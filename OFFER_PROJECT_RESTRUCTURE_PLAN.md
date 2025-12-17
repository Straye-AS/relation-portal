# Offer-Project Restructure Implementation Plan

## Overview

This document outlines the frontend changes needed to support the backend restructuring where:

- **Offers** now handle the full lifecycle including execution tracking (phases: draft → in_progress → sent → order → completed)
- **Projects** become simple folders/containers for grouping offers (no execution tracking)

---

## Backend Changes Summary

### Offer Phase Changes

| Old         | New                 |
| ----------- | ------------------- |
| draft       | draft               |
| in_progress | in_progress         |
| sent        | sent                |
| **won**     | **order** (renamed) |
| lost        | lost                |
| expired     | expired             |
| -           | **completed** (new) |

### New Offer Execution Fields

```typescript
managerId?: string;
managerName?: string;
teamMembers?: string[];
spent?: number;
invoiced?: number;
orderReserve?: number;  // Calculated: value - invoiced
health?: "on_track" | "at_risk" | "delayed" | "over_budget";
completionPercent?: number;
startDate?: string;
endDate?: string;
estimatedCompletionDate?: string;
```

### New API Endpoints for Offers

- `POST /offers/{id}/accept-order` - Transition sent → order
- `PUT /offers/{id}/health` - Update health & completion percent
- `PUT /offers/{id}/spent` - Update spent amount
- `PUT /offers/{id}/invoiced` - Update invoiced amount
- `POST /offers/{id}/complete` - Transition order → completed

### Project Simplification

**Removed from Project:**

- companyId, value, cost, marginPercent, spent, invoiced, orderReserve
- managerId, managerName, teamMembers, health, completionPercent
- hasDetailedBudget, winningOfferId, inheritedOfferNumber, wonAt

**New Project Phases:**
| Old | New |
|-----|-----|
| tilbud | tilbud |
| **active** | **working** (renamed) |
| - | **on_hold** (new) |
| completed | completed |
| cancelled | cancelled |

---

## Implementation Tasks

### Phase 1: Type Definitions

#### 1.1 Update `types/index.ts`

**OfferPhase type:**

```typescript
export type OfferPhase =
  | "draft"
  | "in_progress"
  | "sent"
  | "order" // Replaces "won"
  | "completed" // New
  | "lost"
  | "expired";
```

**ProjectPhase type:**

```typescript
export type ProjectPhase =
  | "tilbud"
  | "working" // Replaces "active"
  | "on_hold" // New
  | "completed"
  | "cancelled";
```

**Offer interface - Add execution fields:**

```typescript
export interface Offer {
  // ... existing fields ...

  // Execution tracking (for order/completed phases)
  managerId?: string;
  managerName?: string;
  teamMembers?: string[];
  spent?: number;
  invoiced?: number;
  orderReserve?: number;
  health?: "on_track" | "at_risk" | "delayed" | "over_budget";
  completionPercent?: number;
  startDate?: string;
  endDate?: string;
  estimatedCompletionDate?: string;
}
```

**Project interface - Simplify:**
Remove: budget, spent, managerId, managerName, teamMembers, health, completionPercent

#### 1.2 Update `lib/api/types.ts`

**OFFER_PHASE_LABELS:**

```typescript
export const OFFER_PHASE_LABELS: Record<OfferPhase, string> = {
  draft: "Kladd",
  in_progress: "I gang",
  sent: "Sendt",
  order: "Ordre", // New label
  completed: "Ferdig", // New
  lost: "Tapt",
  expired: "Utgått",
};
```

**PROJECT_PHASE_LABELS:**

```typescript
export const PROJECT_PHASE_LABELS: Record<ProjectPhase, string> = {
  tilbud: "Tilbud",
  working: "I arbeid",
  on_hold: "På vent", // New
  completed: "Ferdig",
  cancelled: "Kansellert",
};
```

---

### Phase 2: New Components

#### 2.1 Create `components/offers/offer-health-badge.tsx`

New component for displaying offer health status:

```typescript
type OfferHealth = "on_track" | "at_risk" | "delayed" | "over_budget";

const HEALTH_LABELS: Record<OfferHealth, string> = {
  on_track: "På sporet",
  at_risk: "I risiko",
  delayed: "Forsinket",
  over_budget: "Over budsjett",
};

const HEALTH_COLORS: Record<OfferHealth, string> = {
  on_track: "bg-green-500/15 text-green-700",
  at_risk: "bg-yellow-500/15 text-yellow-700",
  delayed: "bg-orange-500/15 text-orange-700",
  over_budget: "bg-red-500/15 text-red-700",
};
```

#### 2.2 Update `components/offers/offer-status-badge.tsx`

Add new phase styles:

- `order`: amber/gold styling
- `completed`: emerald/green styling
- Map legacy "won" to "order" for backward compatibility

#### 2.3 Update `components/projects/project-phase-badge.tsx`

- Add `on_hold`: orange styling
- Change `active` to `working` or keep both for compatibility

---

### Phase 3: Hooks

#### 3.1 Add to `hooks/useOffers.ts`

```typescript
// Accept as order (sent → order)
export function useAcceptOrder() {
  return useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      const response = await api.offers.acceptOrderCreate({ id }, { notes });
      return response.data;
    },
    // invalidate queries, show toast
  });
}

// Complete offer (order → completed)
export function useCompleteOffer() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.offers.completeCreate({ id });
      return response.data;
    },
  });
}

// Update health status
export function useUpdateOfferHealth() {
  return useMutation({
    mutationFn: async ({ id, health, completionPercent }) => {
      const response = await api.offers.healthUpdate(
        { id },
        { health, completionPercent }
      );
      return response.data;
    },
  });
}

// Update spent amount
export function useUpdateOfferSpent() {
  return useMutation({
    mutationFn: async ({ id, spent }: { id: string; spent: number }) => {
      const response = await api.offers.spentUpdate({ id }, { spent });
      return response.data;
    },
  });
}

// Update invoiced amount
export function useUpdateOfferInvoiced() {
  return useMutation({
    mutationFn: async ({ id, invoiced }: { id: string; invoiced: number }) => {
      const response = await api.offers.invoicedUpdate({ id }, { invoiced });
      return response.data;
    },
  });
}
```

#### 3.2 Simplify `hooks/useProjects.ts`

**Remove these hooks (no longer needed):**

- `useInheritProjectBudget`
- `useResyncProjectFromOffer`
- `useProjectBudget`

---

### Phase 4: Offer Detail Page (`app/offers/[id]/page.tsx`)

#### 4.1 Update Phase Action Buttons

**For "sent" phase:**

```tsx
<DropdownMenuItem onClick={() => handleAcceptOrder()}>
  <Briefcase className="mr-2 h-4 w-4" />
  Konverter til ordre
</DropdownMenuItem>
```

**For "order" phase:**

```tsx
<Button onClick={() => handleComplete()}>
  <CheckCircle className="mr-2 h-4 w-4" />
  Marker som ferdig
</Button>
```

#### 4.2 Add Execution Tracking Section (for order phase)

New Card "Ordreoppfølging" visible when `offer.phase === "order"`:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Ordreoppfølging</CardTitle>
  </CardHeader>
  <CardContent className="space-y-6">
    {/* Health status dropdown */}
    <Select value={offer.health} onValueChange={updateHealth}>
      <SelectItem value="on_track">På sporet</SelectItem>
      <SelectItem value="at_risk">I risiko</SelectItem>
      <SelectItem value="delayed">Forsinket</SelectItem>
      <SelectItem value="over_budget">Over budsjett</SelectItem>
    </Select>

    {/* Completion percentage slider */}
    <Slider value={offer.completionPercent} max={100} />

    {/* Spent amount - editable */}
    <InlineEdit value={offer.spent} onSave={updateSpent} />

    {/* Invoiced amount - editable */}
    <InlineEdit value={offer.invoiced} onSave={updateInvoiced} />

    {/* Order reserve - read only */}
    <div>
      <Label>Ordrereserve</Label>
      <p className="text-2xl font-bold">
        {formatCurrency((offer.value || 0) - (offer.invoiced || 0))}
      </p>
    </div>
  </CardContent>
</Card>
```

#### 4.3 Update Locked State Logic

```typescript
const isLocked = offer?.phase === "completed" || offer?.phase === "lost";
const isInOrderPhase = offer?.phase === "order";
```

---

### Phase 5: Project Detail Page (`app/projects/[id]/page.tsx`)

**Remove the "Økonomi" (Finance) Card entirely:**

- Total kostnad, Total pris, Margin, Dekningsbidrag
- Hittil påløpte kostnader, Hittil fakturert
- Progress bars
- "Sync fra tilbud" button

**Keep:**

- Project info (name, customer, phase, manager, company, dates)
- Connected offers list
- Description editor

---

### Phase 6: Dashboard Components

#### 6.1 Update `components/dashboard/pipeline-overview.tsx`

```typescript
export const phaseLabels: Record<string, string> = {
  draft: "Forespørsel",
  in_progress: "I gang",
  sent: "Sendt",
  order: "Ordre", // New
  completed: "Ferdig", // New
  lost: "Tapt",
  expired: "Utgått",
};

export const phaseColors: Record<string, string> = {
  // ... existing ...
  order:
    "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900 dark:border-amber-600",
  completed:
    "bg-emerald-100 border-emerald-300 text-emerald-700 dark:bg-emerald-900 dark:border-emerald-600",
};

const phaseOrder: string[] = [
  "draft",
  "in_progress",
  "sent",
  "order",
  "completed",
  "lost",
];
```

#### 6.2 Update `components/dashboard/offer-stats-card.tsx`

Include "order" in statistics, add completed count.

#### 6.3 Simplify `components/dashboard/active-projects-card.tsx`

Remove budget/spent/health since projects no longer have these fields.
Consider repurposing to show "Active Orders" (offers in order phase).

---

### Phase 7: Offer Lists

#### 7.1 Update `components/offers/offer-row.tsx`

- Handle new phase badges
- Optionally show health badge for "order" phase offers
- Show completion percentage indicator

#### 7.2 Update `app/offers/page.tsx`

- Ensure filters include new phases (order, completed)
- Update any phase-specific filter logic

---

## File Change Summary

| File                                            | Action                                        | Priority |
| ----------------------------------------------- | --------------------------------------------- | -------- |
| `types/index.ts`                                | Modify - Update phase types, add offer fields | High     |
| `lib/api/types.ts`                              | Modify - Update phase labels                  | High     |
| `components/offers/offer-health-badge.tsx`      | Create - New component                        | High     |
| `components/offers/offer-status-badge.tsx`      | Modify - Add new phases                       | High     |
| `components/projects/project-phase-badge.tsx`   | Modify - Add on_hold                          | Medium   |
| `hooks/useOffers.ts`                            | Modify - Add 5 new hooks                      | High     |
| `hooks/useProjects.ts`                          | Modify - Remove 3 hooks                       | Medium   |
| `app/offers/[id]/page.tsx`                      | Major - Add execution tracking UI             | High     |
| `app/projects/[id]/page.tsx`                    | Major - Remove finance section                | High     |
| `components/dashboard/pipeline-overview.tsx`    | Modify - Update phases                        | Medium   |
| `components/dashboard/offer-stats-card.tsx`     | Modify - Update stats                         | Medium   |
| `components/dashboard/active-projects-card.tsx` | Simplify/Remove                               | Low      |
| `components/offers/offer-row.tsx`               | Modify - Handle new phases                    | Medium   |
| `app/offers/page.tsx`                           | Modify - Update filters                       | Low      |

---

## Testing Checklist

- [ ] Offer transitions work: draft → in_progress → sent → order → completed
- [ ] Offer transition works: sent → lost
- [ ] Health status updates work on "order" phase offers
- [ ] Spent and invoiced updates work on "order" phase offers
- [ ] Project detail page no longer shows execution tracking
- [ ] Dashboard pipeline shows all phases correctly
- [ ] Phase badges display correct Norwegian labels
- [ ] Build completes without errors
- [ ] Type checking passes

---

## Notes

- The generated API types in `lib/.generated/` already contain the new phases (DomainOfferPhase.OfferPhaseOrder, etc.)
- Norwegian labels: "Ordre" for order, "Ferdig" for completed, "På vent" for on_hold
- Backward compatibility: Map "won" → "order" in UI components where needed
