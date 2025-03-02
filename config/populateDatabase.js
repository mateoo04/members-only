require('dotenv').config();
const { pool } = require('./db');

const clubhouseMemberTableSQL = `CREATE TABLE IF NOT EXISTS clubhouse_member (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    first_name character varying(255) NOT NULL,
    last_name character varying(255) NOT NULL,
    username character varying(255) UNIQUE NOT NULL,
    password character varying(255) NOT NULL,
    is_exclusive boolean NOT NULL,
    is_admin boolean NOT NULL
);
`;

const messageTableSQL = `CREATE TABLE IF NOT EXISTS message (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY NOT NULL,
    member_id integer,
    title character varying(255),
    content text,
    "time" timestamp with time zone DEFAULT now(),
    CONSTRAINT message_member_id_fkey FOREIGN KEY (member_id) REFERENCES clubhouse_member(id) ON DELETE CASCADE
);
`;

const sessionTableSQL = `CREATE TABLE IF NOT EXISTS "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'session_pkey') THEN
    ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'IDX_session_expire') THEN
    CREATE INDEX "IDX_session_expire" ON "session" ("expire");
  END IF;
END $$;`;

async function main() {
  console.log('Seeding...');

  await pool.query(clubhouseMemberTableSQL);
  await pool.query(messageTableSQL);
  await pool.query(sessionTableSQL);

  console.log('Done');
}

main();
