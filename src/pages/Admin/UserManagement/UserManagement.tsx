import React, { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Input,
  Select,
  Table,
  Modal,
  Form,
  message,
  Space,
  Tag,
  Tooltip,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useUserManagement } from "./hooks/useUserManagement";
import { UserForm } from "./components/UserForm";
import { UserSearch } from "./components/UserSearch";
import { UserTable } from "./components/UserTable";
import { UserManagementProvider } from "./context/UserManagementContext";
import { UserManagementStyles } from "./styles/UserManagementStyles";
import { UserManagementTypes } from "./types/UserManagementTypes";
import { UserManagementUtils } from "./utils/UserManagementUtils";

const UserManagement: React.FC = () => {
  const {
    searchParams,
    setSearchParams,
    handleSearch,
    handleReset,
    handleTableChange,
    handleDelete,
    handleEdit,
    handleAdd,
    handleModalOk,
    handleModalCancel,
    isModalVisible,
    editingUser,
    modalTitle,
    form,
    tableData,
    pagination,
    loading,
    deleteLoading,
    columns,
  } = useUserManagement();

  return (
    <UserManagementProvider>
      <UserManagementStyles.Container>
        <UserManagementStyles.Header>
          <h1>사용자 관리</h1>
          <Button type="primary" icon={<UserAddOutlined />} onClick={handleAdd}>
            사용자 추가
          </Button>
        </UserManagementStyles.Header>

        <UserSearch
          searchParams={searchParams}
          onSearch={handleSearch}
          onReset={handleReset}
          onSearchParamsChange={setSearchParams}
        />

        <UserTable
          columns={columns}
          dataSource={tableData}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
          deleteLoading={deleteLoading}
        />

        <UserForm
          visible={isModalVisible}
          title={modalTitle}
          form={form}
          initialValues={editingUser}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
        />
      </UserManagementStyles.Container>
    </UserManagementProvider>
  );
};

export default UserManagement;
