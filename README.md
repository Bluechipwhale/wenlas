# Wenlas Resources Ltd.

**Wenlas** is an electronics storefront with all **98 products**, **9 categories** and **292 product photos** imported from the owner's [Jiji catalogue](https://jiji.ng/sellerpage-Cya3vFFCDoDTmxwjjm6P39IL). It includes category and brand browsing, search, product galleries, saved favourites, an installable web app and the inherited administration tools.

**Start here:** [Wenlas setup and catalogue notes](docs/WENLAS.md). Other historical migration and hosting documents describe the original business.

## Run locally

Use Node 24 and npm:

~~~sh
npm ci
npm run dev
~~~

Open http://127.0.0.1:3000 for the storefront and http://127.0.0.1:3000/inventory for the secure inventory workspace. Catalogue mode keeps Wenlas separate from the original project's database. Physical stock is unconfirmed until recorded through inventory management; each imported listing links to Wenlas on Jiji for availability enquiries.

Copy .env.example to .env.local for the documented configuration. Local management uses .data/wenlas.sqlite and is limited to development on loopback. Production inventory uses a separate Wenlas MySQL database, with live stock updates, an audit ledger, low-stock thresholds and editable team accounts. Set NEXT_PUBLIC_SITE_URL to the actual Wenlas HTTPS domain before deployment. Customer authentication, online administration, payments and native app releases require separate commissioning.

## Implemented

- Responsive discovery, autocomplete, categories/subcategories, filters, product galleries/options, brand and merchant pages, device-local wishlist/cart, checkout and account screens.
- Theme Studio with actual storefront iframe previews, editable presets, design tokens, branding uploads, draft isolation, confirmed publication, version history, rollback and unsaved-change protection.
- Validated management forms for products, categories, merchants, campaigns, coupons, policies, suppliers, procurement records, warehouses, drivers, returns, reviews and settlement records.
- Transactional stock reservations, integer-kobo totals, server prices/options, idempotent checkout, multi-owner allocations and audited adjustments. Product editing cannot overwrite inventory.
- Server Paystack initialization and trusted verification, signed/idempotent charge webhooks, persisted payment initialization recovery, bounded refund requests, provider refund processing and status reconciliation.
- Merchant-isolated products, stock, store profiles, orders, commissions and settlement history; authenticated driver dispatch, recipient confirmation, failure reasons, availability, navigation and event timelines.
- RLS on every base table, scoped RPCs, secure cookie refresh, private no-store responses, SEO metadata/sitemap, installable online driver shell and offline reconnect screen.

## Verification

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

Run the isolated browser verification:

```sh
npm run test:e2e
```

Browser tests start their own isolated sandbox on port 3100 and explicitly disable live service credentials. They use installed Chrome locally and Playwright Chromium in CI. To use Playwright Chromium instead, change `channel` in `playwright.config.ts` and install that browser. Tests cover storefront/search/variants/wishlist, reservation checkout, theme draft/publish/rollback, mobile overflow, admin screens, recovery screens, saved-address autofill, cross-tab cart updates, CSP enforcement and service/access errors. They mutate the local sandbox and restore theme state; use a disposable development database, not production credentials.

The 50 business/provider/PostgreSQL/storage/auth tests execute all migrations and cover RLS, stock, allocations, duplicate webhooks, refund claims, driver proof and payment initialization. PGlite simulates Auth/Storage schemas; provider responses are mocked. Real hosted sessions, Storage, Paystack and cross-connection load testing still require staging acceptance.

## Guides

- [Web app, Android APKs, Windows installer and administrator access](docs/APPS.md)

Deploy this repository from Hostinger's GitHub integration using the `main` branch, Next.js, Node 24, install `npm ci --include=dev`, build `npm run build:hostinger`, and start `node --use-system-ca .next/standalone/server.js`. The build prepares public Supabase/domain defaults from `config/hostinger-public.json`. Private service/payment keys remain host environment settings. See the Hostinger guide for domain, authentication and acceptance checks.

- [Connected project and remaining launch steps](docs/LAUNCH.md)
- [Supabase and migrations](docs/SUPABASE.md)
- [Paystack and finance](docs/PAYSTACK.md)
- [Hostinger Business, domain and HTTPS](docs/HOSTINGER.md)
- [Administrator and operations guide](docs/ADMIN.md)
- [Architecture, verified scope and remaining work](docs/STATUS.md)

`npm run check:env` validates required launch values. `npm run build:hostinger` builds and packages standalone assets when that Hostinger workflow is needed. `npm run check:production` verifies that package against the configured services. On Windows, `powershell -NoProfile -File scripts/package-hostinger.ps1` prepares a verified source ZIP for Hostinger upload without local secrets or generated output. `npm run seed:generate` regenerates the development seed from typed fixtures and refuses to overwrite an existing default-theme migration; do not change deployed migration history.

## Source layout

`src/app` contains server pages and APIs; `src/components` contains shared storefront and workspace UI; `src/lib` separates validation, tokens, data access, local transactions and provider integrations. `supabase/migrations` owns production schema/RLS/RPCs. `supabase/seed.sql` is development-only. `tests` includes business, PostgreSQL and browser verification. `public` contains locally served fonts and driver shell assets.

## Launch status

The Wenlas catalogue is implemented locally. No public Wenlas deployment or native installer release has been made by this change. Stock, a dedicated backend, payments, business policies and an actual domain need commissioning before accepting online orders. See [Wenlas setup](docs/WENLAS.md).

See [Inventory and team access](docs/INVENTORY.md) and [Wenlas Hostinger deployment](docs/HOSTINGER.md). The official customer-supplied Wenlas logo is used throughout the storefront and workspace.
