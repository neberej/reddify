(() => {
  "use strict";

  // Keep every Reddit-owned selector in one registry for straightforward DOM updates.
  globalThis.reddifySelectors = Object.freeze({
    // Target Reddit's major page-column containers.
    layout: Object.freeze({
      // Verified against the saved Reddit home snapshot from 2026-09.
      pageGrid: ".grid-container",
      subgridContainer: "#subgrid-container",
      leftSidebar: "#left-sidebar-container",
      mainContainer: ".main-container",
      rightSidebarContainer: "#right-sidebar-container",
      rightSidebar: "#right-sidebar-contents",
    }),

    // Target post content shared by home and subreddit listing feeds.
    listing: Object.freeze({
      // AggregateFeed was verified in the snapshot; SubredditFeed was verified live.
      post:
        'shreddit-post:is([view-context="AggregateFeed"], [view-context="SubredditFeed"])',
      postContainer: "shreddit-feed > article[data-post-id]",
      postTitle: '[slot="title"]',
      postMedia: '[slot="post-media-container"]',
      postThumbnail: '[slot="thumbnail"]',
      postTextBody: "shreddit-post-text-body",
      postSubreddit: '[data-testid="subreddit-name"]',
      postTimestamp: "faceplate-timeago",
      postSubredditAvatar: '[slot="credit-bar"] [avatar]',
      postJoin:
        'shreddit-join-button[data-testid="credit-bar-join-button"]',
      postOverflow: "shreddit-post-overflow-menu",
      postShare: 'rpl-dropdown[slot="ssr-share-button"]',
      // Verified live in Firefox against Reddit's hydrated post shadow root.
      postContentContainerShadow:
        ':host(.reddify-listing-post) > div:has(slot[name="title"])',
      postShareShadow:
        '[data-action-bar-action="share"], [data-post-click-location="share"], shreddit-post-share-button',
      postActionRowShadow: '[data-testid="action-row"]',
      mediaPrimary:
        "[data-post-media-primary], shreddit-player, gallery-carousel, shreddit-gallery-carousel, video",
      player: "shreddit-player",
      video: "video",
      postMeta: '[slot="credit-bar"]',
      postActions: null,
      voteControls: null,
    }),

    // Target comment-thread content only on post detail pages.
    comments: Object.freeze({
      thread: "shreddit-comment-tree",
      comment: "shreddit-comment",
      commentBody: 'shreddit-comment [slot="comment"]',
      commentActions: null,
      voteControls: null,
      composer: null,
    }),
  });
})();
