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
} from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  reqAddEggRec,
  reqBatchId,
  reqEggsList,
  reqUpdateEggRec,
} from "../../api";
import dayjs from "dayjs";
import { DATEFORMAT, PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function ProdHuevo() {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [id, setId] = useState();
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const response = await reqEggsList();
    const bat = (await reqBatchId()).data;
    setLotes(bat.data);
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
      title: "Fecha de Coleccion",
      dataIndex: "fec_coleccion",
      render: (fec) => moment(fec).format(DATEFORMAT),
    },
    {
      title: "Huevos buenos",
      dataIndex: "bueno",
    },
    {
      title: "Huevos podridos",
      dataIndex: "podrido",
    },
    {
      title: "Proveniente de",
      dataIndex: "lote",
      render: (lote) => lote.nombre,
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
              setId(rec.id_huevo);
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
        fec_coleccion: dayjs(rec.fec_coleccion, DATEFORMAT),
        podrido: rec.podrido,
        bueno: rec.bueno,
        id_lote: rec.id_lote,
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
      value.id_huevo = id;
      result = (await reqUpdateEggRec(value)).data;
    } else {
      result = (await reqAddEggRec(value)).data;
    }
    if (result.status === 0) {
      const bat = lotes.find((lote) => lote.id_lote === value.id_lote);
      // console.log(bat);
      if (isUpdate) {
        const index = dataSource.findIndex((rec) => rec.id_huevo === id);
        // console.log("-----", index);

        const data = {
          ...value,
          lote: {
            id_lote: value.id_lote,
            nombre: bat.nombre,
          },
        };
        // console.log(data);
        dataSource[index] = data;
      } else {
        const data = {
          ...result.data,
          lote: {
            id_lote: value.id_lote,
            nombre: bat.nombre,
          },
        };
        // console.log(data);
        dataSource.unshift(data);
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
      Registrar Coleccion de Huevos
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_huevo"
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
            label="Fecha de coleccion"
            name="fec_coleccion"
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Huevos buenos"
            name="bueno"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>

          <Form.Item
            label="Huevos podridos"
            name="podrido"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Proveniente de"
            name="id_lote"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Seleccione" allowClear>
              {lotes.map((lote) => (
                <Select.Option value={lote.id_lote} key={lote.id_lote}>
                  {lote.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
