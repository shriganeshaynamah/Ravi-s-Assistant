# Security Specification (`security_spec.md`)

## 1. Data Invariants
1. Only the single designated workspace document `/workspaces/ravi_shankar_hq` may be read or written.
2. Every write to `/workspaces/{workspaceId}` must strictly match `workspaceId == 'ravi_shankar_hq'` and `ownerEmail == 'rk867000@gmail.com'`.
3. Every write must pass `isValidLifeOsWorkspace(incoming())` enforcing strict required keys, strict allowed keys (`hasOnly`), bounded list sizes, and immutable `ownerEmail`.
4. Blanket collection listing (`allow list`) is completely disabled (`if false`).

## 2. The "Dirty Dozen" Payloads
1. **Unlisted Ghost Field Injection**: `{ ..., "isAdmin": true }` -> Rejected by `data.keys().hasOnly(...)`.
2. **Owner Email Spoofing**: `{ "ownerEmail": "attacker@evil.com", ... }` -> Rejected by `data.ownerEmail == 'rk867000@gmail.com'`.
3. **Invalid Workspace ID Poisoning**: Write to `/workspaces/other_id` -> Rejected by `workspaceId == 'ravi_shankar_hq'`.
4. **Oversized ID String**: 2KB `workspaceId` -> Rejected by `isValidId(workspaceId)`.
5. **Missing Required Collection Array**: Omitting `loans` or `expenses` -> Rejected by `data.keys().hasAll(...)`.
6. **Type Confusion on `updatedAtMs`**: `{ "updatedAtMs": "not-a-number" }` -> Rejected by `data.updatedAtMs is int || data.updatedAtMs is number`.
7. **Type Confusion on `loans`**: `{ "loans": "not-a-list" }` -> Rejected by `data.loans is list`.
8. **Unbounded Array Exhaustion on `expenses`**: `expenses.size() > 500` -> Rejected by `.size() <= 500`.
9. **Unauthorized Delete**: `deleteDoc(doc(db, 'workspaces', 'ravi_shankar_hq'))` -> Rejected by `allow delete: if false`.
10. **Unauthorized Collection List**: `getDocs(collection(db, 'workspaces'))` -> Rejected by `allow list: if false`.
11. **Arbitrary Collection Write**: Write to `/random_collection/doc1` -> Rejected by global default-deny `match /{document=**} { allow read, write: if false; }`.
12. **Owner Mutation on Update**: Changing `ownerEmail` during update -> Rejected by `incoming().ownerEmail == existing().ownerEmail`.
