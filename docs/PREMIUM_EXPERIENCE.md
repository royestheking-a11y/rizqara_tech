# Maroon & white dimensional enhancement

This is an additive visual layer over the existing site. The original accordion hero, all existing Home sections, navigation destinations, forms, pricing information, portfolio content, chatbot, and English/Bengali content remain in place. The admin design and backend access controls are unchanged.

## Visual behavior

- Floating glass navigation with an extruded brand mark, dimensional active pill and scroll progress.
- Original accordion hero with glass edges, controlled highlight sweep and richer depth.
- Real, interactive Three.js engineering model: Architecture, Intelligence and Engineering representations; drag, pause and reset controls. The models are illustrative technology visuals, not live business metrics.
- Pointer lighting and restrained perspective on service, project, process, guarantee, feature, video, blog, pricing and impact cards.
- Scroll entrances, maroon title accents and coordinated case-study, testimonial, form and footer surfaces.
- Animated technology/client strips pause on hover or keyboard focus and while outside the viewport.

## Implementation

- `src/styles/premium-experience.css`: scoped visual tokens and progressive enhancement. Existing content/style utilities are preserved.
- `src/components/experience/PremiumExperience.tsx`: scroll/pointer interactions and lazy scene mounting.
- `src/components/experience/TechCore.tsx`: WebGL scene, input and resource lifecycle.
- `src/components/experience/CoreFallback.tsx`: CSS 3D visual when WebGL or the scene chunk is unavailable.

The Three.js bundle loads only as the engineering section approaches the viewport. Rendering pauses while the scene is offscreen, the tab is hidden, or the user pauses it. Pixel density is capped at 1.5; GPU resources/listeners are released when the scene unmounts. A scene-local error boundary prevents a rendering failure from replacing the rest of the website.

Device reduced-motion preferences stop the new automatic scene rotation, reveal movement, perspective pointer effects, hero highlight sweep and marquee movement. The page remains readable without a successful JavaScript animation. Touch devices retain normal scrolling, with horizontal/direct drag interaction on the model.

## Validation

The development preview was inspected at desktop (1440 px) and mobile (390 px), including actual WebGL rendering, model selection, drag, pause, navigation and horizontal overflow. Original content section counts and business copy were checked against the pre-enhancement checkpoint. TypeScript, production build and the existing integration suite are run as regression checks. OS reduced-motion emulation and a complete cross-device performance audit are not claimed.

A local checkpoint of the previous design is retained in `.local-data/pre-premium-enhancement/` for straightforward rollback. This enhancement is local; no production deployment is performed.
