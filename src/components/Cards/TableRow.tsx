// tablerow.tsx
import ViewToggle from "@/components/Cards/ViewToggle";
import Modal from "@/components/Modal";
import { ProjectDetails } from "@/types/api.types";
import { format } from "date-fns";
import { useState } from "react";
import { BsActivity } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { LuCalendar, LuUserRound } from "react-icons/lu";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { PiSpinner, PiUsersThreeLight } from "react-icons/pi";
import { RiStickyNoteLine } from "react-icons/ri";
import { TableCell } from "../ui/table";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: string;
}

interface Note {
  id: number;
  content: string;
  createdAt: string;
  createdBy: string;
}

interface Activity {
  id: number;
  action: string;
  details: string;
  timestamp: string;
  user: string;
}

const TableRow = ({ row }: { row: ProjectDetails }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("task");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Complete Project Proposal",
      description: "Draft and finalize the project proposal for client review.",
      completed: true,
    },
    {
      id: 2,
      title: "Team Meeting",
      description: "Attend the weekly team meeting to discuss project progress.",
      completed: false,
    },
    {
      id: 3,
      title: "Code Review",
      description: "Review pull requests and provide feedback on recent code changes.",
      completed: false,
    },
  ]);

  const [notes] = useState<Note[]>([
    {
      id: 1,
      content:
        "Client requested additional features in the dashboard. Need to discuss scope.",
      createdAt: "2023-05-10T10:30:00",
      createdBy: "Uchenna Okenwa",
    },
    {
      id: 2,
      content:
        "Budget approval pending from finance team. Follow up scheduled for Friday.",
      createdAt: "2023-05-08T14:15:00",
      createdBy: "Sarah Williams",
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: 1,
      action: "Status Update",
      details: "Changed status from 'Not Started' to 'In Progress'",
      timestamp: "2023-05-12T09:45:00",
      user: "Uchenna Okenwa",
    },
    {
      id: 2,
      action: "Task Completed",
      details: "Marked 'Project Proposal' as completed",
      timestamp: "2023-05-11T16:20:00",
      user: "Jane Smith",
    },
    {
      id: 3,
      action: "Team Update",
      details: "Added Mike Johnson to the project team",
      timestamp: "2023-05-10T11:10:00",
      user: "Uchenna Okenwa",
    },
  ]);

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  return (
    <>
      <tr
        key={row.id}
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer hover:bg-gray-50"
      >
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.company_id}</TableCell>
        <TableCell>{format(row.start_date, "PPP")}</TableCell>
        <TableCell>{format(row.end_date, "PPP")}</TableCell>
        <TableCell>Nill</TableCell>
        <TableCell>
          <span
            className={`p-2 inline-flex text-sm leading-5 font-semibold rounded-full 
            ${
              row.status === "Completed"
                ? "bg-green-100 text-green-800"
                : row.status === "In progress"
                  ? "bg-[#F1E6D4] text-[#B78026]"
                  : "bg-[#FB002B1A] text-[#FB002B]"
            }`}
          >
            {row.status}
          </span>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            Nil
            {/* {row.projectTeam?.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
              >
                {member.substring(0, 2)}
              </div>
            ))} */}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex -space-x-2">
            Nil
            {/* {row.clientTeam?.map((member, index) => (
              <div
                key={index}
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
              >
                {member.substring(0, 2)}
              </div>
            ))} */}
          </div>
        </TableCell>
        <TableCell>
          <IoSettingsOutline className="text-gray-500" />
        </TableCell>
      </tr>

      {/* Modal for project details - same as in ProjectCard */}
      {isModalOpen && (
        <Modal
          title="Project detail"
          closeModal={() => setIsModalOpen(false)}
          showExpandButton={true}
          expandRoute={`/projects/${row.id}`}
        >
          <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
            <div className="space-y-4">
              <div className="flex flex-col">
                <p className="text-[#191819] font-bold text-2xl">{row.name}</p>
                <p className="text-[#19181980] text-base font-medium">{row.company_id}</p>
              </div>
              <div className="bg-[#F8F8F8] p-4 rounded-lg flex-col border-[#0000001A] border-[1px]">
                <div className="mb-3 flex items-center gap-3 lg:gap-11 md:gap-1">
                  <div className="flex items-center gap-2">
                    <LuUserRound className="text-[#19181980] w-4 h-4" />
                    <h3 className="text-sm text-[#19181980]">Owner</h3>
                  </div>
                  <div>
                    <p>Uchenna Okenwa</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-3 lg:gap-11 md:gap-1">
                  <div className="flex items-center gap-2">
                    <LuCalendar className="text-[#19181980] w-4 h-4" />
                    <h3 className="text-sm text-[#19181980]">Timeline</h3>
                  </div>
                  <div>
                    <p>6 months</p>
                  </div>
                </div>
                <div className="mb-3 flex items-center gap-3 lg:gap-11 md:gap-1">
                  <div className="flex items-center gap-2">
                    <PiSpinner className="text-[#19181980] w-4 h-4" />
                    <h3 className="text-sm text-[#19181980]">Status</h3>
                  </div>
                  <div>
                    <span
                      className={`p-1 px-3 inline-flex text-xs leading-5 font-semibold rounded-full 
                  ${
                    row.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : row.status === "In progress"
                        ? "bg-[#F1E6D4] text-[#B78026]"
                        : "bg-[#FB002B1A] text-[#FB002B]"
                  }`}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3 lg:gap-11 md:gap-1">
                  <div className="flex items-center gap-2">
                    <PiUsersThreeLight className="text-[#19181980] w-4 h-4" />
                    <h3 className="text-sm text-[#19181980]">Assigned</h3>
                  </div>
                  <div>
                    <div className="flex -space-x-2">
                      {/* {row.clientTeam?.map((member, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#F1F1F1] text-dark text-sm font-medium ring-2 ring-white"
                        >
                          {member.substring(0, 2)}
                        </div>
                      ))} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-[#19181980] text-sm font-semibold">
                  Phase:
                  <span className="text-[#000] mx-1 text-sm font-semibold">
                    Pre travel
                  </span>
                </p>

                <p className="text-[#000] mx-1 text-sm font-semibold">40%</p>
              </div>

              <p className="text-[#19181980] text-sm font-semibold">
                32 days to completion
              </p>
            </div>
          </div>
          <div className="border-[1px] rounded-lg p-4 m-2 mt-4">
            <div className="space-y-4">
              <ViewToggle
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                options={[
                  { value: "task", label: "Task" },
                  { value: "notes", label: "Notes" },
                  { value: "activity", label: "Activity" },
                ]}
              />

              {/* Task Tab Content */}
              {activeTab === "task" && (
                <div className="space-y-4">
                  {tasks.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No tasks yet. Add your first task!
                    </div>
                  ) : (
                    tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50"
                      >
                        <button
                          onClick={() => toggleTaskCompletion(task.id)}
                          className={`mt-1 p-1 rounded-full ${
                            task.completed
                              ? "text-[#092327]"
                              : "text-gray-300 hover:text-gray-400"
                          }`}
                        >
                          {task.completed ? (
                            <MdCheckBox size={20} />
                          ) : (
                            <MdCheckBoxOutlineBlank size={20} />
                          )}
                        </button>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              task.completed
                                ? "line-through text-gray-400"
                                : "text-gray-800"
                            }`}
                          >
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-sm text-gray-500">{task.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4 mt-2">
                            {task.dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <LuCalendar size={14} />
                                <span>
                                  Due: {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              </div>
                            )}
                            {task.assignedTo && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <LuUserRound size={14} />
                                <span>{task.assignedTo}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Notes Tab Content */}
              {activeTab === "notes" && (
                <div className="space-y-4">
                  {notes.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      No notes yet. Add your first note!
                    </div>
                  ) : (
                    notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-3 border rounded bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex items-start gap-2">
                          <RiStickyNoteLine className="mt-1 text-gray-400" />
                          <div className="flex-1">
                            <p className="text-gray-800 whitespace-pre-wrap">
                              {note.content}
                            </p>
                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                              <span>{note.createdBy}</span>
                              <span>{new Date(note.createdAt).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Activity Tab Content */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  {activities.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">No activity yet.</div>
                  ) : (
                    activities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 border-b last:border-b-0"
                      >
                        <div className="p-2 bg-gray-100 rounded-full">
                          <BsActivity className="text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium text-gray-800">
                              {activity.action}
                            </h4>
                            <span className="text-xs text-gray-500">
                              {new Date(activity.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{activity.details}</p>
                          <p className="text-xs text-gray-500 mt-1">by {activity.user}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default TableRow;
