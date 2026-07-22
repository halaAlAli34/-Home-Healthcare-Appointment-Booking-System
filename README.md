# Hearth.care — Admin (Mohammad's part, frontend only)

This covers your slice of the project: **Services & Admin**.

- Admin Dashboard (stats + appointments needing a decision)
- Manage Services (list, add, edit, delete — via modal)
- Manage Appointments (tabs for pending/accepted/rejected/all, accept/reject)

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- No database yet — this is frontend-only per your request. All data lives in
  `lib/mock-data.ts` and is held in React state (`useState`), so refreshing the
  page resets it. Swapping in real data later means wiring these to your API
  routes and dropping the mock imports.

## Visual language

Matched to the existing app (Hala's public pages / your teammates' screens):
cream background, dark forest-green primary, serif display headings (Lora)
over an Inter body, pill-shaped buttons, soft white cards. Tokens live in
`tailwind.config.ts` (`cream`, `hearth`, `ink`, `pending`, `danger`) — reuse
these classes rather than one-off hex values so the whole app stays visually
consistent as more pages get built.

## Run it

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — it redirects straight to `/admin/dashboard`.

## File map (matches the plan doc)

```
app/
  admin/
    layout.tsx              # shared admin nav shell
    dashboard/page.tsx
    services/page.tsx
    appointments/page.tsx
components/
  admin/
    AdminNav.tsx
    DashboardCard.tsx
    ServiceCard.tsx
    ServiceModal.tsx         # add + edit, same modal
    StatusBadge.tsx
    AppointmentRow.tsx
lib/
  types.ts                   # Service, Appointment, DashboardStats
  mock-data.ts                # stand-in for serviceController/adminController
```

## Next steps (when the backend lands)

- `models/Service.ts`, `controllers/serviceController.ts`,
  `routes/serviceRoutes.ts` per the plan doc.
- Replace `initialServices` / `initialAppointments` with fetches to
  `Get Services`, `Add/Update/Delete Service`, `Accept/Reject Appointment`,
  `Dashboard Stats`.
- Consider React Query or SWR for the fetch/mutate/cache layer once real
  endpoints exist — the current `useState` calls are placeholders for that.
