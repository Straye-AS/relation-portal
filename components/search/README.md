# Global Search - Straye Relation

## Overview

The global search component provides a fast, keyboard-friendly multi-entity search experience similar to a command palette.

## Features

### Keyboard Shortcuts

- **Cmd+K** (macOS) or **Ctrl+K** (Windows/Linux): Open search
- **↑/↓**: Navigate through results
- **Enter**: Open selected result
- **Esc**: Close search

### Search Capabilities

- **Customers**: Search by name, organization number, email, contact person
- **Projects**: Search by name, customer name, description
- **Offers**: Search by title, customer name, responsible user, description
- **Contacts**: Search by name, email, phone, customer name, role

### Company Context

- Automatically filters results based on selected company
- "Hele Straye" shows results from all companies
- Other companies show only their own data

### UI Features

- Debounced search (300ms) for optimal performance
- Grouped results by entity type
- Icon-based visual identification
- Loading states with spinner
- Empty states with helpful messages
- Recent items when no search query

## Usage

The search is integrated into the app header and opens automatically with the keyboard shortcut.

### API Structure

The search uses the `searchApi` in `lib/api/client.ts`:

```typescript
searchApi.search(query: string, companyId?: CompanyId): Promise<SearchResults>
searchApi.getRecentItems(companyId?: CompanyId): Promise<SearchResults>
```

### Hook

Use the `useSearch` hook for search functionality:

```typescript
const { data, isLoading } = useSearch(query, companyId);
```

## Future Enhancements

- Fuzzy matching for better search results
- Search history
- Saved searches
- Backend integration for faster results
- Additional entity types (tasks, activities, etc.)
