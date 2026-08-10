# ConstructionOS

ConstructionOS is a simple, fast construction project management platform designed to keep the full project lifecycle connected in one workspace.

## Product vision

**Contract → BOQ → Planning → Execution → Measurement → Materials → Billing → Reconciliation → Handover**

The goal is to reduce disconnected Excel files, repeated data entry, quantity mismatches, billing errors and scattered project documents.

## Current foundation

- Responsive construction-focused dashboard
- Project creation and project overview
- Project search
- Project lifecycle navigation
- Mobile-friendly UI
- Local persistence for the first prototype
- Netlify-ready Vite build

## Roadmap

1. Authentication and user roles
2. Cloud database and persistent multi-device data
3. Project setup and contract management
4. BOQ import, editing and quantity control
5. Planning and work packages
6. DPR, site progress and measurement/MB
7. Material inventory and reconciliation
8. Contractor/subcontractor management
9. RA bills, client bills and payment tracking
10. Variation and extra-item control
11. Final reconciliation and final bill
12. Documents, reports and project handover
13. AI-assisted billing and project risk insights

## Development

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Deployment

The `main` branch is intended to be the production source branch for Netlify.
