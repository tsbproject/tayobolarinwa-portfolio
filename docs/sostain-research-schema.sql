-- Sostain research schema proposal v1.1-short
-- Provision in a dedicated research PostgreSQL database, NOT the future Sostain SaaS database.
-- Apply only after reviewing data protection and backup requirements.
BEGIN;

CREATE TABLE IF NOT EXISTS research_surveys (
  version text PRIMARY KEY,
  status text NOT NULL CHECK (status IN ('draft','open','closed')),
  published_at timestamptz
);

CREATE TABLE IF NOT EXISTS research_responses (
  id uuid PRIMARY KEY,
  survey_version text NOT NULL REFERENCES research_surveys(version),
  business_category text NOT NULL,
  answers jsonb NOT NULL CHECK (jsonb_typeof(answers) = 'object'),
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS research_responses_category_idx
  ON research_responses (business_category,submitted_at);

CREATE TABLE IF NOT EXISTS research_consents (
  response_id uuid PRIMARY KEY REFERENCES research_responses(id) ON DELETE CASCADE,
  privacy_notice_version text NOT NULL,
  acknowledgement boolean NOT NULL CHECK (acknowledgement = true),
  followup_permission boolean NOT NULL DEFAULT false,
  recorded_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_contacts (
  response_id uuid PRIMARY KEY REFERENCES research_responses(id) ON DELETE CASCADE,
  contact_name text NOT NULL DEFAULT '',
  contact_detail text NOT NULL,
  followup_permission boolean NOT NULL CHECK (followup_permission = true),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO research_surveys (version,status)
VALUES ('1.1-short','draft')
ON CONFLICT (version) DO NOTHING;

COMMIT;

-- Important: the production insert must be a single transaction and MUST
-- EXCLUDE name, contact, Turnstile token, IP address, and honeypot from answers JSON.
-- Require a dedicated application DB role without DDL permission.
-- Do not promote survey status or backend release flags before working persistence is verified.
