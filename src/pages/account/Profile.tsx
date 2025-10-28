import React, { useEffect } from "react";
import { Form, Input, Button, Row, Col, message } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchProfile, saveProfile } from "../../redux/slice/profileSlice";

const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.profile.profile);
  const loading = useAppSelector((s) => s.profile.loading);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchProfile());
  }, []);

  useEffect(() => {
    if (profile) form.setFieldsValue(profile);
  }, [profile]);

  const onFinish = async (values: any) => {
    try {
      await dispatch(saveProfile(values)).unwrap();
      message.success("Lưu hồ sơ thành công");
    } catch (err) {
      message.error("Lưu thất bại");
    }
  };

  return (
    <div>
      <h2>Hồ sơ cá nhân</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{}}
      >
        <Row gutter={12}>
          <Col span={12}>
            <Form.Item label="Họ tên" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Giới tính" name="gender">
              <Input />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="Ngày sinh" name="dob">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item
          label="Liên hệ khẩn cấp"
          name={["emergencyContact", "phone"]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Tiền sử bệnh" name="medicalHistory">
          <Input.TextArea />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProfilePage;
