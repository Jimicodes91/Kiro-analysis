export interface SidebarLayoutProps {
  image?: string | React.ReactElement;
  title: string;
  isCollapsed?: boolean;
}

export interface TableRowProps {
  row: {
    id: number;
    title: string;
    organization: string;
    startDate: string;
    dueDate: string;
    completedDate: string;
    status: string;
    projectTeam?: string[];
    clientTeam?: string[];
  };
}
