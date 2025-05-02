export interface Contact {
  id: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  deleted_at: string; // ISO 8601 string
  name: string;
  email: string;
  phone: string;
  organization: string;
  address: string | null;
  active_projects: number;
  total_projects: number;
  no_of_projects: number | null;
  closed_projects: number | null;
  assigne: string | null;
  assigned_to: {
    id: string;
    name: string;
  }[];
}

export interface AssignTo {
  id: string;
  name: string;
}
export interface ContactFormValues {
  id?: string;
  name: string;
  phone: string;
  email: string;
  organization: string;
  assigned_to: AssignTo[];
}
