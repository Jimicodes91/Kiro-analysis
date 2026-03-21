import Heading from "@/components/ui/heading";
import { Icons } from "@/components/ui/icons";
import { Switch } from "@/components/ui/switch";
import useGetProjectSettings from "@/hooks/project-modules/project-settings/use-get-project-settings";
import useSetProjectSettings from "@/hooks/project-modules/project-settings/use-set-project-settings";
import React from "react";

const SettingsTab = ({ projectId }: { projectId?: string }) => {
  const projectSettings = useGetProjectSettings(projectId);
  const setProjectSettings = useSetProjectSettings(projectId);
  const [activeSetting, setActiveSetting] = React.useState<undefined | string>(undefined);

  const updateProjectSettings = (name: string, checked: boolean) => {
    setActiveSetting(name);
    setProjectSettings
      .mutateAsync({
        client_can_view_task: Boolean(projectSettings?.value?.data?.client_can_view_task),
        client_can_view_notes: Boolean(
          projectSettings?.value?.data?.client_can_view_notes
        ),
        client_can_view_documents: Boolean(
          projectSettings?.value?.data?.client_can_view_documents
        ),
        client_can_view_activity: Boolean(
          projectSettings?.value?.data?.client_can_view_activity
        ),
        client_can_view_event: Boolean(
          projectSettings?.value?.data?.client_can_view_event
        ),
        client_can_view_project_members: Boolean(
          projectSettings?.value?.data?.client_can_view_project_members
        ),
        [name]: checked,
      })
      .finally(() => setActiveSetting(undefined));
  };

  const renderBody = () => {
    if (projectSettings.isPending)
      return (
        <div className="space-y-2 border rounded-lg p-4">
          {[1, 2, 3, 4].map((item) => (
            <div
              className="px-5 py-10 space-y-2 rounded-lg bg-gray-100 flex justify-between  animate-pulse"
              key={item}
            ></div>
          ))}
        </div>
      );

    if (projectSettings?.isError)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">Somthing went wrong</p>
        </div>
      );

    if (!projectSettings?.value)
      return (
        <div className="py-10 px-4 rounded-lg border flex justify-center border-brand-border bg-[#F8F8F8]">
          <p className="text-sm text-brand-fade p-0 m-0">
            No activity currently on this project
          </p>
        </div>
      );

    const loadingComp = (name: string) => (
      <>
        {setProjectSettings.isPending && activeSetting === name && (
          <Icons.spinner className="animate-spin h-4 w-4" />
        )}
      </>
    );
    return (
      <div className="border rounded-xl p-6 w-full max-w-6xl flex flex-wrap justify-between gap-8">
        <div>
          <Heading size="h5">Project Settings</Heading>
          <p className="text-sm text-brand-text">
            A list of all tabs linked to the project, <br />
            including their status
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(projectSettings?.value?.data?.client_can_view_task)}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_task", checked)
                }
              />
              {loadingComp("client_can_view_task")}
            </div>

            <div>
              <p className="text-sm font-bold">Task</p>
              <p className="text-[13px] text-[#00000066]">
                Toggle if a client can can view task tab
              </p>
            </div>
          </div>
          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(projectSettings?.value?.data?.client_can_view_notes)}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_notes", checked)
                }
              />
              {loadingComp("client_can_view_notes")}
            </div>

            <div>
              <p className="text-sm font-bold">Notes</p>
              <p className="text-[13px] text-[#00000066]">
                Toggle if a client can can view notes tab
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(projectSettings?.value?.data?.client_can_view_activity)}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_activity", checked)
                }
              />
              {loadingComp("client_can_view_activity")}
            </div>

            <div>
              <p className="text-sm font-bold">Activity</p>
              <p className="text-[13px] text-[#00000066]">
                Toggle if a client can can view activity tab
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(projectSettings?.value?.data?.client_can_view_documents)}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_documents", checked)
                }
              />
              {loadingComp("client_can_view_documents")}
            </div>

            <div>
              <p className="text-sm font-bold">Document</p>
              <p className="text-[13px] text-[#00000066]">
                Toggle if a client can can view document tab
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(projectSettings?.value?.data?.client_can_view_event)}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_event", checked)
                }
              />
              {loadingComp("client_can_view_event")}
            </div>

            <div>
              <p className="text-sm font-bold">Event</p>
              <p className="text-[13px] text-[#00000066]">
                A list of all tasks linked to the project, including their status
              </p>
            </div>
          </div>

          <div className="flex gap-x-5 items-center pb-4 border-b w-fit">
            <div className="flex items-center min-w-[60px] gap-1">
              <Switch
                disabled={setProjectSettings.isPending}
                checked={Boolean(
                  projectSettings?.value?.data?.client_can_view_project_members
                )}
                onCheckedChange={(checked) =>
                  updateProjectSettings("client_can_view_project_members", checked)
                }
              />
              {loadingComp("client_can_view_project_members")}
            </div>

            <div>
              <p className="text-sm font-bold">Project team</p>
              <p className="text-[13px] text-[#00000066]">
                Toggle if a client can can view project team members tab
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-3 my-2">
        <h1 className="text-[16px] font-[600]">Settings</h1>
        <>{renderBody()}</>
      </div>
    </>
  );
};

export default SettingsTab;
