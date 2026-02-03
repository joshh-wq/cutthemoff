import postgres from 'postgres';

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  return postgres(url, { ssl: 'require' });
}

export async function ensureTable() {
  const sql = getDb();
  try {
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
  } finally {
    await sql.end();
  }
}

export async function insertCancellation(email: string, token: string, subscribed: boolean = false) {
  await ensureTable();
  const sql = getDb();
  try {
    await sql`
      INSERT INTO cancellations (email, token, subscribed)
      VALUES (${email}, ${token}, ${subscribed})
    `;
  } finally {
    await sql.end();
  }
}

export async function findByEmail(email: string) {
  await ensureTable();
  const sql = getDb();
  try {
    const rows = await sql`SELECT * FROM cancellations WHERE email = ${email}`;
    return rows[0] || null;
  } finally {
    await sql.end();
  }
}

export async function findByToken(token: string) {
  await ensureTable();
  const sql = getDb();
  try {
    const rows = await sql`SELECT * FROM cancellations WHERE token = ${token}`;
    return rows[0] || null;
  } finally {
    await sql.end();
  }
}

export async function verifyToken(token: string) {
  const sql = getDb();
  try {
    await sql`
      UPDATE cancellations SET verified = TRUE, verified_at = NOW()
      WHERE token = ${token}
    `;
  } finally {
    await sql.end();
  }
}

export async function updateToken(email: string, newToken: string) {
  const sql = getDb();
  try {
    await sql`
      UPDATE cancellations SET token = ${newToken}
      WHERE email = ${email}
    `;
  } finally {
    await sql.end();
  }
}

export async function getVerifiedCount(): Promise<number> {
  await ensureTable();
  const sql = getDb();
  try {
    const rows = await sql`SELECT COUNT(*) as count FROM cancellations WHERE verified = TRUE`;
    return parseInt(rows[0].count, 10);
  } finally {
    await sql.end();
  }
}
