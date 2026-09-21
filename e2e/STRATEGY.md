# Test Strategy

## Automation and manual work

Automate stable rules: booking, cancellation, slot conflicts, working hours, permissions, API contracts, notification triggers, and prices. Keep requirement analysis, exploration, usability, and ambiguous behavior primarily manual. Automate critical checks before production once contracts stabilize. This submission covers booking, two form negatives, and successful/negative public API responses with schema assertions.

AI can propose coverage changes from code, contracts, documentation, and completed issues. QA reviews proposals; rejections become explicit instructions and examples. An investigation agent can classify failures with evidence and confidence. Humans approve issues and fixes. This is a proposed review process, not a system implemented here.

## Time and repeatability

Use a dedicated tenant, controlled hours, and `Europe/Kyiv`. Discover availability within 14 future days; partition calendar dates by scenario and repetition. Generate unique synthetic contacts and assert the persisted appointment. Teardown deletes only each test's appointments and verifies 404; synthetic client profiles remain. CI serializes runs; avoid overlapping local execution.

Use no fixed sleeps or hidden retries. Repeat all tests twice with two workers. A controlled environment should support data seeding and a backend clock for boundaries; a browser clock cannot freeze server availability. Extend working hours beyond October 31, 2026 and maintain the tenant's booking access.

## Confirmed findings

Verified September 21, 2026, Chromium, Ukrainian UI.

### 1. A trial labeled free opens a paid checkout

**Severity:** Minor, pricing clarity.

**Steps:** Register, apply the supplied promo, select `7 днів безкоштовно`, then `Отримати доступ`.

**Expected:** Explain activation charges and show consistent prices before checkout.

**Actual:** The card says both `7 днів безкоштовно` and `1.00 грн`; checkout requests `Сплатити 1,00грн` for a Pro subscription. Duplicate cards below retain their original prices.

**Impact:** Activation cost is unclear. Payment was required on this route; a separate Free-plan route remains unverified.

### 2. Pasting an international phone number changes its digits

**Severity:** Major, incorrect contact data.

**Steps:** Reach booking contacts; paste synthetic `+380000000001` into `Телефон *`.

**Expected:** Preserve the number or clearly reject its format.

**Actual:** It becomes `+38 (380) 000-0000`. Entering national digits `0000000001` produces the intended `+38 (000) 000-0001`.

**Impact:** A pasted contact can identify the wrong recipient. Tests document and use the national-digit workaround.

### 3. Duplicate input IDs associate both labels with the name field

**Severity:** Moderate, accessibility. **Reproducibility:** Intermittent, captured in CI trace.

**Steps:** Open booking contacts repeatedly; inspect input IDs and associated labels.

**Expected:** Unique IDs; each label identifies its corresponding input.

**Actual:** Name and phone both received `id="input-25"`; both labels used `for="input-25"`. The name field's accessible name became `Ім'я * Телефон *`; the phone lost its label.

**Impact:** Assistive technologies and label-based interaction can identify the wrong field. Tests scope inputs by observed `formcontrolname` attributes. Evidence: [CI run and trace artifact](https://github.com/chernobrovin/playwright_project_template/actions/runs/35545954117).
