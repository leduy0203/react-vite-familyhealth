import React from "react";
import { Card, Input, Select, Space, Button } from "antd";
import { SearchOutlined, ClearOutlined, FilterOutlined } from "@ant-design/icons";

export interface PatientFilterValues {
  search?: string;
  gender?: string;
  bloodType?: string;
  status?: string;
  dateRange?: [string, string];
}

interface PatientFilterProps {
  onFilterChange: (filters: PatientFilterValues) => void;
}

const PatientFilter: React.FC<PatientFilterProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = React.useState<PatientFilterValues>({});

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFieldChange = (field: keyof PatientFilterValues, value: any) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = () => {
    setFilters({});
    onFilterChange({});
  };

  return (
    <Card 
      size="small" 
      title={
        <Space>
          <FilterOutlined />
          <span>Bộ lọc</span>
        </Space>
      }
      style={{ marginBottom: 16 }}
    >
      <Space direction="vertical" style={{ width: "100%" }} size="middle">
        <Input
          placeholder="Tìm kiếm theo tên, email, số điện thoại..."
          prefix={<SearchOutlined />}
          value={filters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          allowClear
          size="large"
        />
        
        <Space wrap style={{ width: "100%" }}>
          <Select
            placeholder="Giới tính"
            style={{ width: 150 }}
            value={filters.gender}
            onChange={(value) => handleFieldChange("gender", value)}
            allowClear
          >
            <Select.Option value="male">Nam</Select.Option>
            <Select.Option value="female">Nữ</Select.Option>
            <Select.Option value="other">Khác</Select.Option>
          </Select>

          <Select
            placeholder="Nhóm máu"
            style={{ width: 150 }}
            value={filters.bloodType}
            onChange={(value) => handleFieldChange("bloodType", value)}
            allowClear
          >
            <Select.Option value="A+">A+</Select.Option>
            <Select.Option value="A-">A-</Select.Option>
            <Select.Option value="B+">B+</Select.Option>
            <Select.Option value="B-">B-</Select.Option>
            <Select.Option value="AB+">AB+</Select.Option>
            <Select.Option value="AB-">AB-</Select.Option>
            <Select.Option value="O+">O+</Select.Option>
            <Select.Option value="O-">O-</Select.Option>
          </Select>

          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            value={filters.status}
            onChange={(value) => handleFieldChange("status", value)}
            allowClear
          >
            <Select.Option value="active">Đang điều trị</Select.Option>
            <Select.Option value="inactive">Không hoạt động</Select.Option>
          </Select>

          <Button icon={<ClearOutlined />} onClick={handleClear}>
            Xóa bộ lọc
          </Button>
        </Space>
      </Space>
    </Card>
  );
};

export default PatientFilter;
