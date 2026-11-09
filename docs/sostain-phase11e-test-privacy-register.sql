-- Sostain Phase 11E: TEST-ONLY privacy request register.
-- Apply ONLY in the disposable Neon 'sostain-write-testing' branch.
-- Never apply to the main Sostain research database.
-- This migration creates a workflow register and audit log.
-- It does NOT change, revoke, or delete participant records.
BEGIN;

DO $guard$
BEGIN
  IF to_regclass('public.research_integration_test_guard') IS NULL THEN
    RAISE EXCEPTION 'STOP: test-branch guard missing';
  END IF;
  IF (SELECT COUNT(*) FROM research_integration_test_guard
       WHERE id=1 AND environment='sostain-write-testing') <> 1 THEN
    RAISE EXCEPTION 'STOP: wrong test environment';
  END IF;
  IF (SELECT status FROM research_surveys WHERE version='1.1-short') IS DISTINCT FROM 'draft' THEN
    RAISE EXCEPTION 'STOP: research survey must be draft';
  END IF;
  IF EXISTS (SELECT 1 FROM research_responses)
     OR EXISTS (SELECT 1 FROM research_consents)
     OR EXISTS (SELECT 1 FROM research_contacts) THEN
    RAISE EXCEPTION 'STOP: test branch must contain no participant data';
  END IF;
END $guard$;

CREATE TABLE IF NOT EXISTS research_privacy_requests (
  id uuid PRIMARY KEY,
  request_kind text NOT NULL CHECK (request_kind IN ('withdraw_followup','erase_response')),
  -- Only an operator-verified response UUID; never an email/phone/name.
  response_id uuid NOT NULL,
  evidence_sha256 text NOT NULL CHECK (evidence_sha256 ~ '^[a-f0-9]{64}$'),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  CHECK ((status='pending' AND reviewed_at IS NULL) OR
         (status IN ('approved','rejected') AND reviewed_at IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS research_privacy_requests_created_idx
  ON research_privacy_requests (created_at DESC);

CREATE TABLE IF NOT EXISTS research_privacy_request_events (
  id uuid PRIMARY KEY,
  request_id uuid NOT NULL REFERENCES research_privacy_requests(id) ON DELETE RESTRICT,
  action text NOT NULL CHECK (action IN ('registered','approved','rejected')),
  actor text NOT NULL CHECK (actor = 'local-mfa-admin'),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS research_privacy_request_events_request_idx
  ON research_privacy_request_events (request_id, occurred_at);

-- No cascading association with participant response: request review is separate
-- from response erasure, and no private contact details are copied into this log.
-- Operators must separately decide whether this metadata may be retained.
COMMIT;
