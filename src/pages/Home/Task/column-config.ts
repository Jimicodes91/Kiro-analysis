// Column configuration constants and localStorage helpers for the configurable task table.

export interface ColumnConfig {
  id: string;
  label: string;
  defaultVisible: boolean;
  editable: boolean;
}

export const ALL_COLUMNS: ColumnConfig[] = [
  { id: "done",           label: "Done",            defaultVisible: true,  editable: true  },
  { id: "subject",        label: "Subject",         defaultVisible: true,  editable: true  },
  { id: "project",        label: "Project",         defaultVisible: true,  editable: true  },
  { id: "contact_person", label: "Contact Person",  defaultVisible: true,  editable: true  },
  { id: "due_date",       label: "Due Date",        defaultVisible: true,  editable: true  },
  { id: "category",       label: "Category",        defaultVisible: true,  editable: true  },
  { id: "status",         label: "Status",          defaultVisible: true,  editable: true  },
  { id: "priority",       label: "Priority",        defaultVisible: false, editable: true  },
  { id: "email",          label: "Email",           defaultVisible: false, editable: false },
  { id: "phone",          label: "Phone",           defaultVisible: false, editable: false },
  { id: "organization",   label: "Organization",    defaultVisible: false, editable: false },
  { id: "assignee",       label: "Assignee",        defaultVisible: false, editable: true  },
  { id: "note",           label: "Note",            defaultVisible: false, editable: true  },
  { id: "created",        label: "Created",         defaultVisible: false, editable: false },
];

const STORAGE_KEY = "pylott_task_column_prefs";

/** Returns the default visible column IDs. */
export function getDefaultColumns(): string[] {
  return ALL_COLUMNS.filter((c) => c.defaultVisible).map((c) => c.id);
}

/** Reads visible column IDs from localStorage, falling back to defaults if missing or corrupted. */
export function getVisibleColumns(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultColumns();

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return getDefaultColumns();

    // Validate that every entry is a known column ID
    const validIds = new Set(ALL_COLUMNS.map((c) => c.id));
    const filtered = parsed.filter((id: unknown) => typeof id === "string" && validIds.has(id));
    return filtered.length > 0 ? filtered : getDefaultColumns();
  } catch {
    return getDefaultColumns();
  }
}

/** Persists visible column IDs to localStorage. */
export function setVisibleColumns(columns: string[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(columns));
}
