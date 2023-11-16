import {
  Button,
  Card,
  Table,
  message,
  Form,
  Modal,
  Input,
  Select,
  DatePicker,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import { DATEFORMAT, PAGES_SIZE, formItemLayout } from "../utils/constant";
import storageUtils from "../utils/storageUtils";
import {
  reqAddQuar,
  reqEndDate,
  reqQuarList,
  reqShedIdQuar,
  reqUpdateQuar,
} from "../api";
import dayjs from "dayjs";

const { Option } = Select;
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Cuarentena() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);
  const [galpones, setGalpones] = useState([]);
  const [isAdd, setIsAdd] = useState(true);
  const [endDate, setEndDate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);

    let result = (await reqQuarList()).data;
    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setData(result.data);
      result = (await reqShedIdQuar()).data;
      setGalpones(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Galpon",
      dataIndex: "id_galpon",
    },
    {
      title: "Fecha ingreso",
      dataIndex: "fecha_ingreso",
    },
    {
      title: "Fecha salida",
      dataIndex: "fecha_salida",
      render: (fec) => (fec === null ? "-" : fec),
    },
    {
      title: "Razon",
      dataIndex: "razon",
    },
    {
      title: "Acción",
      // ellipsis: true,
      render: (cuar) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setId(cuar.id_cuar);
              setIsAdd(false);
              setEndDate(false);
              form.setFieldsValue({
                id_galpon: cuar.id_galpon,
                fecha_ingreso: dayjs(cuar.fecha_ingreso, DATEFORMAT),
                razon: cuar.razon,
              });
              showModal();
            }}
          >
            Modificar
          </Button>
          <Button
            type="primary"
            danger
            disabled={cuar.fecha_salida !== null}
            onClick={() => {
              setId(cuar.id_cuar);
              setIsAdd(false);
              setEndDate(true);
              form.setFieldsValue({
                id_galpon: cuar.id_galpon,
                fecha_salida:
                  cuar.fecha_salida === null
                    ? null
                    : dayjs(cuar.fecha_salida, DATEFORMAT),
              });
              showModal();
            }}
          >
            Finalizar cuarentena
          </Button>
        </>
      ),
    },
  ];

  const showModal = () => {
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
    // console.log(value);
    let result;
    value.nombre_usuario = NOMBRE_USUARIO;
    // console.log(NOMBRE_USUARIO);
    if (isAdd) {
      result = (await reqAddQuar(value)).data;
      // console.log(value);
    } else {
      value.id_cuar = id;
      if (endDate) result = (await reqEndDate(value)).data;
      else result = (await reqUpdateQuar(value)).data;
    }
    // console.log(result);
    if (result.status === 0) {
      if (isAdd) {
        data.unshift(result.data);
      } else {
        let index = data.findIndex((ele) => ele.id_cuar === id);
        data[index] = { ...data[index], ...value };
        // console.log(data);
        message.success(result.msg);
      }
      setData([...data]);
      // console.log(data);
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
        setIsAdd(true);
        setEndDate(false);
        showModal();
      }}
    >
      <PlusOutlined /> Registar
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_cuar"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={
          isAdd
            ? "Registrar cuarentena"
            : endDate
            ? "Finalizar cuarentena"
            : "Modificar"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} {...formItemLayout}>
          <Form.Item
            label="Galpon"
            name="id_galpon"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              placeholder="Seleccione"
              allowClear
              disabled={!isAdd || endDate}
            >
              {galpones.map((gal) => (
                <Option value={gal.id_galpon} key={gal.id_galpon}>
                  {gal.id_galpon}
                </Option>
              ))}
            </Select>
          </Form.Item>
          {endDate ? (
            <Form.Item
              label="Fecha_salida"
              name="fecha_salida"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="Fecha Ingreso"
                name="fecha_ingreso"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <DatePicker />
              </Form.Item>
              <Form.Item
                label="Razon"
                name="razon"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  );
}
