import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form,
  Select,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  reqAddDescarte,
  reqBatchId,
  reqDeleteDescarte,
  reqDescarteList,
  reqUpdateDescarte,
} from "../../api";
import { PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Descarte() {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [form] = Form.useForm();

  const getData = async (response) => {
    if (response) {
    } else {
      setLoading(true);
      const bat = (await reqBatchId()).data;
      if (bat.status === 0) {
        let newBat = bat.data.filter((element) => element.archivado === true);
        setLotes(newBat);
      }
      response = await reqDescarteList();
    }

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
      title: "Lote",
      dataIndex: "lote",
      render: (lote) => lote.nombre,
    },
    {
      title: "Fecha",
      dataIndex: "lote",
      render: (lote) => lote.fecha_salida,
    },
    {
      title: "Cantidad antes de la salida",
      dataIndex: "lote",
      render: (lote) => lote.cantidad - lote.mortalidad,
    },
    {
      title: "Descarte",
      render: (rec) => {
        let porc =
          (rec.cantidad / (rec.lote.cantidad - rec.lote.mortalidad)) * 100;
        return rec.cantidad + ` (${porc} %)`;
      },
    },
    {
      title: "Acción",
      render: (record) => {
        return (
          <>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                setIsUpdate((_) => true);
                setId(record.id_des);
                showModal(record, true);
              }}
            >
              <EditOutlined />
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              danger
              onClick={() => deleteBatch(record.id_des)}
            >
              <DeleteOutlined />
            </Button>
          </>
        );
      },
    },
  ];

  const showModal = (record, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        id_lote: record.id_lote,
        cantidad: record.cantidad,
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
    console.log(value);

    if (isUpdate) {
      value.id_des = id;
      result = (await reqUpdateDescarte(value)).data;
    } else {
      result = (await reqAddDescarte(value)).data;
    }
    if (result.status === 0) {
      if (isUpdate) {
        let index = dataSource.findIndex((rec) => rec.id_des === id);
        dataSource[index] = { ...dataSource[index], cantidad: value.cantidad };
      } else {
        dataSource.push(result.data);
        let index = lotes.findIndex((rec) => rec.id_lote === value.id_lote);
        lotes.splice(index, 1);
        setLotes([...lotes]);
      }
      setDataSource([...dataSource]);
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteBatch = (id_des) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de eliminar este registro?",
      onOk: async () => {
        // console.log(NOMBRE_USUARIO);
        const result = (await reqDeleteDescarte(NOMBRE_USUARIO, id_des)).data;
        if (result.status === 0) {
          let index = dataSource.findIndex((rec) => rec.id_des === id_des);
          dataSource.splice(index, 1);
          setDataSource([...dataSource]);
        } else {
          message.error(result.msg);
        }
        // console.log(dataSource);
      },
    });
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
      Registrar Descarte
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_des"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={isUpdate ? "Modificar Registro" : "Registrar Descarte"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} {...formItemLayout}>
          <Form.Item
            label="Lote"
            name="id_lote"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Seleccione" allowClear disabled={isUpdate}>
              {lotes.map((lote) => (
                <Select.Option value={lote.id_lote} key={lote.id_lote}>
                  {lote.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Cant. Descarte"
            name="cantidad"
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
