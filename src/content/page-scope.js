(() => {
  "use strict";

  // Isolate listing styles from comment-page styles using the current pathname.
  const LISTING_CLASS = "reddify-page-listing";
  const COMMENTS_CLASS = "reddify-page-comments";

  // Recognize Reddit post detail routes by their comments path segment.
  function isCommentsPath(pathname) {
    return /\/comments(?:\/|$)/.test(pathname);
  }

  // Expose route scope to the independent content modules.
  globalThis.reddifyIsListingPage = function reddifyIsListingPage() {
    return !isCommentsPath(window.location.pathname);
  };

  // Toggle mutually exclusive root classes for route-scoped CSS.
  globalThis.reddifyApplyPageScope = function reddifyApplyPageScope() {
    const isListingPage = globalThis.reddifyIsListingPage();

    document.documentElement.classList.toggle(LISTING_CLASS, isListingPage);
    document.documentElement.classList.toggle(COMMENTS_CLASS, !isListingPage);
  };
})();
