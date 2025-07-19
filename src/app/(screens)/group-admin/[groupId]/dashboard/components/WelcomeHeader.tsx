import { Group } from "@/app/shared/types";

interface WelcomeHeaderProps {
  group: Group;
}

export const WelcomeHeader = ({ group }: WelcomeHeaderProps) => {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold text-white mb-2">
        ברוך הבא לניהול קבוצת {group.displayName}
      </h1>
      <p className="text-gray-400">
        כאן תוכל לנהל את כל היבטי הקבוצה - משמרות, משתמשים, בקשות ועוד
      </p>
    </div>
  );
}; 