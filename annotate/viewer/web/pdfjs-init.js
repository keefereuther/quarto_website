'use strict';

// Script that loads the Hypothesis client after PDF.js is initialized.
// After making changes to this file, copy it to viewer/web/pdfjs-init.js.

// Listen for `webviewerloaded` event to configure the viewer after its files
// have been loaded but before it is initialized.
//
// PDF.js >= v2.10.377 fires this event at the parent document if it is embedded
// in a same-origin iframe. See https://github.com/mozilla/pdf.js/pull/11837.
try {
  parent.document.addEventListener('webviewerloaded', onViewerLoaded);
} catch (err) {
  // Parent document is cross-origin. The event will be fired at the current
  // document instead.
  document.addEventListener('webviewerloaded', onViewerLoaded);
}

function onViewerLoaded() {
  PDFViewerApplication.initializedPromise.then(() => {
    const embedScript = document.createElement('script');
    // Service origin comes from ../../hypothesis-config.js so that switching to
    // a self-hosted annotation server is a one-line change outside this
    // vendored PDF.js tree.
    const service = window.HYP_SERVICE || 'https://hypothes.is';
    embedScript.src = service + '/embed.js';
    document.body.appendChild(embedScript);
  });
}
