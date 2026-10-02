import React, { createContext, useContext, ReactNode } from "react";
import { UserManagementTypes } from "../types/UserManagementTypes";

interface UserManagementContextType {
  searchParams: UserManagementTypes.SearchParams;
  setSearchParams: (params: UserManagementTypes.SearchParams) => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
  editingUser: UserManagementTypes.User | null;
  setEditingUser: (user: UserManagementTypes.User | null) => void;
}

const UserManagementContext = createContext<
  UserManagementContextType | undefined
>(undefined);

interface UserManagementProviderProps {
  children: ReactNode;
  value: UserManagementContextType;
}

export const UserManagementProvider: React.FC<UserManagementProviderProps> = ({
  children,
  value,
}) => {
  return (
    <UserManagementContext.Provider value={value}>
      {children}
    </UserManagementContext.Provider>
  );
};

export const useUserManagementContext = () => {
  const context = useContext(UserManagementContext);
  if (context === undefined) {
    throw new Error(
      "useUserManagementContext must be used within a UserManagementProvider"
    );
  }
  return context;
};
