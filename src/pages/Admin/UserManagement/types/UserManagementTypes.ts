export namespace UserManagementTypes {
  export interface User {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
  }

  export type UserRole = "admin" | "user" | "manager";
  export type UserStatus = "active" | "inactive" | "pending";

  export interface SearchParams {
    keyword?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    pageSize?: number;
  }

  export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
  }

  export interface UserFormData {
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
  }
}
