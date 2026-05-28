import api from "../lib/api";

export interface Event {
  id: number;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  category?: string;
  location?: string;

  tickets?: {
    id: number;
    name?: string;
    price?: number;
    quota?: number;
    sold?: number;
  }[];
}

/////////////////////////////////////////////////////
// ✅ GET ALL EVENTS
/////////////////////////////////////////////////////
export async function getEvents() {
  const response =
    await api.get("/events");

  return response.data.data;
}

/////////////////////////////////////////////////////
// ✅ GET EVENT DETAIL
/////////////////////////////////////////////////////
export async function getEventById(
  id: number
) {
  const response =
    await api.get(`/events/${id}`);

  return response.data.data;
}

/////////////////////////////////////////////////////
// ✅ CREATE EVENT
/////////////////////////////////////////////////////
export async function createEvent(
  data: any
) {
  const response = await api.post(
    "/events",
    data
  );

  return response.data;
}

/////////////////////////////////////////////////////
// ✅ UPDATE EVENT
/////////////////////////////////////////////////////
export async function updateEvent(
  id: number,
  data: any
) {
  const response = await api.patch(
    `/events/${id}`,
    data
  );

  return response.data;
}

/////////////////////////////////////////////////////
// ✅ DELETE EVENT
/////////////////////////////////////////////////////
export async function deleteEvent(
  id: number
) {
  const response = await api.delete(
    `/events/${id}`
  );

  return response.data;
}