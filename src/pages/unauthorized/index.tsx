import React from "react";
import { Result, Button } from "antd";
import { Link } from "react-router-dom";

const UnauthorizedPage: React.FC = () => (
  <Result
    status="403"
    title="403"
    subTitle="Xin lỗi, bạn không có quyền truy cập trang này."
    extra={
      <Button type="primary">
        <Link to="/">Về trang chủ</Link>
      </Button>
    }
  />
);

export default UnauthorizedPage;
