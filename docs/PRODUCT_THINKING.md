# Fomi Creative Studio: Product Thinking Document

**Assessment Submission:** Part B — Original AI Image Generation Workspace  
**Candidate:** Maryam Tabassum  
**Date:** October 2026  
**System Architecture:** React SPA on Vite, Tailwind CSS, Local Data Engine  

---

## 1. What problem are you solving, and for whom?

### Target Audience
Fomi Creative Studio is designed for **independent creators, brand designers, marketing leads, and boutique entrepreneurs** who require cohesive, editorial-grade visual assets for e-commerce, campaign launches, social storytelling, and publication design.

### The Problem
Traditional text-to-image AI tools suffer from two extremes:
1. **The "Empty Textbox" Blank Page Problem:** Generalist interfaces present users with an intimidating, blank input field. Non-expert prompt writers struggle to recall the exact keywords required to steer diffusion models (e.g., lighting styles like *chiaroscuro* or *diffused high-key*, lens choices like *35mm f/1.8*, and compositional framing). This results in generic, plastic-looking outputs and wasted iterations.
2. **The "Airplane Cockpit" Over-Engineering Problem:** Advanced open-source diffusion web UIs overwhelm non-technical creators with dozens of esoteric numerical inputs (CFG scale, denoising thresholds, clip skip, schedulers, latent noise seeds) arranged without visual hierarchy.
3. **Disconnected Visual Systems:** Creators rarely need single, isolated images; they need cohesive collections that match brand art direction across multiple aspect ratios (1:1 product squares, 4:3 web showcases, 16:9 cinematic headers, and 9:16 vertical stories).

### How Fomi Creative Studio Solves This
Fomi bridges the gap between creative intention and algorithmic generation:
- **Prompt Recipe Matrix:** Empowers creators to break down visual concepts into five tangible dimensions (Subject, Environment, Lighting, Composition, and Style) with one-click curated ingredients.
- **Unified Workspace Canvas:** Integrates prompt composer, aspect ratio selectors, variations grid, and instant high-res lightbox inspection into a single responsive screen.
- **Brand Continuity & Safe Storage:** Provides immediate favoriting, filtering by aesthetic style, and local persistence without requiring server-side credential setup or third-party tracking.

---

## 2. What are three key UX decisions you made, and why?

### Decision 1: The "Prompt Recipe" Deconstruction Workflow
- **The Problem:** Users often have a vivid creative idea ("a luxury perfume on a stone block") but fail to describe the lighting, texture, camera lens, or composition that turns an amateur prompt into an editorial asset.
- **The Decision:** Built an interactive prompt recipe studio directly above the composer. It decomposes prompt authoring into five discrete, editable fields (Subject, Environment, Lighting, Composition, Style) and offers one-click curated starter recipes alongside editable custom suggestions.
- **User Benefit:** Novices can craft studio-grade prompts in seconds by selecting structured ingredients, while seasoned art directors can edit any specific field without having to re-type full compound sentences. Clicking "Insert into Composer" automatically synthesizes a grammatically natural prompt string with instant visual confirmation.

### Decision 2: 2-Column Desktop Grid with Co-located Controls & Output Canvas
- **The Problem:** Many AI generation interfaces force the user to scroll repeatedly between a prompt panel at the top and a gallery buried several viewports down, breaking the creator's mental model and iteration loop.
- **The Decision:** Engineered a balanced 12-column layout (5 columns for prompt composition and generation parameters; 7 columns for the real-time canvas gallery) that maintains viewport presence on 1440px+ screens while stacking gracefully on tablet and mobile viewports.
- **User Benefit:** As creators adjust aspect ratios, variations, or style parameters, the output canvas remains visible adjacent to their controls. The visual feedback loop between setting changes and output results is instantaneous.

### Decision 3: Comprehensive Zero-Dead-Click Policy & Realistic Multi-Stage Progress
- **The Problem:** Demo and mock interfaces frequently feature disabled buttons, static cards, and instant flash-of-content results that feel fake and untrustworthy.
- **The Decision:** Every affordance in the application is functionally wired:
  - Generation button triggers a realistic 4-stage simulation (tokenizing semantics, configuring diffusion latents, synthesizing spatial lighting, and detail color grading).
  - Cards support instant lightbox modal preview, favorite toggling, download trigger, prompt copying, and variation regeneration.
  - Saved creations view supports live keyword search, style filtering, and sorting.
  - Lightbox modal supports both keyboard shortcuts (Escape, Left Arrow, Right Arrow) and click-outside dismissal.
- **User Benefit:** The workspace feels like a responsive, production-ready desktop creative suite rather than a prototype.

---

## 3. What features did you intentionally leave out, and why?

### 1. Inpainting / Outpainting Mask Brush Canvas
- **Why Omitted:** Implementing an interactive canvas mask editor for inpainting requires complex canvas pixel manipulation, undo/redo stacks, and brush size controls that would add substantial interface weight without adding core value to the initial prompt-to-concept exploration workflow.
- **Focus Kept:** Focused on prompt refinement, parameter tuning, multi-variation output, and curation.

### 2. Mandatory User Authentication & Remote Cloud Database Setup
- **Why Omitted:** Requiring sign-up screens, email verification, or third-party OAuth before allowing an evaluator to generate concepts creates immediate friction. The assessment emphasizes frontend engineering, UI responsiveness, and product thinking.
- **Focus Kept:** Stored favorites and generation history in browser `localStorage` with graceful fallback handling, ensuring the app is immediately testable upon launch.

### 3. Server-Side AI API Costs & Gemini Key Dependency
- **Why Omitted:** The prompt explicitly stated: *"The assessment permits mock APIs, static data, and local demo data. A real AI model is not required... Do not integrate the Gemini API merely because a key is available."* Calling remote AI models would introduce external rate limits, network latency, and API billing costs for the assessment evaluation.
- **Focus Kept:** Built a robust, realistic local simulation service utilizing high-fidelity curated assets matching the exact styles and aspect ratios defined in the Prompt Recipes.

### 4. Overly Complex Latent Sliders (Clip Skip, Euler-A Schedulers)
- **Why Omitted:** Low-level diffusion parameters confuse marketers and creative directors who think in terms of lighting, lenses, and mood rather than algorithmic scheduler algorithms.
- **Focus Kept:** Grouped technical tuning into a clean collapsible "Advanced Tuning" section (Negative prompt, CFG Guidance scale slider, Diffusion steps, and Seed), keeping the primary UI clean and approachable.

---

## 4. What inspired the design, and what would you improve?

### Visual Direction & Inspirations
- **Scandinavian & Editorial Aesthetics:** Inspired by modern creative tool aesthetics (e.g., Kinfolk editorial layouts, Linear's keyboard accessibility, Figma's spatial discipline, and VSCO's tactile color grading).
- **Warm Ivory Palette:** Replaced cold, generic tech blues with a warm off-white canvas (`#FAF7F2`), subtle warm stone borders (`#EAE5DC`), and an intentional terracotta/coral accent (`#D95338`).
- **Anti-Slop Discipline:** Eradicated arbitrary metric badges, fake compiler logs, decorative pulsing dots, and static pill enclosures. Metadata is presented with clean typographic separators (`·`).
- **Dual Theme Harmony:** Designed both light warm ivory and dark charcoal slate modes from the ground up, utilizing CSS custom properties for cohesive contrast across modals, cards, and inputs.

### What Would Be Improved Immediately
- Add visual sliders for camera focal length (e.g., 24mm wide vs. 85mm portrait) directly inside the Prompt Recipe composition tool.
- Provide a side-by-side comparison mode for evaluating two generated variations against each other with a split-screen slider.

---

## 5. What would you improve with one more month?

If given one additional month of development, I would prioritize the following roadmap:

### Phase 1: Real AI Backend & Webhook Streaming (Week 1–2)
- Connect the mock service to an Express/FastAPI backend proxying requests to Google Imagen 3 or SDXL via WebSockets / Server-Sent Events (SSE).
- Stream progressive image denoising previews in real time so users see low-resolution latents resolve into final high-resolution renders.

### Phase 2: Brand Kit & Moodboard Importer (Week 2–3)
- Allow users to upload existing brand guidelines, color palettes (HEX/Pantone), and reference logos.
- Automatically inject brand constraints as latent LoRA weights or prompt prefixes to ensure all generated images adhere to company art direction.

### Phase 3: Interactive Visual Canvas & Storyboarding (Week 3–4)
- Transform the linear gallery into an infinite spatial canvas (similar to FigJam or Milanote) where creators can drag, group, annotate, and cluster visual assets into marketing campaign storyboards.
- Add multi-asset export (batch ZIP download with CSV prompt manifests).

---

## 6. What is your differentiating feature or workflow?

### The Differentiating Feature: **Prompt Recipe Studio**
Most AI generators treat prompts as unstructured strings of natural language. Users are expected to guess the magic incantations needed to produce commercial-grade results.

**How Prompt Recipe Works:**
1. **Deconstruction:** It categorizes visual imagery into five professional photographic principles:
   - **Subject:** The primary product or person with physical texture details.
   - **Environment:** The spatial context, architectural backdrop, or surface material.
   - **Lighting:** Directional characteristics (diffused daylight, chiaroscuro, golden hour, high-key studio).
   - **Composition:** Camera distance, lens angle, and negative space framing.
   - **Visual Style:** Artistic execution (Editorial 35mm, Minimal Scandinavian, Cinematic, Screenprint Illustration, 3D Render).
2. **Interactive Synthesis:** Users can mix and match curated suggestions with their own custom inputs. As they type or click ingredients, a live natural language preview updates instantaneously.
3. **Seamless Composer Injection:** Clicking "Insert into Composer" formats the recipe into a prompt, sets the optimal aspect ratio, selects the appropriate style preset, and prepares the workspace for generation in one click.
4. **Curated Presets:** Includes 4 production-grade editorial templates (*Editorial product photography*, *Minimal lifestyle campaign*, *Cinematic portrait*, *Artistic still life*) that demonstrate best practices for commercial asset creation.

### Why It Matters
Prompt Recipe eliminates the blank-page problem, educates creators on visual vocabulary, and produces consistently higher quality results than freeform prompt typing.

---

## 7. Instructions for Testing and Deployment

### Running Locally
```bash
# 1. Install dependencies
npm install

# 2. Start the Vite development server (Port 3000)
npm run dev
```

### Building for Production
```bash
# Compile and build the production bundle
npm run build
```

### Deploying to Vercel
1. Push the repository to GitHub.
2. Import the project into Vercel.
3. Framework Preset: **Vite**.
4. Root Directory: `./`.
5. Build Command: `npm run build`.
6. Output Directory: `dist`.
7. Deploy.
