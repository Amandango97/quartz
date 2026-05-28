import { QuartzComponentConstructor } from "./types"

export default (() => {
  function BackButton() {
    return (
      <button class="back-button" onclick="history.back()">
        ← Back
      </button>
    )
  }

  BackButton.css = `
    .back-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 14px;
      color: var(--gray);
      padding: 0;
      margin-bottom: 1rem;
      font-family: var(--bodyFont);
      display: block;
    }
    .back-button:hover {
      color: var(--darkgray);
    }
  `

  return BackButton
}) satisfies QuartzComponentConstructor