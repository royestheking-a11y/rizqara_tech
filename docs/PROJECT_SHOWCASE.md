# Project showcase

The homepage and Projects page share a responsive maroon-and-white showcase with a wide featured project, large previews, hover motion, search, filters and incremental loading. Existing database project records are unchanged.

50 independent visual concepts (30 mobile apps and 20 websites) are defined in `src/data/project-concepts.json`. These are clearly labelled Concept on cards and detail pages. They have no fabricated client identities, results, testimonials or live links. Proposed features and technology are illustrative, not claims of implemented functionality.

Original SVG interface illustrations are in `public/images/projects/concepts/`. Regenerate the source catalog and artwork with `python3 scripts/build-project-concepts.py` from the repository root. These concepts are maintained in source, separately from the admin-managed database portfolio. Production route metadata recognizes their URLs.

Validation: TypeScript, production build, 20 integration tests; browser checks for category filters, search and concept detail routes.

## Editorial redesign

The showcase now includes a manually selectable four-project spotlight, perspective artwork, an asymmetric collection layout, and feature tags. Concept thumbnails are live HTML/CSS device compositions (`ConceptPreview.tsx`) with coordinated maroon tones; the original SVG assets remain available. Concept detail pages (`ConceptDetail.tsx`) include a large device scene, opportunity brief, proposed user journeys, design direction, scope, and next steps. These are illustrative proposals, not validated case studies. Reduced-motion users do not receive animated transformations.
