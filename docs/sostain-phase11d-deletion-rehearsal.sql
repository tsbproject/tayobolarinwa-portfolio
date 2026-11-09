-- Sostain Phase 11D: controlled privacy operations rehearsal.
-- TEST ONLY. Run manually in Neon SQL Editor on the disposable
-- 'sostain-write-testing' branch after checking its selected branch name.
-- NEVER run this file on the default/main research database.
-- This whole exercise ends in ROLLBACK, not COMMIT.
-- No real participant records are used or modified.
BEGIN;

-- Temporary proof table lasts only for this transaction, and is rolled
-- back with the rest of the rehearsal. A SELECT prints visible results even
-- when the SQL Editor suppresses RAISE NOTICE messages.
CREATE TEMP TABLE sostain_privacy_rehearsal_results (
  step_number integer PRIMARY KEY,
  operation text NOT NULL,
  outcome text NOT NULL CHECK (outcome = 'PASS')
) ON COMMIT DROP;

DO $privacy_test$
DECLARE
  withdrawal_id uuid := gen_random_uuid();
  erasure_id uuid := gen_random_uuid();
  untouched_id uuid := gen_random_uuid();
  survey_state text;
  affected integer;
  before_total integer;
BEGIN
  -- Enforce the explicit marker prepared on the isolated branch during Phase 9.
  IF to_regclass('public.research_integration_test_guard') IS NULL THEN
    RAISE EXCEPTION 'STOP: isolated research test branch guard table does not exist';
  END IF;
  IF (SELECT COUNT(*) FROM public.research_integration_test_guard
      WHERE id = 1 AND environment = 'sostain-write-testing') <> 1 THEN
    RAISE EXCEPTION 'STOP: isolated test branch guard marker mismatch';
  END IF;

  PERFORM pg_advisory_xact_lock(hashtext('sostain-phase11d-privacy-rehearsal'));

  SELECT status INTO survey_state FROM research_surveys
    WHERE version = '1.1-short' FOR UPDATE;
  IF survey_state IS DISTINCT FROM 'draft' THEN
    RAISE EXCEPTION 'STOP: test survey must remain draft';
  END IF;

  SELECT COUNT(*) INTO before_total FROM research_responses;
  -- Rehearsal only in a clean disposable branch with no other responses.
  IF before_total <> 0
     OR EXISTS (SELECT 1 FROM research_contacts)
     OR EXISTS (SELECT 1 FROM research_consents) THEN
    RAISE EXCEPTION 'STOP: test branch contains pre-existing records';
  END IF;

  -- All three records are deliberately fictional and tagged test-only.
  INSERT INTO research_responses (id, survey_version, business_category, answers)
  VALUES
    (withdrawal_id, '1.1-short', 'SOSTAIN_SYNTHETIC_WITHDRAWAL', '{"testOnly":true}'::jsonb),
    (erasure_id, '1.1-short', 'SOSTAIN_SYNTHETIC_ERASURE', '{"testOnly":true}'::jsonb),
    (untouched_id, '1.1-short', 'SOSTAIN_SYNTHETIC_CONTROL', '{"testOnly":true}'::jsonb);

  INSERT INTO research_consents
    (response_id, privacy_notice_version, acknowledgement, followup_permission)
  VALUES
    (withdrawal_id, 'sostain-research-v1', TRUE, TRUE),
    (erasure_id, 'sostain-research-v1', TRUE, TRUE),
    (untouched_id, 'sostain-research-v1', TRUE, FALSE);

  INSERT INTO research_contacts
    (response_id, contact_name, contact_detail, followup_permission)
  VALUES
    (withdrawal_id, 'SYNTHETIC TEST', 'privacy-withdrawal@example.invalid', TRUE),
    (erasure_id, 'SYNTHETIC TEST', 'privacy-erasure@example.invalid', TRUE);

  IF (SELECT COUNT(*) FROM research_responses WHERE id IN (withdrawal_id, erasure_id, untouched_id)) <> 3
      OR (SELECT COUNT(*) FROM research_consents WHERE response_id IN (withdrawal_id, erasure_id, untouched_id)) <> 3
      OR (SELECT COUNT(*) FROM research_contacts WHERE response_id IN (withdrawal_id, erasure_id, untouched_id)) <> 2 THEN
    RAISE EXCEPTION 'Synthetic setup integrity failure';
  END IF;
  INSERT INTO sostain_privacy_rehearsal_results VALUES
    (1, 'Synthetic relationships initialized', 'PASS');
  RAISE NOTICE 'PASS: synthetic response/consent/contact relationships prepared';

  -- PRIVACY OPERATION A: verified interview consent withdrawal.
  -- Contact is deleted and followup_permission is revoked in one transaction.
  -- Survey response is deliberately retained.
  DELETE FROM research_contacts
    WHERE response_id = withdrawal_id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'Contact withdrawal expected exactly one deleted row'; END IF;

  UPDATE research_consents
    SET followup_permission = FALSE
    WHERE response_id = withdrawal_id AND followup_permission = TRUE;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'Consent withdrawal expected exactly one changed row'; END IF;

  IF EXISTS (SELECT 1 FROM research_contacts WHERE response_id = withdrawal_id)
     OR NOT EXISTS (SELECT 1 FROM research_responses WHERE id = withdrawal_id)
     OR NOT EXISTS (SELECT 1 FROM research_consents
       WHERE response_id = withdrawal_id AND followup_permission = FALSE) THEN
    RAISE EXCEPTION 'Withdrawal did not preserve answer and revoke follow-up consistently';
  END IF;
  INSERT INTO sostain_privacy_rehearsal_results VALUES
    (2, 'Contact consent withdrawn; response preserved', 'PASS');
  RAISE NOTICE 'PASS: consent withdrawal removes contact and revokes follow-up but preserves answer';

  -- PRIVACY OPERATION B: verified full erasure.
  -- Parent deletion must cascade to linked consent and contact records.
  DELETE FROM research_responses WHERE id = erasure_id;
  GET DIAGNOSTICS affected = ROW_COUNT;
  IF affected <> 1 THEN RAISE EXCEPTION 'Erasure expected exactly one deleted response'; END IF;

  IF EXISTS (SELECT 1 FROM research_responses WHERE id = erasure_id)
     OR EXISTS (SELECT 1 FROM research_consents WHERE response_id = erasure_id)
     OR EXISTS (SELECT 1 FROM research_contacts WHERE response_id = erasure_id) THEN
    RAISE EXCEPTION 'Erasure cascade failed';
  END IF;
  INSERT INTO sostain_privacy_rehearsal_results VALUES
    (3, 'Targeted response and linked rows erased', 'PASS');
  RAISE NOTICE 'PASS: erasure removes targeted answer, consent, and contact';

  -- Invariants: other participants are never targeted by either operation.
  IF NOT EXISTS (SELECT 1 FROM research_responses WHERE id = untouched_id)
     OR NOT EXISTS (SELECT 1 FROM research_consents
         WHERE response_id = untouched_id AND followup_permission = FALSE)
     OR EXISTS (SELECT 1 FROM research_contacts WHERE response_id = untouched_id)
     OR (SELECT COUNT(*) FROM research_responses) <> 2
     OR (SELECT COUNT(*) FROM research_consents) <> 2
     OR EXISTS (SELECT 1 FROM research_contacts) THEN
    RAISE EXCEPTION 'Operations changed an unrelated synthetic record or incorrect totals';
  END IF;
  INSERT INTO sostain_privacy_rehearsal_results VALUES
    (4, 'Unrelated synthetic record unaffected', 'PASS');
  RAISE NOTICE 'PASS: unaffected synthetic record remains intact';
  INSERT INTO sostain_privacy_rehearsal_results VALUES
    (5, 'Transaction rollback is required', 'PASS');
  RAISE NOTICE 'PASS: all operations remain uncommitted and will be rolled back';
END $privacy_test$;

-- Visible validation result. Exactly five PASS rows should appear.
SELECT step_number, operation, outcome
FROM sostain_privacy_rehearsal_results
ORDER BY step_number;

-- Guard that the result display cannot silently report partial success.
DO $assert_results$
BEGIN
  IF (SELECT COUNT(*) FROM sostain_privacy_rehearsal_results WHERE outcome = 'PASS') <> 5 THEN
    RAISE EXCEPTION 'Privacy rehearsal proof is incomplete';
  END IF;
END $assert_results$;

-- NEVER change to COMMIT.
ROLLBACK;

-- Optional independent post-test verification in this SAME isolated branch:
-- SELECT version, status FROM research_surveys WHERE version = '1.1-short';
-- SELECT COUNT(*) FROM research_responses;
-- SELECT COUNT(*) FROM research_consents;
-- SELECT COUNT(*) FROM research_contacts;
-- Expected for a clean isolated branch: draft; 0; 0; 0.
