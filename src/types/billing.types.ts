export interface Billing {
  id: string;
  client_name: string;
  project_title: string;
  total_project_cost: string;
  amount_paid: string;
  outstanding_balance: string;
  next_payment_due_date: string;
  created_at?: string;
  updated_at?: string;
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
