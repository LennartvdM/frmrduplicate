# Prompt for Chrome-extension agent — make `saveResponses` failsafe in Google Apps Script

## Paste everything below this line into the Chrome extension agent

---

Context: I run a Dutch monitoring survey (`Monitoring Cultureel Talent naar de Top 2026`) on Netlify, backed by a Google Apps Script web-app that writes to a Google Sheet. The survey takes 20–30 minutes to fill in, and respondents are senior executives. **Losing a submission is not acceptable under any circumstance.**

The live GAS deployment is labelled **Charter Monitor**. Deployment ID: `AKfycbw3gcRqlbc9lH0WKiR5yEeM4whu_WFVAUg9lE8cf9Uyf6C-teYRfA5CQX2tCaZZiV-nlg`. Access: "Anyone" / Execute as me.

### The problem

On the client, when someone enters an unknown code, the login goes through a "failsafe" path: we let them into the survey anyway so they can fill it in, and we tag their session with `authFailed: true` + a `authFailedReason`. The client already passes `authFailed: true` (and sometimes `authFailedReason`) in the `data` object of the `saveResponses` GET request.

The GAS `saveResponses` handler currently validates the code against the Codes sheet and returns `{ success: false, error: ... }` when the code isn't found. That causes the client to surface a submit error to the respondent. This is the bug: **submissions must never be rejected**, including from failsafe sessions.

Recent errors (from the `Errors` tab that's already wired up) show the pattern:

```
2026-04-17T07:18:38.134Z TIMEOUT_ERROR  step=14  (random failsafe code)
2026-04-17T07:18:44.966Z SERVER_REJECTED step=14
...
```

### What to change on the GAS side

1. **`saveResponses` must always succeed.** Whatever the state of the code lookup, the handler must archive the submission somewhere and return `{ success: true, ... }`. Never return `success: false` from this action. The only permitted failure mode is "the request genuinely could not be parsed" — and even that should, if at all possible, dump the raw params to a catch-all row before erroring.

2. **Add a `Onbekende codes` (or `Failsafe`) tab** with columns: `timestamp`, `code`, `authFailed`, `authFailedReason`, `ip` (if you have it), plus one column per known survey field (mirror the main responses tab schema). When a submission comes in with `authFailed: true` or a code that isn't in the Codes sheet, write a row to this tab instead of (or in addition to) the main tab. The point is to have the data somewhere we can reconcile manually.

3. **Do not require the code to exist.** Drop any `if (!codeRow) return { success:false }` guard. If you want to keep a sanity check, downgrade it to a log line, not a rejection.

4. **Log a beacon in the existing `Errors` tab** (the one the `logError` action already writes to) when a failsafe/unknown-code submission lands, with errorCode `FAILSAFE_SUBMISSION`. This lets me see in one place when manual reconciliation is needed. Schema is already: `timestamp, action, orgCode, errorCode, step, browser` — use `action=saveResponses`, step blank or `14`.

5. **Performance.** Keep the path fast — the client currently times out at ~15s. If your handler currently does a full-sheet scan for code validation, cache the Codes sheet into a Map once per execution (GAS execution is short-lived so this is safe).

6. **Response envelope.** Always return JSON, never HTML. Shape:
   ```json
   {
     "success": true,
     "message": "Submission received",
     "archived": "failsafe" | "primary",
     "documentUrl": "..." // optional, if you generate one
   }
   ```
   The client treats `archived: "failsafe"` as a hint but does not branch on it; it's for future UI.

### What NOT to change

- Don't touch `checkCode` — it's fine for it to return `success:false` for an unknown code at login time; the client handles that via the failsafe path.
- Don't touch `logError` / the `Errors` tab schema.
- Don't touch `registerCode` (we now generate codes JIT on EML download and register them fire-and-forget).
- Don't touch `sendEmail`.

### Deployment

The live deployment is the **Charter Monitor** deployment, ID `AKfycbw3...CaZZiV-nlg`. After editing the script, **re-deploy that specific deployment** (Deploy → Manage deployments → edit the Charter Monitor entry → new version → Deploy). Do not create a new deployment; the client URL is pinned to this ID and a new ID breaks the production site.

Confirm deployment worked by hitting:
```
https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec?action=ping
```

### Verification

After deploying, test the whole failsafe path end-to-end:

1. Open https://monitorcultuur.nl/?code=AAA-AAA (a code that definitely isn't in the sheet).
2. You'll be let into the survey with `authFailed: true`.
3. Fill a few fields, skip to step 14, click submit.
4. **Expected**: success modal on client, new row in the `Onbekende codes` tab, a `FAILSAFE_SUBMISSION` row in `Errors`.
5. **Not expected**: the client seeing `SERVER_REJECTED` or a timeout.

Report back:
- The updated `doGet`/`saveResponses` handler code (or a diff).
- Confirmation the Charter Monitor deployment was redeployed with the new version.
- Paste of the `Onbekende codes` test row you wrote during verification.

---
