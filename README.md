# Hacker Goa House - Builder Pass Generator Clone

A complete duplication of the [Hacker Goa House Builder Pass Generator](https://hhgoa-own-id-card.vercel.app/).

## Project Structure
- `index.html`: The main entry page.
- `vercel.json`: Configuration for routing and static file handling on Vercel.
- `favicon.png`: Website favicon.
- `site.webmanifest`: PWA manifest file.
- `idCardTemplate.png`: The primary background card template used for rendering builder cards.
- `logo-background-remove.png`: Official Hacker House Goa logo with background transparency.
- `assets/`: Contains css/js bundles and other media assets:
  - `index-D2k7wDzh.js`: Bundle JS logic.
  - `index-Cu-KM6lk.css`: Styled UI components.
  - `Prehype.mp4`: Background/intro video.
  - `2-47.svg`, `frame-a.svg`, `goa_hindi.svg`, `Hacker house.png`, `BuilderPass.png`: Logo and frame elements.
- `stickers/`: Contains the draggable stickers/badges used to customize the pass:
  - `cache-raider.png`
  - `coconut-courier.png`
  - `comfort-coder.png`
  - `harbor-hopper.png`
  - `night-champion.png`
  - `terminal-surfer.png`
  - `wave-rider.png`

## How to Run Locally

To run this site locally, use a local HTTP server to make sure the absolute paths `/assets/` and `/stickers/` resolve correctly.

### Prerequisite
Make sure you have [Node.js](https://nodejs.org/) installed.

### Option 1: Using the provided package.json script
1. Open your terminal in this directory.
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

### Option 2: Running with npx directly
If you do not want to install any dependencies:
```bash
npx http-server -p 3000
```
Then open `http://localhost:3000` in your browser.

## How to Deploy to Vercel

This repository is pre-configured for instant Vercel deployment.

### Option 1: Deploy via Vercel CLI
If you have Vercel CLI installed:
1. Run `vercel` in the root of the project:
   ```bash
   vercel
   ```
2. Follow the interactive prompts to link and deploy the project.

### Option 2: Deploy via Vercel Dashboard (GitHub integration)
1. Push this codebase to a GitHub, GitLab, or Bitbucket repository.
2. Import the repository into your Vercel Dashboard.
3. Vercel will automatically detect the static project and deploy it. The pre-configured `vercel.json` will manage clean URLs and SPA routing.
