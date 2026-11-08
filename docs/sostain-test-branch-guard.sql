-- APPLY THIS ONLY TO THE TEMPORARY "sostain-write-testing" NEON BRANCH.
-- Never execute on the parent/default Sostain research branch.
-- This marker is checked before any integration-test writes.
BEGIN;
CREATE TABLE IF NOT EXISTS research_integration_test_guard (
  id integer PRIMARY KEY CHECK (id = 1),
  environment text NOT NULL CHECK (environment = 'sostain-write-testing')
);
INSERT INTO research_integration_test_guard (id, environment)
VALUES (1, 'sostain-write-testing')
ON CONFLICT (id) DO NOTHING;
COMMIT;

-- Expected: one row, environment = sostain-write-testing.
SELECT environment FROM research_integration_test_guard WHERE id = 1;
