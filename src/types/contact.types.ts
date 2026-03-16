export interface Contact {
  id: string;
  created_at: string; // ISO 8601 string
  updated_at: string; // ISO 8601 string
  deleted_at: string; // ISO 8601 string
  name: string;
  email: string;
  phone: string;
  organization?: string;
  address?: string | null;
  workspace_id?: string;
  status: 'uninvited' | 'invited' | 'active';
  user_id?: string | null;
  invited_at?: string | null;
  invited_by?: string | null;
  active_projects: number;
  total_projects: number;
  no_of_projects: number | null;
  closed_projects: number;
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
  organization?: string;
  address?: string;
  assigned_to?: AssignTo[];
  send_invite_immediately?: boolean;
  invite_message?: string;
}

export interface InviteResponse {
  success: boolean;
  status: 'invited' | 'pending_approval';
  requires_approval: boolean;
  invite_sent_at?: string;
}

export interface CreateContactResponse {
  contact: Contact;
  invite?: InviteResponse;
}
