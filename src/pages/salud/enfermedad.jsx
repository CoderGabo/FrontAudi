import { Button, Card, Table, message, Form, Modal, Input } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { reqAddEnf, reqEnfList, reqUpdateEnf } from "../../api";
import { PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Enfermedad() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);

  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getData = async () => {
    setLoading(true);

    const result = (await reqEnfList()).data;

    setLoading(false);
    if (result.status === 0) {
      setData(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Nombre",
      dataIndex: "nombre",
    },
    {
      title: "Sintomas",
      dataIndex: "sintoma",
    },
    {
      title: "Acción",
      render: (enf) => (
        <Button
          type="primary"
          onClick={() => {
            setId(enf.id_enf);
            setIsUpdate(true);
            showModal(enf, true);
          }}
        >
          <EditOutlined />
        </Button>
      ),
    },
  ];

  const showModal = (enf, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        nombre: enf.nombre,
        sintoma: enf.sintoma,
      });
    }
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (value) => {
    let result;
    value.nombre_usuario = NOMBRE_USUARIO;
    // console.log(NOMBRE_USUARIO);
    if (isUpdate) {
      value.id_enf = id;
      result = (await reqUpdateEnf(value)).data;
    } else {
      result = (await reqAddEnf(value)).data;
    }
    // console.log(value);
    if (result.status === 0) {
      if (isUpdate) {
        let index = data.findIndex((enf) => enf.id_enf === id);
        let en = {
          ...data[index],
          nombre: value.nombre,
          sintoma: value.sintoma,
        };
        data[index] = en;
        //   console.log(data[index]);
      } else {
        data.push(result.data);
      }
      setData([...data]);
      // console.log(data);
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsUpdate(false);
        showModal();
      }}
    >
      <PlusOutlined /> Registrar Enfermedad
    </Button>
  );
  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_enf"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={isUpdate ? "Modificar enfermedad" : "Registrar enfermedad"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} {...formItemLayout}>
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Sintomas"
            name="sintoma"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea
              autoSize={{
                minRows: 3,
                maxRows: 6,
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
