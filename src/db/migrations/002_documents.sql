CREATE TABLE documents(
  document_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL REFERENCES jobs(job_id) on delete cascade,
  file_name varchar(255) not null,
  file_type varchar(255),
  s3_key varchar(255) not null,
  uploaded_at TIMESTAMPTZ DEFAULT NOW()
)