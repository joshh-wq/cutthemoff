import postgres from 'postgres';

let sql: ReturnType<typeof postgres>;

function getDb() {
  if (!sql) {
    const url = process.env['DATABASE' + '_URL'];
    console.log('DB URL hostname:', url ? new URL(url).hostname : 'NOT SET');
    if (!url) throw new Error('DATABASE_URL environment variable is not set');
    sql = postgres(url, { ssl: 'require' });
  }
  return sql;
}

export async function ensureTable() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS cancellations (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      token TEXT UNIQUE NOT NULL,
      subscribed BOOLEAN DEFAULT FALSE,
      verified BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      verified_at TIMESTAMP
    )
  `;
  await sql`
    ALTER TABLE cancellations ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT FALSE
  `;
}

export async function insertCancellation(email: string, token: string, subscribed: boolean = false) {
  const sql = getDb();
  await ensureTable();
  await sql`
    INSERT INTO cancellations (email, token, subscribed)
    VALUES (${email}, ${token}, ${subscribed})
  `;
}

export async function findByEmail(email: string) {
  const sql = getDb();
  await ensureTable();
  const rows = await sql`SELECT * FROM cancellations WHERE email = ${email}`;
  return rows[0] || null;
}

export async function findByToken(token: string) {
  const sql = getDb();
  await ensureTable();
  const rows = await sql`SELECT * FROM cancellations WHERE token = ${token}`;
  return rows[0] || null;
}

export async function verifyToken(token: string) {
  const sql = getDb();
  await sql`
    UPDATE cancellations SET verified = TRUE, verified_at = NOW()
    WHERE token = ${token}
  `;
}

export async function updateToken(email: string, newToken: string) {
  const sql = getDb();
  await sql`
    UPDATE cancellations SET token = ${newToken}
    WHERE email = ${email}
  `;
}

export async function getVerifiedCount(): Promise<number> {
  const sql = getDb();
  await ensureTable();
  const rows = await sql`SELECT COUNT(*) as count FROM cancellations WHERE verified = TRUE`;
  return parseInt(rows[0].count, 10);
}
