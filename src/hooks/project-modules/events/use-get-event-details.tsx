import useQueryActionHook from "@/hooks/use-queryaction";
import { ENDPOINTS, QUERYKEYS } from "@/lib/constants";

export interface EventDetailsResponse {
  success: boolean;
  message: string;
  data: Daum[];
}

export interface Daum {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: unknown;
  project_id: string;
  company_id: string;
  event_type_id: string;
  created_by: string;
  name: string;
  start_datetime: string;
  end_datetime: string;
  description: string;
  venue: string;
  invites: string[];
  provider_identifier: unknown;
  is_visible_to_client: number;
  date: string;
  is_creator: boolean;
  is_attendee: boolean;
  user_response: unknown;
  attendance_stats: AttendanceStats;
}

export interface AttendanceStats {
  total: number;
  accepted: number;
  declined: number;
  tentative: number;
  no_response: number;
}

const useGetEventDetails = (projectId: string, eventId: string) => {
  return useQueryActionHook<EventDetailsResponse>({
    method: "get",
    endpoint: ENDPOINTS.GET_EVENT_DETAILS(projectId, eventId),
    queryKey: [QUERYKEYS.GET_EVENT_DETAILS, projectId, eventId],
  });
};

export default useGetEventDetails;
