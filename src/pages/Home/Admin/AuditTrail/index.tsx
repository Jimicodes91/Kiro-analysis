import React from "react";

// Define types for our audit trail entries
type ActionType = "note" | "task";

interface AuditTrailEntry {
  id: string;
  userId: string;
  userInitials: string;
  userName: string;
  action: string;
  actionType: ActionType;
  timestamp: Date;
}

// Group header type
type TimeGroup = "Today" | "Last 7 days" | "2 weeks ago" | string;

const AuditTrailTab: React.FC = () => {
  // Sample data that matches the image
  const auditEntries: AuditTrailEntry[] = [
    {
      id: "1",
      userId: "uo1",
      userInitials: "UO",
      userName: "Uchenna Okenwa",
      action: "left",
      actionType: "note",
      timestamp: new Date(),
    },
    {
      id: "2",
      userId: "jp1",
      userInitials: "JP",
      userName: "Jessica Parker",
      action: "added",
      actionType: "task",
      timestamp: new Date(),
    },
    {
      id: "3",
      userId: "jp2",
      userInitials: "JP",
      userName: "Jessica parker",
      action: "pinned",
      actionType: "note",
      timestamp: new Date(),
    },
    {
      id: "4",
      userId: "uo2",
      userInitials: "UO",
      userName: "Uchenna Okenwa",
      action: "left",
      actionType: "note",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "5",
      userId: "jp3",
      userInitials: "JP",
      userName: "Jessica Parker",
      action: "added",
      actionType: "task",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "6",
      userId: "jp4",
      userInitials: "JP",
      userName: "Jessica parker",
      action: "pinned",
      actionType: "note",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    },
    {
      id: "7",
      userId: "uo3",
      userInitials: "UO",
      userName: "Uchenna Okenwa",
      action: "left",
      actionType: "note",
      timestamp: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 2 weeks ago
    },
  ];

  // Function to group entries by time period
  const groupEntriesByTimePeriod = (
    entries: AuditTrailEntry[]
  ): Record<TimeGroup, AuditTrailEntry[]> => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const twoWeeksAgo = new Date(today);
    twoWeeksAgo.setDate(today.getDate() - 14);

    return entries.reduce((groups: Record<TimeGroup, AuditTrailEntry[]>, entry) => {
      let group: TimeGroup;
      const entryDate = new Date(entry.timestamp);

      if (entryDate >= today) {
        group = "Today";
      } else if (entryDate >= oneWeekAgo) {
        group = "Last 7 days";
      } else if (entryDate >= twoWeeksAgo) {
        group = "2 weeks ago";
      } else {
        group = "Older";
      }

      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(entry);
      return groups;
    }, {});
  };

  const groupedEntries = groupEntriesByTimePeriod(auditEntries);

  // Format the time as "Today at 6:38 PM"
  const formatTime = (date: Date): string => {
    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    if (isToday) {
      return `Today at ${date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true })}`;
    }
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-base font-semibold pt-2">Audit trail</h1>

      {Object.entries(groupedEntries).map(([groupName, entries]) => (
        <div key={groupName} className="w-full">
          {/* Time group header with divider line */}
          <div className="relative flex items-center justify-center my-4">
            <div className="absolute border-t border-brand-border w-full"></div>
            <div className="relative px-4 py-1 bg-white text-[#191819] border-brand-border font-semibold text-sm rounded-full border z-10">
              {groupName}
            </div>
          </div>

          {/* Entries in this time group */}
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-start p-4 border bg-[#F8F8F8] mb-[14px] rounded-[6px] hover:bg-gray-50"
            >
              {/* User avatar/initials */}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-[#F1F1F1] flex items-center justify-center text-[20px] text-black font-medium mr-4">
                {entry.userInitials}
              </div>

              {/* Entry details */}
              <div className="flex flex-col">
                <span className="text-[#19181966] text-sm font-medium">
                  {formatTime(entry.timestamp)}
                </span>
                <span className="text-sm text-brand-fade">
                  <span className="font-medium text-[#191819]">{entry.userName}</span>{" "}
                  {entry.action} a{" "}
                  <span className="text-[#191819]">{entry.actionType}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AuditTrailTab;
