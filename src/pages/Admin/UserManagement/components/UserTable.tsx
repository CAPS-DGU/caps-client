import React from "react";
import { Table } from "antd";
import { UserManagementTypes } from "../types/UserManagementTypes";
import { UserManagementStyles } from "../styles/UserManagementStyles";

interface UserTableProps {
  columns: any[];
  dataSource: UserManagementTypes.User[];
  pagination: {
    total: number;
    current: number;
    pageSize: number;
  };
  loading: boolean;
  onChange: (pagination: any) => void;
  onEdit: (user: UserManagementTypes.User) => void;
  onDelete: (id: string) => void;
  deleteLoading: boolean;
}

export const UserTable: React.FC<UserTableProps> = ({
  columns,
  dataSource,
  pagination,
  loading,
  onChange,
  onEdit,
  onDelete,
  deleteLoading,
}) => {
  return (
    <UserManagementStyles.TableContainer>
      <Table
        columns={columns}
        dataSource={dataSource}
        pagination={pagination}
        loading={loading}
        onChange={onChange}
        rowKey="id"
      />
    </UserManagementStyles.TableContainer>
  );
};
