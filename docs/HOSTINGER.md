# Deploy Wenlas on Hostinger

Source repository: https://github.com/Bluechipwhale/wenlas. No changes are pushed to the previous business repository, and no previous business database is used.

The live Wenlas temporary origin is https://mediumspringgreen-gazelle-531200.hostingersite.com. The storefront and dedicated MySQL inventory connection were verified on 13 November 2026. Hostinger's current Git connection belongs to another account; deploy the verified Wenlas source archive without changing that connection.

Use the Business plan's separate Node.js Web App. Framework: Next.js. Node: 24. Install: npm ci --include=dev. Build: npm run build:hostinger. Output: .next. Start: npm run start:hostinger, or entry .next/standalone/server.js if hPanel asks for an entry file. Keep Hostinger's assigned PORT and set HOSTNAME=0.0.0.0.

The build creates a public-only .env.production from config/hostinger-public.json and packages static/public assets into the standalone output. Private credentials belong only in this Wenlas app's environment settings. Never upload local .env files, .data, Git metadata or a Windows-generated build as source.

After committing the verified code, run powershell -NoProfile -File scripts/package-hostinger.ps1. Upload artifacts/wenlas-hostinger-source.zip through the new app's source upload flow. The ZIP is generated from the committed tree and excludes ignored secrets, previous Git history, development tests and unused legacy media. The accompanying SHA-256 file identifies the release.

## Persistent inventory database

Create a dedicated MySQL database with wenlas in its name on the Hostinger plan. Use a separate database user and password. Set these private environment values for Wenlas only:

- WENLAS_DB_HOST=127.0.0.1
- WENLAS_DB_PORT=3306
- WENLAS_DB_NAME: complete prefixed Wenlas database name
- WENLAS_DB_USER: complete prefixed Wenlas database username
- WENLAS_DB_PASSWORD: that user's private password
- WENLAS_OWNER_EMAIL: the initial owner's approved email
- WENLAS_SETUP_TOKEN: a private random one-time setup code of at least 32 characters
- WENLAS_CATALOGUE_MODE=true
- LOCAL_DEMO=false
- WENLAS_LOCAL_INVENTORY=false
- NEXT_PUBLIC_SITE_URL: the actual Wenlas HTTPS origin

Keep WENLAS_DB_TLS=false only for Hostinger's loopback database connection; use WENLAS_DB_TLS=true with certificate verification for an external TLS connection. The application refuses database names without wenlas and ignores the old DATABASE_URL and Supabase variables for this inventory system.

The application creates its own Wenlas-prefixed inventory/account tables and seeds 98 product IDs with unconfirmed, zero quantities. MySQL retains stock, movement history and accounts across source redeployments. SQLite is used only for development and tests.

The initial owner is configured. Sign in at /inventory/login using the privately supplied access details, then use the key icon to choose your own password. On a fresh database only, activate the owner with the private setup code. The setup code is useless once an owner exists. The owner can edit email addresses, invite stock managers/viewers and disable accounts. Invitations are private single-use links; the app does not send external email.

## Verify the release

- /api/health must report inventory: connected after the database is configured.
- All 98 products and the supplied Wenlas logo must appear on the storefront.
- /api/inventory must return 401 without a session.
- The owner can receive stock, record sales/counts, set thresholds, export stock and inspect the ledger.
- A second browser sees stock updates within seconds.
- Viewers cannot change stock. Changing an account email/role or disabling it revokes existing sessions.
- Redeploy and confirm that the MySQL stock and account records remain intact.

Online payment checkout remains disabled until payment/order processing is separately commissioned. Inventory adjustments never charge a card or send money.
