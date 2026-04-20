/**
 * Authentication module for Monitoring Cultureel Talent naar de Top
 * Handles organization code validation and session management
 *
 * Dependencies: config.js, constants.js, storage.js, api.js
 */

(function() {
  'use strict';

  // Magic-link state: name passed via ?name= is stashed here so handleLogin
  // can fall back to it if the server doesn't return an organisatie.
  var magicLinkName = null;

  // Set to true by handleMagicLinkFromURL right before it auto-submits the
  // login form, and read+cleared by handleLogin. Lets the transition logic
  // distinguish an email-invite auto-submit (which should suppress the
  // unfold if the survey is already visible) from an interactive login
  // (which should always animate).
  var autoSubmitFromMagicLink = false;

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    initDemoMode();
    setupEventListeners();
    renderContactEmail();
    handleMagicLinkFromURL();
  });

  /**
   * Render obfuscated contact email into the login footer
   */
  function renderContactEmail() {
    var el = document.getElementById('contactEmail');
    if (!el) return;
    var u = 'talent';
    var d = 'talentnaardetop' + '.' + 'nl';
    el.textContent = u + '@' + d;
  }

  /**
   * Setup all event listeners for the login page
   */
  function setupEventListeners() {
    // Login form submission
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', handleLogin);
    }

    // Split code input: auto-advance and paste handling
    var part1 = document.getElementById('orgCodePart1');
    var part2 = document.getElementById('orgCodePart2');

    if (part1 && part2) {
      // Clear validation on input
      function clearCodeValidation() {
        var v = document.getElementById('codeValidation');
        if (v) v.style.display = 'none';
        part1.classList.remove(CONSTANTS.CSS.ERROR);
        part2.classList.remove(CONSTANTS.CSS.ERROR);
      }

      // Auto-advance to part2 when part1 is filled
      part1.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        clearCodeValidation();
        if (this.value.length === 3) {
          part2.focus();
        }
      });

      part2.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
        clearCodeValidation();
      });

      // Handle paste on either field: split full code across both
      part1.addEventListener('paste', function(e) {
        handleCodePaste(e, part1, part2);
      });
      part2.addEventListener('paste', function(e) {
        handleCodePaste(e, part1, part2);
      });

      // Allow backspace from empty part2 to jump back to part1
      part2.addEventListener('keydown', function(e) {
        if (e.key === 'Backspace' && this.value === '') {
          part1.focus();
        }
      });

      // Ctrl+A / Cmd+A selects both fields visually
      function handleSelectAll(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
          e.preventDefault();
          part1.select();
          part2.select();
          part1.parentElement.classList.add('code-input-selected');
        }
      }
      part1.addEventListener('keydown', handleSelectAll);
      part2.addEventListener('keydown', handleSelectAll);

      // Ctrl+C / Cmd+C copies the full combined code when both are selected
      function handleCopy(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'c' && part1.parentElement.classList.contains('code-input-selected')) {
          e.preventDefault();
          var fullCode = part1.value + '-' + part2.value;
          navigator.clipboard.writeText(fullCode);
        }
      }
      part1.addEventListener('keydown', handleCopy);
      part2.addEventListener('keydown', handleCopy);

      // Clear the "selected" visual state on click or any other input
      function clearGroupSelection() {
        part1.parentElement.classList.remove('code-input-selected');
      }
      part1.addEventListener('click', clearGroupSelection);
      part2.addEventListener('click', clearGroupSelection);
      part1.addEventListener('input', clearGroupSelection);
      part2.addEventListener('input', clearGroupSelection);
    }

    // Public login button (demo mode)
    var publicLoginBtn = document.getElementById('publicLoginBtn');
    if (publicLoginBtn) {
      publicLoginBtn.addEventListener('click', publicLogin);
    }
  }

  /**
   * Handle paste event for split code inputs
   * Splits a pasted code like "YAW-PGP" across both fields
   */
  function handleCodePaste(e, part1, part2) {
    e.preventDefault();
    var pasted = (e.clipboardData || window.clipboardData).getData('text').trim().toUpperCase();
    // Remove any separators (dash, space, etc.)
    var clean = pasted.replace(/[\s\-_]/g, '');
    if (clean.length >= 6) {
      part1.value = clean.substring(0, 3);
      part2.value = clean.substring(3, 6);
      part2.focus();
    } else if (clean.length <= 3) {
      // Short paste, just put in current field
      var target = e.target;
      target.value = clean.substring(0, 3);
      if (clean.length === 3 && target === part1) {
        part2.focus();
      }
    } else {
      // 4 or 5 chars: fill part1 with first 3, rest in part2
      part1.value = clean.substring(0, 3);
      part2.value = clean.substring(3);
      part2.focus();
    }
  }

  /**
   * Initialize demo mode UI elements when no API is configured
   */
  function initDemoMode() {
    if (CONFIG.isDemoMode()) {
      var demoBanner = document.getElementById('demoBanner');
      var publicAccess = document.getElementById('publicAccess');

      if (demoBanner) demoBanner.style.display = 'block';
      if (publicAccess) publicAccess.style.display = 'block';

      // Make org code fields not required in demo mode
      var part1 = document.getElementById('orgCodePart1');
      var part2 = document.getElementById('orgCodePart2');
      if (part1) part1.required = false;
      if (part2) part2.required = false;
    }
  }

  /**
   * Public login without organization code (inkijkexemplaar)
   */
  function publicLogin() {

    var publicLoginBtn = document.getElementById('publicLoginBtn');

    // Session-boundary cleanup: if the previous session was authenticated
    // (or belonged to any other session shape), wipe lingering form state so
    // a real organisation's answers can't surface inside the preview — and,
    // more importantly, so a preview started after a real session doesn't
    // carry real answers forward.
    var previousSession = Storage.getSession();
    if (!previousSession || !previousSession.isPublic) {
      Storage.clearFormState();
    }

    // Create a public session
    Storage.saveSession({
      orgCode: CONSTANTS.SESSION.PUBLIC_CODE,
      orgName: CONSTANTS.SESSION.PUBLIC_NAME,
      timestamp: Date.now(),
      isPublic: true
    });

    // Update URL so /inkijkexemplaar is shareable
    window.history.pushState({ inkijkexemplaar: true }, '', '/inkijkexemplaar');

    // Transition to survey view (SPA navigation) - expand from button
    if (typeof App !== 'undefined' && App.transitionToSurvey) {
      App.transitionToSurvey(publicLoginBtn);
    } else {
      // Fallback for direct survey.html access
      window.location.href = '/survey.html';
    }
  }

  /**
   * Handle login form submission
   * @param {Event} event - Form submit event
   */
  async function handleLogin(event) {
    event.preventDefault();

    // Snapshot and clear the magic-link flag immediately — this flips
    // back to interactive-submit behaviour for any subsequent retry the
    // user might trigger from the form.
    var cameFromMagicLink = autoSubmitFromMagicLink;
    autoSubmitFromMagicLink = false;

    var codePart1 = document.getElementById('orgCodePart1');
    var codePart2 = document.getElementById('orgCodePart2');
    var errorDiv = document.getElementById('loginError');
    var loginBtn = document.getElementById('loginBtn');
    var btnText = loginBtn.querySelector('.btn-text');
    var btnLoading = loginBtn.querySelector('.btn-loading');
    var btnLoadingText = loginBtn.querySelector('.btn-loading-text');
    var retryProgress = document.getElementById('retryProgress');
    var retryProgressFill = document.getElementById('retryProgressFill');
    var retryProgressText = document.getElementById('retryProgressText');

    var p1 = codePart1.value.trim().toUpperCase();
    var p2 = codePart2.value.trim().toUpperCase();
    var codeValidation = document.getElementById('codeValidation');

    if (!p1 || !p2) {
      if (!p1) { codePart1.classList.add(CONSTANTS.CSS.ERROR); codePart1.focus(); }
      if (!p2) codePart2.classList.add(CONSTANTS.CSS.ERROR);
      if (codeValidation) codeValidation.style.display = '';
      return;
    }

    var code = p1 + '-' + p2;

    // Hide validation and show loading state
    if (codeValidation) codeValidation.style.display = 'none';
    setLoadingState(true, loginBtn, btnText, btnLoading);
    errorDiv.style.display = 'none';
    codePart1.classList.remove(CONSTANTS.CSS.ERROR);
    codePart2.classList.remove(CONSTANTS.CSS.ERROR);

    // Reset retry progress
    if (retryProgress) {
      retryProgress.style.display = 'none';
      retryProgressFill.style.width = '0%';
    }

    // Progress callback to show retry attempts to the user
    var onProgress = function(attempt, maxAttempts) {
      if (btnLoadingText) {
        btnLoadingText.textContent = 'Poging ' + attempt + ' van ' + maxAttempts + '...';
      }
      if (retryProgress && attempt > 1) {
        retryProgress.style.display = 'flex';
      }
      if (retryProgressFill) {
        retryProgressFill.style.width = ((attempt / maxAttempts) * 100) + '%';
      }
      if (retryProgressText) {
        if (attempt === 1) {
          retryProgressText.textContent = 'Verbinding maken...';
        } else {
          retryProgressText.textContent = 'Server reageert niet, opnieuw proberen...';
        }
      }
    };

    try {
      var result = await validateOrganizationCode(code, { onProgress: onProgress });

      if (result.success) {
        // Session-boundary cleanup: if the previous session was a preview
        // (inkijkexemplaar) or belonged to a different organisation, wipe
        // any lingering form state so that another session's answers cannot
        // surface inside this authenticated login. Preserve the submitted
        // forms archive (different storage key) so users don't lose history.
        var previousSession = Storage.getSession();
        var isBoundaryCrossing = !previousSession
          || previousSession.isPublic
          || previousSession.orgCode !== code;
        if (isBoundaryCrossing) {
          Storage.clearFormState();
        }

        // Store session data. If the server response is missing an org name
        // (rare, but possible for thinly-configured rows), fall back to the
        // name carried in the magic link so the sidebar still looks right.
        Storage.saveSession({
          orgCode: code,
          orgName: result.organizationName || magicLinkName || '',
          timestamp: Date.now()
        });

        // Leave the URL alone. A refresh will land back in handleMagicLinkFromURL,
        // which now short-circuits when the session is already valid for this
        // code — so we don't need to strip query params here, and skipping
        // replaceState avoids a jarring address-bar flicker mid-transition.

        // Hide retry progress
        if (retryProgress) retryProgress.style.display = 'none';

        // Transition to survey view (SPA navigation) - expand from button
        if (typeof App !== 'undefined' && App.transitionToSurvey) {
          App.transitionToSurvey(loginBtn, { suppressible: cameFromMagicLink });
        } else {
          // Fallback for direct survey.html access
          window.location.href = '/survey.html';
        }
      } else {
        // Server said "invalid code". For the target audience (supervisory
        // boards, heads of HR at top-200 orgs) blocking on this is a worse
        // failure than letting them through. Fall through to failsafe.
        proceedWithFailsafe(code, loginBtn, btnText, btnLoading, btnLoadingText, retryProgress, {
          reason: 'invalid_code',
          message: result.message || ''
        }, cameFromMagicLink);
      }
    } catch (error) {
      var reason = (error && error.code) ? String(error.code).toLowerCase()
        : (error && error.name === 'AbortError') ? 'timeout'
        : 'network_error';
      proceedWithFailsafe(code, loginBtn, btnText, btnLoading, btnLoadingText, retryProgress, {
        reason: reason,
        message: (error && error.message) || ''
      }, cameFromMagicLink);
    }
  }

  /**
   * Failsafe: validation failed for any reason (network, GAS misconfig, bad
   * code, timeout). Rather than blocking a VIP user, hydrate a session with
   * the best name we have, fire-and-forget a diagnostic to the backend so
   * the admin knows, then let them into the survey. Submissions carry an
   * `authFailed: true` flag so admins can distinguish these from validated
   * entries.
   */
  function proceedWithFailsafe(code, loginBtn, btnText, btnLoading, btnLoadingText, retryProgress, diag, cameFromMagicLink) {
    // Stop the loading spinner and retry UI — we're taking a different path.
    setLoadingState(false, loginBtn, btnText, btnLoading);
    if (btnLoadingText) btnLoadingText.textContent = 'Controleren...';
    if (retryProgress) retryProgress.style.display = 'none';

    // Hide any lingering hard-error message.
    var errorDiv = document.getElementById('loginError');
    if (errorDiv) errorDiv.style.display = 'none';

    // Seed a session so the survey has something to work with.
    Storage.saveSession({
      orgCode: code,
      orgName: magicLinkName || '',
      timestamp: Date.now(),
      authFailed: true,
      authFailedReason: (diag && diag.reason) || 'unknown'
    });

    // Leave the URL alone — handleMagicLinkFromURL's short-circuit prevents
    // a re-auto-submit on refresh now, and avoiding replaceState keeps the
    // address bar stable during the transition.

    // Fire-and-forget signal. If the proxy/GAS is reachable we leave a
    // breadcrumb for the admin; if not, the user still gets through.
    sendFailsafeSignal(code, diag);

    // Short delay lets the beacon's fetch start before the page transitions.
    // The reassuring notice itself is shown as a dismissable modal once the
    // survey is visible — putting it on the login screen made it unreadable
    // during the transition animation.
    setTimeout(function() {
      if (typeof App !== 'undefined' && App.transitionToSurvey) {
        App.transitionToSurvey(loginBtn, { suppressible: cameFromMagicLink });
      } else {
        window.location.href = '/survey.html';
      }
    }, 400);
  }

  /**
   * Best-effort breadcrumb so the admin knows a user hit the failsafe.
   * Uses the Netlify proxy path (/api/) — which runs server-side and can
   * reach GAS even when the client's firewall can't.
   */
  function sendFailsafeSignal(code, diag) {
    try {
      var base = (CONFIG.PROXY_URL || '/api/');
      var browser = (window.ApiClient && window.ApiClient.browserFamily)
        ? window.ApiClient.browserFamily()
        : 'Other';
      var url = base + (base.indexOf('?') >= 0 ? '&' : '?') + 'action=logFailsafe'
        + '&code=' + encodeURIComponent(code)
        + '&reason=' + encodeURIComponent((diag && diag.reason) || 'unknown')
        + '&message=' + encodeURIComponent(((diag && diag.message) || '').slice(0, 200))
        + '&browser=' + encodeURIComponent(browser)
        + '&ts=' + encodeURIComponent(new Date().toISOString());
      // keepalive lets the request survive the imminent view transition.
      fetch(url, { method: 'GET', keepalive: true, cache: 'no-store' }).catch(function() {});
    } catch (e) { /* swallow — never block the user */ }
  }

  /**
   * Reset login UI to its default state after an error
   */
  function resetLoginUI(btn, textEl, loadingEl, loadingTextEl, retryProgress) {
    setLoadingState(false, btn, textEl, loadingEl);
    if (loadingTextEl) loadingTextEl.textContent = 'Controleren...';
    if (retryProgress) retryProgress.style.display = 'none';
  }

  /**
   * Set the loading state of the login button
   * @param {boolean} isLoading - Whether to show loading state
   * @param {HTMLButtonElement} btn - The button element
   * @param {HTMLElement} textEl - The button text element
   * @param {HTMLElement} loadingEl - The loading indicator element
   */
  function setLoadingState(isLoading, btn, textEl, loadingEl) {
    btn.disabled = isLoading;
    textEl.style.display = isLoading ? 'none' : 'inline';
    loadingEl.style.display = isLoading ? 'flex' : 'none';
  }

  /**
   * Validate organization code against backend
   * Falls back to demo validation when API is not configured
   * @param {string} code - The organization code to validate
   * @returns {Promise<{success: boolean, organizationName?: string, message?: string}>}
   */
  async function validateOrganizationCode(code, options) {
    // Use demo validation if API is not configured
    if (!ApiClient.isConfigured()) {
      return demoValidation(code);
    }

    return ApiClient.validateCode(code, options);
  }

  /**
   * Demo validation for testing without backend
   * Accepts codes in format: XXX-XXX (e.g. YAW-PGP) or DEM-OOO
   * @param {string} code - The organization code to validate
   * @returns {{success: boolean, organizationName?: string, message?: string}}
   */
  function demoValidation(code) {
    // Accept any code matching the XXX-XXX pattern for demo purposes
    if (/^[A-Z0-9]{3}-[A-Z0-9]{3}$/.test(code)) {
      return {
        success: true,
        organizationName: 'Organisatie ' + code
      };
    }

    return {
      success: false,
      message: 'Ongeldige organisatiecode. Voer een code in het formaat ABC-DEF in.'
    };
  }

  /**
   * Show error message in the error display element
   * @param {HTMLElement} element - The error container element
   * @param {string} message - The error message to display
   */
  function showError(element, message) {
    var span = element.querySelector('span');
    if (span) {
      span.textContent = message;
    }
    element.style.display = 'flex';
  }

  /**
   * Handle a magic link from the invitation email. If the URL carries a valid
   * ?code= (and optional ?name=) we pre-fill the inputs and auto-submit the
   * form so the recipient lands straight in the survey. The code is still
   * validated server-side, so a tampered link fails the same way a manually
   * typed bad code would — just with the inputs already populated for retry.
   */
  function handleMagicLinkFromURL() {
    var params = new URLSearchParams(window.location.search);
    var code = params.get('code');
    if (!code) return;

    var clean = code.toUpperCase().replace(/[\s\-_]/g, '');
    if (clean.length < 6) return;

    var part1 = document.getElementById('orgCodePart1');
    var part2 = document.getElementById('orgCodePart2');
    if (part1 && part2) {
      part1.value = clean.substring(0, 3);
      part2.value = clean.substring(3, 6);
    }

    // Stash the URL-provided org name. Used as a fallback only if the server
    // validation succeeds without returning one; the server value wins.
    var name = params.get('name');
    if (name) {
      magicLinkName = name.trim().slice(0, 200);
    }

    // If a valid session for this same code already exists, App.init() has
    // already loaded and shown the survey. Auto-submitting would run the
    // full login→survey transition on top of the already-visible survey,
    // producing a second "unfold" animation. Bail out — leave the URL alone
    // (neither form is preferable and stripping it causes an address-bar
    // flicker during the transition).
    var formattedCode = clean.substring(0, 3) + '-' + clean.substring(3, 6);
    var existingSession = Storage.getSession();
    if (Storage.isSessionValid()
        && existingSession
        && !existingSession.isPublic
        && existingSession.orgCode === formattedCode) {
      return;
    }

    // Skip auto-submit in demo mode — the demo landing page is still useful
    // as an entry point, and auto-submitting would defeat that.
    if (CONFIG.isDemoMode()) return;

    var form = document.getElementById('loginForm');
    if (!form) return;
    // Defer so the submit handler is attached before we fire.
    requestAnimationFrame(function() {
      // Mark this submission as an auto-submit from the magic link so
      // handleLogin can tell the transition to suppress the unfold if
      // the survey is already visible. Cleared by handleLogin on read.
      autoSubmitFromMagicLink = true;
      if (typeof form.requestSubmit === 'function') {
        form.requestSubmit();
      } else {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      }
    });
  }

})();
