# Wenlas Backend User Manual

Wenlas Resources Ltd. | Inventory and team administration | Edition 13 November 2026

This manual explains every function in the live Wenlas inventory workspace. Use it to establish reliable opening stock, record daily movements, monitor availability, export stock and manage staff accounts. Owners and stock managers should read the stock procedures before entering quantities; viewers can use the viewing and export sections.

The catalogue launched with 98 products. Imported listings do not establish physical quantities: a zero marked Count needed means the quantity has not been confirmed. Count the goods before using those figures to make promises to customers.

## 1 Access and first use

### Workspace links

- Storefront: https://mediumspringgreen-gazelle-531200.hostingersite.com
- Inventory: https://mediumspringgreen-gazelle-531200.hostingersite.com/inventory
- Sign in: https://mediumspringgreen-gazelle-531200.hostingersite.com/inventory/login

Bookmark the inventory link. You can also select Inventory & staff in the storefront footer. The Wenlas owner login is separate from Hostinger and GitHub; staff do not need hosting or source repository access to manage stock.

### Sign in

1. Open the sign-in link using an internet-connected browser.
2. Enter your assigned Email address and Password. Use Show password only when nobody else can see your screen.
3. Select Sign in. Wait for Inventory overview to load and check the email and role shown below the summary cards.
4. Confirm the connection indicator says Live updates and the Updated time is current before changing stock.

The initial owner's access details were supplied privately. Keep that file separate from this manual; this manual contains no passwords, setup tokens or invitation links. Invited staff choose their own passwords using the procedure in section 9.

### First day checklist

1. The owner signs in and changes the initial password using the key icon.
2. Invite named staff accounts with the minimum role needed.
3. Coordinate an opening count so staff do not sell or receive the same item during its count.
4. For each product, record the actual total using Record a stock count, then set a reorder level if needed.
5. Check Movement history and export an opening inventory CSV.
6. Open the storefront and confirm availability reflects the counts.

### Password changes and sign out

Select the key icon labelled Change your password. Enter Current password, New password and Confirm new password, then select Update password. New passwords must contain 12 to 128 characters. Choose a unique password and keep it in your own password manager. A successful change signs out every session for that account; sign in again using the new password.

Select the arrow icon labelled Sign out when finished, especially on a shared device. Sign out ends the current session. Sessions expire after 24 hours; a password change ends all sessions. Closing a browser tab alone is not a substitute for signing out.

## 2 Roles and permissions

Each person should use a separate email and password so the movement ledger identifies who recorded an operation.

| Function | Owner | Stock manager | Viewer |
| --- | --- | --- | --- |
| View stock and movement history | Yes | Yes | Yes |
| Search and filter stock | Yes | Yes | Yes |
| Export current stock CSV | Yes | Yes | Yes |
| Receive stock and record sales | Yes | Yes | No |
| Record removals and physical counts | Yes | Yes | No |
| Change reorder levels | Yes | Yes | No |
| Invite staff and edit team access | Yes | No | No |
| Edit own email in Team & emails | Yes | No | No |
| Change own password and sign out | Yes | Yes | Yes |

A viewer will not see Manage stock, and only the owner sees Team & emails. A manager or viewer asks the owner to change their email or access level. The current interface protects the owner from being disabled or demoted. Adding a manager does not transfer ownership.

## 3 Understand the dashboard

### Summary cards

Products in your catalogue counts the product records in this inventory. Units on hand adds the recorded physical quantities across all products; it is a unit total, not money or stock valuation. At or below reorder level counts confirmed products whose available quantity is less than or equal to their reorder level, including confirmed products with no available stock. Awaiting a stock count counts products whose quantity remains unconfirmed.

These cards describe the whole catalogue and do not shrink when you use the product search or filters. The Your products count and page controls describe the filtered list below them.

### Stock columns

| Field | Meaning |
| --- | --- |
| Product and SKU | Name, brand and unique product identifier. Match the physical item to the correct SKU before saving. |
| On hand | Total physical units currently recorded for that product. |
| Reserved | Units protected from removal. This workspace displays reservations but has no manual reservation editor. |
| Available | On hand minus Reserved. This is the quantity available for a sale or removal. |
| Reorder level | Your chosen threshold for low-stock monitoring. It does not order goods automatically. |
| Status | Count needed, Out of stock, Low stock or In stock, according to confirmation and available quantity. |
| Manage stock | Opens the stock operation form for an owner or manager. |

Example: On hand 20 and Reserved 3 means Available 17. A sale of 5 leaves On hand 15 and Available 12. The system refuses a sale, removal or count that would leave On hand below Reserved.

### Status meanings

Count needed means the opening quantity is unconfirmed; it does not prove the shop has no stock. For confirmed quantities, Available 0 shows Out of stock; a positive Available quantity at or below the reorder level shows Low stock; a quantity above the threshold shows In stock. Reorder levels initially default to zero.

### Live updates and Refresh

The workspace checks for changes about every three seconds while its browser tab is visible, and refreshes when you return to it. Refresh requests a new snapshot immediately. Updated displays the last successful workspace update in Lagos time. A recent Updated time does not necessarily mean a sale or receipt happened at that time.

If Reconnecting or a connection warning appears, displayed figures may be old. Wait for Live updates or refresh successfully before relying on them. Stock changes require an internet connection; there is no offline stock-entry queue.

## 4 Find products and navigate

### Search and filters

1. Open Stock overview.
2. Type a product name, brand or SKU into Search inventory. Search is case-insensitive.
3. Use Filter by category to narrow the list to the right group.
4. Use Filter by stock status to select All stock, Low stock, Out of stock or Unconfirmed stock.
5. Clear the search and select All categories and All stock to return to the complete list.

The three filters work together. Low stock includes confirmed products at or below their reorder level, so confirmed out-of-stock items can appear there too. Out of stock includes confirmed zero-available products. Unconfirmed stock finds items requiring an opening count.

The table displays 20 products per page. Use Next and Previous; a disabled control means you are already at that end of the list. Changing a filter returns to the beginning of its results. No products match your filters means the current combination found nothing, not that the catalogue was deleted.

### Phones and smaller screens

The workspace adjusts to screen size. On a narrow phone, key quantities appear below the product name and some desktop columns are hidden. At intermediate widths, swipe the table sideways if a column or Manage stock is outside the visible area. Scroll down to reach forms and page controls. Rotating the phone or using a larger screen can make stock reviews easier.

### View storefront

View storefront opens the public Wenlas shop. Use it to check availability labels after stock work; return through the bookmarked inventory link or the footer. Inventory access remains private even though the catalogue is public.

## 5 Rules for all stock operations

1. Find the exact product and choose Manage stock on its row.
2. Review On hand, Reserved and Available in the form.
3. Choose the correct Stock operation.
4. Enter a whole-number quantity or threshold as described in section 6.
5. Enter a clear Reason / reference, from 3 to 500 characters. Use a delivery note, receipt or count reference when available.
6. Check the product, operation, number and reason, then select Save stock movement once.
7. Wait for the form to close after success. Check the resulting row and Movement history.

Cancel or the close icon abandons an unsaved form. Saving does not require a second confirmation screen. While Saving is displayed, wait for the response rather than starting the same operation in another tab.

Receipts, sales and removals require positive whole numbers from 1 to 1,000,000. Counts and reorder levels allow zero through 1,000,000. The resulting On hand balance cannot exceed 1,000,000 or fall below Reserved. Do not type minus signs, currency values or decimal quantities into these fields.

Every successful operation records the operator email, reason, time and resulting balance. The same submission has duplicate protection, but reopening a form creates a new operation: it is not safe to assume a second entry will be ignored. If a connection fails around a save, inspect history and the balance before deciding whether to enter it again.

Reason examples: Opening count shelf A 13 Nov; Supplier invoice INV1042 received 12 units; Counter sale receipt S0051 quantity 2; Damaged packaging inspection D008. Use references that your team can trace. Keep passwords, payment details and unnecessary customer information out of reasons.

## 6 Every stock operation

### Receive stock

Use Receive stock for goods arriving into saleable inventory, such as a supplier delivery or a customer return inspected and approved for resale.

1. Open Manage stock for the receiving product.
2. Choose Receive stock and enter the number of additional units received in Quantity.
3. Enter the supplier invoice, delivery or approved return reference.
4. Select Save stock movement and verify the increased balance.

Example: On hand 10, Quantity 6 produces On hand 16. Enter 6, not the new total 16. Receive stock confirms the stock record. If an unconfirmed item already has physical stock in the shop, count all of it first; recording only the latest delivery against an unconfirmed zero would omit the existing goods.

### Record a sale

Use Record a sale when goods leave recorded inventory because they were sold.

1. Open Manage stock and choose Record a sale.
2. Enter units sold, not the amount paid, in Quantity.
3. Enter the sales receipt or counter-sale reference.
4. Save and check the reduced available balance and history.

Example: On hand 16, Reserved 2, Available 14; a sale of 3 produces On hand 13 and Available 11. A sale of 15 is refused because it exceeds availability. Recording a sale changes units only: it does not charge a customer, create a payment transaction, issue a receipt, calculate tax or send an invoice. Complete the business's sales and payment procedures separately.

### Remove damaged or returned stock

The menu label is Remove damaged / returned stock. This operation always subtracts units. Use it for damaged goods removed from saleable stock, losses, goods returned to a supplier or another documented outward movement.

1. Open Manage stock and select Remove damaged / returned stock.
2. Enter the number leaving inventory as a positive Quantity.
3. Explain the reason and supporting damage, supplier return or adjustment reference.
4. Save and verify the reduced quantity.

Example: On hand 13, remove 2 damaged units, produces On hand 11. For a customer return coming back into saleable stock, use Receive stock after inspection. Do not select Remove for an inbound return merely because its label contains returned. Keep non-saleable returned goods outside the saleable quantity until the business decides how to handle them.

### Record a stock count

Use Record a stock count to set the physical total after counting. This replaces On hand with the counted total; it is not a quantity to add or subtract.

1. Coordinate the count with staff handling the item. Count the physical units that belong in this stock balance.
2. Open or reopen Manage stock so it reflects the latest balance.
3. Choose Record a stock count and enter the actual total in Counted stock.
4. Enter a count date, shelf/location and reference in Reason / reference.
5. Save, then compare the result to the count sheet and check the ledger.

Example: The app shows 11 but the physical count is 9. Enter 9. The history records a change of -2 and Stock after 9. If the shelf is empty, enter 0; this confirms a genuine zero instead of leaving Count needed. Counts cannot be below a reserved quantity.

If someone changes that product after you open the form, the system refuses the stale count. Close the editor, select Refresh, review the intervening movement, recount or reconcile the timing, then reopen and save the correct total. Do not repeatedly submit the old form.

### Set reorder level

Use Set reorder level to choose when the product needs replenishment attention.

1. Open Manage stock and select Set reorder level.
2. Enter the desired threshold in Reorder level.
3. Explain the purchasing or review reason, then save.
4. Review the status and At or below reorder level card.

Example: Available 5 and reorder level 5 qualifies as low stock; Available 6 does not. Choose thresholds using your supplier lead time and normal sales rate. Zero is allowed. This action changes the threshold, leaves the physical quantity unchanged and creates a history entry showing the old and new thresholds. It does not confirm an uncounted product, email a supplier or create a purchase order.

## 7 History and corrections

### Movement history

Select Movement history to see the latest 100 operations across the catalogue, newest first. All movements remain stored in the database, even when older ones fall outside this on-screen list. The current workspace does not provide history search, date filters or a complete ledger export.

When shows Lagos time. Product identifies the item. Operation identifies the stock action. Change is the signed difference in units; + means units added, - means units removed. Stock after is the resulting On hand balance. Reason / team member contains the reference and the email that recorded it. Reorder changes show the before and after thresholds; their unit change is zero.

A count can produce a positive, negative or zero unit change, depending on the previous balance. A receipt and a sale with the same quantity can cancel numerically but remain separate recorded events.

### Correct an error

There is no Edit, Delete or Undo control for saved movements. Preserve the audit trail and record a new correcting operation with a reason referencing the earlier mistake.

Example: A receipt of 8 was entered, but only 6 arrived. If no other facts changed, a documented removal of 2 can correct the balance; use a reason such as Correction to INV1042 receipt entered as 8 actual 6. If the correct physical balance is uncertain, coordinate and record a new stock count instead. Check later sales and receipts before deciding on a correction, and have a manager review material discrepancies.

If your team changes a person's email later, earlier movement entries retain the operator email recorded at the time. Keep a staff handover record when email ownership changes.

## 8 Export and reconciliation

### Export stock

1. Select Export stock near the top of the workspace.
2. Save the downloaded wenlas-inventory.csv file.
3. Open it in Excel or another CSV-capable spreadsheet app. Import it as UTF-8 and comma-separated if the program asks.
4. Save a dated copy for the count, handover or reconciliation you are performing.

The export includes all current stock records, regardless of search, category, stock-status filter or current page. It is a stock snapshot, not the movement ledger, a sales report or a full database backup. Editing the downloaded spreadsheet does not change the live app, and there is no CSV upload or bulk stock-import button in this workspace.

Columns are SKU, Product, Brand, On hand, Reserved, Available, Reorder level, Stock confirmed and Updated at. Stock confirmed is Yes or No. Updated at is the product's last stock-record update timestamp, exported in ISO format with a UTC Z suffix. The on-screen workspace displays Lagos time instead. Compare by SKU when joining files because names can be similar.

### Reconcile an exported snapshot

Compare physical count sheets and receipt references to the CSV. Investigate differences against Movement history. Coordinate counts while business continues so changes after the export are not mistaken for errors. Save adjustments in the live workspace using the correct operation and a traceable reason; then export a fresh snapshot.

## 9 Team accounts and email addresses

Only the owner sees Team & emails. A staff inventory account gives access to this workspace; it does not create a mailbox or grant Hostinger or GitHub access.

### Invite a manager or viewer

1. Open Team & emails.
2. Under Invite a team member, enter the person's correct email.
3. Choose Stock manager for someone who must record stock, or Viewer for someone who should only view and export.
4. Select Create invitation link.
5. Select Copy link and send the complete private link directly to the intended person through your normal trusted channel.
6. After activation, check Workspace accounts to confirm the email and role.

The app does not send an email automatically. Links last seven days and can be accepted once. The link itself permits activation, so verify the recipient and do not publish it in a group or public document. The current UI does not display or revoke pending invitations; creating a replacement does not itself guarantee the earlier unused link is invalidated. If a link is exposed, contact the administrator for revocation, and disable any unwanted account that has activated.

### Accept an invitation

The recipient opens the complete invitation link, including the part after the # symbol, and sees You're invited. They enter Password and Confirm password, both matching and at least 12 characters, then select Activate workspace. The account uses the email and role chosen by the owner; the invitee does not choose a different email in this screen. After activation they enter inventory and subsequently sign in with that email and password.

An expired or used link cannot be accepted again. If the account is already active, use the normal sign-in page. If it never activated and the link expired, ask the owner for a new one. Workspace accounts lists activated accounts, so a freshly created invitation may not appear there yet.

### Edit a team email or role

1. In Workspace accounts, select Edit beside the correct person.
2. Change Email address if needed, and choose Stock manager or Viewer in Access level.
3. Leave Disable account access clear if they should remain active.
4. Select Save account and confirm the revised account is listed.
5. Tell the person to sign in again with the updated email and their existing password.

Emails must be unique across workspace accounts. Editing an account revokes its existing sessions. An email change does not change the password, verify mailbox ownership or send an automatic notification. Confirm the address with the person before saving. Use a new invitation for an additional person instead of repurposing an existing person's login.

### Change the owner email

Open Team & emails and select Edit beside your owner account. Enter the new Email address and Your current password, then select Save account. You are signed out; sign in using the new email and the same password. The owner role stays protected. Changing the owner email changes this application's login identifier; it does not transfer your Hostinger or GitHub account.

### Disable and restore a staff account

To stop access, select Edit for that staff member, tick Disable account access and select Save account. Existing sessions are revoked and the account cannot sign in. Workspace accounts shows Access disabled. This retains the account and history; it is not permanent deletion.

To restore access, select Edit, clear Disable account access and save. The person can sign in with their current email and existing password. The owner cannot disable or demote the owner account from this screen. Managers cannot administer other accounts.

## 10 Daily and periodic routines

### Start of day

Sign in with your own account, verify Live updates, review Low stock and Out of stock, and identify products still awaiting a count. Coordinate deliveries and counts with the other staff on duty.

### During the day

Record supplier receipts when checked, record sales once, and record documented outward damage or supplier returns. Inspect the new balance after each save. Keep external sales, payment and supplier documents using references that match the movement reasons. Watch for overlapping work on the same product.

### End of day

Review recent movements, investigate unexpected balances, count selected high-value or fast-moving products, export a dated stock snapshot and sign out. Any cash or payment reconciliation belongs in the business's separate sales/payment process.

### Weekly owner review

Review reorder thresholds, resolve Count needed items, check active staff and roles, disable accounts that no longer need access, and confirm a recent dedicated database backup is available. Keep a dated handover record for staffing and account-email changes.

### Worked sequence

All quantities below are training examples, not live Wenlas stock.

| Step | Action entered | On hand after | Available after if Reserved is 0 |
| --- | --- | --- | --- |
| Opening count | Record a stock count 20 | 20 | 20 |
| Delivery | Receive stock 8 | 28 | 28 |
| Counter sale | Record a sale 3 | 25 | 25 |
| Damaged unit | Remove damaged / returned stock 1 | 24 | 24 |
| Count difference | Record a stock count 23 | 23 | 23 |
| Purchasing threshold | Set reorder level 5 | 23 | 23 |

The count difference creates a -1 adjustment. The reorder action changes the threshold but adds no units. If an inbound customer return is approved for resale, receive it separately with its return reference.

## 11 Troubleshooting

### Sign in and access problems

Email or password is incorrect: verify the current account email, Caps Lock and password. If the owner changed the email, the old address no longer signs in. A disabled account cannot sign in; ask the owner to check access.

Too many sign-in attempts: the system limits repeated attempts for an email. Stop retrying and wait 15 minutes before using the correct details. A successful login clears the attempt counter.

Repeated sign-in prompts: a session may have expired or been revoked by a password, email or role change. Sign in again. If an active account is still refused, have the owner check its status.

Forgotten password: the inventory workspace currently has no self-service password-reset email flow and no owner password-reset control for another user. Contact the designated application administrator for a verified recovery procedure. Do not use unrelated customer-account password pages as an inventory reset path, share passwords in chat, or reset the production database to regain access.

No Team & emails tab or Manage stock button: check the role next to your email. Only owners see the team tab; viewers cannot change stock. Ask the owner for the appropriate role if your duties changed.

### Stock problems

Insufficient available stock: refresh and compare On hand, Reserved and Available. Check for a recent sale or removal. A count cannot be below Reserved. Resolve the actual discrepancy; do not invent receipts merely to bypass the protection.

Stock changed since you opened this count: close the form, refresh, examine intervening movements and reopen it with a reconciled physical total.

A quantity is refused: enter a whole number within the allowed range. Sales, receipts and removals require at least 1; counts and thresholds can be 0. Supply a reason of at least 3 characters.

A save result is uncertain: regain a connection, review the balance and Movement history, and identify the product, operation, time and reason before submitting a new entry. Do not create multiple compensating movements until you know what saved.

No products match: clear the search and both filters and check the first page. If the full catalogue still does not load, investigate the connection.

### Connection and download problems

Reconnecting or Loading persists: check your internet connection, return to the tab, select Refresh and try a browser reload. A previously displayed table can remain visible while stale; use the last successful Updated time as a warning.

Inventory database is not connected yet: notify the hosting/application administrator. They should inspect the Wenlas app's environment, dedicated database and runtime logs. This is not a reason to create a replacement stock database or enter quantities in another business's app.

CSV will not open cleanly: import it as UTF-8 CSV with comma separators. Check Downloads and browser download settings. Sign in again if the export requires authentication. Remember that it contains all stock records, even when the screen is filtered.

Storefront availability looks old: wait a few seconds with the page visible, reload it, check the confirmed state in inventory and verify Live updates. Unconfirmed products show an availability enquiry state. Inventory saves do not update the original Jiji listing.

### Ask for support effectively

Provide the page URL, time in Lagos, product name/SKU, operation, intended quantity, reason/reference and the exact visible error. Say whether the movement already appears in history. Screenshots should exclude passwords, private invitation links and customer or financial details. Send support requests through your agreed support contact; the app does not automatically create a support ticket from an inventory error.

## 12 Hosting continuity and current scope

### Database backups and recovery

Production stock, movements, accounts and sessions use a dedicated Wenlas MySQL database. Replacing website source files does not intentionally reset these records. Stock CSV exports are useful operational snapshots but do not back up users, credentials, invitations or the complete movement ledger.

The hosting administrator should use the Wenlas site's Hostinger database backup tools, verify the dedicated database selected and confirm the available backup dates and retention in that account. Store backup downloads privately. Keep the application environment and database credentials separate from source code and staff manuals.

For a recovery, first coordinate a maintenance window and stop stock entry, preserve the current database, identify the correct backup and involve the designated administrator. Review and re-enter documented movements made after the backup, then verify stock, accounts and storefront availability before resuming. Do not restore an old backup over active stock without that reconciliation.

This inventory manual does not authorise a destructive database restore. Staff should not edit records directly in phpMyAdmin. Application administrators should use the separate hosting guide for technical deployment settings.

### Functions available in this release

The live workspace provides stock viewing, search, filters, pagination, receipts, manual sale deductions, removals, physical counts, reorder thresholds, the latest 100 on-screen movements, current-stock CSV export, editable team emails, manager/viewer invitations, account disabling and personal password changes.

The workspace currently has no product-create/delete editor, price/photo editor, warehouse/location transfer screen, serial-number or batch tracking, valuation/profit reports, purchase-order generation, automated low-stock emails, bulk CSV stock import, inventory password-reset email flow, full ledger export or manual reservation editor. Arrange catalogue additions or changes with the application administrator; refreshing the Jiji catalogue is a separate source maintenance task, not a stock receipt.

Customer checkout and online payments are not commissioned for this catalogue release. Public enquiries link to the Wenlas Jiji listings. A Jiji sale does not automatically deduct inventory here; staff must record the stock movement once. Likewise, changing inventory does not edit Jiji quantities or listings. Native installer releases and the older commerce administration tools are outside this commissioned inventory workspace.

### Handover checklist

- Confirm the owner can sign in and has changed the initial password.
- Confirm each staff member has their own correct email and role.
- Complete opening counts and agree reorder levels.
- Review the five stock operations using this manual's examples. Use a separate training environment for any practice entries, never live stock.
- Check that the team knows how to verify a save and correct a mistake.
- Save a current stock export and confirm a database backup process.
- Keep hosting access, owner credentials and private invitation links outside this manual.
- Record the designated owner, stock lead and application support contact in your private operating records.
