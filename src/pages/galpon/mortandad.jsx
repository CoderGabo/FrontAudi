import React, { useEffect, useState } from "react";
import {
  Card,
  Button,
  Table,
  Modal,
  message,
  Form,
  InputNumber,
  DatePicker,
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqBatchId, reqMortList, reqAddMort, reqUpdateMort } from "../../api";
import {
  DATEHOURFORMAT,
  PAGES_SIZE,
  formItemLayout,
} from "../../utils/constant";
import moment from "moment";
import storageUtils from "../../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Mortandad() {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lotes, setLotes] = useState([]);
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const result = (await reqMortList()).data;
    const bat = (await reqBatchId()).data;
    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setDataSource(result.data);
      setLotes(bat.data);
      // console.log(result.data);
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
      dataIndex: "fecha",
      render: (f) => {
        return moment(f).format(DATEHOURFORMAT);
      },
    },
    {
      title: "Cantidad Defuncion",
      dataIndex: "cantidad_defuncion",
    },
    {
      title: "Acción",
      render: (rec) => {
        return (
          <span>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                setIsUpdate((_) => true);
                showModal(rec, true);
              }}
            >
              Modificar
            </Button>
          </span>
        );
      },
    },
  ];

  const showModal = (rec, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        id_lote: rec.id_lote,
        fecha: moment(rec.fecha, DATEHOURFORMAT),
        cantidad_defuncion: rec.cantidad_defuncion,
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
    // console.log(NOMBRE_USUARIO);
    if (isUpdate) {
      result = (await reqUpdateMort(value)).data;
    } else {
      result = (await reqAddMort(value)).data;
    }
    // console.log(result);
    if (result.status === 0) {
      if (isUpdate) {
        let index = dataSource.findIndex(
          (ele) => ele.id_lote === value.id_lote
        );
        dataSource[index] = result.data;
        setDataSource([...dataSource]);
      } else {
        let lote = lotes.find((ele) =>
          ele.id_lote === value.id_lote ? ele : null
        );
        result.data.lote = lote;
        setDataSource([result.data, ...dataSource]);
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
      Registrar mortandad
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="fecha"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      ;
      <Modal
        title={isUpdate ? "Modificar Mortandad" : "Añadir Mortandad"}
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
            <Select disabled={isUpdate}>
              {lotes.map((ele) => (
                <Select.Option value={ele.id_lote} key={ele.id_lote}>
                  {ele.nombre}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Fecha"
            name="fecha"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <DatePicker showTime format={DATEHOURFORMAT} disabled={isUpdate} />
          </Form.Item>

          <Form.Item
            label="Cantidad Defuncion "
            name="cantidad_defuncion"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <InputNumber min={0} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
