import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form,
  DatePicker,
  InputNumber,
  Select,
  Input,
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  reqAddFeeding,
  reqFeedingList,
  reqShedId,
  reqUpdateFeeding,
} from "../../api";
import dayjs from "dayjs";
import { DATEFORMAT, PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Alimentacion() {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [galpones, setGalpones] = useState([]);
  const [id, setId] = useState();
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const response = await reqFeedingList();
    const bat = (await reqShedId()).data;
    setGalpones(bat.data);
    const result = response.data;

    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setDataSource(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Fecha de Alimentacion",
      dataIndex: "fecha",
      render: (fec) => moment(fec).format(DATEFORMAT),
    },
    {
      title: "Alimentos",
      dataIndex: "alimento",
    },
    {
      title: "Cantidad (kg)",
      dataIndex: "cantidad",
    },
    {
      title: "Galpon",
      dataIndex: "id_galpon",
      render: (gal) => "Galpon " + gal,
    },
    {
      title: "Acción",
      render: (rec) => {
        return (
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setIsUpdate(true);
              showModal(rec, true);
              setId(rec.id_alim);
            }}
          >
            <EditOutlined />
          </Button>
        );
      },
    },
  ];

  const showModal = (rec, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        fecha: dayjs(rec.fecha, DATEFORMAT),
        alimento: rec.alimento,
        cantidad: rec.cantidad,
        id_galpon: rec.id_galpon,
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
      value.id_alim = id;
      result = (await reqUpdateFeeding(value)).data;
    } else {
      result = (await reqAddFeeding(value)).data;
    }
    if (result.status === 0) {
      // console.log(bat);
      if (isUpdate) {
        const index = dataSource.findIndex((rec) => rec.id_alim === id);
        // console.log("-----", index);

        dataSource[index] = { ...value };
      } else {
        dataSource.unshift(result.data);
      }
      setDataSource([...dataSource]);
      // console.log(dataSource);
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
        setIsModalOpen(true);
      }}
    >
      <PlusOutlined />
      Registrar Alimentacion
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_alim"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      ;
      <Modal
        title={isUpdate ? "Modificar Registro" : "Registrar nueva coleccion"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} {...formItemLayout}>
          <Form.Item
            label="Fecha de Alimentacion"
            name="fecha"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Alimentos"
            name="alimento"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Cantidad (kg)"
            name="cantidad"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Galpon"
            name="id_galpon"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Seleccione" allowClear>
              {galpones.map((gal) => (
                <Select.Option value={gal.id_galpon} key={gal.id_galpon}>
                  {gal.id_galpon}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
