# Frontend Architecture & Workspace Rules

## 1. Safety Invariants
- DO NOT modify `prisma/schema.prisma`.
- DO NOT alter backend route handlers inside `src/app/api/*`.
- All forms and mutation payloads MUST be validated using **Zod** schemas.

## 2. Validation & Libraries
- Form validation: **Zod** (`npm install zod`) with standard inferred types (`z.infer<typeof schema>`).
- UI styling: Tailwind CSS with dark slate tokens (`#0B0D11`, `#14171F`, `#222735`, `#10B981`).
- Icon library: Lucide React (or standard SVGs).

## 3. Mandatory Directory Structure
You must structure all new frontend code strictly according to this layout:

src/
├── app/
│   ├── (app)/
│   │   ├── admin/
│   │   │   ├── layout.tsx                # Fixed Admin Sidebar layout
│   │   │   ├── page.tsx                  # Redirects to /admin/review
│   │   │   ├── discover/page.tsx         # Trigger collection tool
│   │   │   ├── review/
│   │   │   │   ├── page.tsx              # Active Review Queue workspace
│   │   │   │   └── [walkthroughId]/page.tsx
│   │   │   ├── published/page.tsx        # Published list management
│   │   │   ├── link-health/page.tsx      # Dead link monitoring
│   │   │   └── categories/page.tsx       # Taxonomy categories
│   │   ├── page.tsx                      # Public Search Engine view
│   │   └── layout.tsx
├── components/
│   ├── ui/                               # Atomic primitives (button, badge, input, slider, switch)
│   ├── admin/                            # Admin components (AdminSidebar, ReviewActiveCard, PendingTable)
│   └── search/                           # Search components (SearchHero, FilterSidebar, WalkthroughCard)
├── lib/
│   ├── api-client.ts                     # Fetch client targeting /api/admin/* and /api/walkthroughs/*
│   ├── validations/                      # Zod schemas for forms, reviews, and search queries
│   │   ├── admin.ts                      # Zod schema for ReviewActionPayload & IngestPayload
│   │   └── search.ts                     # Zod schema for search params & query filters
│   └── utils.ts
├── hooks/
│   ├── useAdminQueue.ts                  # Admin review queue fetch and mutations
│   └── useWalkthroughSearch.ts           # Debounced search & facet state
└── types/
    └── walkthrough.ts                    # Inferred types from Zod schemas & backend models

## 4. Execution Workflow
1. Run exploration/plan: generate an Artifact showing which files will be created.
2. Confirm the Zod validation schemas.
3. Wait for user approval before writing code.