export interface Event {
  id: number;
  eventTitle: string;
  projectName?: string;
  projectType: string;
  eventType?: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  sendTo: string;
  visibleToClient: boolean;
  assignee: string[];
}

export interface EventFormData {
  id?: number;
  eventTitle: string;
  eventType: string;
  projectType: string;
  date: string;
  time: string;
  venue: string;
  description: string;
  sendTo: string;
  // visibleToClient: boolean;
  assignee?: string[];
}
