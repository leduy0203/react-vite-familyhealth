import React, { useEffect, useState } from "react";
import {
  Table,
  Card,
  Tag,
  Button,
  Space,
  Input,
  Row,
  Col,
  Modal,
  Descriptions,
  message,
  Statistic,
  Badge,
} from "antd";
import type { TableColumnsType } from "antd";
import {
  HomeOutlined,
  SearchOutlined,
  UserOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

interface Member {
  id: number;
  fullName: string;
  relation: string;
  bhyt: string;
  memberStatus: "ACTIVE" | "INACTIVE";
}

interface Household {
  id: number;
  househeadId: number;
  address: string;
  quantity: number;
  isActive: boolean;
  members: Member[];
}

const relationMap: Record<string, string> = {
  CHU_HO: "Chủ hộ",
  VO: "Vợ",
  CHONG: "Chồng",
  CON: "Con",
  BO: "Bố",
  ME: "Mẹ",
  ANH: "Anh",
  CHI: "Chị",
  EM: "Em",
};

const HouseholdsPage: React.FC = () => {
  const [households, setHouseholds] = useState<Household[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadHouseholds();
  }, []);

  const loadHouseholds = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:8080/familyhealth/api/v1/households",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token") || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load households");
      }

      const data = await response.json();

      if (data.code === 200 && data.data) {
        setHouseholds(data.data);
      } else {
        throw new Error(data.message || "Failed to load households");
      }
    } catch (error) {
      console.error("Error loading households:", error);
      message.error("Không thể tải danh sách hộ gia đình");
    } finally {
      setLoading(false);
    }
  };

  const handleViewMembers = (household: Household) => {
    setSelectedHousehold(household);
    setModalVisible(true);
  };

  const filteredHouseholds = households.filter((household) => {
    const searchLower = searchText.toLowerCase();
    return (
      household.address.toLowerCase().includes(searchLower) ||
      household.members.some((member) =>
        member.fullName.toLowerCase().includes(searchLower)
      ) ||
      household.id.toString().includes(searchLower)
    );
  });

  const columns: TableColumnsType<Household> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Chủ hộ",
      key: "househead",
      render: (_, record) => {
        const househead = record.members.find(
          (m) => m.id === record.househeadId
        );
        return (
          <Space>
            <UserOutlined />
            {househead?.fullName || "N/A"}
          </Space>
        );
      },
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
    },
    {
      title: "Số thành viên",
      dataIndex: "quantity",
      key: "quantity",
      width: 130,
      align: "center",
      sorter: (a, b) => a.quantity - b.quantity,
      render: (quantity: number) => (
        <Badge
          count={quantity}
          showZero
          style={{ backgroundColor: "#1890ff" }}
        />
      ),
    },
    {
      title: "Trạng thái hộ",
      dataIndex: "isActive",
      key: "isActive",
      width: 130,
      align: "center",
      filters: [
        { text: "Hoạt động", value: true },
        { text: "Ngưng hoạt động", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (isActive: boolean) =>
        isActive ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Ngưng hoạt động
          </Tag>
        ),
    },
    {
      title: "Thành viên hoạt động",
      key: "activeMembers",
      width: 160,
      align: "center",
      render: (_, record) => {
        const activeCount = record.members.filter(
          (m) => m.memberStatus === "ACTIVE"
        ).length;
        return (
          <Tag color={activeCount === record.quantity ? "green" : "orange"}>
            {activeCount}/{record.quantity}
          </Tag>
        );
      },
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          size="small"
          onClick={() => handleViewMembers(record)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const memberColumns: TableColumnsType<Member> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Quan hệ",
      dataIndex: "relation",
      key: "relation",
      render: (relation: string) => (
        <Tag color="blue">{relationMap[relation] || relation}</Tag>
      ),
    },
    {
      title: "Số BHYT",
      dataIndex: "bhyt",
      key: "bhyt",
    },
    {
      title: "Trạng thái",
      dataIndex: "memberStatus",
      key: "memberStatus",
      render: (status: string) =>
        status === "ACTIVE" ? (
          <Tag icon={<CheckCircleOutlined />} color="success">
            Hoạt động
          </Tag>
        ) : (
          <Tag icon={<CloseCircleOutlined />} color="error">
            Ngưng
          </Tag>
        ),
    },
  ];

  const totalMembers = households.reduce((sum, h) => sum + h.quantity, 0);
  const activeHouseholds = households.filter((h) => h.isActive).length;
  const totalActiveMembers = households.reduce(
    (sum, h) =>
      sum + h.members.filter((m) => m.memberStatus === "ACTIVE").length,
    0
  );

  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Tổng số hộ gia đình"
              value={households.length}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Hộ đang hoạt động"
              value={activeHouseholds}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Tổng thành viên"
              value={totalMembers}
              suffix={`(${totalActiveMembers} hoạt động)`}
              prefix={<TeamOutlined />}
              valueStyle={{ color: "#faad14" }}
            />
          </Col>
        </Row>
      </Card>

      <Card
        title={
          <Space>
            <HomeOutlined style={{ fontSize: 20 }} />
            <span style={{ fontSize: 18, fontWeight: 600 }}>
              Quản lý hộ gia đình
            </span>
          </Space>
        }
      >
        <Space style={{ marginBottom: 16 }} wrap>
          <Input
            placeholder="Tìm kiếm theo địa chỉ, tên, ID..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 300 }}
            allowClear
          />
          <Button onClick={loadHouseholds} loading={loading}>
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => message.success('Chức năng xuất Excel đang được phát triển')}
            style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
          >
            Xuất Excel
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredHouseholds}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} hộ gia đình`,
          }}
          scroll={{ x: 1000 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <TeamOutlined style={{ color: "#1890ff" }} />
            <span>Chi tiết hộ gia đình - ID: {selectedHousehold?.id}</span>
          </Space>
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setModalVisible(false)}>
            Đóng
          </Button>,
        ]}
        width={900}
      >
        {selectedHousehold && (
          <>
            <Card size="small" style={{ marginBottom: 16 }}>
              <Descriptions column={2} bordered>
                <Descriptions.Item label="ID hộ">
                  {selectedHousehold.id}
                </Descriptions.Item>
                <Descriptions.Item label="ID chủ hộ">
                  {selectedHousehold.househeadId}
                </Descriptions.Item>
                <Descriptions.Item label="Địa chỉ" span={2}>
                  {selectedHousehold.address}
                </Descriptions.Item>
                <Descriptions.Item label="Số thành viên">
                  <Badge
                    count={selectedHousehold.quantity}
                    showZero
                    style={{ backgroundColor: "#1890ff" }}
                  />
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái hộ">
                  {selectedHousehold.isActive ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Hoạt động
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      Ngưng hoạt động
                    </Tag>
                  )}
                </Descriptions.Item>
              </Descriptions>
            </Card>

            <Card
              size="small"
              title={
                <Space>
                  <TeamOutlined />
                  Danh sách thành viên ({selectedHousehold.members.length})
                </Space>
              }
            >
              <Table
                columns={memberColumns}
                dataSource={selectedHousehold.members}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </>
        )}
      </Modal>
    </div>
  );
};

export default HouseholdsPage;
