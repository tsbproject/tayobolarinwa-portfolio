-- Sostain research database integrity smoke test
-- Run ONLY in the dedicated Neon Sostain research database SQL Editor.
-- All writes, including temporary survey status changes, are rolled back.
-- Do not change ROLLBACK to COMMIT.
BEGIN;
SELECT pg_advisory_xact_lock(hashtext('sostain-research-integrity-smoke-test'));

DO $test$
DECLARE
  test_id uuid := gen_random_uuid();
  contact_id uuid := gen_random_uuid();
  inserted_count integer;
  consent_count integer;
  contact_count integer;
  duplicate_count integer;
  blocked_count integer;
  survey_status text;
BEGIN
  SELECT status INTO survey_status FROM research_surveys WHERE version = '1.1-short';
  IF survey_status IS DISTINCT FROM 'draft' THEN
    RAISE EXCEPTION 'Expected the Sostain research survey to be draft. Actual: %', survey_status;
  END IF;

  -- An uncommitted open status is visible only to this transaction.
  UPDATE research_surveys SET status = 'open' WHERE version = '1.1-short';

  -- No-contact path: one atomic SQL statement, same structure as application.
  WITH survey_gate AS (
    SELECT version FROM research_surveys WHERE version = '1.1-short' AND status = 'open'
  ), inserted AS (
    INSERT INTO research_responses(id,survey_version,business_category,answers)
    SELECT test_id, version, 'Research test category',
      '{"category":"Research test category","teamSize":"Just me","challenges":["Research test only"]}'::jsonb
    FROM survey_gate
    ON CONFLICT (id) DO NOTHING
    RETURNING id
  ), consent AS (
    INSERT INTO research_consents(response_id,privacy_notice_version,acknowledgement,followup_permission)
    SELECT id,'sostain-research-v1',TRUE,FALSE FROM inserted RETURNING response_id
  ), contact_record AS (
    INSERT INTO research_contacts(response_id,contact_name,contact_detail,followup_permission)
    SELECT id,'','','true'::boolean FROM inserted WHERE FALSE RETURNING response_id
  )
  SELECT (SELECT count(*) FROM inserted), (SELECT count(*) FROM consent),
         (SELECT count(*) FROM contact_record)
  INTO inserted_count, consent_count, contact_count;

  IF inserted_count <> 1 OR consent_count <> 1 OR contact_count <> 0 THEN
    RAISE EXCEPTION 'No-contact insert violated integrity: %, %, %',inserted_count,consent_count,contact_count;
  END IF;

  -- Duplicate: the same idempotency key must not write another response.
  WITH survey_gate AS (
    SELECT version FROM research_surveys WHERE version = '1.1-short' AND status = 'open'
  ), inserted AS (
    INSERT INTO research_responses(id,survey_version,business_category,answers)
    SELECT test_id, version, 'Research test category','{}'::jsonb FROM survey_gate
    ON CONFLICT (id) DO NOTHING RETURNING id
  )
  SELECT count(*) INTO duplicate_count FROM inserted;
  IF duplicate_count <> 0 THEN
    RAISE EXCEPTION 'Duplicate submission unexpectedly inserted a row.';
  END IF;

  -- Explicit follow-up opt-in: contact is stored separately.
  WITH survey_gate AS (
    SELECT version FROM research_surveys WHERE version = '1.1-short' AND status = 'open'
  ), inserted AS (
    INSERT INTO research_responses(id,survey_version,business_category,answers)
    SELECT contact_id, version, 'Research test category',
      '{"category":"Research test category","challenges":["Research test only"]}'::jsonb
    FROM survey_gate ON CONFLICT (id) DO NOTHING RETURNING id
  ), consent AS (
    INSERT INTO research_consents(response_id,privacy_notice_version,acknowledgement,followup_permission)
    SELECT id,'sostain-research-v1',TRUE,TRUE FROM inserted RETURNING response_id
  ), contact_record AS (
    INSERT INTO research_contacts(response_id,contact_name,contact_detail,followup_permission)
    SELECT id,'TEST ONLY','test-only@example.invalid',TRUE FROM inserted RETURNING response_id
  )
  SELECT (SELECT count(*) FROM inserted), (SELECT count(*) FROM consent),
         (SELECT count(*) FROM contact_record)
  INTO inserted_count, consent_count, contact_count;
  IF inserted_count <> 1 OR consent_count <> 1 OR contact_count <> 1 THEN
    RAISE EXCEPTION 'Follow-up contact insert violated integrity: %, %, %',inserted_count,consent_count,contact_count;
  END IF;
  IF EXISTS (
    SELECT 1 FROM research_responses
    WHERE id = contact_id AND (answers ? 'contactDetail' OR answers ? 'contactName' OR answers ? 'turnstileToken')
  ) THEN
    RAISE EXCEPTION 'Sensitive contact fields leaked into analytics JSON.';
  END IF;

  -- Closed/draft gating prevents writes, even with otherwise valid input.
  UPDATE research_surveys SET status = 'draft' WHERE version = '1.1-short';
  WITH survey_gate AS (
    SELECT version FROM research_surveys WHERE version = '1.1-short' AND status = 'open'
  ), inserted AS (
    INSERT INTO research_responses(id,survey_version,business_category,answers)
    SELECT gen_random_uuid(),version,'Blocked test','{}'::jsonb FROM survey_gate
    RETURNING id
  )
  SELECT count(*) INTO blocked_count FROM inserted;
  IF blocked_count <> 0 THEN RAISE EXCEPTION 'Draft survey accepted a submission.'; END IF;

  RAISE NOTICE 'PASS: atomic response/consent inserts, no-contact case, follow-up separation, duplicate block, draft gate.';
  RAISE NOTICE 'ROLLBACK will remove all test writes. This test does not exercise HTTP, Turnstile, Redis, or the deployed API.';
END
$test$;

ROLLBACK;

-- Optional independent verification after ROLLBACK:
SELECT version,status FROM research_surveys WHERE version = '1.1-short';
