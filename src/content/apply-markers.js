(() => {
  "use strict";

  // Translate verified Reddit selectors into stable classes owned by Reddify.
  const { layout, listing, comments } = globalThis.reddifySelectors;

  // Mark the first matching page-level element.
  function mark(selector, className) {
    const element = document.querySelector(selector);

    if (element) {
      element.classList.add(className);
    }
  }

  // Mark every matching element within a known root.
  function markAll(root, selector, className) {
    root.querySelectorAll(selector).forEach((element) => {
      element.classList.add(className);
    });
  }

  // Find the direct child that owns a nested Reddit element.
  function directChildContaining(container, descendant) {
    let element = descendant;

    while (element?.parentElement && element.parentElement !== container) {
      element = element.parentElement;
    }

    return element?.parentElement === container ? element : null;
  }

  function markPageGrid() {
    mark(layout.pageGrid, "reddify-page-grid");
  }

  function markSubgridContainer() {
    mark(layout.subgridContainer, "reddify-subgrid-container");
  }

  function markLeftSidebar() {
    mark(layout.leftSidebar, "reddify-hidden-left-sidebar");
  }

  function markMainContainer() {
    mark(layout.mainContainer, "reddify-main-container");
  }

  function markRightSidebar() {
    mark(layout.rightSidebarContainer, "reddify-hidden-right-sidebar");
    mark(layout.rightSidebar, "reddify-hidden-right-sidebar-contents");
  }

  // Mark a full media container as the post's compact preview.
  function markMediaPreview(post, media) {
    const primary = media.querySelector(listing.mediaPrimary);

    post.classList.add("reddify-listing-post-has-preview");
    media.classList.add("reddify-listing-media");

    if (!primary) {
      return;
    }

    primary.classList.add("reddify-listing-media-primary");

    const frame = directChildContaining(media, primary);
    frame?.classList.add("reddify-listing-media-frame");
  }

  // Mark Reddit's alternate link-preview structure.
  function markLinkPreview(post, thumbnail) {
    const linkLayout = directChildContaining(post, thumbnail);

    if (!linkLayout) {
      return;
    }

    post.classList.add("reddify-listing-post-has-preview");
    linkLayout.classList.add("reddify-listing-link-layout");
    thumbnail.classList.add("reddify-listing-thumbnail");

    Array.from(linkLayout.children).forEach((section) => {
      if (section.querySelector(listing.postThumbnail)) {
        section.classList.add("reddify-listing-thumbnail-cell");
      } else if (section.querySelector(listing.postTitle)) {
        section.classList.add("reddify-listing-copy");
      } else if (section.querySelector(listing.postMeta)) {
        section.classList.add("reddify-listing-meta");
      }
    });
  }

  // Mark nested title and metadata rows when Reddit wraps them together.
  function markNestedTitleMetaRows(post) {
    const title = post.querySelector(listing.postTitle);
    const meta = post.querySelector(listing.postMeta);

    if (!title || !meta) {
      return;
    }

    const titleContainer = directChildContaining(post, title);
    const metaContainer = directChildContaining(post, meta);

    if (!titleContainer || titleContainer !== metaContainer) {
      return;
    }

    const titleRow = directChildContaining(titleContainer, title);
    const metaRow = directChildContaining(metaContainer, meta);

    if (!titleRow || !metaRow || titleRow === metaRow) {
      return;
    }

    titleRow.classList.add("reddify-listing-title-row");
    metaRow.classList.add("reddify-listing-meta-row");
  }

  // Apply every listing marker to one native Reddit post.
  function markListingPost(post) {
    post.classList.add("reddify-listing-post");
    globalThis.reddifyStyleListingShadow(post);
    post.closest(listing.postContainer)?.classList.add("reddify-listing-item");

    markAll(post, listing.postTitle, "reddify-listing-title");
    markAll(post, listing.postMeta, "reddify-listing-credit-bar");
    markAll(post, listing.postTextBody, "reddify-listing-text-body");
    markAll(post, listing.postSubreddit, "reddify-listing-meta-text");
    markAll(post, listing.postTimestamp, "reddify-listing-meta-text");
    markAll(
      post,
      listing.postSubredditAvatar,
      "reddify-listing-subreddit-avatar",
    );
    markAll(post, listing.postJoin, "reddify-listing-hidden-control");
    markAll(post, listing.postOverflow, "reddify-listing-hidden-control");
    markAll(post, listing.postShare, "reddify-listing-hidden-control");
    markNestedTitleMetaRows(post);

    const media = Array.from(post.children).find((element) =>
      element.matches(listing.postMedia),
    );
    const thumbnail = post.querySelector(listing.postThumbnail);

    if (media) {
      markMediaPreview(post, media);
    } else if (thumbnail) {
      markLinkPreview(post, thumbnail);
    }
  }

  // Process home and subreddit posts only on listing routes.
  function markListing() {
    if (!globalThis.reddifyIsListingPage()) {
      return;
    }

    document.querySelectorAll(listing.post).forEach(markListingPost);
  }

  // Tighten comment bodies only on post detail routes.
  function markComments() {
    if (globalThis.reddifyIsListingPage()) {
      return;
    }

    markAll(document, comments.commentBody, "reddify-comment-body");
  }

  // Reapply all idempotent markers after initial load or SPA updates.
  globalThis.reddifyApplyMarkers = function reddifyApplyMarkers() {
    markPageGrid();
    markSubgridContainer();
    markLeftSidebar();
    markMainContainer();
    markRightSidebar();
    markListing();
    markComments();
  };
})();
