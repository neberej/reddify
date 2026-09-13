(() => {
  "use strict";

  // Apply the few listing overrides that Reddit encapsulates in post shadow roots.
  const { listing } = globalThis.reddifySelectors;
  let listingShadowSheet = null;

  // Build one shared stylesheet for Reddit's open post shadow roots.
  function getListingShadowSheet() {
    if (listingShadowSheet) {
      return listingShadowSheet;
    }

    const sheet = new CSSStyleSheet();

    sheet.replaceSync(`
      ${listing.postContentContainerShadow} {
        grid-row: 1 !important;
      }

      ${listing.postShareShadow} {
        display: none !important;
      }

      :host(.reddify-listing-post) ${listing.postActionRowShadow} {
        grid-column: 2 !important;
        grid-row: 3 !important;
        height: var(--reddify-listing-action-height) !important;
        min-height: var(--reddify-listing-action-height) !important;
        margin-top: var(--reddify-listing-action-offset) !important;
        padding-block: 0 !important;
      }

      :host(.reddify-listing-post) ${listing.postActionRowShadow} :is(button, a) {
        height: var(--reddify-listing-action-height) !important;
        min-height: var(--reddify-listing-action-height) !important;
      }
    `);

    listingShadowSheet = sheet;
    return listingShadowSheet;
  }

  // Adopt the shared sheet without duplicating it on repeated scans.
  globalThis.reddifyStyleListingShadow = function reddifyStyleListingShadow(
    post,
  ) {
    const root = post.shadowRoot;

    if (!root) {
      return;
    }

    try {
      const sheet = getListingShadowSheet();

      if (!root.adoptedStyleSheets.includes(sheet)) {
        root.adoptedStyleSheets = [...root.adoptedStyleSheets, sheet];
      }
    } catch {
      // A missing shadow styling API should not break the rest of Reddify.
    }
  };
})();
