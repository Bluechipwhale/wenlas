# Wenlas Resources Ltd.

Wenlas is an electronics storefront with 98 products, 9 categories and 292 product photos imported from the owner's [Jiji catalogue](https://jiji.ng/sellerpage-Cya3vFFCDoDTmxwjjm6P39IL). It uses the supplied official Wenlas logo and navy/cyan branding.

- [Live storefront](https://mediumspringgreen-gazelle-531200.hostingersite.com)
- [Inventory workspace](https://mediumspringgreen-gazelle-531200.hostingersite.com/inventory)
- [Source repository](https://github.com/Bluechipwhale/wenlas)

## Inventory and team access

Production inventory uses a dedicated Wenlas MySQL database on Hostinger. The owner can record receipts, sales, removals and physical counts, set reorder levels, export stock and review movement history. Stock changes appear across the team and storefront within seconds.

Team & emails lets the owner invite managers or viewers, edit account email addresses and disable access. Every user can change their own password. Credentials and invitation links stay private and are never committed.

All imported quantities begin unconfirmed. Staff must record actual opening counts or receipts before treating them as confirmed stock. Product enquiries use the original Jiji listings; online payment checkout is not commissioned.

## Run locally

Use Node 24:

```sh
npm ci
npm run dev
```

Copy `.env.example` to `.env.local` and follow the Wenlas configuration notes. Development inventory uses a separate SQLite file; production requires the dedicated MySQL settings. Previous business credentials are not used for Wenlas inventory.

## Validate and deploy

```sh
npm run lint
npm run typecheck
npm test
npx playwright test --config playwright.wenlas.config.ts
npm run build:hostinger
npm run check:production
```

The application release passed these checks in GitHub Actions. Hostinger runs Node 24, `npm run build:hostinger`, and the generated Next.js standalone server. Deploy the committed source archive without changing another account's existing Git connection. See the hosting guide for packaging and private environment settings.

## Guides

- [Catalogue and branding](docs/WENLAS.md)
- [Inventory and editable team accounts](docs/INVENTORY.md)
- [Hostinger deployment and database configuration](docs/HOSTINGER.md)

The live storefront and dedicated inventory database were commissioned on 13 November 2026. Customer accounts, online payments and native installer releases require separate commissioning. Historical commerce code and test fixtures remain in the repository but are not connected to the previous business's production services.
