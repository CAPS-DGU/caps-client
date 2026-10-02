import { UserManagementTypes } from "../types/UserManagementTypes";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Space, Button, Tag } from "antd";

export const UserManagementUtils = {
  async fetchUsers(
    params: UserManagementTypes.SearchParams
  ): Promise<UserManagementTypes.PaginatedResponse<UserManagementTypes.User>> {
    const response = await fetch(
      `/api/users?${new URLSearchParams(params as any).toString()}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }
    return response.json();
  },

  async createUser(
    data: UserManagementTypes.UserFormData
  ): Promise<UserManagementTypes.User> {
    const response = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to create user");
    }
    return response.json();
  },

  async updateUser(
    id: string,
    data: UserManagementTypes.UserFormData
  ): Promise<UserManagementTypes.User> {
    const response = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error("Failed to update user");
    }
    return response.json();
  },

  async deleteUser(id: string): Promise<void> {
    const response = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user");
    }
  },

  getTableColumns(
    onEdit: (user: UserManagementTypes.User) => void,
    onDelete: (id: string) => void
  ) {
    return [
      {
        title: "사용자명",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "이메일",
        dataIndex: "email",
        key: "email",
      },
      {
        title: "역할",
        dataIndex: "role",
        key: "role",
        render: (role: UserManagementTypes.UserRole) => (
          <Tag
            color={
              role === "admin" ? "red" : role === "manager" ? "blue" : "default"
            }
          >
            {role}
          </Tag>
        ),
      },
      {
        title: "상태",
        dataIndex: "status",
        key: "status",
        render: (status: UserManagementTypes.UserStatus) => (
          <Tag
            color={
              status === "active"
                ? "green"
                : status === "inactive"
                ? "red"
                : "orange"
            }
          >
            {status}
          </Tag>
        ),
      },
      {
        title: "생성일",
        dataIndex: "createdAt",
        key: "createdAt",
        render: (date: string) => new Date(date).toLocaleDateString(),
      },
      {
        title: "작업",
        key: "action",
        render: (_: any, record: UserManagementTypes.User) => (
          <Space size="middle">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => onEdit(record)}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
            />
          </Space>
        ),
      },
    ];
  },
};
