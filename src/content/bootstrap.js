(() => {
  "use strict";

  // Start page scoping, marker application, autoplay guards, and SPA observation.
  globalThis.reddifyApplyPageScope();
  globalThis.reddifyApplyMarkers();
  globalThis.reddifyDisableListingAutoplay();
  globalThis.reddifyObserveLayout();
})();
