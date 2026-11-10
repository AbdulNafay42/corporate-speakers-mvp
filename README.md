# Forum - Corporate Speakers & Programs MVP

A Next.js App Router frontend connected to Strapi 5 REST APIs and PostgreSQL. Strapi's built-in admin is the only administration interface. All included people and programs are fictional samples; stock portraits are illustrative.

## Requirements

- Node.js 22.19 or newer within the Node 22 LTS line, npm 10+
- Docker Desktop running (or an existing PostgreSQL 17 database)
- Ports 3000, 1337, and 5432 available

## Run locally

From the repository root:

```sh
npm ci
npm run setup
docker compose up -d
npm run dev:cms
```

`npm run setup` generates random secrets and matching database credentials in `.env` and `apps/cms/.env`, plus `apps/web/.env.local`. It preserves existing files. Templates are available at all three locations as `.env.example`. Never commit actual environment files.

To use an existing PostgreSQL server, change `DATABASE_*` in `apps/cms/.env` and skip Docker. `DATABASE_SSL=true` validates the server certificate; install the database provider's CA if necessary. The included Compose database binds only to loopback and persists data in a Docker volume.

### Configure Strapi

1. Open http://localhost:1337/admin and create your administrator account.
2. For fictional test content, set `SEED_SAMPLE_DATA=true` in `apps/cms/.env`, then restart Strapi. The bootstrap publishes three speakers and three programs, links the speakers, and uploads local sample portraits. It only runs when no speaker draft exists. Turn the flag off after seeding. Do not seed a production database. Use the Media Library to add actual program images; missing images have designed fallbacks.
3. In **Settings > API Tokens**, create two **Custom** tokens:

| Token | Allowed actions | Next.js variable |
| --- | --- | --- |
| Website content | Speaker: `find`, `findOne`; Program: `find`, `findOne` | `STRAPI_READ_TOKEN` |
| Inquiry intake | Inquiry: `create` only | `STRAPI_INQUIRY_TOKEN` |

4. Copy the tokens into `apps/web/.env.local`. Keep all Public and Authenticated role permissions for Inquiries disabled. Do not grant public create permissions. Speaker/program public permissions can stay disabled too: Next.js fetches using its server token.
5. Start the frontend in a second terminal:

```sh
npm run dev:web
```

Open http://localhost:3000. Restart Next.js whenever you change its environment variables. `SITE_URL` must match the browser's origin exactly, including scheme and port, for the contact form to work. `STRAPI_URL` must be reachable by Next.js, and its media URLs must also be reachable by visitors. Set `PUBLIC_URL` to the public CMS origin when deploying.

### Admin content workflow

- **Content Manager > Speaker > Create new entry**: fill name, slug, designation, bio, expertise, and optionally image and featured. Expertise is a comma-separated text field. Save, then Publish.
- Open `/speakers/<slug>` in Next.js. A published profile is immediately visible; a draft is not. Set Featured to include it on the homepage (up to three featured speakers).
- Create a Program, enter its title, slug, description, and duration, optionally choose an image and related speakers, then Publish. Publish related speakers too. The homepage shows up to two featured programs.
- Edit, unpublish, or delete entries using Strapi's standard content manager. Slugs must be URL-safe and unique. Changing a slug changes its URL; redirects are outside this MVP.
- Open **Content Manager > Inquiry** to view contact submissions. There is no customer login or public inquiries listing. Submission dates are set on the CMS server.

## Structure

```text
apps/web/src/app/            App Router pages, detail routes, SEO, inquiry endpoint
apps/web/src/components/     Shared navigation, cards, sections, contact form
apps/web/src/lib/            Server-only CMS client, types, input validation
apps/cms/config/             Strapi, PostgreSQL, admin, and middleware settings
apps/cms/src/api/            Speaker, Program, and Inquiry schemas and REST endpoints
apps/cms/src/index.js        Opt-in sample-data bootstrap
apps/web/public/images/      Local hero and illustrative sample portraits
scripts/setup.mjs            Safe local environment generation
data/samples.json            Fictional sample content
tests/                      REST integration and Playwright browser tests
```

Content models use Strapi's Draft & Publish for speakers and programs, a many-to-many speaker/program relation, and private inquiry records without publishing. Biography and description fields are plain multiline text, rendered as escaped paragraphs. The media field accepts images only. Next.js uses Server Components, server-only bearer tokens, explicit media/relation population, slug filtering, and `cache: no-store` so publishing changes appear without a rebuild. Listings currently show up to 100 published entries, appropriate for this MVP.

## Demo without a CMS

Set `DEMO_MODE=true` in `apps/web/.env.local` and run Next.js. A visible banner identifies all profiles/programs as fictional, and indexing is disabled. This mode is read-only; the contact form still requires a configured real Strapi intake token and never pretends to save a submission. Normal mode never silently falls back to sample content when Strapi fails.

## Build and verification

```sh
npm run check
npm run build
npm run start -w apps/cms
npm run start -w apps/web
```

Start the two production servers in separate terminals. `npm run build` builds Strapi's built-in admin and Next.js. No database connection is needed during the frontend build because content routes render dynamically.

For integration tests, use a **temporary Full access API token** against a disposable local CMS database. Set `TEST_STRAPI_TOKEN` in the terminal environment, and load the website's scoped tokens from its env file:

```sh
node --env-file=apps/web/.env.local --test tests/integration.test.mjs
npx playwright install chromium
npm run test:e2e
```

PowerShell: `$env:TEST_STRAPI_TOKEN = 'your-temporary-token'`. Without that variable the REST test is explicitly skipped. It creates draft/published content, uploads an image, verifies public rendering and relations, validates inquiry rejection and persistence, and confirms token isolation. Temporary test content/media are removed in a `finally` block. Delete the temporary Full access token after testing. Browser tests need at least one published speaker and program, create one identifiable inquiry (`browser-test@example.com`), and save ignored screenshots in `artifacts/`. Remove that inquiry after testing. Next.js may stream a not-found result with HTTP 200 after a loading boundary; the response includes a noindex directive and renders the not-found UI.

## Deployment considerations

Deploy Next.js to a Node.js host, Strapi to a persistent Node.js host, and PostgreSQL to a durable database service. Sites static/Worker hosting is not a compatible runtime for this requested Strapi/Node/PostgreSQL stack, so this deliverable is a local runnable repository, not a hosted Sites deployment. Configure production HTTPS origins, persistent uploads or a Strapi storage provider, database and upload backups, strong admin credentials, and token rotation. Do not use the temporary integration token for the website.

The inquiry endpoint enforces same-origin JSON requests, a streamed body-size limit, strict field validation, a honeypot, timeouts, and a create-only CMS token. Strapi caps intake at 30 requests per minute per CMS process. For multiple CMS replicas, put a shared rate limit at your reverse proxy. Inquiries contain personal data: restrict admin access, define a retention policy, and replace the example privacy copy with your organization's policy before launch. The MVP does not send email notifications.

## Image credits

Locally bundled images are from Unsplash. They illustrate a demo and imply no endorsement or real relationship to the fictional speakers.

- Conference: https://images.unsplash.com/photo-1540575467063-178a50c2df87
- Portrait sources: `photo-1494790108377-be9c29b29330`, `photo-1560250097-0b93528c311a`, `photo-1580489944761-15a19d654956` on images.unsplash.com

## Deliberate scope

Homepage, speakers and programs with dynamic details, contact inquiry storage, sample data, loading/error/empty/not-found states, responsive design, reduced-motion support, page metadata, sitemap, and robots. No payments, customer accounts, booking engine, or advanced search.

## Admin handbook

The illustrated administrator guide includes 47 captured screens across eight chapters, field references, publishing checklists, and troubleshooting.

- [Word handbook](docs/admin/Forum-Admin-Handbook.docx)
- [PDF handbook](docs/admin/Forum-Admin-Handbook.pdf)
- [Browsable HTML guide](docs/admin/Forum-Admin-Handbook.html)
- [Markdown guide and screenshot sources](docs/admin/README.md)

Regenerate after editing `docs/admin/guide-content.json`: install `docs/admin/requirements.txt` and run `python scripts/build-admin-guide.py`. Screenshot captures must be refreshed separately when the admin UI changes.
