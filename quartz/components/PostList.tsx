import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const placeholderColors = ["#EEEDFE", "#E8E4FB", "#F4C0D1", "#F5C4B3", "#E1F5EE"]

interface Options {
  folder?: string
  label?: string
}

export default ((opts?: Options) => {
  function PostList({ allFiles, displayClass }: QuartzComponentProps) {
    const posts = allFiles
      .filter(
        (f) =>
          f.slug !== "index" &&
          !f.slug?.endsWith("/index") &&
          (!opts?.folder || f.slug?.startsWith(opts.folder + "/")),
      )
      .sort((a, b) => {
            const aPinned = a.frontmatter?.pinned === true || a.frontmatter?.pinned === "true"
            const bPinned = b.frontmatter?.pinned === true || b.frontmatter?.pinned === "true"
            if (aPinned && !bPinned) return -1
            if (!aPinned && bPinned) return 1
            const dateA = a.dates?.modified ?? a.dates?.created ?? new Date(0)
            const dateB = b.dates?.modified ?? b.dates?.created ?? new Date(0)
            return dateB.getTime() - dateA.getTime()
        })

    const renderPost = (post: any) => {
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

    const title = post.frontmatter?.title as string ?? post.slug
    const colorIndex = title.charCodeAt(0) % placeholderColors.length
    const placeholderColor = placeholderColors[colorIndex]

    const folder = post.slug?.split("/")[0] ?? ""

    return (
        <a
        href={"/" + post.slug}
        class="post-card"
        data-stream={folder}
        data-tags={tags.join(",")}
    >
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
            {tags.map((tag) => (
            <span class="post-card-tag">{tag}</span>
            ))}
            {tags.length > 0 && <span class="post-card-sep">·</span>}
        </div>
        </div>
    </a>
    )
    }

    const pinnedPosts = posts.filter((p) => p.frontmatter?.pinned === true || p.frontmatter?.pinned === "true")
    const unpinnedPosts = posts.filter((p) => p.frontmatter?.pinned !== true && p.frontmatter?.pinned !== "true")

    return (
    <div class={classNames(displayClass, "post-list-wrapper")}>
        {pinnedPosts.length > 0 && (
        <div class="post-list-section">
            <div class="post-list-section-label">Pinned</div>
            {pinnedPosts.map(renderPost)}
        </div>
        )}
        <div class="post-list-section">
        <div class="post-list-section-label">{opts?.label ?? "All posts"}</div>
        {unpinnedPosts.map(renderPost)}
        </div>
    </div>
    )
  }

  PostList.css = `
    .post-list-wrapper {
    }
    .post-card {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        gap: 1.25rem;
        padding: 1.75rem 0;
        border-radius: 0;
        text-decoration: none;
        color: inherit;
        border-bottom: 1px solid var(--lightgray);
        }

    .post-card:last-child {
      border-bottom: none;
    }
    .post-card:hover {
      background: var(--highlight);
    }
    .post-card-image {
        width: 180px;
        height: 140px;
        border-radius: 8px;
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        }
        .post-card-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        }
        .post-card-initial {
        font-size: 48px;
        font-weight: 500;
        opacity: 0.3;
        }
        .post-card-content {
        flex: 1;
        min-width: 0;
        }
    .post-card-title {
        font-size: 20px;
        font-weight: 600;
        line-height: 1.35;
        margin-bottom: 6px;
        color: var(--dark);
        }
    .post-card-excerpt {
        font-size: 16px;
        font-weight: 400;
        color: var(--darkgray);
        line-height: 1.6;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        }
    .post-card-date {
      font-size: 16px;
      color: var(--gray);
    }
    .post-card-meta {
    display: flex;
    gap: 6px;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 2px;
    }
    .post-card-sep {
      font-size: 12px;
      color: var(--gray);
    }
   .post-card-tag {
    font-size: 13px;
    color: #9B8FE0
    }
    .post-card-pin {
    font-size: 11px;
    font-weight: 400;
    color: var(--gray);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-right: 4px;
    }
    .post-list-section {
    margin-bottom: 2rem;
    }
    .post-list-section-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--lightgray);
    }
    .post-list-section:not(:has(.post-card:not(.hidden))) {
  display: none;
}
  `

  return PostList
}) satisfies QuartzComponentConstructor