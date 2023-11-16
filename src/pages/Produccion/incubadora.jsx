import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  message,
  Form,
  DatePicker,
  InputNumber,
} from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { reqEndIncu, reqIncuList, reqStartIncu, reqaddIncu } from "../../api";
import {
  DATEHOURFORMAT,
  PAGES_SIZE,
  formItemLayout,
} from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
import { useNavigate } from "react-router-dom";
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Incubadora() {
  const [loading, setLoading] = useState(false);
  const [isInit, setIsInit] = useState(true);
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const response = await reqIncuList();

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
      title: "Nro. Incubadora",
      dataIndex: "id_inc",
    },
    {
      title: "Estado",
      dataIndex: "disponible",
      render: (dis) => (dis === true ? "Disponible" : "En uso"),
    },
    {
      title: "Fecha Inicio",
      dataIndex: "inicio",
      render: (ini) =>
        ini === null ? "-" : moment(ini).format(DATEHOURFORMAT),
    },
    {
      title: "Nro de huevos",
      dataIndex: "nro_huevos",
      render: (nro) => (nro === null ? "-" : nro),
    },

    {
      title: "Acción",
      render: (incu) => {
        return (
          <span>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              disabled={!incu.disponible}
              onClick={() => {
                setIsInit(true);
                showModal(incu);
              }}
            >
              Iniciar Incubación
            </Button>
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              disabled={incu.disponible}
              onClick={() => {
                setIsInit(false);
                showModal(incu);
                setId(incu.id_incub);
              }}
            >
              Detener Incubación
            </Button>
            <Button
              type="primary"
              onClick={() => {
                navigate("/produccion/incu-detalles", { state: { incu } });
              }}
            >
              Detalles
            </Button>
          </span>
        );
      },
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (incu) => {
    form.setFieldsValue({
      id_inc: incu.id_inc,
    });

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
    if (isInit) {
      result = (await reqStartIncu(value)).data;
    } else {
      value.id_incub = id;
      result = (await reqEndIncu(value)).data;
    }
    if (result.status === 0) {
      let index = dataSource.findIndex((inc) => inc.id_inc === value.id_inc);
      // console.log("-----", index);
      let data;
      if (isInit) {
        data = {
          ...dataSource[index],
          disponible: false,
          inicio: value.inicio,
          nro_huevos: value.nro_huevos,
          id_incub: result.data.id_incub,
        };
      } else {
        data = {
          ...dataSource[index],
          disponible: true,
          inicio: null,
          nro_huevos: null,
        };
      }
      dataSource[index] = data;
      setDataSource([...dataSource]);
      // console.log(dataSource[index]);
      // console.log(dataSource);
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const addIncubator = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de agregar una nueva incubadora?",
      onOk: async () => {
        const response = await reqaddIncu(NOMBRE_USUARIO);
        const result = response.data;
        // console.log(result);
        if (result.status === 0) {
          dataSource.push(result.data);
          setDataSource([...dataSource]);
        } else {
          message.error(result.msg);
        }
      },
    });
  };

  const extra = (
    <Button type="primary" onClick={addIncubator}>
      <PlusOutlined />
      Agregar Incubadora
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_inc"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      ;
      <Modal
        title={isInit ? "Iniciar Incubacion" : "Detener Incubacion"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isInit ? (
          <Form form={form} onFinish={onFinish} {...formItemLayout}>
            <Form.Item label="Incubadora" name="id_inc">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Fecha Inicio"
              name="inicio"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>

            <Form.Item
              label="Nro de huevos"
              name="nro_huevos"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} onFinish={onFinish} {...formItemLayout}>
            <Form.Item label="Incubadora" name="id_inc">
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Fecha de Finalizacion"
              name="finalizacion"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>

            <Form.Item
              label="Nro de huevos eclosionados"
              name="nro_eclosionado"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={0} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </Card>
  );
}
