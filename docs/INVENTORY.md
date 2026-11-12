# Wenlas inventory and team access

Open /inventory. First-time owner activation and subsequent sign-in use /inventory/login. Use the supplied official navy/cyan Wenlas logo throughout the app.

The inventory dashboard lists all 98 imported products, with search, category/status filters, on-hand stock, reservations, available stock, reorder levels and live updates every three seconds while visible. Unknown source quantities remain unconfirmed until a staff member records an actual count or receipt.

Choose Manage stock on a product. Receive stock adds delivered units; Record a sale removes sold units; Remove stock records damage/other removals; Record a stock count sets the physical quantity counted; Set reorder level changes the low-stock threshold. Every operation needs a reason/reference and creates an immutable before/after movement. Recording a count detects intervening stock changes; simultaneous sales cannot take available stock below zero. Repeating the same submitted request does not apply it twice.

Movement history shows the latest 100 ledger entries; all entries remain stored in the database. Export stock downloads a current inventory CSV. The storefront reads the same quantities and updates without a page reload. Product enquiries remain available through the original Jiji listings; live inventory does not enable unconfigured payment checkout.

## Add clients or colleagues

The owner opens Team & emails, enters the new email and selects Stock manager or Viewer. Create invitation link produces a private seven-day link. Share it directly with the intended person. They open the link and choose their own password. No email is sent automatically.

Stock managers can view, export and change stock. Viewers can view/export only. Only the owner can create invitations or edit account emails and access levels. Editing an email or role, or disabling an account, signs that account out immediately. Disabled accounts can be re-enabled. The owner can change their own email after confirming their current password; the owner account cannot be disabled.

## Persistence and recovery

Production uses a separate Wenlas MySQL database on Hostinger. Source deployments do not recreate inventory or reset quantities. Keep the database and backups separate from the previous business. The app hashes passwords with salted scrypt and stores only hashes of session/invitation tokens. Sessions expire after 24 hours and are revoked on logout or account changes.

Back up the dedicated database using Hostinger's database backup tools. Do not place database passwords, owner setup codes, session cookies or invitation links in Git, support messages or public documentation.

Every team member can use the key icon in the workspace header to change their own password after confirming the current password. Password changes sign out every existing session.
