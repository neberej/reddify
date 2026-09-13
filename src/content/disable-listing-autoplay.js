(() => {
  "use strict";

  // Pause listing videos unless playback follows an explicit user interaction.
  const { listing } = globalThis.reddifySelectors;
  const guardedVideos = new WeakSet();
  const listeningRoots = new WeakSet();
  const observedShadowRoots = new WeakSet();
  const playbackIntentByRoot = new WeakMap();
  const PLAYBACK_INTENT_WINDOW_MS = 1200;

  // Record a short-lived user gesture for the relevant media root.
  function allowNextPlayback(root) {
    playbackIntentByRoot.set(root, performance.now() + PLAYBACK_INTENT_WINDOW_MS);
  }

  // Consume one recorded gesture before allowing playback.
  function consumePlaybackIntent(root) {
    const expiresAt = playbackIntentByRoot.get(root) ?? 0;

    playbackIntentByRoot.delete(root);
    return performance.now() <= expiresAt;
  }

  // Listen for mouse and keyboard actions that may intentionally start media.
  function observeUserIntent(root) {
    if (listeningRoots.has(root)) {
      return;
    }

    listeningRoots.add(root);
    root.addEventListener("pointerdown", () => allowNextPlayback(root), true);
    root.addEventListener("click", () => allowNextPlayback(root), true);
    root.addEventListener(
      "keydown",
      (event) => {
        if (event.key === "Enter" || event.key === " ") {
          allowNextPlayback(root);
        }
      },
      true,
    );
  }

  // Pause playback events that lack a recent user gesture.
  function guardVideo(video, interactionRoot) {
    if (guardedVideos.has(video)) {
      return;
    }

    guardedVideos.add(video);
    observeUserIntent(interactionRoot);

    video.addEventListener("play", () => {
      if (!consumePlaybackIntent(interactionRoot)) {
        video.pause();
      }
    });

    if (!video.paused) {
      video.pause();
    }
  }

  // Scan a document or shadow root for videos and nested media roots.
  function scanRoot(root) {
    root.querySelectorAll(listing.video).forEach((video) => {
      guardVideo(video, root);
    });

    root.querySelectorAll("*").forEach((element) => {
      if (element.shadowRoot) {
        observeShadowRoot(element.shadowRoot);
      }
    });
  }

  // Watch hydrated player shadow roots for videos Reddit adds later.
  function observeShadowRoot(root) {
    if (observedShadowRoots.has(root)) {
      scanRoot(root);
      return;
    }

    observedShadowRoots.add(root);
    observeUserIntent(root);
    scanRoot(root);

    const observer = new MutationObserver(() => scanRoot(root));
    observer.observe(root, { childList: true, subtree: true });
  }

  // Guard light-DOM and shadow-DOM videos within one listing post.
  function scanListingPost(post) {
    post
      .querySelectorAll(listing.video)
      .forEach((video) => guardVideo(video, video));
    post.querySelectorAll(listing.player).forEach((player) => {
      if (player.shadowRoot) {
        observeShadowRoot(player.shadowRoot);
      }
    });
  }

  // Apply autoplay guards to every supported listing-feed post.
  globalThis.reddifyDisableListingAutoplay =
    function reddifyDisableListingAutoplay() {
      if (!globalThis.reddifyIsListingPage()) {
        return;
      }

      document.querySelectorAll(listing.post).forEach(scanListingPost);
    };
})();
