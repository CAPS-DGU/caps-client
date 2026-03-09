export interface User {
  id: string;
  name: string;
  email: string;
  grade: string;
  role: "admin" | "member" | "guest" | "system";
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
