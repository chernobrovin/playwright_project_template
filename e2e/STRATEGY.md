# Test Strategy

## Automation and manual work

Automate stable, consequential rules: booking, cancellation, slot conflicts, working hours, permissions, API contracts, notification triggers, and price calculations. Keep requirement analysis, exploration, usability, and ambiguous behavior primarily manual. Automate critical checks before production once their contracts stabilize. This submission covers one real booking, two form negatives, and successful/negative public API responses with schema assertions.

AI can propose coverage changes from code, contracts, documentation, and completed issues. QA reviews each proposal; rejected suggestions become explicit instructions and examples. A separate investigation agent can classify failures with evidence and confidence. Humans approve issue creation and fixes. This is a proposed review process, not a multi-agent system implemented here.

## Time and repeatability

Use a dedicated tenant, controlled working hours, and `Europe/Kyiv`. Discover availability within 14 future days and partition calendar dates by scenario and repetition. Generate unique synthetic contacts; assert the selected slot and persisted appointment. Fixture teardown deletes only appointments created by that test and verifies HTTP 404. Synthetic client profiles remain. Avoid overlapping local and CI runs; CI serializes its own runs.

Use no fixed sleeps or hidden retries. Run all tests twice with two workers. A controlled environment should also support data seeding and a backend clock for time boundaries; a browser clock cannot freeze server availability. Extend this tenant's schedule beyond October 31, 2026 and maintain booking access before future runs.

## Confirmed findings

Verified September 21, 2026, Chromium, Ukrainian Natodi UI.

### 1. A trial labeled free opens a paid checkout

**Severity:** Minor, pricing clarity.

**Steps:** Complete registration, apply the supplied promo, select `7 днів безкоштовно`, then `Отримати доступ`.

**Expected:** A free trial starts without payment or clearly explains any verification charge and subsequent billing before checkout. Repeated tariff cards show consistent prices.

**Actual:** The card says both `7 днів безкоштовно` and `1.00 грн`; checkout requests `Сплатити 1,00грн` for `Natodi Pro subscription`. Duplicate cards below retain their original prices after the upper cards change to 1 UAH.

**Impact:** The activation cost is unclear. A payment was required on this selected route. Availability of a separate Free-plan route remains unverified; this is not evidence that Free is unavailable.

### 2. Pasting an international phone number changes its digits

**Severity:** Major, incorrect booking contact data.

**Steps:** Reach booking contacts and paste synthetic `+380000000001` into `Телефон *`.

**Expected:** Preserve and format the same phone number, or reject an unsupported format clearly.

**Actual:** The field becomes `+38 (380) 000-0000`, duplicating part of the country prefix and dropping trailing digits. Entering national digits `0000000001` instead produces the intended `+38 (000) 000-0001`.

**Impact:** A pasted contact number can identify the wrong recipient. The suite uses national digits as a documented workaround; this does not resolve the product defect.
