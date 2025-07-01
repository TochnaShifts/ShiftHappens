import { loadUserContext } from "@/app/shared/loaders/loadUserContext";
import CalendarClient from "./CalendarClient";

export default async function CalendarPage() {
  const { user, userGroups, requests } = await loadUserContext();
  if (!user) {
    return <div>עליך להתחבר כדי לצפות בלוח השנה</div>;
  }
  return <CalendarClient user={user} userGroups={userGroups} requests={requests} />;
}