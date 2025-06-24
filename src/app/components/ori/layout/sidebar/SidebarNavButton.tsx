import Link from "next/link";
import { Button } from "@/app/components/loveable";

interface SidebarNavButtonProps {
  path: string;
  active: boolean;
  icon: React.ComponentType<any>;
  label: string;
  onClick?: () => void;
  colorActive: string; // Tailwind gradient colors e.g. "from-blue-500 to-blue-600"
}

export const SidebarNavButton = ({ path, active, icon: Icon, label, onClick, colorActive }: SidebarNavButtonProps) => {
  return (
    <Link href={path} onClick={onClick}>
      <Button 
        variant={active ? "default" : "ghost"}
        size="lg"
        className={`w-full justify-start ${
          active
            ? `bg-gradient-to-r ${colorActive} hover:from-opacity-90 hover:to-opacity-90 text-white`
            : "hover:bg-gray-800 text-gray-300 hover:text-white"
        }`}
      >
        <Icon className="w-5 h-5 ml-3 flex-shrink-0" />
        {label}
      </Button>
    </Link>
  );
}

export default SidebarNavButton;