import { Users, Building, Shield, School, Home, Heart, Star, Target, Zap, BookOpen, Briefcase, Users2 } from "lucide-react";

// Direct mapping from group names to React components
export const GROUP_ICONS: Record<string, React.ComponentType<any>> = {
  // Add your specific group names here
  "שמירות מחנה": School,
  "שמירות יחידה": Shield,
  "תורנויות": Users,
};

// Default icon component for unmatched groups
export const DEFAULT_GROUP_ICON = Star;

// Function to get the icon component directly
export const getGroupIconComponent = (groupName: string) => {
  return GROUP_ICONS[groupName] || DEFAULT_GROUP_ICON;
};

// Utility function to add new group name
export const addGroupName = (groupName: string, iconComponent: React.ComponentType<any>) => {
  GROUP_ICONS[groupName] = iconComponent;
}; 