# Research: AI Mesh Generation Loop for Game Characters

_Generated 2026-03-25_

## TL;DR

Primitive geometry (cylinders, spheres, boxes) has a hard visual ceiling — no amount of PBR materials overcomes a toy silhouette. The most immediately actionable fix is **loading KayKit CC0 GLBs directly from GitHub CDN** (zero setup, real character meshes in under 30 minutes). For a sustainable "AI designs and iterates on meshes" loop, the two proven paths are: **(1) Blender headless scripting** — AI writes bpy Python, runs `blender --bg --python script.py`, exports GLB, browser loads it; and **(2) AI visual feedback loop** — headless-gl renders the scene to PNG, Claude vision analyzes it, LLM rewrites the geometry code, repeat. Both converge in 2–3 iterations. Text-to-3D APIs (Meshy, Tripo) are the fastest path to production-quality characters but cost ~$0.10–$0.20/gen and produce ~1 in 10 usable outputs for characters specifically. SDF + marching cubes is a compelling all-code approach that produces organic-looking meshes without any external tools.

---

## Key Findings

### The Root Cause: Silhouette is Everything

The cartoonish appearance isn't a material problem — it's a geometry problem. Human vision reads silhouettes first. Cylinders, spheres, and boxes produce hard geometric silhouettes that scream "primitive." Real character meshes have:
- Gradual surface curvature (no hard cylinder edges)
- High-frequency detail (armor dents, fabric folds, face features)
- Anatomically coherent proportions (not stacked shapes)

No PBR pipeline — not even displacement maps — can compensate for a fundamentally wrong base mesh. The fix is in geometry, not shading.

### Path 1: KayKit CC0 GLBs (Immediate — 30 min)

KayKit's Character Pack Adventures is CC0-licensed and hosted on GitHub with CORS-open raw.githubusercontent.com URLs. These are real, professionally authored low-poly character meshes with clean topology and UV maps.

**Load-ready URLs:**
```
https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf/Knight.glb
https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf/Mage.glb
https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf/Barbarian.glb
https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf/Rogue.glb
https://raw.githubusercontent.com/KayKit-Game-Assets/KayKit-Character-Pack-Adventures-1.0/main/addons/kaykit_character_pack_adventures/Characters/gltf/Skeleton_Warrior.glb
```

In Babylon.js: `BABYLON.SceneLoader.ImportMeshAsync("", url, "", scene)`.

**Tradeoffs:** Stylized low-poly aesthetic (not photorealistic), but genuine character silhouettes. Immediately better than any primitive geometry approach. Zero cost.

Other CC0 sources:
- **Poly Pizza** (polypizza.run) — CC0 models, searchable
- **Quaternius** (quaternius.com) — CC0 RPG character packs
- **Sketchfab** — free tier, many CC0, downloadable as GLB

### Path 2: SDF + Marching Cubes (All-Code, Organic)

Define a character as a composition of Signed Distance Fields — capsule SDFs for limbs, sphere SDFs for the head, box SDFs for torso armor. Use smoothUnion (IQ's polynomial smooth minimum) to blend between them organically. Polygonize with marching cubes or surface nets.

**Key libraries:**
- `mikolalysenko/isosurface` (npm) — surface nets polygonization, produces cleaner topology than marching cubes
- Three.js MarchingCubes addon — browser-native, no npm
- WebGPU compute at 256³ grid: ~30ms per mesh update

**IQ's smoothUnion:**
```glsl
float smin(float a, float b, float k) {
    float h = max(k - abs(a-b), 0.0) / k;
    return min(a, b) - h*h*k*(1.0/4.0);
}
```

**Character SDF pseudocode:**
```javascript
function characterSDF(x, y, z) {
    const head    = sphere(x, y-1.7, z, 0.18);
    const torso   = capsule(x, y-0.9, z, 0.22, 0.4);
    const leftArm = capsule(x-0.3, y-1.0, z, 0.08, 0.35);
    const rightArm= capsule(x+0.3, y-1.0, z, 0.08, 0.35);
    const leftLeg = capsule(x-0.12, y-1.5, z, 0.1, 0.4);
    const rightLeg= capsule(x+0.12, y-1.5, z, 0.1, 0.4);
    return smin(smin(smin(head, torso, 0.05), smin(leftArm, rightArm, 0.03)), smin(leftLeg, rightLeg, 0.03), 0.04);
}
```

At 64³ grid → ~8–18k triangles. Looks organic, not primitive. AI can tune SDF parameters iteratively.

**CSG alternative:** `three-bvh-csg` or Babylon CSG2 (built on manifold-3d WASM) for boolean subtract/union operations on meshes. Good for armor pieces, less for organic forms.

**Subdivision surfaces:** `three-subdivide` (Loop algorithm) or `gl-catmull-clark` — apply 1–2 passes to smooth any low-poly base mesh.

### Path 3: AI Visual Feedback Loop (Proven, ~2–3 iterations)

Render the scene → capture screenshot → Claude vision analyzes defects → LLM rewrites geometry code → repeat.

**Research backing:**
- **CADCodeVerify** (ICLR 2025): LLM generates CAD code, vision model verifies rendered output, iterates to fix geometric defects. Converges in ~2.1 iterations with GPT-4o.
- **DD3M** (commercial product): Same loop, production use.
- **EvoCAD** and **Idea23D**: Multi-modal pipelines that combine code generation with visual feedback.

**Implementation in Node.js:**
```javascript
// 1. Render scene with headless-gl (stackgl/headless-gl)
const gl = require('gl')(800, 600);
// ... render Three.js or raw WebGL scene ...
const pixels = new Uint8Array(800 * 600 * 4);
gl.readPixels(0, 0, 800, 600, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
// Convert to PNG, send to Claude vision API

// 2. Claude vision prompt:
// "This is a 3D character mesh rendered in a game engine.
//  Describe specific geometric defects: unnatural silhouettes,
//  proportion problems, missing detail areas. Return a list of
//  SDF parameter adjustments to fix each issue."

// 3. Parse response, update SDF parameters, re-render, repeat
```

**Key constraint:** headless-gl only supports WebGL1. For Three.js/Babylon.js with WebGL2/WebGPU features, need Puppeteer headless Chrome instead.

**Puppeteer approach:**
```javascript
const browser = await puppeteer.launch({ headless: true });
const page = await browser.newPage();
await page.goto(`file://${htmlPath}`);
await page.waitForFunction('window.sceneReady === true');
const screenshot = await page.screenshot({ type: 'png' });
// Send screenshot bytes to Claude API
```

### Path 4: Blender Headless (Best Quality, Highest Setup Cost)

AI writes bpy Python scripts → `blender --background --python script.py` → exports GLB → browser loads it.

**Blender 4.2+ has a pip-installable `bpy` wheel**, enabling pure Python use without the full Blender GUI.

**Install:**
```bash
pip install bpy  # Blender 4.2+
```

**Headless invocation:**
```bash
blender --background --python generate_character.py -- --faction iron --output knight.glb
```

**Key Blender Python capabilities:**
- Geometry Nodes via Python: fully procedural mesh generation
- MPFB2 (Make it Human for Blender): parametric human body generation with morph targets
- Modifiers: Subdivision Surface, Solidify, Bevel, Array — all scriptable
- `bpy.ops.export_scene.gltf()` for GLB export

**NodeToPython addon**: exports Geometry Nodes graphs as pure Python bpy code — AI can modify the code, no GUI needed.

**LL3M** (August 2025 paper): Multi-agent system where one LLM generates Blender Python, a second critiques it, a third renders and analyzes. Achieves ~4.2/5 quality score on character meshes. This is the research state-of-the-art.

**Tradeoffs:** Requires local Blender install (~200MB). Render-to-critique loop adds latency. But produces the highest quality meshes of any code-based approach.

### Path 5: Text-to-3D APIs (Best Character Quality, Per-Request Cost)

| Service | Strengths | Topology | Price |
|---------|-----------|----------|-------|
| **Tripo AI v3.0 Ultra** | Best character topology, auto-rigging, animation-ready | Quad-dominant | ~$0.15/gen |
| **Meshy AI** | Best docs, REST API, Low Poly Mode, PBR textures | Mostly tris | ~$0.10–$0.20/gen |
| **Rodin/Hyper3D** | Best textures, detail | Mixed | ~$0.12/gen |
| **TRELLIS.2** (Microsoft) | Open-source MIT, 4B params, full PBR, self-hostable | Tris | Free (self-host) |

**Meshy REST example:**
```javascript
// Step 1: Create task
const task = await fetch('https://api.meshy.ai/v2/text-to-3d', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${MESHY_KEY}` },
    body: JSON.stringify({
        mode: 'preview',
        prompt: 'armored knight, fantasy, low poly, game character',
        art_style: 'realistic',
        topology: 'quad',
    })
});
// Step 2: Poll for completion
// Step 3: Download .glb from task.model_urls.glb
// Step 4: BABYLON.SceneLoader.ImportMeshAsync(glbUrl, ...)
```

**Reality check:** ~1 in 10 AI-generated character outputs are usable without rework. Props (shields, swords, chests) have a much higher hit rate (~3 in 10). The topology for animation is often poor. Best used for props and environment objects, with manual curation for characters.

**TRELLIS.2** is the most interesting long-term option: MIT-licensed, self-hostable, produces structured 3D Gaussians + mesh + full PBR. Requires an A100-class GPU to run locally.

### Procedural Character Generation

**Metaballs**: Browser-native via Three.js MarchingCubes addon. Blobs that merge organically when close. Good for amorphous creatures, poor for humanoids (no fine detail control).

**Skeleton-driven mesh**: Define a skeleton (joint positions + bone lengths), extrude mesh around bones, apply Dual Quaternion Skinning. DQS fixes the "candy-wrapper" artifact from Linear Blend Skinning that appears at shoulder/hip joints.

**SMPL model**: 10-shape + 10-pose parameter statistical body model. Open-source Python, can generate .obj files. Academic license (non-commercial). Good for generating anatomically correct human body proportions.

**L-systems**: For organic non-humanoid forms (trees, tentacles, coral). Not suitable for armored humanoid characters.

---

## Analysis

### The Fundamental Tradeoff: Control vs. Quality

| Approach | Quality | AI Control | Setup | Cost |
|----------|---------|-----------|-------|------|
| KayKit GLBs | Good (stylized) | None (fixed assets) | Zero | Free |
| SDF + marching cubes | Medium (organic) | Full | None | Free |
| Blender headless | Excellent | Full | Medium | Free |
| AI visual feedback loop | Depends on base | Iterative | Medium | API cost |
| Text-to-3D APIs | Excellent | Prompt-only | Low | Per-gen |

For a tactics game, **KayKit + custom materials** is the 80/20 solution — real geometry, faction color swaps, Babylon.js PBR materials on top. For unique characters or procedural variety, **Blender headless** is the most powerful code-based path.

### The Vision Loop Actually Works

Multiple independent research papers (CADCodeVerify, DD3M, EvoCAD) confirm that the render → vision → refine loop converges. The key insight: don't ask the vision model to rewrite everything — ask it to produce a **structured diff** of specific parameter adjustments. "Increase left shoulder radius by 15%, elongate torso capsule by 0.1 units" is more actionable than "make it look better."

### Babylon.js + Blender is a Natural Fit

Babylon.js has excellent GLB/glTF support (`SceneLoader.ImportMeshAsync`). Blender's default export format is GLB. The pipeline is: write bpy script → run headless → load GLB → apply Babylon PBR materials + postprocessing. Each step is well-supported.

---

## Practical Takeaways

1. **Start with KayKit GLBs** — load Knight, Mage, Barbarian into the existing Babylon.js prototype first. This immediately fixes the cartoonish look with zero cost and 30 minutes of work.

2. **Add a GLB loader to the Babylon.js prototype** — replace `createUnitModel()` with `loadGLBUnit(url, faction)` that imports a GLB and swaps materials to faction colors.

3. **For the AI loop, use Puppeteer not headless-gl** — headless-gl is WebGL1 only, Puppeteer headless Chrome supports the full pipeline including Babylon.js postprocessing. Render the actual game scene, screenshot it, send to Claude vision.

4. **For SDF mesh generation in-browser**, the pattern is: define `sdf(x,y,z)` function in JS → polygonize with `mikolalysenko/isosurface` → create `BufferGeometry` / `BABYLON.VertexData` from the output vertices/indices.

5. **For Blender headless**, install `bpy` via pip and test `blender --background --python test.py`. If Blender is already installed at `/Applications/Blender.app`, that's easier than the pip wheel.

6. **Text-to-3D APIs**: use for props (swords, shields, crates) where hit rates are higher. Batch-generate 10 variants, pick the best 1–2.

7. **The vision feedback loop prompt template**: "Here is a 3D character render. List geometric issues as JSON: `{issue: string, parameter: string, adjustment: number}`. Focus on: silhouette naturalness, proportion accuracy, missing anatomical landmarks."

---

## Sources

### Programmatic Mesh Generation
- `mikolalysenko/isosurface` — npm library for surface nets polygonization
- Inigo Quilez (iquilezles.org) — canonical SDF primitives and smooth operators
- Three.js MarchingCubes addon — browser-native metaballs/SDF polygonization
- `three-bvh-csg` — boolean mesh operations for Three.js
- Babylon CSG2 (manifold-3d WASM) — production CSG for Babylon.js
- `three-subdivide` — Loop subdivision algorithm for Three.js

### AI Visual Feedback Loop
- CADCodeVerify (ICLR 2025) — LLM+vision loop for CAD code verification
- DD3M — commercial product built on the same render-verify-refine pattern
- EvoCAD, Idea23D — research pipelines combining code gen with visual analysis
- `stackgl/headless-gl` — WebGL1 in Node.js without a browser

### Text-to-3D
- Meshy AI (meshy.ai) — REST API, best documentation for developers
- Tripo AI (tripo3d.ai) — best character topology, v3.0 Ultra model, auto-rigging
- TRELLIS.2 (Microsoft Research) — open-source MIT, 4B params, self-hostable
- Rodin/Hyper3D — best texture quality

### Blender Headless
- Blender Python API docs (docs.blender.org/api) — `bpy` module reference
- MPFB2 (makehuman.org) — parametric human generation in Blender
- NodeToPython addon — export Geometry Nodes as Python code
- LL3M paper (Aug 2025) — multi-agent LLM system for Blender mesh generation

### Free Runtime Models
- KayKit Character Pack Adventures (github.com/KayKit-Game-Assets) — CC0, CORS-open GLBs
- Quaternius (quaternius.com) — CC0 RPG character and animation packs
- Poly Pizza (polypizza.run) — CC0 3D models, web-accessible
- Sketchfab — free tier, many CC0 downloadable as GLB

---

## Open Questions

- KayKit URL stability: raw.githubusercontent.com URLs should be stable but are not a CDN — load times may vary. Consider bundling the GLBs locally.
- Tripo auto-rigging quality: character meshes from text-to-3D APIs often have topology that breaks at joints during animation. Needs testing with actual animation clips.
- Puppeteer in the project context: headless Chrome adds significant complexity if this is a pure frontend project. Evaluate whether a Node.js backend is acceptable for the loop.
- TRELLIS.2 self-hosting: requires A100-class GPU (~$2/hr on cloud). Cost-effective for batch generation, not for real-time iteration.

---

## Confidence Assessment

**Strong consensus**: KayKit GLB loading, Blender headless pipeline, Meshy/Tripo APIs — multiple independent sources, clear implementations.

**Moderate**: SDF + marching cubes for humanoid characters — technique is proven, but humanoid proportions require careful SDF parameter tuning; no reference implementation for game-character-quality output at typical game resolution.

**Moderate**: AI visual feedback loop convergence — proven in research papers but all papers used proprietary setups; Puppeteer + Claude Vision hasn't been tested in this specific workflow (though all components exist and work).

**Weak**: TRELLIS.2 usability for games — paper shows impressive quality but self-hosting complexity and GPU cost make it impractical for most game dev contexts in 2026.
