(() => {
  "use strict";

  // Reapply idempotent markers when Reddit replaces relevant SPA content.
  const observedSelectors = [
    ...Object.values(globalThis.reddifySelectors.layout),
    globalThis.reddifySelectors.listing.post,
    globalThis.reddifySelectors.comments.comment,
  ].filter(Boolean);
  let markerApplicationScheduled = false;

  // Ignore mutations that cannot contain a relevant Reddit target.
  function containsObservedTarget(node) {
    if (!(node instanceof Element)) {
      return false;
    }

    return observedSelectors.some(
      (selector) => node.matches(selector) || node.querySelector(selector),
    );
  }

  // Batch repeated Reddit mutations into one rendering-frame update.
  function scheduleMarkerApplication() {
    if (markerApplicationScheduled) {
      return;
    }

    markerApplicationScheduled = true;

    requestAnimationFrame(() => {
      markerApplicationScheduled = false;
      globalThis.reddifyApplyPageScope();
      globalThis.reddifyApplyMarkers();
      globalThis.reddifyDisableListingAutoplay();
    });
  }

  // Observe Reddit's SPA replacements without polling the page.
  globalThis.reddifyObserveLayout = function reddifyObserveLayout() {
    const observer = new MutationObserver((records) => {
      const observedContentChanged = records.some((record) =>
        Array.from(record.addedNodes).some(containsObservedTarget),
      );

      if (observedContentChanged) {
        scheduleMarkerApplication();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  };
})();
