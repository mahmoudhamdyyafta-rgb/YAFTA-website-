# Security Specifications - YAFTA Platform

## 1. Data Invariants
- A `Material` document must contain valid Arabic and English names and positive numbers for stock levels.
- A `Movement` document must reference a valid `materialId` with type "In" or "Out".
- A `Supplier` document must contain a unique `id`, `companyName`, and `contactPerson` details.
- A `Purchase` document must belong to a registered `supplierId`.
- An accounting record in `finance` must have type "Revenue" or "Expense".
- A `Project` document must progress through the defined stages sequentially.
- Custom settings for `logos` and `whatsapp` are configurable only by authenticated Admin or Super Admin roles.

## 2. The "Dirty Dozen" Payloads
1. **Malicious Material Injection**: Creating a material document with a spoofed ID of 2MB to exhaust project budget.
2. **Privilege Escalation**: Attempting to rewrite user profile `role` parameter to "Admin".
3. **Out-of-Bounds Stock Withdrawal**: Forcing a stock movement subtraction of a quantity greater than available stock.
4. **Anomalous Currency Postings**: Posting Negative Finance Revenue entry to siphon off funds record.
5. **Orphaned Project Creation**: Submitting a project workflow without a valid client account link.
6. **Malicious WhatsApp Redirect**: Injecting JavaScript payload into `whatsapp.number` configuration.
7. **Bypassing Logo Size Bounds**: Uploading a logo size configuration of negative integer or massive dimensions.
8. **Spoofing CreatedAt Dates**: Providing a client-side timestamp to forge transaction creation time.
9. **Unauthenticated Write Bypass**: Submitting material adjustments without active auth header token.
10. **State Shortcutting**: Updating project status straight to "Completed" from "New Lead" bypasses production gates.
11. **PII Information Leakage**: Retrieving confidential supplier contact balances from an unauthenticated visitor role.
12. **Double-Spend Purchase Order**: Modifying outstanding balances of a supplier invoice without proper audit ledger record.

## 3. The Test Runner
A `firestore.rules.test.ts` is configured to run tests simulating all listed malicious payloads to ensure `PERMISSION_DENIED` status is always returned correctly.
