import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const placeholderColors = ["#EEEDFE", "#E8E4FB", "#F4C0D1", "#F5C4B3", "#E1F5EE"]

export default (() => {
  function LinkedPosts({ fileData, allFiles, displayClass }: QuartzComponentProps) {
    const links = fileData.links ?? []
    if (links.length === 0) return null

    const slugSet = new Set(links.map((l) => l.replace(/^\//, "")))
    const linked = allFiles.filter((f) => slugSet.has(f.slug ?? ""))
    if (linked.length === 0) return null

    return (
      <div class={classNames(displayClass, "post-list-wrapper linked-posts-wrapper")}>
        <div class="post-list-section-label">Linked posts</div>
        <div class="post-list-inner">
          {linked.map((post) => {
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
            const colorIndex = (title?.charCodeAt(0) ?? 0) % placeholderColors.length
            const placeholderColor = placeholderColors[colorIndex]
            const folder = post.slug?.split("/")[0] ?? ""
            const streamLabel = folder.includes("-stream") ? folder.replace("-", " ") : null

            return (
              <a href={"/" + post.slug} class="post-card">
                <div class="post-card-image" style={"background-color: " + placeholderColor}>
                  {cover
                    ? <img src={"/" + cover} alt={title} />
                    : <span class="post-card-initial">{title?.[0]}</span>
                  }
                </div>
                <div class="post-card-content">
                  <div class="post-card-title">{title}</div>
                  {excerpt && <div class="post-card-excerpt">{excerpt}</div>}
                  <div class="post-card-meta">
                    {dateStr && <span class="post-card-date">{dateStr}</span>}
                    {tags.length > 0 && <span class="post-card-sep">·</span>}
                    {tags.map((tag) => (
                      <span class="post-card-tag">{tag}</span>
                    ))}
                    {streamLabel && <span class="post-card-sep">·</span>}
                    {streamLabel && <span class="post-card-stream">{streamLabel}</span>}
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    )
  }

  LinkedPosts.css = `
    .linked-posts-wrapper {
      margin-top: 2.5rem;
      padding-top: 2rem;
      border-top: 1px solid var(--lightgray);
    }
  `

  return LinkedPosts
}) satisfies QuartzComponentConstructor