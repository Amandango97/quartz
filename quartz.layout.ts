import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.ConditionalRender({
      component: Component.PostList({ folder: "writing", label: "All posts" }),
      condition: (page) => page.fileData.slug === "All-posts",
    }),
    Component.ConditionalRender({
      component: Component.PostList({ folder: "visual", label: "Visual art" }),
      condition: (page) => page.fileData.slug === "Visual-art",
    }),
    Component.ConditionalRender({
      component: Component.LinkedPosts(),
      condition: (page) =>
        page.fileData.slug !== "All-posts" &&
        page.fileData.slug !== "Visual-art" &&
        page.fileData.slug !== "index",
    }),
    Component.SubstackLink(undefined),
  ],
  footer: Component.Footer({
    links: {},
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    // Component.ConditionalRender({
    //   component: Component.Breadcrumbs(),
    //   condition: (page) => page.fileData.slug !== "index",
    // }),
    Component.ConditionalRender({
  component: Component.BackButton(),
  condition: (page) => page.fileData.slug !== "index",
}),
    Component.ConditionalRender({
      component: Component.ArticleTitle(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ConditionalRender({
      component: Component.ContentMeta(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.SidebarPostList(),
  ],
  right: [],
}

// components for pages that display lists of pages (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.SidebarPostList(),
  ],
  right: [],
}