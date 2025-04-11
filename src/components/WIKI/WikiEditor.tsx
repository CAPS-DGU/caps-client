import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useWiki } from "../../hooks/useWiki";

const { TextArea } = Input;

interface WikiFormData {
  title: string;
  content: string;
}

export const WikiEditor: React.FC = () => {
  const { wiki_title } = useParams<{ wiki_title: string }>();
  const navigate = useNavigate();
  const { wikiData, loading, updateWiki, createWiki } = useWiki(wiki_title);
  const [form] = Form.useForm<WikiFormData>();

  const handleSubmit = useCallback(
    async (values: WikiFormData) => {
      try {
        if (wiki_title) {
          await updateWiki(values);
          message.success("문서가 수정되었습니다.");
        } else {
          await createWiki(values);
          message.success("문서가 생성되었습니다.");
        }
        navigate(`/wiki/${values.title}`);
      } catch (error) {
        message.error("문서 저장 중 오류가 발생했습니다.");
      }
    },
    [wiki_title, updateWiki, createWiki, navigate]
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={wikiData}
    >
      <Form.Item
        name="title"
        label="제목"
        rules={[{ required: true, message: "제목을 입력해주세요" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="content"
        label="내용"
        rules={[{ required: true, message: "내용을 입력해주세요" }]}
      >
        <TextArea rows={20} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          저장
        </Button>
      </Form.Item>
    </Form>
  );
};

export default WikiEditor;
