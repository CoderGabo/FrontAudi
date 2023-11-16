import { Button, Card, Table, message, Form, Modal, Input } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { reqAddVacc, reqUpdateVacc, reqVaccList } from "../../api";
import { PAGES_SIZE } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Vacuna() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);

  const [form] = Form.useForm();
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getData = async () => {
    setLoading(true);

    const result = (await reqVaccList()).data;

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
      title: "Descripcion",
      dataIndex: "descripcion",
      render: (des) => (des === null ? "-" : des),
    },
    {
      title: "Acción",
      render: (vac) => (
        <Button
          type="primary"
          onClick={() => {
            setId(vac.id);
            setIsUpdate(true);
            showModal(vac, true);
          }}
        >
          Modificar
        </Button>
      ),
    },
  ];

  const showModal = (vac, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        nombre: vac.nombre,
        descripcion: vac.descripcion,
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
      value.id_vac = id;
      result = (await reqUpdateVacc(value)).data;
      // console.log(value);
    } else {
      result = (await reqAddVacc(value)).data;
    }
    if (result.status === 0) {
      if (result.data) {
        setData([...data, result.data]);
      } else {
        let index = data.findIndex((vac) => vac.id === id);
        data[index] = { ...data[index], ...value };
        // console.log(data);
        setData([...data]);
      }
      // message.success(result.msg);
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
      <PlusOutlined /> Añadir Vacuna
    </Button>
  );
  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_vac"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={isUpdate ? "Modificar Vacuna" : "Añadir Vacuna"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
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
            label="Descripcion"
            name="descripcion"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
