import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SubstackLink: QuartzComponentConstructor = () => {
  const SubstackLinkComponent: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
    const substackUrl = fileData.frontmatter?.substack as string | undefined
    if (!substackUrl) return <></>

    return (
      <div class="substack-link">
        <a href={substackUrl} target="_blank" rel="noopener noreferrer">
          Read and comment on Substack →
        </a>
      </div>
    )
  }

  SubstackLinkComponent.css = `
    .substack-link {
      margin: 1rem 0 2rem 0;
    }

    .substack-link a {
      font-size: 0.875rem;
      color: var(--gray);
      text-decoration: none;
      border-bottom: 1px solid var(--lightgray);
      padding-bottom: 1px;
      transition: color 0.15s, border-color 0.15s;
    }

    .substack-link a:hover {
      color: var(--secondary);
      border-color: var(--secondary);
    }
  `

  return SubstackLinkComponent
}

export default SubstackLink