import { QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { getAllSegmentPrefixes } from "../util/path"

export default (() => {
  function SidebarPostList({ allFiles, displayClass }: QuartzComponentProps) {
    const allTags = Array.from(
      new Set(
        allFiles
          .filter((p) => p.slug?.startsWith("writing/"))
          .flatMap((p) => {
            const raw = p.frontmatter?.tags
            const tags = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : []
            return tags.flatMap(getAllSegmentPrefixes)
          })
      )
    ).sort()

    return (
      <div class={classNames(displayClass, "spl-wrapper")}>
        <div class="spl-tag-list">
          <a href="/" class="spl-tag-item">Start here</a>
          <a href="/All-posts" class="spl-tag-item">All posts</a>
        </div>
        <div class="spl-divider"></div>
        <div class="spl-section-label">Tags</div>
        <div class="spl-tag-list">
          {allTags.map((tag) => (
            <a href={"/tags/" + tag} class="spl-tag-item">{tag}</a>
          ))}
        </div>
        <div class="spl-divider"></div>
        <div class="spl-tag-list">
          <a href="/Visual-art" class="spl-tag-item">Visual art</a>
        </div>
      </div>
    )
  }

  SidebarPostList.css = `
    .spl-wrapper {
      width: 100%;
      padding-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .spl-section-label {
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gray);
    }
    .spl-tag-list {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .spl-tag-item {
      font-size: 14px;
      padding: 5px 8px;
      border-radius: 6px;
      cursor: pointer;
      color: var(--darkgray);
      text-decoration: none;
      display: block;
    }
    .spl-tag-item:hover {
      background: var(--highlight);
      color: var(--dark);
    }
    .spl-tag-item.active {
      background: var(--highlight);
      color: var(--dark);
      font-weight: 500;
    }
    .spl-divider {
    height: 1px;
    background: var(--lightgray);
    margin: 0.5rem 0;
  }
  `

  SidebarPostList.afterDOMLoaded = `
    // Highlight active tag based on current URL
    const path = window.location.pathname;
    document.querySelectorAll(".spl-tag-item").forEach((link) => {
      const href = link.getAttribute("href");
      if (href === path || (path === "/" && href === "/")) {
        link.classList.add("active");
      } else if (href !== "/" && path.startsWith(href)) {
        link.classList.add("active");
      }
    });

    document.addEventListener("nav", () => {
      const path = window.location.pathname;
      document.querySelectorAll(".spl-tag-item").forEach((link) => {
        const href = link.getAttribute("href");
        link.classList.toggle("active",
          href === path || (href !== "/" && path.startsWith(href))
        );
      });
    });
  `

  return SidebarPostList
}) satisfies QuartzComponentConstructor