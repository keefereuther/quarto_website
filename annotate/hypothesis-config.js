'use strict';

// Single point of configuration for the Hypothesis client used by the PDF
// viewer in this directory. Loaded by viewer/web/viewer.html before
// viewer/web/pdfjs-init.js.
//
// To move off the public hypothes.is service and onto a self-hosted `h`
// instance, change HYP_SERVICE to that server's origin. Nothing else in the
// vendored PDF.js tree needs to change. Note that a self-hosted instance has
// its own account system: existing hypothes.is annotations do not carry over.
window.HYP_SERVICE = 'https://hypothes.is';

// Group ID from https://hypothes.is/groups/AeovwxGQ/bild-5
window.HYP_GROUP = 'AeovwxGQ';

window.hypothesisConfig = function () {
  return {
    openSidebar: true,
    showHighlights: true,

    // Restricts the sidebar's group selector to the class group, so students
    // cannot accidentally post to the Public layer. This is a UI restriction
    // in this viewer only: it does not stop anyone from annotating the same
    // PDF publicly via the Hypothesis browser extension or via.hypothes.is.
    // Read access to group annotations is enforced by Hypothesis server-side.
    //
    // Note this is `groupsAllowlist` (top-level), not the `groups` option,
    // which lives inside `services[]` and requires a third-party authority
    // and OAuth grant token.
    groupsAllowlist: [window.HYP_GROUP],
  };
};
