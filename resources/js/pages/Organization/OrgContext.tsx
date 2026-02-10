import { createContext, useContext } from 'react';
import { User } from '@/types/org-structure';

export const OrgContext = createContext<{ users: User[] }>({ users: [] });
export const useOrgContext = () => useContext(OrgContext);
