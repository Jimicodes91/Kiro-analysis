export interface Billing {
  amount_paid: string;
  client_name: string;
  created_at: string;
  deleted_at: string | null;
  has_paid: number; // likely 0 or 1 as number
  id: string;
  next_payment_due_date: string;
  organization_id: string;
  outstanding_balance: string;
  payment_date: string | null;
  payment_proof_url: string | null;
  payment_status: string | null;
  project_title: string;
  total_project_cost: string;
  updated_at: string;
}

export interface BillingFormValues {
  id?: string;
  client_name: string;
  project_title: string;
  total_project_cost: number | undefined;
  amount_paid: number | undefined;
  outstanding_balance: number | undefined;
  next_payment_due_date: string;
}
