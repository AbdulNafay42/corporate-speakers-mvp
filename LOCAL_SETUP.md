# This workspace's prepared local environment

The application was built and tested on this machine using a downloaded, checksum-verified Node.js 22 runtime and an isolated PostgreSQL 17 cluster. Generated credentials are in ignored app environment files. Your existing Strapi admin account was preserved. Sample speakers, programs, and uploaded portraits are already present.

The temporary test servers have been stopped. To restart in PowerShell from this repository:

```powershell
$env:Path = "$PWD\.tools\node-v22.23.4-win-x64;$env:Path"
$env:XDG_CONFIG_HOME = "$PWD\.tools\config"
& 'C:/Program Files/PostgreSQL/17/bin/pg_ctl.exe' -D "$PWD/.tools/pgdata" -l "$PWD/.tools/postgres.log" -o '-p 55432 -h 127.0.0.1' start
npm run dev:cms
```

In a second terminal, set the portable runtime path again and start the website:

```powershell
$env:Path = "$PWD\.tools\node-v22.23.4-win-x64;$env:Path"
npm run dev:web
```

- Website: http://localhost:3000
- Built-in Strapi admin: http://localhost:1337/admin
- Workspace PostgreSQL: `127.0.0.1:55432`, database `postgres`, local role `forum`

This disposable cluster uses loopback-only trust authentication for local verification. Use the password-authenticated Docker setup in README.md, or a managed PostgreSQL database, for a fresh installation. `.tools/` is ignored and is not part of the portable application source. Install Node.js 22.19+ normally when using the repository elsewhere.

Stop the dev commands with Ctrl+C. Stop this workspace database with:

```powershell
& 'C:/Program Files/PostgreSQL/17/bin/pg_ctl.exe' -D "$PWD/.tools/pgdata" stop
```

Verified: Next.js production build, Strapi built-in admin production build, TypeScript, draft exclusion, REST speaker publishing and frontend rendering, uploaded media and program relations, secure inquiry validation and persistence, token permission isolation, fresh-database sample bootstrap, desktop navigation and form submission, mobile navigation, and layout at 390px. API tokens were also checked against generated browser bundles and were absent. Screenshots are in the ignored `artifacts/` directory. The temporary Full access token and browser-test inquiries were removed after verification.
