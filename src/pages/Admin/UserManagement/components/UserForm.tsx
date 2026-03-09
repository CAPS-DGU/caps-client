import React from "react";
import { Modal, Form, Input, Select } from "antd";
import { UserManagementTypes } from "../types/UserManagementTypes";
import { UserManagementStyles } from "../styles/UserManagementStyles";

interface UserFormProps {
  visible: boolean;
  title: string;
  form: any;
  initialValues: UserManagementTypes.User | null;
  onOk: () => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({
  visible,
  title,
  form,
  initialValues,
  onOk,
  onCancel,
}) => {
  return (
    <Modal
      title={title}
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      width={600}
    >
      <UserManagementStyles.Modal>
        <Form form={form} layout="vertical" initialValues={initialValues || {}}>
          <Form.Item
            name="username"
            label="사용자명"
            rules={[{ required: true, message: "사용자명을 입력해주세요" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="이메일"
            rules={[
              { required: true, message: "이메일을 입력해주세요" },
              { type: "email", message: "올바른 이메일 형식이 아닙니다" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="역할"
            rules={[{ required: true, message: "역할을 선택해주세요" }]}
          >
            <Select>
              <Select.Option value="admin">관리자</Select.Option>
              <Select.Option value="manager">매니저</Select.Option>
              <Select.Option value="user">일반 사용자</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="상태"
            rules={[{ required: true, message: "상태를 선택해주세요" }]}
          >
            <Select>
              <Select.Option value="active">활성</Select.Option>
              <Select.Option value="inactive">비활성</Select.Option>
              <Select.Option value="pending">대기중</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </UserManagementStyles.Modal>
    </Modal>
  );
};
