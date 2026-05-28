import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"
import style from "../styles/listPage.scss"
import { PageList, SortFn } from "../PageList"
import { FullSlug, getAllSegmentPrefixes, resolveRelative, simplifySlug } from "../../util/path"
import { QuartzPluginData } from "../../plugins/vfile"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"

const placeholderColors = ["#EEEDFE", "#E8E4FB", "#F4C0D1", "#F5C4B3", "#E1F5EE"]

interface TagContentOptions {
  sort?: SortFn
  numPages: number
}

const defaultOptions: TagContentOptions = {
  numPages: 10,
}

export default ((opts?: Partial<TagContentOptions>) => {
  const options: TagContentOptions = { ...defaultOptions, ...opts }

  const TagContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props
    const slug = fileData.slug

    if (!(slug?.startsWith("tags/") || slug === "tags")) {
      throw new Error(`Component "TagContent" tried to render a non-tag page: ${slug}`)
    }

    const tag = simplifySlug(slug.slice("tags/".length) as FullSlug)
    const allPagesWithTag = (tag: string) =>
      allFiles.filter((file) =>
        (file.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes).includes(tag),
      )

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren
    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")

    if (tag === "/") {
      const tags = [
        ...new Set(
          allFiles.flatMap((data) => data.frontmatter?.tags ?? []).flatMap(getAllSegmentPrefixes),
        ),
      ].sort((a, b) => a.localeCompare(b))
      const tagItemMap: Map<string, QuartzPluginData[]> = new Map()
      for (const tag of tags) {
        tagItemMap.set(tag, allPagesWithTag(tag))
      }
      return (
        <div class="popover-hint">
          <article class={classes}>
            <p>{content}</p>
          </article>
          <p>{i18n(cfg.locale).pages.tagContent.totalTags({ count: tags.length })}</p>
          <div>
            {tags.map((tag) => {
              const pages = tagItemMap.get(tag)!
              const listProps = { ...props, allFiles: pages }
              const contentPage = allFiles.filter((file) => file.slug === `tags/${tag}`).at(0)
              const root = contentPage?.htmlAst
              const content =
                !root || root?.children.length === 0
                  ? contentPage?.description
                  : htmlToJsx(contentPage.filePath!, root)
              const tagListingPage = `/tags/${tag}` as FullSlug
              const href = resolveRelative(fileData.slug!, tagListingPage)
              return (
                <div>
                  <h2>
                    <a class="internal tag-link" href={href}>{tag}</a>
                  </h2>
                  {content && <p>{content}</p>}
                  <div class="page-listing">
                    <p>
                      {i18n(cfg.locale).pages.tagContent.itemsUnderTag({ count: pages.length })}
                    </p>
                    <PageList limit={options.numPages} {...listProps} sort={options?.sort} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    } else {
      const pages = allPagesWithTag(tag)
        .sort((a, b) => {
          const dateA = a.dates?.modified ?? a.dates?.created ?? new Date(0)
          const dateB = b.dates?.modified ?? b.dates?.created ?? new Date(0)
          return dateB.getTime() - dateA.getTime()
        })

      return (
        <div class="popover-hint">
          <div class="post-list-wrapper">
            {pages.map((post) => {
              const title = post.frontmatter?.title as string ?? post.slug
              const excerpt = post.frontmatter?.excerpt as string
              const rawCover = post.frontmatter?.cover as string
              const cover = rawCover ? rawCover.replace(/^\[\[|\]\]$/g, "") : null
              const date = post.dates?.modified ?? post.dates?.created
              const dateStr = date
                ? new Date(date).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })
                : ""
              const rawTags = post.frontmatter?.tags
              const tags: string[] = Array.isArray(rawTags)
                ? rawTags
                : typeof rawTags === "string"
                ? [rawTags]
                : []
              const colorIndex = title.charCodeAt(0) % placeholderColors.length
              const placeholderColor = placeholderColors[colorIndex]

              return (
                <a href={"/" + post.slug} class="post-card">
                  <div class="post-card-image" style={"background-color: " + placeholderColor}>
                    {cover
  ? <img src={"/" + cover} alt={title} />
  : <span class="post-card-initial">{title[0]}</span>
}
                  </div>
                  <div class="post-card-content">
                    <div class="post-card-title">{title}</div>
                    {excerpt && <div class="post-card-excerpt">{excerpt}</div>}
                    <div class="post-card-meta">
                      {dateStr && <span class="post-card-date">{dateStr}</span>}
                      {tags.length > 0 && <span class="post-card-sep">·</span>}
                      {tags.map((t) => (
                        <span class="post-card-tag">{t}</span>
                      ))}
                    </div>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      )
    }
  }

  TagContent.css = concatenateResources(style, `
    .tag-page-title {
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 1.5rem;
      text-transform: capitalize;
    }
  `)

  return TagContent
}) satisfies QuartzComponentConstructor