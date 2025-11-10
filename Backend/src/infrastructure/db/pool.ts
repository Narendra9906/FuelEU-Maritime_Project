import { Pool, PoolClient } from "pg";
import dotenv from "dotenv";

dotenv.config();
let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL not found in environment variables.");
  }

  pool = new Pool({
    connectionString,
    ssl: false,
  });

  pool.on("connect", () => console.log("Connected to Postgres database"));
  pool.on("error", (err) => console.error("Unexpected PG error:", err));

  return pool;
}

export async function withTransaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const pool = getPool();
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}