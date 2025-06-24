interface SidebarSectionTitleProps {
    icon: React.ComponentType<any>;
    title: string;
    color: string;
  }
  
  export const SidebarSectionTitle = ({ icon: Icon, title, color }: SidebarSectionTitleProps) => {
    return (
      <div className={`flex items-center space-x-2 space-x-reverse px-3 mb-1 ${color}`}>
        <Icon className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wider">{title}</span>
      </div>
    );
  }

  export default SidebarSectionTitle;