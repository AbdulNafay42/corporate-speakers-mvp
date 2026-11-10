import fs from "node:fs";
import crypto from "node:crypto";
import { parseEnv } from "node:util";
const secret = () => crypto.randomBytes(32).toString("hex");
function create(file, text) {
  if (fs.existsSync(file)) {
    console.log(`Preserved ${file}`);
    return;
  }
  fs.writeFileSync(file, text);
  console.log(`Created ${file}`);
}
create(
  ".env",
  fs
    .readFileSync(".env.example", "utf8")
    .replace("replace-with-a-long-random-password", secret()),
);
const db = parseEnv(fs.readFileSync(".env", "utf8"));
let cms = fs.readFileSync("apps/cms/.env.example", "utf8");
cms = cms
  .replace(/replace-with-random-secret/g, secret)
  .replace(
    "replace-random-key-1,replace-random-key-2,replace-random-key-3,replace-random-key-4",
    Array.from({ length: 4 }, secret).join(","),
  );
cms = cms
  .replace(
    "DATABASE_PASSWORD=replace-with-a-long-random-password",
    `DATABASE_PASSWORD=${db.POSTGRES_PASSWORD}`,
  )
  .replace("DATABASE_NAME=forum", `DATABASE_NAME=${db.POSTGRES_DB || "forum"}`)
  .replace(
    "DATABASE_USERNAME=forum",
    `DATABASE_USERNAME=${db.POSTGRES_USER || "forum"}`,
  );
create("apps/cms/.env", cms);
create("apps/web/.env.local", fs.readFileSync("apps/web/.env.example", "utf8"));
console.log(
  "Next: docker compose up -d, start Strapi, create scoped tokens in its admin panel, then start Next.js. See README.md.",
);
