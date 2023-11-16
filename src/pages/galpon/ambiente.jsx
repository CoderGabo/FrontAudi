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
  Typography,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { reqAddAmbiente, reqAmbienteList, reqShedId } from "../../api";
import { DATEHOURFORMAT, PAGES_SIZE } from "../../utils/constant";
import moment from "moment";
import storageUtils from "../../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Ambiente() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [galpon, setGalpon] = useState([]);
  const [id, setId] = useState();
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);
    const gids = (await reqShedId()).data;
    let gal = [];

    if (gids.status === 0) {
      gids.data.forEach((s) =>
        gal.push({
          value: s.id_galpon,
          label: "Galpon " + s.id_galpon,
        })
      );
      setGalpon(gal);
      setId(gal[0].value);
    }
    const result = (await reqAmbienteList(gal[0].value)).data;
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

  const columns = [
    {
      title: "Fecha",
      dataIndex: "fecha",
      render: (f) => {
        return moment(f).format(DATEHOURFORMAT);
      },
    },

    {
      title: "Humedad",
      dataIndex: "humedad",
      render: (h) => h + " %",
    },
    {
      title: "Temperatura (°C)",
      dataIndex: "temperatura",
    },
    // {
    //   title:"Informe",
    //   render:(amb) =>{
    //     const sum =  amb.humedad + amb.temperatura;
    //     if(sum < 80){
    //       return "Aire frio/deficiente";
    //     }
    //     else if(sum >= 80 && sum <= 100){
    //       return "Las aves se sienten comodas";
    //     }
    //     else if(sum > 100 && sum < 114){
    //       return "Sensacion sofocante (caliente y humedo)";
    //     }else{
    //       return "Consecuencia fatal";
    //     }
    //   }
    // },
    {
      title: "Medidas a tomar",
      render: (amb) => {
        let temp = amb.temperatura;
        let hum = amb.humedad;
        let str = "";
        if (temp >= 18 && temp <= 35) {
          str = "";
        } else if (temp < 18) {
          str = "Utilizar sistema de Calefaccion ";
        } else {
          str = "Utilizar sistema de Ventilacion";
        }
        if (str !== "") {
          str += "  ";
        }
        if (hum < 40) {
          str += "Utilizar sistema de nebulización";
        } else if (hum >= 40 && hum <= 70) {
          str += "";
        } else {
          str += "Utilizar deshumidificadores ";
        }
        if (str === "") {
          str = "Ninguna";
        }
        return str;
      },
    },
  ];

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (value) => {
    value.nombre_usuario = NOMBRE_USUARIO;
    // console.log(value);
    let result = (await reqAddAmbiente(value)).data;

    // console.log(result);
    if (result.status === 0) {
      if (value.id_galpon === id) {
        setDataSource([result.data, ...dataSource]);
      }
      // console.log([...dataSource, result.data]);
      message.success(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      <PlusOutlined />
      Registrar Temperatura Humedad
    </Button>
  );

  const onSelect = async (value) => {
    setId(value);
    const result = (await reqAmbienteList(value)).data;
    if (result.status === 0) {
      setDataSource(result.data);
    } else {
      message.error(result.msg);
    }
  };
  const title = (
    <Select
      value={id}
      style={{
        width: 200,
      }}
      onSelect={onSelect}
      options={galpon}
    />
  );
  return (
    <Card title={title} extra={extra}>
      <Typography.Title level={2}>Galpon {id}</Typography.Title>
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
        title="Registrar temperatura & humedad"
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
            <Select>
              {galpon.map((ele) => (
                <Select.Option value={ele.value} key={ele.value}>
                  {ele.value}
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
            <DatePicker showTime />
          </Form.Item>

          <Form.Item
            label="Temperatura"
            name="temperatura"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Humedad"
            name="humedad"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
