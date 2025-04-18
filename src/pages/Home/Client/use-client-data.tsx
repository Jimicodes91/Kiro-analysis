import { Client } from "@/types/client.types";
import {
  // useEffect,
  useState,
} from "react";

// Dummy data based on your screenshots
const dummyClients: Client[] = [
  {
    id: "1",
    serialNumber: "0123456756",
    clientName: "Stellar Solutions Inc.",
    projects: 5,
    plan: "Basic",
    users: 60,
    status: "Completed",
    assignee: ["UO", "JO", "IO"],
    registrationDate: "02 Nov 2023",
  },
  {
    id: "2",
    serialNumber: "0123456756",
    clientName: "Stellar Solutions Inc.",
    projects: 5,
    plan: "Premium",
    users: 60,
    status: "Completed",
    assignee: ["UO", "JO", "IO"],
    registrationDate: "02 Nov 2023",
  },
  {
    id: "3",
    serialNumber: "0123456756",
    clientName: "Stellar Solutions Inc.",
    projects: 5,
    plan: "Basic",
    users: 60,
    status: "Completed",
    assignee: ["UO", "JO", "IO"],
    registrationDate: "02 Nov 2023",
  },
  {
    id: "4",
    serialNumber: "0123456756",
    clientName: "Stellar Solutions Inc.",
    projects: 5,
    plan: "Premium",
    users: 60,
    status: "Completed",
    assignee: ["UO", "JO", "IO"],
    registrationDate: "02 Nov 2023",
  },
  {
    id: "5",
    serialNumber: "0123456756",
    clientName: "Stellar Solutions Inc.",
    projects: 5,
    plan: "Basic",
    users: 60,
    status: "Completed",
    assignee: ["UO", "JO", "IO"],
    registrationDate: "02 Nov 2023",
  },
];

export const useClientData = () =>
  // showEmpty = false
  {
    const [clients, setClients] = useState<Client[]>(dummyClients);
    //   const [loading, setLoading] = useState(true);

    //   useEffect(() => {
    //     // Simulate API call
    //     const timer = setTimeout(() => {
    //       setClients(showEmpty ? [] : dummyClients);
    //       setLoading(false);
    //     }, 1000);

    //     return () => clearTimeout(timer);
    //   }, [showEmpty]);

    return {
      clients,
      // loading,
      setClients,
    };
  };
