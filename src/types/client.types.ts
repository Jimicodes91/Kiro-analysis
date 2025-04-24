export interface Client {
  id: string;
  serialNumber: string;
  clientName: string;
  projects: number;
  plan: "Basic" | "Premium" | "Enterprise";
  users: number;
  status: "Completed" | "In Progress" | "Pending";
  assignee: string[];
  registrationDate: string;
}
