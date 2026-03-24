CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE jobs (
  job_id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  organisation_name VARCHAR(255) NOT NULL,
  job_role        VARCHAR(255) NOT NULL,
  description     TEXT,
  application_link VARCHAR(255),
  status          VARCHAR(50)  NOT NULL DEFAULT 'applied'
                  CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected', 'saved')),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);