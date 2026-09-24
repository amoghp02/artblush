import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
const env = readFileSync(".env.local", "utf8");
for (const line of env.split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^"(.*)"$/, "$1");
}
(async () => {
  const sqlx = neon(process.env.DATABASE_URL);
  const token = "localrepro_token_00112233445566778899aabbccddeeff00112233445566778899aabbccddeeff";
  await sqlx`DELETE FROM sessions WHERE id = ${token}`;
  await sqlx`INSERT INTO sessions (id, user_id, expires_at) VALUES (${token}, (SELECT id FROM users WHERE email = 'amoghprakash02@gmail.com'), now() + interval '30 days')`;
  console.log(token);
})();