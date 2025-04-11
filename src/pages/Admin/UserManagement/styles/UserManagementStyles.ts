import styled from "styled-components";

export const UserManagementStyles = {
  Container: styled.div`
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  `,

  Header: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #1a1a1a;
    }
  `,

  SearchForm: styled.form`
    display: flex;
    gap: 16px;
    margin-bottom: 24px;
    padding: 24px;
    background: #f5f5f5;
    border-radius: 8px;

    .ant-form-item {
      margin-bottom: 0;
    }
  `,

  TableContainer: styled.div`
    .ant-table-wrapper {
      background: #fff;
      border-radius: 8px;
      overflow: hidden;
    }
  `,

  Modal: styled.div`
    .ant-modal-content {
      border-radius: 8px;
    }

    .ant-modal-header {
      border-radius: 8px 8px 0 0;
    }

    .ant-modal-footer {
      border-radius: 0 0 8px 8px;
    }
  `,
};
