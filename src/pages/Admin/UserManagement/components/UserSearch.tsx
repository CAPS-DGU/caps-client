import React from "react";
import { Form, Input, Select, Button, Space } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { UserManagementTypes } from "../types/UserManagementTypes";
import { UserManagementStyles } from "../styles/UserManagementStyles";

interface UserSearchProps {
  searchParams: UserManagementTypes.SearchParams;
  onSearch: () => void;
  onReset: () => void;
  onSearchParamsChange: (params: UserManagementTypes.SearchParams) => void;
}

export const UserSearch: React.FC<UserSearchProps> = ({
  searchParams,
  onSearch,
  onReset,
  onSearchParamsChange,
}) => {
  const [form] = Form.useForm();

  const handleValuesChange = (
    _: any,
    allValues: UserManagementTypes.SearchParams
  ) => {
    onSearchParamsChange(allValues);
  };

  return (
    <UserManagementStyles.SearchForm>
      <Form
        form={form}
        layout="inline"
        onValuesChange={handleValuesChange}
        initialValues={searchParams}
      >
        <Form.Item name="keyword">
          <Input
            placeholder="검색어 입력"
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item name="role">
          <Select placeholder="역할 선택" allowClear style={{ width: 120 }}>
            <Select.Option value="admin">관리자</Select.Option>
            <Select.Option value="manager">매니저</Select.Option>
            <Select.Option value="user">일반 사용자</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="status">
          <Select placeholder="상태 선택" allowClear style={{ width: 120 }}>
            <Select.Option value="active">활성</Select.Option>
            <Select.Option value="inactive">비활성</Select.Option>
            <Select.Option value="pending">대기중</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>
              검색
            </Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>
              초기화
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </UserManagementStyles.SearchForm>
  );
};
