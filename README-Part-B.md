# Fomi AI --- Visual Content Generation Workspace

A responsive frontend workspace for exploring AI-assisted image
creation. The interface brings together prompt writing, generation
settings, image previews, a creative gallery, and saved-generation
history in one place.

> **Current implementation:** Vite + React + JavaScript + Tailwind CSS
> v4. The current generation flow is a mock/demo experience using sample
> images; connect a real image-generation API separately if required.

## Features

-   **Prompt editor:** Enter and refine a description for a visual
    concept.
-   **Generation controls:** Configure the available image settings,
    such as model, style, aspect ratio, and number of images.
-   **Generation feedback:** View loading and result states during the
    demo generation flow.
-   **Image gallery:** Browse sample generated images and select an
    image for a larger preview.
-   **Preview modal:** Inspect a selected image in a focused view.
-   **Recent creations:** Keep a browser-local history of creations when
    supported by the current implementation.
-   **Theme support:** Light/dark appearance controls, if enabled in the
    current UI.
-   **Responsive layout:** Designed to adapt to desktop and smaller
    screens.
-   **Creative utilities:** Prompt enhancement, model details, library,
    or support dialogs where present in the current implementation.

## Tech Stack

-   [Vite](https://vite.dev/) --- development server and build tooling
-   [React](https://react.dev/) --- UI components
-   JavaScript
-   [Tailwind CSS v4](https://tailwindcss.com/) --- utility-first
    styling

## Getting Started

### Prerequisites

-   Node.js 20.19+ or a compatible current LTS release
-   npm

Check your installed versions:

``` bash
node --version
npm --version
```

### Install dependencies

Open a terminal in the `Fomi-AI---Visual-Content-Generation-Workspace`
folder and run:

``` bash
npm install
```

### Start the development server

``` bash
npm run dev
```

Open the local URL printed by Vite in the terminal.

### Create a production build

``` bash
npm run build
```

### Preview the production build locally

``` bash
npm run preview
```

These commands assume the corresponding scripts are present in
`package.json`. If a command reports `Missing script`, check the scripts
section of that file.

## Project Structure

The exact structure can evolve, but the main files and folders typically
include:

``` text
Fomi-AI---Visual-Content-Generation-Workspace/
├── public/                 # Static public assets, if present
├── src/
│   ├── components/         # Reusable UI components
│   ├── data/               # Demo content and sample asset data
│   ├── services/            # Generation/demo service logic
│   ├── App.jsx              # Main application UI (filename may vary)
│   ├── main.jsx              # React entry point (filename may vary)
│   └── index.css             # Global styles and Tailwind imports (filename may vary)
├── index.html
├── package.json
├── vite.config.ts
└── README.md
```

Refer to the actual repository if a filename differs from this
illustrative structure.

## How the Demo Works

1.  Enter a visual prompt.
2.  Choose the available generation options.
3.  Start the demo generation flow.
4.  Review the sample image results.
5.  Open a result in the preview and use available gallery or save
    controls.

The precise controls depend on the current UI implementation.

## Important Notes

-   **Mock generation:** The current demo flow uses sample images and
    simulated generation behavior. It does not prove that a real AI
    image model is connected.
-   **Local storage:** If the app stores recent creations or preferences
    in `localStorage`, those values are browser-specific and may be
    cleared by the user or browser.
-   **API credentials:** Never commit API keys or secrets. Keep any
    required secrets in the deployment provider's environment settings
    and route secret API calls through a secure backend/serverless
    endpoint when necessary.
-   **Browser support:** Use a current version of a modern browser for
    the best experience.

## Deployment

This app can be deployed as a Vite frontend to a static hosting provider
such as Vercel.

### Deploy as a standalone project

1.  Push this folder to a GitHub repository.
2.  Import the repository into Vercel.
3.  Set the project root directory to this folder if it is inside a
    monorepo.
4.  Use the build command `npm run build`.
5.  Use `dist` as the output directory.
6.  Deploy and test the generated URL.

### Deploy under `/part-b/` in the combined Fomi AI project

If this app is hosted at `https://your-domain.example/part-b/` rather
than the domain root, configure Vite's `base` option for `/part-b/` in
`vite.config.ts`, and configure the combined Vercel routing/build setup
accordingly. The exact configuration depends on how Part A is built and
served. Test direct navigation and refreshes on `/part-b/` after
deployment.

## Quality Checklist

Before publishing, verify:

-   [ ] `npm install` completes successfully.
-   [ ] `npm run build` completes without errors.
-   [ ] `npm run dev` starts the app.
-   [ ] Images and other assets load correctly.
-   [ ] Main controls, dialogs, gallery, and preview work.
-   [ ] The interface is usable on desktop, tablet, and mobile.
-   [ ] Browser console has no unresolved runtime errors.
-   [ ] No secrets or local environment files are committed.
-   [ ] The README accurately describes the current implementation.

## License

Add the license required by your project or assessment before
distributing the repository publicly.
