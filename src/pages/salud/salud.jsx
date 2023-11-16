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
  Select,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  reqAddRecordHealth,
  reqAddVacc,
  reqHealthList,
  reqShedId,
  reqUpdateRecordHealth,
  reqVaccList,
} from "../../api";
import { DATEFORMAT, PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
import dayjs from "dayjs";

const { Option } = Select;
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Salud() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVacOpen, setIsVacOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState();
  const [galpones, setGalpones] = useState([]);
  const [vacunas, setVacunas] = useState([]);

  const [form] = Form.useForm();
  const [myform] = Form.useForm();

  const getData = async (response) => {
    if (response) {
    } else {
      setLoading(true);
      response = await reqHealthList();
      const g = (await reqShedId()).data;
      setGalpones(g.data);
      const vacc = (await reqVaccList()).data;
      setVacunas(vacc.data);
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
      title: "Galpon",
      dataIndex: "id_galpon",
    },
    {
      title: "Vacuna",
      dataIndex: "nombre",
    },
    {
      title: "Fecha",
      dataIndex: "fecha",
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
                setId(record.id);
                showModal(record, true);
              }}
            >
              Modificar
            </Button>
          </>
        );
      },
    },
  ];

  const showModal = (record, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        id_galpon: record.id_galpon,
        fecha: dayjs(record.fecha, DATEFORMAT),
        id_vac: record.id_vac,
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
      value.id = id;
      result = (await reqUpdateRecordHealth(value)).data;
    } else {
      result = (await reqAddRecordHealth(value)).data;
    }
    // console.log(result);
    if (result.status === 0) {
      value.fecha = moment(value.fecha).format("YYYY-MM-DD");
      console.log(result.data);
      if (isUpdate) {
        let index = dataSource.findIndex((rec) => rec.id === id);
        dataSource[index] = result.data;
      } else {
        dataSource.unshift(result.data);
      }

      setDataSource([...dataSource]);
      message.success(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const extra = (
    <>
      <Button
        type="primary"
        danger
        style={{ marginRight: 10 }}
        onClick={() => {
          setIsVacOpen(true);
        }}
      >
        <PlusOutlined />
        Añadir Vacuna
      </Button>

      <Button
        type="primary"
        onClick={() => {
          setIsUpdate(false);
          setIsModalOpen(true);
        }}
      >
        <PlusOutlined />
        Registrar vacunación
      </Button>
    </>
  );

  const submitVac = async (value) => {
    // console.log(value);
    value.nombre_usuario = NOMBRE_USUARIO;
    // console.log(NOMBRE_USUARIO);
    let result = (await reqAddVacc(value)).data;

    if (result.status === 0) {
      setVacunas([...vacunas, result.data]);
      message.success(result.msg);
      setIsVacOpen(false);
      myform.resetFields();
    } else {
      message.error(result.msg);
    }
  };

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      ;
      <Modal
        title={isUpdate ? "Modificar Registro" : "Añadir Registro"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            label="Galpon"
            name="id_galpon"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Seleccione" allowClear disabled={isUpdate}>
              {galpones.map((gal) => (
                <Option value={gal.id_galpon} key={gal.id_galpon}>
                  {gal.id_galpon}
                </Option>
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
            <DatePicker />
          </Form.Item>

          <Form.Item
            label="Vacuna"
            name="id_vac"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select placeholder="Seleccione" allowClear>
              {vacunas.map((vac) => (
                <Option value={vac.id_vac} key={vac.id_vac}>
                  {vac.nombre}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Añadir Vacuna"
        open={isVacOpen}
        onOk={() => {
          myform.submit();
        }}
        onCancel={() => {
          setIsVacOpen(false);
          myform.resetFields();
        }}
      >
        <Form form={myform} onFinish={submitVac} {...formItemLayout}>
          <Form.Item
            label="Nombre de Vacuna"
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
                max: 200,
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
