import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const categoryColors: Record<string, string> = {
  healing: "#E1F5EE",
  autism: "#EEEDFE",
  money: "#FAEEDA",
  writing: "#FAECE7",
  default: "#E5E5E5",
}

export default (() => {
  function PostList({ allFiles, displayClass }: QuartzComponentProps) {
    const posts = allFiles
      .filter((f) => f.slug !== "index" && !f.slug?.endsWith("/index"))
      .sort((a, b) => {
        const dateA = a.dates?.modified ?? a.dates?.created ?? new Date(0)
        const dateB = b.dates?.modified ?? b.dates?.created ?? new Date(0)
        return dateB.getTime() - dateA.getTime()
      })

    const categories = Array.from(
      new Set(posts.map((p) => (p.frontmatter?.category as string) ?? "uncategorized"))
    )

    return (
      <div class={classNames(displayClass, "post-list-wrapper")}>
        <div class="post-list-tabs">
          <button class="tab-btn active" data-tab="recent">Most recent</button>
          <button class="tab-btn" data-tab="category">By category</button>
        </div>

        <div class="post-list-panel" data-panel="recent">
          {posts.map((post) => {
            const category = (post.frontmatter?.category as string) ?? "default"
            const color = categoryColors[category] ?? categoryColors.default
            const excerpt = post.frontmatter?.excerpt as string
            const cover = post.frontmatter?.cover as string
            const date = post.dates?.modified ?? post.dates?.created
            const dateStr = date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""

            return (
              <a href={`/${post.slug}`} class="post-card">
                <div class="post-card-image" style={`background-color: ${color}`}>
                  {cover
                    ? <img src={cover} alt={post.frontmatter?.title as string} />
                    : <span class="post-card-initial">{(post.frontmatter?.title as string ?? "?")[0]}</span>
                  }
                </div>
                <div class="post-card-body">
                  <div class="post-card-meta">
                    {dateStr && <span class="post-card-date">{dateStr}</span>}
                    {category !== "default" && <span class="post-card-category">{category}</span>}
                  </div>
                  <div class="post-card-title">{post.frontmatter?.title as string ?? post.slug}</div>
                  {excerpt && <div class="post-card-excerpt">{excerpt}</div>}
                </div>
              </a>
            )
          })}
        </div>

        <div class="post-list-panel hidden" data-panel="category">
          {categories.map((cat) => (
            <div class="category-group">
              <h3 class="category-heading">{cat}</h3>
              {posts
                .filter((p) => ((p.frontmatter?.category as string) ?? "uncategorized") === cat)
                .map((post) => {
                  const color = categoryColors[cat] ?? categoryColors.default
                  const excerpt = post.frontmatter?.excerpt as string
                  const cover = post.frontmatter?.cover as string
                  const date = post.dates?.modified ?? post.dates?.created
                  const dateStr = date ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : ""

                  return (
                    <a href={`/${post.slug}`} class="post-card">
                      <div class="post-card-image" style={`background-color: ${color}`}>
                        {cover
                          ? <img src={cover} alt={post.frontmatter?.title as string} />
                          : <span class="post-card-initial">{(post.frontmatter?.title as string ?? "?")[0]}</span>
                        }
                      </div>
                      <div class="post-card-body">
                        <div class="post-card-meta">
                          {dateStr && <span class="post-card-date">{dateStr}</span>}
                        </div>
                        <div class="post-card-title">{post.frontmatter?.title as string ?? post.slug}</div>
                        {excerpt && <div class="post-card-excerpt">{excerpt}</div>}
                      </div>
                    </a>
                  )
                })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  PostList.css = `
    .post-list-wrapper {
      margin-top: 2rem;
      border-top: 1px solid var(--lightgray);
      padding-top: 1.5rem;
    }
    .post-list-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .tab-btn {
      background: none;
      border: 1px solid var(--lightgray);
      border-radius: 99px;
      padding: 4px 16px;
      font-size: 13px;
      cursor: pointer;
      color: var(--darkgray);
      font-family: var(--bodyFont);
    }
    .tab-btn.active {
      background: var(--dark);
      color: var(--light);
      border-color: var(--dark);
    }
    .post-list-panel.hidden {
      display: none;
    }
    .post-card {
      display: flex;
      gap: 1rem;
      padding: 1.25rem 0;
      border-bottom: 1px solid var(--lightgray);
      text-decoration: none;
      color: inherit;
    }
    .post-card:hover .post-card-title {
      color: var(--secondary);
    }
    .post-card-image {
      width: 80px;
      height: 80px;
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
      font-size: 28px;
      font-weight: 500;
      opacity: 0.4;
    }
    .post-card-body {
      flex: 1;
      min-width: 0;
    }
    .post-card-meta {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 4px;
    }
    .post-card-date {
      font-size: 12px;
      color: var(--gray);
    }
    .post-card-category {
      font-size: 11px;
      padding: 2px 8px;
      border-radius: 99px;
      background: var(--lightgray);
      color: var(--darkgray);
      text-transform: capitalize;
    }
    .post-card-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 4px;
      line-height: 1.4;
    }
    .post-card-excerpt {
      font-size: 13px;
      color: var(--darkgray);
      line-height: 1.6;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .category-group {
      margin-bottom: 2rem;
    }
    .category-heading {
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--gray);
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
  `

  PostList.afterDOMLoaded = `
    const tabs = document.querySelectorAll(".tab-btn");
    const panels = document.querySelectorAll(".post-list-panel");
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        panels.forEach(p => p.classList.add("hidden"));
        tab.classList.add("active");
        const target = tab.getAttribute("data-tab");
        document.querySelector(".post-list-panel[data-panel='" + target + "']")?.classList.remove("hidden");
      });
    });
  `

  return PostList
}) satisfies QuartzComponentConstructor