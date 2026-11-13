# Wenlas Resources Ltd.

The app name is Wenlas; the full business name is Wenlas Resources Ltd. Its catalogue contains the 98 active listings imported from the owner's Jiji store on 12 November 2026, across 9 categories with 292 product photos. Each product retains its source URL/ID, full description, attributes and naira price.

The supplied official Wenlas logo is retained unchanged as public/brand/wenlas-official-logo.png. SVG display wrappers embed that original artwork for the header and app icon; the storefront uses its navy and cyan colours.

Run npm run dev for a local preview. Catalogue mode is enabled by default and is isolated from the original business's Supabase database. WENLAS_LOCAL_INVENTORY=true enables the separate development inventory SQLite file; production uses a dedicated Wenlas MySQL database. Read INVENTORY.md for stock operations and editable team email/access management. Read HOSTINGER.md for deployment and private environment configuration.

The source repository is https://github.com/Bluechipwhale/wenlas. The copied old Git metadata is archived in ignored .data/wenlas-import/original-edgedirect2u-git. No old commits are pushed into the new repository.

The storefront is live at https://mediumspringgreen-gazelle-531200.hostingersite.com. Its /inventory workspace uses a dedicated Hostinger MySQL database with the initial owner configured. All 98 opening quantities remain unconfirmed until staff record actual counts or receipts.

Use npm run import:wenlas to resume a cached source import, or npm run import:wenlas -- --refresh to fetch current product details. The importer checks seller identity, pagination counts, unique IDs, prices and photos. It never invents physical stock. Existing inventory is retained when the source snapshot is refreshed.

Live payment checkout and native installer releases require separate commissioning. The installable Wenlas web app is available at /apps. No previous business installer is offered as a Wenlas download.

The storefront uses a navy and cyan product showcase, visible naira prices, category shortcuts and cleaner product cards. Unconfirmed products do not show an availability badge or claim to be in stock; confirmed inventory still controls stock warnings and enquiry-only ordering.

Search discovery includes unique homepage, collection, category, brand, contact and product metadata, canonical URLs, social previews, a public catalogue sitemap, crawl rules and safe JSON-LD for the business, products and breadcrumbs. Unknown product availability is omitted from structured offers. Filtered search pages remain outside indexing. Search engines control crawling, indexing and rankings; metadata does not promise a particular position or timing.
