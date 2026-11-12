# Wenlas Resources Ltd.

The app name is Wenlas; the full business name is Wenlas Resources Ltd. Its catalogue contains the 98 active listings imported from the owner's Jiji store on 12 November 2026, across 9 categories with 292 product photos. Each product retains its source URL/ID, full description, attributes and naira price.

The supplied official Wenlas logo is retained unchanged as public/brand/wenlas-official-logo.png. SVG display wrappers embed that original artwork for the header and app icon; the storefront uses its navy and cyan colours.

Run npm run dev for a local preview. Catalogue mode is enabled by default and is isolated from the original business's Supabase database. WENLAS_LOCAL_INVENTORY=true enables the separate development inventory SQLite file; production uses a dedicated Wenlas MySQL database. Read INVENTORY.md for stock operations and editable team email/access management. Read HOSTINGER.md for deployment and private environment configuration.

The source repository is https://github.com/Bluechipwhale/wenlas. The copied old Git metadata is archived in ignored .data/wenlas-import/original-edgedirect2u-git. No old commits are pushed into the new repository.

Use npm run import:wenlas to resume a cached source import, or npm run import:wenlas -- --refresh to fetch current product details. The importer checks seller identity, pagination counts, unique IDs, prices and photos. It never invents physical stock. Existing inventory is retained when the source snapshot is refreshed.

Live payment checkout and native installer releases require separate commissioning. The installable Wenlas web app is available at /apps. No previous business installer is offered as a Wenlas download.
