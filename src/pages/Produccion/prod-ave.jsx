import React, { useEffect, useState } from "react";
import {
  Card,
  Input,
  Button,
  Table,
  Modal,
  message,
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  MoreOutlined,
} from "@ant-design/icons";
import {
  reqAddBatch,
  reqBatchList,
  reqDeleteBatch,
  reqEditBatch,
  reqEndBatch,
  reqSearchBatch,
  reqShedList,
  reqSpeciesList,
  reqUpdateShedBatch,
} from "../../api";
import { DATEFORMAT, PAGES_SIZE } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const { Option } = Select;
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function ProdAve() {
  const [loading, setLoading] = useState(false);

  const [isUpdate, setIsUpdate] = useState(false);
  const [isEnd, setIsEnd] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [id, setId] = useState();
  const [galpones, setGalpones] = useState([]);
  const [aves, setAves] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState();

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const getData = async (response) => {
    if (response) {
    } else {
      setLoading(true);
      response = await reqBatchList();
      const g = (await reqShedList()).data;
      setGalpones(g.data);
      const esp = (await reqSpeciesList()).data;
      setAves(esp.data);
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

  const onSelect = async (value, id_lote) => {
    // console.log(value, id_lote);
    const result = (await reqUpdateShedBatch(id_lote, value, NOMBRE_USUARIO))
      .data;
    if (result.status === 0) {
      message.success(result.msg);
    } else {
      message.error(result.msg);
    }
  };

  const columns = [
    {
      title: "Nombre Lote",
      dataIndex: "nombre",
    },
    {
      title: "Fecha Ingreso",
      dataIndex: "fecha_ingreso",
    },
    {
      title: "Especie",
      dataIndex: "ave",
      render: (ave) => ave.especie,
    },
    {
      title: "Calidad",
      dataIndex: "calidad",
      render: (cal) =>
        cal === "B"
          ? "Buena"
          : cal === "R"
          ? "Regular"
          : cal === "M"
          ? "Mala"
          : "-",
    },
    {
      title: "Cant. actual",
      render: (ave) => ave.cantidad - ave.mortalidad,
    },
    {
      title: "Galpon",
      render: (lote) => (
        <Select
          defaultValue={lote.id_galpon}
          onSelect={(value) => onSelect(value, lote.id_lote)}
          disabled={lote.archivado}
        >
          {galpones.map((gal) => (
            <Option value={gal.id_galpon} key={gal.id_galpon}>
              {gal.id_galpon}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Acción",
      render: (lote) => {
        return (
          <>
            {lote.archivado === false ? (
              <>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    setIsEnd(false);
                    setIsUpdate((_) => true);
                    setId(lote.id_lote);
                    showModal(lote, true);
                  }}
                >
                  <EditOutlined />
                </Button>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  danger
                  onClick={() => deleteBatch(lote.id_lote)}
                >
                  <DeleteOutlined />
                </Button>
              </>
            ) : null}
            <Button
              type="primary"
              style={{ marginRight: 10 }}
              onClick={() => {
                navigate("/produccion/ave-detalles", { state: { lote } });
              }}
            >
              <MoreOutlined />
            </Button>

            {lote.fecha_salida === null ? (
              <Button
                type="primary"
                style={{ marginRight: 10 }}
                onClick={() => {
                  setIsUpdate(false);
                  setId(lote.id_lote);
                  setIsEnd(true);
                  showModal(lote);
                }}
              >
                Finalizar
              </Button>
            ) : null}
          </>
        );
      },
    },
  ];

  const showModal = (lote, isUpdate) => {
    if (isUpdate) {
      form.setFieldsValue({
        nombre: lote.nombre,
        fecha_ingreso: dayjs(lote.fecha_ingreso, DATEFORMAT),
        origen: lote.origen,
        cantidad: lote.cantidad,
        descripcion: lote.descripcion,
        id_ave: lote.id_ave,
        calidad: lote.calidad,
      });

      if (lote.ave.id === 1) {
        setSelected(1);
      }
    }
    if (isEnd) {
      form.setFieldsValue({
        nombre: lote.nombre,
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
      value.id_lote = id;
      if (value.id_ave !== 1) {
        value.calidad = null;
      }
      result = (await reqEditBatch(value)).data;
    } else if (isEnd) {
      value.id_lote = id;
      result = (await reqEndBatch(value)).data;
    } else {
      result = (await reqAddBatch(value)).data;
    }
    if (result.status === 0) {
      // value.fecha_ingreso = moment(value.fecha).format("YYYY-MM-DD");
      if (isEnd) {
        let index = dataSource.findIndex((lote) => lote.id_lote === id);
        dataSource[index] = {
          ...dataSource[index],
          fecha_salida: value.fecha_salida,
          destino: value.destino,
          archivado: true,
        };
      } else if (isUpdate) {
        let index = dataSource.findIndex((lote) => lote.id_lote === id);
        dataSource[index] = { ...dataSource[index], ...value };
      } else {
        dataSource.push(result.data);
      }
      setDataSource([...dataSource]);
      message.success(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const deleteBatch = (id_lote) => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de eliminar este lote?",
      onOk: async () => {
        const result = (await reqDeleteBatch(id_lote, NOMBRE_USUARIO)).data;
        if (result.status === 0) {
          let index = dataSource.findIndex((lote) => lote.id_lote === id_lote);
          dataSource.splice(index, 1);
          setDataSource([...dataSource]);
        } else {
          message.error(result.msg);
        }
        // console.log(dataSource);
      },
    });
  };

  const onSearch = async (value) => {
    const response = await reqSearchBatch(value);
    getData(response);
    // console.log(response);
  };

  const title = (
    <Row
      gutter={{
        xs: 8,
        sm: 16,
      }}
    >
      <Col className="gutter-row" span={16}>
        <Search
          placeholder="Introduzca el nombre del Lote"
          onSearch={onSearch}
          enterButton
        />
      </Col>
    </Row>
  );

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsUpdate(false);
        setIsEnd(false);
        setIsModalOpen(true);
        setSelected();
      }}
    >
      <PlusOutlined />
      Añadir Nuevo Lote
    </Button>
  );

  const handleEspecie = (value) => {
    setSelected(value);
  };

  return (
    <Card title={title} extra={extra}>
      <Table
        bordered={true}
        rowKey="id_lote"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={isUpdate ? "Modificar Lote" : "Añadir Lote"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isEnd ? (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Lote"
              name="nombre"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              label="Fecha Salida"
              name="fecha_salida"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              label="Destino"
              name="destino"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Seleccione" allowClear>
                <Option value="s">Sacrificio y procesamiento</Option>
                <Option value="v">Venta como aves vivas</Option>
                <Option value="o">Otro</Option>
              </Select>
            </Form.Item>
          </Form>
        ) : (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              label="Nombre Lote"
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
              label="Origen"
              name="origen"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="Seleccione" allowClear>
                <Option value="c">Comprado</Option>
                <Option value="n">Nacido en granja</Option>
                <Option value="d">Desconocido</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Cantidad"
              name="cantidad"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <InputNumber min={1} />
            </Form.Item>

            <Form.Item label="Descripcion" name="descripcion">
              <Input.TextArea />
            </Form.Item>

            <Form.Item
              label="Especie"
              name="id_ave"
              rules={[
                {
                  required: true,
                  message: "Este campo no puede ser vacío!",
                },
              ]}
            >
              <Select
                placeholder="Seleccione"
                allowClear
                onSelect={handleEspecie}
              >
                {aves.map((ave) => (
                  <Option value={ave.id} key={ave.id}>
                    {ave.especie}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            {/* {selected === 1 ? ( */}
            <Form.Item
              label="Calidad"
              name="calidad"
              // rules={[
              //   {
              //     required: true,
              //     message: "Este campo no puede ser vacío!",
              //   },
              // ]}
            >
              <Select
                placeholder="Seleccione"
                allowClear
                onSelect={handleEspecie}
                disabled={selected !== 1}
              >
                <Option value="B">Buena</Option>
                <Option value="R">Regular</Option>
                <Option value="M">Mala</Option>
              </Select>
            </Form.Item>
            {/* ) : null} */}
          </Form>
        )}
      </Modal>
    </Card>
  );
}
