import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  message,
  Form,
  InputNumber,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqUpdateShed, reqAddShed, reqShedList } from "../../api";
import { PAGES_SIZE } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;
export default function Galpon() {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState();
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);

    const result = (await reqShedList()).data;

    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setDataSource(result.data);
      // console.log(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const expandedRowRender = (record) => {
    const data = record.lotes;

    const columns = [
      {
        title: "Lote",
        dataIndex: "nombre",
      },
      {
        title: "Cantidad",
        render: (rec) => rec.cantidad - rec.mortalidad,
      },
      {
        title: "Cantidad defuncion",
        dataIndex: "mortalidad",
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey={(data) => data.id_lote}
      />
    );
  };

  const columns = [
    {
      title: "Galpon",
      dataIndex: "id_galpon",
    },
    {
      title: "Dimension (m^2)",
      dataIndex: "dimension",
    },
    {
      title: "Capacidad",
      dataIndex: "capacidad",
    },
    {
      title: "Capacidad Libre",
      dataIndex: "capacidad_libre",
    },
    {
      title: "Acción",
      render: (galpon) => {
        return (
          <span>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                setIsUpdate((_) => true);
                setId(galpon.id_galpon);
                showModal(galpon, true);
              }}
            >
              Modificar
            </Button>
          </span>
        );
      },
    },
  ];

  const showModal = (galpon, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        dimension: galpon.dimension,
        capacidad: galpon.capacidad,
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
    // console.log(value);
    if (isUpdate) {
      value.id_galpon = id;
      result = (await reqUpdateShed(value)).data;
    } else {
      result = (await reqAddShed(value)).data;
    }
    console.log(result);
    if (result.status === 0) {
      if (isUpdate) {
        let index = dataSource.findIndex((galpon) => galpon.id_galpon === id);
        dataSource[index] = result.data;
        setDataSource([...dataSource]);
      } else {
        setDataSource([...dataSource, result.data]);
      }
      message.success(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsUpdate(false);
        setIsModalOpen(true);
      }}
    >
      <PlusOutlined />
      Añadir Nuevo Galpon
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_galpon"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        expandable={{
          expandedRowRender,
          defaultExpandedRowKeys: ["0"],
        }}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      ;
      <Modal
        title={isUpdate ? "Modificar Galpon" : "Añadir Galpon"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
          {isUpdate ? (
            <Input value={id} disabled style={{ marginBottom: 10 }}></Input>
          ) : (
            ""
          )}

          <Form.Item
            label="Dimensiones"
            name="dimension"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^\d+x\d+$/,
                message: "Por favor seguir el formato",
              },
            ]}
          >
            <Input placeholder="Formato a introducir: anchoxlargo. Ej:6x18" />
          </Form.Item>

          <Form.Item
            label="Capacidad"
            name="capacidad"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
