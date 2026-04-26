import api from "../api";

const dispatchActivityUpdated = (userId) => {
  if (typeof window === "undefined") return;

  window.dispatchEvent(new CustomEvent("focusora-activity-updated", { detail: { userId } }));
};

export const pushActivityEvent = async (event) => {
  const payload = {
    type: String(event?.type || "activity"),
    title: String(event?.title || "New activity"),
    points: Math.max(0, Number(event?.points || 0) || 0),
    minutes: Math.max(0, Number(event?.minutes || 0) || 0),
    metadata: event?.metadata && typeof event.metadata === "object" ? event.metadata : {},
  };

  const response = await api.post("/users/activity", payload);
  const created = response?.data || null;
  dispatchActivityUpdated(String(created?.userId || ""));
  return created;
};

export const getUserActivityEvents = async (limit = 50) => {
  const response = await api.get(`/users/activity?limit=${Math.min(Math.max(Number(limit || 50), 1), 200)}`);
  return Array.isArray(response?.data) ? response.data : [];
};
