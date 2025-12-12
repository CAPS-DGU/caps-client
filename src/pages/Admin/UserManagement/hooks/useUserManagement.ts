import { useState, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Form } from "antd";
import { message } from "antd";
import { UserManagementTypes } from "../types/UserManagementTypes";
import { UserManagementUtils } from "../utils/UserManagementUtils";

export const useUserManagement = () => {
  const [searchParams, setSearchParams] =
    useState<UserManagementTypes.SearchParams>({
      keyword: "",
      role: "",
      status: "",
    });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] =
    useState<UserManagementTypes.User | null>(null);
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data, isLoading: loading } = useQuery({
    queryKey: ["users", searchParams],
    queryFn: () => UserManagementUtils.fetchUsers(searchParams),
  });

  const deleteMutation = useMutation({
    mutationFn: UserManagementUtils.deleteUser,
    onSuccess: () => {
      message.success("사용자가 삭제되었습니다.");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const handleSearch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["users"] });
  }, [queryClient]);

  const handleReset = useCallback(() => {
    setSearchParams({
      keyword: "",
      role: "",
      status: "",
    });
  }, []);

  const handleTableChange = useCallback((pagination: any) => {
    setSearchParams((prev) => ({
      ...prev,
      page: pagination.current,
      pageSize: pagination.pageSize,
    }));
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation]
  );

  const handleEdit = useCallback(
    (user: UserManagementTypes.User) => {
      setEditingUser(user);
      form.setFieldsValue(user);
      setIsModalVisible(true);
    },
    [form]
  );

  const handleAdd = useCallback(() => {
    setEditingUser(null);
    form.resetFields();
    setIsModalVisible(true);
  }, [form]);

  const handleModalOk = useCallback(async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await UserManagementUtils.updateUser(editingUser.id, values);
        message.success("사용자가 수정되었습니다.");
      } else {
        await UserManagementUtils.createUser(values);
        message.success("사용자가 추가되었습니다.");
      }
      setIsModalVisible(false);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  }, [editingUser, form, queryClient]);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    form.resetFields();
  }, [form]);

  const columns = useMemo(
    () => UserManagementUtils.getTableColumns(handleEdit, handleDelete),
    [handleEdit, handleDelete]
  );

  const tableData = useMemo(() => data?.items || [], [data]);
  const pagination = useMemo(
    () => ({
      total: data?.total || 0,
      current: searchParams.page || 1,
      pageSize: searchParams.pageSize || 10,
    }),
    [data, searchParams]
  );

  return {
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
    modalTitle: editingUser ? "사용자 수정" : "사용자 추가",
    form,
    tableData,
    pagination,
    loading,
    deleteLoading: deleteMutation.isPending,
    columns,
  };
};
