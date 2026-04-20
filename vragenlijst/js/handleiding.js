(function() {
  'use strict';

  var printBtn = document.getElementById('printBtn');
  if (printBtn) {
    printBtn.addEventListener('click', function() {
      window.print();
    });
  }

  // If opened in a new tab from the survey, "Terug" closes that tab.
  // Otherwise it falls through to the /  href in the anchor.
  var backLink = document.getElementById('backLink');
  if (backLink) {
    backLink.addEventListener('click', function(e) {
      if (window.opener && !window.opener.closed) {
        e.preventDefault();
        window.close();
      }
    });
  }
})();
