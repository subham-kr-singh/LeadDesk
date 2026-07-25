import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { adminUsers } from './schema';
import { eq } from 'drizzle-orm';

dotenv.config();

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error('Missing DATABASE_URL environment variable.');
    process.exit(1);
  }

  const email = process.env.ADMIN_SEED_EMAIL;
  const password = process.env.ADMIN_SEED_PASSWORD;

  if (!email || !password) {
    console.error('Missing ADMIN_SEED_EMAIL or ADMIN_SEED_PASSWORD environment variables.');
    process.exit(1);
  }

  console.log(`Seeding admin account for: ${email}...`);

  // Use postgres-js driver for the seed script (runs in Node.js, not serverless)
  const client = postgres(databaseUrl, { max: 1, ssl: 'require' });
  const db = drizzle(client);

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const existingUsers = await db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase()));

    if (existingUsers.length > 0) {
      await db
        .update(adminUsers)
        .set({ passwordHash })
        .where(eq(adminUsers.email, email.toLowerCase()));
      console.log(`✓ Successfully updated password for existing admin: ${email}`);
    } else {
      await db.insert(adminUsers).values({
        email: email.toLowerCase(),
        passwordHash,
      });
      console.log(`✓ Successfully created new admin user: ${email}`);
    }
  } finally {
    await client.end();
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
});
