import { useUser } from '@/app/contexts/UserContext';

export const useAuth = () => {
  return useUser();
}; 