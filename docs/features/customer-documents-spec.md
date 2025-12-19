# Feature Specification: Dokumenter Tab (Customer Documents)

## Overview

Add a "Dokumenter" tab to the customer detail page that allows users to upload, download, and manage documents associated with a customer. The tab displays both customer-level documents and documents attached to the customer's offers/projects.

## Requirements Summary

| Aspect       | Decision                                                |
| ------------ | ------------------------------------------------------- |
| Association  | Both customer-level AND aggregated from offers/projects |
| File types   | Any file type (no restrictions)                         |
| Preview      | Download only (no inline preview)                       |
| Organization | Flat list (sortable by date/name)                       |

---

## User Stories

1. **As a user**, I want to upload documents directly to a customer so I can store contracts, correspondence, and other customer-related files.

2. **As a user**, I want to see all documents related to a customer in one place, including documents attached to their offers and projects.

3. **As a user**, I want to download any document with a single click.

4. **As a user**, I want to delete documents I've uploaded to a customer.

5. **As a user**, I want to see when a document was uploaded and by whom.

---

## UI Design

### Tab Placement

```
Tabs: [Oversikt] [Prosjekter] [Tilbud] [Dokumenter] [Kontakter]
                                        ^^^^^^^^^^^
                                        NEW TAB
```

### Tab Content Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ CardHeader                                                       │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Title: "Dokumenter"                                         │ │
│ │ Description: "Dokumenter knyttet til kunden"                │ │
│ │                                                             │ │
│ │ [Filter: Alle | Kunde | Tilbud | Prosjekt]    [Last opp +]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ CardContent                                                      │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Document Table                                              │ │
│ │ ┌─────────┬──────────┬────────┬──────────┬────────┬───────┐ │ │
│ │ │ Navn    │ Type     │ Kilde  │ Lastet   │ Str.   │       │ │ │
│ │ │         │          │        │ opp      │        │       │ │ │
│ │ ├─────────┼──────────┼────────┼──────────┼────────┼───────┤ │ │
│ │ │ 📄 Kon..│ PDF      │ Kunde  │ 2 d siden│ 245 KB │ ⬇ 🗑  │ │ │
│ │ │ 📊 Bud..│ Excel    │ Tilbud │ 1 u siden│ 89 KB  │ ⬇     │ │ │
│ │ │ 📷 Bil..│ Image    │ Prosj. │ 3 u siden│ 1.2 MB │ ⬇     │ │ │
│ │ └─────────┴──────────┴────────┴──────────┴────────┴───────┘ │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ [Pagination: < 1 2 3 ... >]                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Upload Modal

```
┌─────────────────────────────────────────────┐
│ Last opp dokument                      [X]  │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │                                     │   │
│  │     📁 Dra og slipp filer her      │   │
│  │        eller klikk for å velge      │   │
│  │                                     │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Selected: kontract-2024.pdf (245 KB)  [X] │
│                                             │
├─────────────────────────────────────────────┤
│                    [Avbryt]  [Last opp]     │
└─────────────────────────────────────────────┘
```

### Empty State

```
┌─────────────────────────────────────────────┐
│                                             │
│              📁                             │
│                                             │
│     Ingen dokumenter lastet opp ennå        │
│                                             │
│     [Last opp første dokument]              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## Data Model

### New API Endpoints Required (Backend)

#### 1. List Customer Documents

```
GET /customers/{id}/documents
Query params:
  - source?: "customer" | "offer" | "project" (filter by source)
  - page?: number
  - pageSize?: number
  - sortBy?: "filename" | "createdAt" | "size"
  - sortOrder?: "asc" | "desc"

Response: {
  data: CustomerDocumentDTO[],
  total: number,
  page: number,
  pageSize: number
}
```

#### 2. Upload Customer Document

```
POST /customers/{id}/documents
Content-Type: multipart/form-data
Body: { file: File }

Response: CustomerDocumentDTO
```

#### 3. Delete Customer Document

```
DELETE /customers/{id}/documents/{documentId}

Response: 204 No Content
```

### CustomerDocumentDTO

```typescript
interface CustomerDocumentDTO {
  id: string;
  filename: string;
  contentType: string; // MIME type
  size: number; // bytes
  createdAt: string; // ISO 8601
  createdByName?: string; // User who uploaded

  // Source tracking
  source: "customer" | "offer" | "project";
  sourceId?: string; // offer/project ID if not customer-level
  sourceName?: string; // offer/project name for display

  // Download URL or use existing /files/{id}/download
  downloadUrl?: string;
}
```

---

## Frontend Implementation

### New Files to Create

```
components/
└── customers/
    ├── customer-documents-tab.tsx      # Main tab component
    └── document-upload-modal.tsx       # Upload dialog

hooks/
└── useCustomerDocuments.ts             # React Query hooks
```

### Component: CustomerDocumentsTab

```typescript
interface CustomerDocumentsTabProps {
  customerId: string;
}

// Features:
// - Fetches documents using useCustomerDocuments hook
// - Filter dropdown for source (All, Customer, Offer, Project)
// - Sortable columns (name, date, size)
// - Pagination (20 per page)
// - Upload button opens DocumentUploadModal
// - Download button triggers file download
// - Delete button (only for customer-level documents)
```

### Component: DocumentUploadModal

```typescript
interface DocumentUploadModalProps {
  customerId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Features:
// - Drag-and-drop zone
// - Click to select file
// - File type icon based on extension
// - File size display
// - Upload progress (optional, nice-to-have)
// - Error handling for failed uploads
```

### Hook: useCustomerDocuments

```typescript
// List documents
export function useCustomerDocuments(
  customerId: string,
  params?: {
    source?: "customer" | "offer" | "project";
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }
);

// Upload document
export function useUploadCustomerDocument();

// Delete document
export function useDeleteCustomerDocument();

// Download helper (triggers browser download)
export function useDownloadDocument();
```

### File Type Icons Mapping

```typescript
const FILE_TYPE_ICONS: Record<string, LucideIcon> = {
  // Documents
  "application/pdf": FileText,
  "application/msword": FileText,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    FileText,

  // Spreadsheets
  "application/vnd.ms-excel": FileSpreadsheet,
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
    FileSpreadsheet,

  // Images
  "image/png": Image,
  "image/jpeg": Image,
  "image/gif": Image,

  // Archives
  "application/zip": FileArchive,
  "application/x-rar-compressed": FileArchive,

  // Default
  default: File,
};
```

---

## Integration Points

### 1. Customer Detail Page Changes

**File:** `app/customers/[id]/page.tsx`

```tsx
// Add import
import { CustomerDocumentsTab } from "@/components/customers/customer-documents-tab";

// Add tab trigger (after Tilbud, before Kontakter)
<TabsTrigger value="documents">
  Dokumenter ({customer.stats?.totalDocuments ?? 0})
</TabsTrigger>

// Add tab content
<TabsContent value="documents">
  <CustomerDocumentsTab customerId={resolvedParams.id} />
</TabsContent>
```

### 2. Customer Stats Extension

The `customer.stats` object should include `totalDocuments` count from the backend.

### 3. Existing File API Reuse

- Download: Reuse `GET /files/{id}/download` endpoint
- File metadata: Reuse `DomainFileDTO` structure where possible

---

## Error Handling

| Scenario       | User Feedback                                         |
| -------------- | ----------------------------------------------------- |
| Upload fails   | Toast: "Kunne ikke laste opp dokumentet. Prøv igjen." |
| Download fails | Toast: "Kunne ikke laste ned dokumentet."             |
| Delete fails   | Toast: "Kunne ikke slette dokumentet."                |
| File too large | Toast: "Filen er for stor. Maks størrelse er X MB."   |
| Network error  | Toast: "Nettverksfeil. Sjekk tilkoblingen din."       |

---

## Security Considerations

1. **Authorization**: Users can only view/upload/delete documents for customers they have access to (company-scoped)
2. **File validation**: Backend should validate file types and scan for malware
3. **Size limits**: Implement reasonable file size limits (e.g., 50MB per file)
4. **Audit trail**: Track who uploaded/deleted documents and when

---

## Implementation Phases

### Phase 1: Core Functionality (MVP)

- [ ] Backend: Create customer documents endpoints
- [ ] Frontend: CustomerDocumentsTab component
- [ ] Frontend: useCustomerDocuments hook
- [ ] Frontend: Basic upload modal
- [ ] Frontend: Download functionality
- [ ] Frontend: Delete functionality (customer-level only)

### Phase 2: Enhanced UX

- [ ] Drag-and-drop upload
- [ ] Upload progress indicator
- [ ] Bulk download (zip)
- [ ] Sort by columns
- [ ] Search/filter by filename

### Phase 3: Aggregation

- [ ] Display offer documents in customer tab
- [ ] Display project documents in customer tab
- [ ] Source filtering
- [ ] Link to source entity (offer/project)

---

## Open Questions

1. **File size limit**: What should be the maximum file size? (Suggested: 50MB)
2. **Retention policy**: Should old documents be auto-archived/deleted?
3. **Duplicate handling**: Allow same filename or auto-rename?
4. **Notifications**: Notify team when documents are uploaded?

---

## Acceptance Criteria

- [ ] Users can see "Dokumenter" tab on customer detail page
- [ ] Users can upload any file type to a customer
- [ ] Users can download uploaded documents
- [ ] Users can delete customer-level documents
- [ ] Document list shows filename, type icon, size, upload date
- [ ] Documents from offers/projects appear in aggregated view (Phase 3)
- [ ] Proper error handling with user-friendly messages
- [ ] Responsive design works on mobile
