import { Task } from "@/types/task.types";
import { useState } from "react";

const dummyTasks: Task[] = [
  {
    id: 1,
    taskName: "Setup documentation meeting",
    projectName: "Dubai registration",
    clientName: "Jessica Parker",
    projectType: "client",
    company: "Dubai registration",
    startDate: "02 Nov 2023",
    status: "completed",
    taskType: "client",
    endDate: "02 Nov 2023",
    description: "An task about the future of commerce",
    assignTo: [
      { value: "user1", label: "Kolawole Ayoade" },
      { value: "user2", label: "Kemisola Inioluwa" },
      { value: "user3", label: "Goodluck Johnny" },
    ],
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
    attachments: [],
  },
  {
    id: 2,
    taskName: "Setup documentation meeting",
    projectName: "Dubai registration",
    clientName: "Jessica Parker",
    projectType: "public",
    company: "Dubai registration",
    startDate: "02 Nov 2023",
    status: "completed",
    taskType: "client",
    endDate: "02 Nov 2023",
    description: "Exhibition on smart money technologies",
    assignTo: [
      { value: "user1", label: "Kolawole Ayoade" },
      { value: "user2", label: "Kemisola Inioluwa" },
      { value: "user3", label: "Goodluck Johnny" },
    ],
    visibleToClient: false,
    assignee: ["UO", "JO", "IO"],
    attachments: [],
  },
  {
    id: 3,
    taskName: "Setup documentation meeting",
    projectName: "Dubai registration",
    clientName: "Jessica Parker",
    projectType: "internal",
    company: "Dubai registration",
    startDate: "02 Nov 2023",
    status: "completed",
    taskType: "client",
    endDate: "02 Nov 2023",
    description: "Company goal setting workshop",
    assignTo: [
      { value: "user1", label: "Kolawole Ayoade" },
      { value: "user2", label: "Kemisola Inioluwa" },
      { value: "user3", label: "Goodluck Johnny" },
    ],
    visibleToClient: false,
    assignee: ["UO", "JO", "IO"],
    attachments: [],
  },
  {
    id: 4,
    taskName: "Setup documentation meeting",
    projectName: "Dubai registration",
    clientName: "Jessica Parker",
    projectType: "client",
    company: "Dubai registration",
    startDate: "02 Nov 2023",
    status: "completed",
    taskType: "client",
    endDate: "02 Nov 2023",
    description: "Follow-up meeting on commerce strategies",
    assignTo: [
      { value: "user1", label: "Kolawole Ayoade" },
      { value: "user2", label: "Kemisola Inioluwa" },
      { value: "user3", label: "Goodluck Johnny" },
    ],
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
    attachments: [],
  },
  {
    id: 5,
    taskName: "Setup documentation meeting",
    projectName: "Dubai registration",
    clientName: "Jessica Parker",
    projectType: "public",
    company: "Dubai registration",
    startDate: "02 Nov 2023",
    status: "completed",
    taskType: "client",
    endDate: "02 Nov 2023",
    description: "Networking task for finance professionals",
    assignTo: [
      { value: "user1", label: "Kolawole Ayoade" },
      { value: "user2", label: "Kemisola Inioluwa" },
      { value: "user3", label: "Goodluck Johnny" },
    ],
    visibleToClient: true,
    assignee: ["UO", "JO", "IO"],
    attachments: [],
  },
];

export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[]>(dummyTasks);
  const [loading, setLoading] = useState(false);

  const addTask = async (newTask: Task) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks((prev) => [...prev, newTask]);
      return true;
    } catch (error) {
      console.error("Failed to add task:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (updatedTask: Task) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks((prev) =>
        prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
      );
      return true;
    } catch (error) {
      console.error("Failed to update task:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId: number) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks((prev) => prev.filter((task) => task.id !== taskId));
      return true;
    } catch (error) {
      console.error("Failed to delete task:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
  };
};
