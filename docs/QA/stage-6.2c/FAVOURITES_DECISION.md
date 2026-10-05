# GST-034 / Favourites — product decision implemented

Status: **IMPLEMENTED AND VERIFIED** on 2026-09-30.

## Accepted product decision

MIRA LINK user authentication is global and independent from a restaurant session. An authenticated user may use account-level features without joining a restaurant. A restaurant session remains a separate entity for a restaurant, table, current order, bill, Split and payment.

For GST-034:

- an authenticated MIRA LINK user can save, view and remove favourites without a restaurant session;
- an anonymous favourite action opens GST-037;
- anonymous access does not mutate favourites;
- after successful authentication, the pending action resumes in the existing context.

## Architecture audit

1. Domain authentication identity already existed as `State.users` / `User` in `lib/domain/model.ts`; the seed contains the demo user `u1`.
2. The coupling came from `GuestContent`: it resolved the user only through `sessionStorage['mira-guest'] -> Guest.userId`. `Guest.userId` was assigned only by `enterTableByToken` when the join toggle selected a registered guest.
3. Session-specific domain commands still correctly depend on `Guest` and `RestaurantSession`. Account screens consume `User`; marketing settings already use `userId` directly. Review submission remains visit-specific because `createReview` requires `guestId`.
4. The separation was possible in demo/frontend state: persist the ID of an existing domain `User` independently from the session guest ID, and pass it to account-level presentation.
5. Affected E2E areas were GST-034 and the multi-tab cashback locator. Full session, payment, Split, anonymous and Nearby isolation coverage was rerun.
6. The existing `User` abstraction was reused. No fake user, hardcoded authenticated boolean or test-only bypass was added.
7. No backend or API exists for this demo flow, so no API/domain contract change was required.

## Implementation

- `mira-link-user-v1` stores the authenticated existing `User.id` independently of `mira-guest`.
- `mira-guest` remains session-scoped and is created only through the existing table-entry command.
- Joining a restaurant while globally authenticated passes the existing registered-user intent to `enterTableByToken`; no session is created by account sign-in itself.
- Dish favourites are stored per authenticated user under `mira-dish-favorites:<userId>`.
- Anonymous favourite actions open GST-037 and leave the per-user favourites key untouched.
- GST-037 authenticates through the existing seeded user record and resumes the pending favourite or account-navigation action.
- `Services` receives the global user independently from `guestId`. Visit-specific review submission is shown only when both an authenticated user and a restaurant guest exist.
- Domain engine, financial logic, Split, payment, orders and restaurant-session contracts were not changed.

## E2E expectation changes

### GST-034

- Original: anonymous click immediately saved a dish, then Favourites opened without authentication.
- New: anonymous click must show GST-037 and must not mutate favourites; sign-in as the existing user resumes the save; the authenticated user then views and removes the dish without any restaurant session.
- Reason: the accepted product decision makes Favourites account-only while keeping authentication independent from restaurant visits.
- Preserved business result: save, view, detail view, disabled cart action without a table, and removal are all still asserted. The test additionally asserts zero sessions and zero guests.

### Multi-tab cashback locator

- Original: `getByText(/accrual/)` assumed a unique rendered node.
- New: the first visible `accrual` entry is asserted.
- Reason: global authentication is shared across tabs in one browser context, so the same authenticated user can have multiple valid accrual entries after the three-payment scenario; the old locator failed Playwright strict mode before making its visibility assertion.
- Preserved business result: all equal-split, successful-payment and cashback assertions remain. No amount, financial outcome or domain expectation was weakened.

## Verification evidence

- TypeScript: **PASS**, exit 0.
- Unit tests: **23/23 PASS**, exit 0.
- Targeted GST-034: **1/1 PASS**, exit 0 — `favourites-targeted.json`.
- Targeted cashback regression: **1/1 PASS**, exit 0 — `cashback-targeted.json`.
- Authentication / restaurant-session suite: **14/14 PASS**, exit 0 — `auth-session-related-final.json`.
- Full Chromium Stage 6 E2E: **32/32 PASS**, exit 0; skipped 0 — `full-auth-final.json`.

## Files changed for this decision

- `components/demo-app.tsx`
- `tests/e2e/guest-theme.spec.ts`
- `tests/e2e/cycle.spec.ts`
- `docs/QA/STAGE_6_E2E_PROGRESS.md`
- `docs/QA/stage-6.2c/FAVOURITES_DECISION.md`
- Generated JSON evidence in `docs/QA/stage-6.2c/`.

Stage 7 was not started.
