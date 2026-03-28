# Research: Browser Graphics Engine for a Beautiful Grid Tactics Game

_Generated 2026-03-25_

## TL;DR

**Babylon.js is the strongest choice for a 3D grid tactics game maintained by an AI coding assistant.** It has the most complete built-in feature set (PBR, post-processing pipeline, GPU particles, shadows, physics — all first-party), requires the least code for impressive visual results (~60–80 lines vs ~120–180 for Three.js), and its `DefaultRenderingPipeline` collapses bloom + DOF + chromatic aberration + grain + FXAA into property toggles on a single object. Three.js has 270x more training data (5.5M vs ~14K weekly npm downloads) making AI code generation more reliable out of the box, but requires assembling third-party libraries for every game feature. If you're open to stylized 2D, **PixiJS v8** is a dark horse — its filter system, 175x static-sprite speedup, and render groups make it the best 2D engine ever built, and "beautiful 2D beats mediocre 3D" is empirically confirmed by the market (Into the Breach, Slay the Spire, Darkest Dungeon).

---

## Key Findings

### Visual Quality Ceiling

**Babylon.js 8.0 (released March 27, 2025) is a major leap:**
- PBR with clearcoat, anisotropy, sheen, iridescence, subsurface scattering — all built-in
- IBL shadows (contributed by Adobe) — environment lighting now casts occlusion
- Area lights (rectangular) — soft, realistic light emission
- Node Material Editor outputs WGSL natively for WebGPU
- Node Render Graph (alpha) — full custom rendering pipeline as a visual graph
- `DefaultRenderingPipeline`: bloom, DOF, chromatic aberration, grain, FXAA, MSAA, tone mapping, color grading — all as property toggles on one object (~20 lines total)
- SSAO via `SSAO2RenderingPipeline` (bilateral filter, 16 samples)
- SSR via dedicated `SSRRenderingPipeline`
- GPU particle system with transform feedback (simulation runs entirely on GPU)
- Cascaded Shadow Maps with PCF, PCSS, ESM filtering

**Three.js enhanced can reach the same visual ceiling, but requires assembly:**
- `MeshPhysicalMaterial` matches Babylon's PBR (clearcoat, sheen, iridescence, transmission, anisotropy)
- `pmndrs/postprocessing` library is essential — merges multiple effects into a single render pass (5 effects = ~1 extra pass vs 5 in built-in EffectComposer)
- N8AO provides temporally-stable SSAO significantly better than Three.js built-in
- `three.quarks` for VFX particles (trail rendering, sprite sheets, 20+ behaviors)
- TSL (Three Shading Language) — JavaScript-native shaders compiling to GLSL/WGSL, production-ready since r166+
- SSGI now available as a first-class addon (`SSGINode`)
- WebGPU renderer production-ready since r171 (Sept 2025) with automatic WebGL fallback
- Selective bloom requires a dual-composer workaround (~80 lines of boilerplate) — a known pain point

**PlayCanvas has competitive rendering but is editor-first:**
- Clustered forward rendering supports hundreds of dynamic lights
- Full post-processing via `CameraFrame` system (SSAO, bloom, DOF, TAA, color grading)
- GPU compute particles (1M particles demonstrated)
- Code-only usage works but the API is designed for the visual editor — `mat.update()` required after every property change, verbose entity-component boilerplate
- ~2.1 MB minified bundle (heaviest option)

**PixiJS v8 redefines 2D rendering:**
- 175x speedup for static sprites (21ms → 0.12ms for 100k sprites) via dirty tracking
- Render Groups offload transform/tint/alpha to GPU — panning the game camera costs one GPU operation regardless of children
- 40+ filter effects: GlowFilter, ShockwaveFilter, GodrayFilter, AdvancedBloomFilter, DisplacementFilter, OutlineFilter
- ParticleContainer handles 1M particles at 60fps on M3 MacBook
- Spine integration is 50% faster in v8 with physics-driven secondary motion
- `PerspectiveMesh` for faux-3D isometric without a 3D engine

### AI Code Generation Ergonomics

| Dimension | Three.js | Babylon.js | PlayCanvas | PixiJS |
|---|---|---|---|---|
| Weekly npm downloads | 5,500,000 | ~14,000 | ~3,300 | ~276,000 |
| GitHub stars | ~110,000 | ~24,400 | ~14,600 | ~45,600 |
| Written in TypeScript | No (types added) | Yes (source of truth) | Yes | Yes (v8) |
| Batteries included | Low (rendering only) | High (full game engine) | High (full game engine) | Low (rendering only) |
| Tribal knowledge required | High | Low | Medium | Medium |
| API stability | Breaking changes every few releases | Highly stable (Microsoft-backed) | Stable | v7→v8 was a major breaking rewrite |

**Key insight**: Three.js has far more training data, so AI generates it more reliably. But Babylon.js requires less tribal knowledge — its explicit, verbose, typed API means when the AI gets it right, it stays right. PixiJS uniquely publishes `llms.txt` files (daily-updated, structured documentation for LLM context windows) to address the v7/v8 training data gap.

**Babylon.js community warning**: A forum thread directly about AI tools states: "ChatGPT is just guessing the solution by combining code fragments... spilling out code with non-existing classes and functions." The smaller training corpus is a real limitation. Mitigation: inject Babylon.js documentation into AI context (their docs are excellent and well-structured).

### CDN / Single-File Viability

| Engine | CDN file | Minified | ~Gzipped | Single-file story |
|---|---|---|---|---|
| Three.js | `three.module.min.js` | 350 KB | ~125 KB | Excellent — importmap, all addons via CDN |
| Babylon.js | `babylon.js` (UMD) | ~1.4 MB | ~400 KB | Good — single script tag, but officially "not for production" |
| PlayCanvas | `playcanvas.min.mjs` | 2.1 MB | ~300 KB | Good — officially documented importmap workflow |
| PixiJS | `pixi.min.mjs` | 769 KB | ~200 KB | Good — single import covers core; filters need separate imports |

**Three.js** wins on raw CDN weight and the cleanest importmap pattern. **Babylon.js** is the simplest setup (one script tag) but their docs explicitly warn CDN is for learning/experiments, not production. **PixiJS** UMD script tag is more reliable than ESM for no-build (known v8 ESM CDN bugs).

### Performance for a Grid Tactics Game

**Instancing is the decisive optimization.** A 20×20 grid = 400 draw calls without instancing → 1–2 draw calls with instancing. All engines support it:
- Three.js `InstancedMesh` — needs manual per-instance frustum culling (naive instancing can be *slower* than individual meshes)
- Babylon.js Thin Instances — measured 219M vertices at 40 FPS (Radeon) / 110–144 FPS (RTX 3080). `freezeWorldMatrix()` + `material.freeze()` gave 4x improvement on mobile
- PlayCanvas batching — up to 1,024 instances per batch, 60–80% draw call reduction

**WebGPU is production-ready** (all major browsers since late 2025):
- Draw-call-heavy scenes: 2–10x gains over WebGL
- Compute particles: 15–30x faster (100K particles in <2ms vs 10K particles in 30ms on CPU)
- Babylon.js Snapshot Rendering (render bundles): ~10x for semi-static scenes — exactly the profile of a tactics grid
- Three.js WebGPU caveat: simple scenes can be 4x *slower* than WebGL due to API overhead (GitHub issue #31055, open)

**Mobile budget**: Target 100–200 draw calls for low-end mobile. With instancing, a grid tactics game fits easily.

### What Makes Tactics Games Look Beautiful

Research into the best-looking tactics games reveals beauty decomposes differently than in action games:

1. **Readability is beauty #1** — If you can't parse board state at a glance, every other visual investment is wasted
2. **Lighting does the heavy lifting** — Rim/fill lights that pop units from the environment consistently distinguishes polished from mediocre
3. **Attack animations are the moment of delight** — Players spend 80% of time reading; the attack animation is the payoff
4. **Particle effects signal consequence** — Even in pixel art (Into the Breach), screen shake and particle bursts are enough
5. **Consistent art style > raw resolution** — Into the Breach at 16×16 pixels looks more intentional than many 3D games

**Surprise finding**: Wartales (widely cited as beautiful grid tactics) runs on Heaps.io — an open-source Haxe engine with a WebGL2 backend. Not Unity or Unreal. The "beautiful grid tactics" aesthetic is achievable without a heavyweight engine.

### Lines of Code to an Impressive Scene

| Engine | Lines for PBR + bloom + shadows + particles | Notes |
|---|---|---|
| Babylon.js | ~60–80 | `DefaultRenderingPipeline` does the heavy lifting |
| PixiJS (2D) | ~50–80 | Filters + ParticleContainer; no 3D equivalent |
| Three.js | ~120–180 | Selective bloom alone is ~80 lines |
| PlayCanvas | ~200–300 | API designed for editor, verbose in code-only |

---

## Analysis

### The 2D vs 3D Decision

Your game analysis doc nails it: "every acclaimed solo-dev game is 2D or minimal-3D with strong art direction." The research confirms this empirically — Into the Breach, Slay the Spire, Darkest Dungeon, and Balatro all use stylized 2D and all reviewed/sold better than many 3D tactics contemporaries.

The art asset burden difference is **exponential**: a 2D unit sprite is one image (or one Spine animation); a 3D unit is a mesh + UV + texture + rig + 20 animations + LODs. For 50 unit types, the 3D pipeline is 50× more expensive in every dimension.

However, 3D with strong art direction (your current Three.js approach) is viable — the key is not to attempt photorealism but to use 3D for what it gives you (camera angles, lighting drama, depth) while keeping asset complexity low (low-poly, stylized materials, procedural where possible).

### Babylon.js vs Three.js: The Core Tradeoff

**Babylon.js advantages for this project:**
- `DefaultRenderingPipeline` eliminates the biggest source of boilerplate
- GPU particle system is first-party (no third-party dependency)
- TypeScript-first means fewer AI-generated type errors
- Scene optimizer, automatic culling, thin instances are correct-by-default for game scenes
- More mature WebGPU backend (native WGSL, Snapshot Rendering)
- Built-in physics, GUI, animation system

**Three.js advantages for this project:**
- 270x more training data = more reliable AI code generation
- Lighter weight (125 KB gzipped vs ~400 KB)
- More community examples of creative/experimental visual work
- pmndrs ecosystem (postprocessing, drei, three.quarks) is excellent
- TSL shaders are JavaScript — better for AI than GLSL strings
- You already have a working Three.js codebase

**The honest assessment**: If starting fresh, Babylon.js is the better foundation for a game. But you already have a Three.js game working. Migrating is a non-trivial cost. The enhanced Three.js path (add pmndrs/postprocessing, N8AO, three.quarks) could get you 80% of Babylon's visual quality with 20% of the migration effort.

### WebGPU: Ready but Not Required

WebGPU achieved full cross-browser support in late 2025. Both Three.js (r171+) and Babylon.js (8.0+) support it with automatic WebGL fallback. For a new project, target WebGPU and accept the fallback. Don't optimize for WebGPU-specific features until WebGL performance is saturated.

The specific WebGPU wins for a tactics game: render bundles for the static grid (~10x), compute particles for spell effects (~15-30x), and instancing via storage buffers (eliminates CPU stalls).

---

## Practical Takeaways

1. **If you want the best visual result with least code**: Babylon.js. The `DefaultRenderingPipeline` + PBR + GPU particles gets you a cinematic scene in ~60 lines. The tradeoff is smaller AI training corpus.

2. **If you want to enhance what you have**: Keep Three.js, add `pmndrs/postprocessing` (effect merging), N8AO (SSAO), `three.quarks` (particles), and `MeshPhysicalMaterial` (advanced PBR). This is the lowest-risk path.

3. **If you're open to a radical direction shift**: PixiJS v8 with stylized 2D. Beautiful 2D demonstrably beats mediocre 3D. The filter system (glow, shockwave, godray, bloom) creates "juice" that makes simple sprites feel alive. Art direction becomes the differentiator, not rendering tech.

4. **Skip PlayCanvas** for this project — its strengths (collaborative editor, asset pipeline) don't apply to AI-maintained code-only development, and its code-first DX is the worst of the four.

5. **Target WebGPU with WebGL fallback** regardless of engine choice. Both Three.js and Babylon.js make this transparent. Don't wait — the cross-browser support gap is closed.

6. **For the experiment folder**: Build two prototypes — one Babylon.js scene and one enhanced Three.js scene (with postprocessing + particles). Compare visual quality and code maintainability side by side. This is the fastest way to make the decision concrete.

---

## Sources

### Babylon.js
- [Babylon.js 8.0 Announcement — Windows Developer Blog](https://blogs.windows.com/windowsdeveloper/2025/03/27/announcing-babylon-js-8-0/)
- [Introducing Babylon.js 8.0 — Medium](https://babylonjs.medium.com/introducing-babylon-js-8-0-77644b31e2f9)
- [Master PBR Materials — Official Docs](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/masterPBR)
- [DefaultRenderingPipeline — Official Docs](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/defaultRenderingPipeline)
- [RSM Global Illumination — Official Docs](https://doc.babylonjs.com/features/featuresDeepDive/lights/rsmgi)
- [SSR Rendering Pipeline — Official Docs](https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/SSRRenderingPipeline)
- [GPU Particles — Official Docs](https://github.com/BabylonJS/Documentation/blob/master/content/features/featuresDeepDive/particles/particle_system/gpu_particles.md)
- [Node Material Editor — Official Docs](https://doc.babylonjs.com/toolsAndResources/nme)
- [Cascaded Shadow Maps — Official Docs](https://doc.babylonjs.com/features/featuresDeepDive/lights/shadows_csm)
- [Why Do Three.js Demos Look More Impressive? — Babylon.js Forum](https://forum.babylonjs.com/t/why-do-three-js-demos-often-look-more-visually-impressive-than-babylon-js/57974)
- [About AI Coding Tools — Babylon.js Forum](https://forum.babylonjs.com/t/about-ai-coding-tools/62238)
- [GPU Instances Fun Fact — Babylon.js Forum (219M vertices benchmark)](https://forum.babylonjs.com/t/gpu-instances-fun-fact/22066)
- [Hex Grid Performance — Babylon.js Forum](https://forum.babylonjs.com/t/performance-what-is-eating-up-frametime-in-this-scene-with-only-simple-3d-hexagon-meshes/25196)
- [Snapshot Rendering WebGPU — Official Docs](https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUSnapshotRendering)

### Three.js
- [pmndrs/postprocessing — GitHub](https://github.com/pmndrs/postprocessing)
- [N8AO — GitHub](https://github.com/N8python/n8ao)
- [Three.js Shading Language Wiki](https://github.com/mrdoob/three.js/wiki/Three.js-Shading-Language)
- [CustomShaderMaterial — GitHub](https://github.com/FarazzShaikh/THREE-CustomShaderMaterial)
- [three.quarks VFX Engine — GitHub](https://github.com/Alchemist0823/three.quarks)
- [Three.js WebGPURenderer Docs](https://threejs.org/docs/pages/WebGPURenderer.html)
- [WebGPU Performance Issue — GitHub #31055](https://github.com/mrdoob/three.js/issues/31055)
- [InstancedMesh2 with BVH Culling — Three.js Forum](https://discourse.threejs.org/t/three-ez-instancedmesh2-enhanced-instancedmesh-with-frustum-culling-fast-raycasting-bvh-sorting-visibility-management-lod-skinning-and-more/69344)
- [Migrate Three.js to WebGPU — utsubo.com](https://www.utsubo.com/blog/webgpu-threejs-migration-guide)
- [100 Three.js Tips — utsubo.com](https://www.utsubo.com/blog/threejs-best-practices-100-tips)
- [SSGI Discussion — Three.js Forum](https://discourse.threejs.org/t/ssgi-screen-space-global-illumination/85190)

### PixiJS
- [PixiJS v8 Launch Blog](https://pixijs.com/blog/pixi-v8-launches)
- [PixiJS Render Groups Guide](https://pixijs.com/8.x/guides/concepts/render-groups)
- [PixiJS Filters — GitHub](https://github.com/pixijs/filters)
- [ParticleContainer v8 Blog](https://pixijs.com/blog/particlecontainer-v8)
- [PixiJS Spine Integration](https://pixijs.com/blog/pixi-js-hearts-spine)
- [PixiJS LLM Documentation](https://pixijs.com/llms)
- [PixiJS Showcase](https://pixijs.com/showcase)

### PlayCanvas
- [PlayCanvas Standalone Engine Docs](https://developer.playcanvas.com/user-manual/engine/standalone/)
- [PlayCanvas Clustered Lighting](https://developer.playcanvas.com/user-manual/graphics/lighting/clustered-lighting/)
- [PlayCanvas Engine 2.0.0 — Blog](https://blog.playcanvas.com/playcanvas-engine-hits-2-0-0/)
- [PlayCanvas WebGPU Support — Blog](https://blog.playcanvas.com/build-webgpu-apps-today-with-playcanvas/)

### WebGPU
- [WebGPU Hits Critical Mass — webgpu.com](https://www.webgpu.com/news/webgpu-hits-critical-mass-all-major-browsers/)
- [WebGPU Supported in Major Browsers — web.dev](https://web.dev/blog/webgpu-supported-major-browsers)
- [Can I Use — WebGPU](https://caniuse.com/webgpu)
- [From WebGL to WebGPU — Chrome Developers](https://developer.chrome.com/docs/web-platform/webgpu/from-webgl-to-webgpu)

### Tactics Game Visual References
- [Shiro Games Technology Stack (Wartales/Heaps.io)](https://haxe.org/blog/shirogames-stack/)
- [Into the Breach Engine Discussion — Steam](https://steamcommunity.com/app/590380/discussions/0/1692662484260323977/)
- [Best-Looking Turn-Based Strategy Games](https://turnbasedlovers.com/lists/the-10-best-looking-turn-based-rpgs-and-strategy-games-ever-made/)

### Comparisons & Benchmarks
- [Three.js vs Babylon.js vs PlayCanvas 2026 — utsubo.com](https://www.utsubo.com/blog/threejs-vs-babylonjs-vs-playcanvas-comparison)
- [Three.js vs Babylon.js — LogRocket](https://blog.logrocket.com/three-js-vs-babylon-js/)
- [js-game-rendering-benchmark — GitHub](https://github.com/Shirajuki/js-game-rendering-benchmark)
- [Best JS Game Engines 2025 — LogRocket](https://blog.logrocket.com/best-javascript-html5-game-engines-2025/)
- [npmtrends: babylonjs vs pixi.js vs three](https://npmtrends.com/babylonjs-vs-pixi.js-vs-three)

---

## Open Questions

1. **How well does Babylon.js code generation work in practice with Claude?** The training data gap is real but untested for this specific model + documentation injection combo. A quick spike (build one scene in Babylon.js) would answer this empirically.

2. **Is the Three.js → Babylon.js migration cost worth it?** The current game is ~110KB of working Three.js code. Rewriting the renderer is non-trivial. The enhanced-Three.js path may deliver enough visual improvement without the migration risk.

3. **Could PixiJS 2D actually produce a more compelling game?** The game analysis doc's own principles argue for it. But the current game has 3D camera angles and isometric perspective that would need to be reconceived.

4. **What does the art direction look like?** No rendering engine solves art direction. The research shows that lighting, attack animations, and consistent style matter more than shader complexity. This is the design question underneath the tech question.

---

## Confidence Assessment

- **Strong consensus**: WebGPU is cross-browser ready; Babylon.js has the most built-in features; Three.js has the most training data; PixiJS v8 is a generational leap for 2D
- **Moderate**: Babylon.js AI code generation quality (inferred from training data volume, not tested); performance parity between engines when equally optimized
- **Weak/conflicting**: Whether 2D or 3D is the right call for this specific game (depends on creative vision, not tech capabilities)
