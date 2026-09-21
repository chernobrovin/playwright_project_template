# AI-assisted delivery and QA judgment

I defined the QA approach, supplied my earlier automation framework as a reference, and used AI to implement and investigate the focused submission. My contribution centered on coverage decisions, exploratory testing, and review of the evidence behind the result.

## What I delegated

- Compare the reference framework with the assignment and implement a focused Playwright + TypeScript suite: page object, fixtures, data generation, UI cases, and API checks.
- Inspect the live booking flow, configure the test tenant, run local and CI checks, and investigate failures using browser traces, network responses, and the observed DOM.
- Reproduce exploratory observations, prepare focused evidence, archive the generated reports, and draft the submission documents under review.

## My contribution and revision decisions

I set the direction: demonstrate engineering judgment through a small, maintainable suite, combine automation with exploratory work, and retain human approval of AI recommendations. I supplied six screenshots from my own testing and asked for reproduction and an assessment of their significance before adding findings. I also challenged whether a locator workaround invalidated the duplicate-ID report and requested a requirement-by-requirement review.

For the assignment's question about hand-written revisions: AI produced the TypeScript implementation and subsequent code revisions. My hands-on work was exploratory testing, defining the QA strategy, and challenging scope and conclusions. I directed the follow-up reviews toward evidence quality and requirement coverage.

Those reviews led to concrete corrections:

- Reproduce the reported user action before calling a symptom a product defect. The phone-paste report was withdrawn after the comparison below.
- Separate automation resilience from product quality. Scoping fields by `formcontrolname` supports the tests; the captured label-association defect remains documented with DOM and accessibility evidence.
- Rate findings by demonstrated impact. The long-name clear button still worked, so the report describes a Low-severity presentation defect. The plan-limit response alone did not prove a subscription bug.

The implementation also evolved through AI-assisted debugging: observed controls replaced guessed locators, booking assertions included saved data, and date partitioning plus verified cleanup resolved test-created conflicts. A final clean-install review moved setup into one npm command and made the creation and read-back assertions share the same business expectations. The repeated CI suite checks these choices with two workers and zero retries. [Execution evidence](RUN_REPORT.md) records the results and remaining environment dependencies.

## One specific model error corrected through review

AI initially reported that pasting an international phone number corrupted it. The observation came from Playwright `fill()`, which does not reproduce a clipboard paste.

During the second review I requested, the AI-assisted investigation used real `Control+V` and recorded a trusted browser paste event. Pasting `+380000000001` produced the correct `+38 (000) 000-0001`; repeating `fill()` produced `+38 (380) 000-0000`.

The final reports withdraw the clipboard-paste claim and preserve the [comparison evidence](evidence/phone-input-recheck/results.json). The suite supplies national digits for this input mask. My review criterion is that a bug report must describe the interaction actually reproduced and explain its user impact; an automation-method difference is not enough to generalize to normal user behavior.

## How I would scale this approach

My proposed workflow combines a maintained regression suite, AI-assisted analysis, and manual QA under human review:

1. **Review requirements and explore new behavior.** QA clarifies expected outcomes and risks with the team. AI suggests cases and edge conditions; manual exploration checks assumptions. Automate critical contracts before release, and expand UI regression when behavior stabilizes.
2. **Review coverage as the product changes.** A daily agent compares merged code, API contracts, documentation, and completed issues. It proposes tests to add, update, or retire, with the source change, affected risk, and rationale. QA approves the proposal before implementation.
3. **Investigate failures with context.** A second agent reviews traces, logs, code changes, and expected behavior. A dashboard shows evidence, a proposed classification, and uncertainty. QA distinguishes product defects, changed requirements, test defects, and environment failures before approving an update or creating an issue.
4. **Improve the decision rules.** Rejected suggestions become corrected instructions, examples, and regression checks for the agents. Track accepted recommendations, incorrect diagnoses, flaky-test frequency, and investigation time to assess whether the workflow helps. This is improvement of the agents' operating rules, not a claim of model fine-tuning.

The submitted repository implements the focused test suite and execution evidence. The agents, dashboard, and measurements describe the next stage of the QA operating model.
