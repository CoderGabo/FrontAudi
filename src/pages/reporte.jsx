import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  message,
  Select,
  DatePicker,
  Button,
  Card,
  Modal,
  Form,
  Radio,
  Space,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATEFORMAT } from "../utils/constant";
import { reqDeath, reqReportType } from "../api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfFile from "../components/pdf-file";
// import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Text } = Typography;

let sstart = moment().format(DATEFORMAT);
let eend = moment().format(DATEFORMAT);

const columnsM = [
  {
    title: "Galpon",
    dataIndex: "id_galpon",
  },
  {
    title: "Cantidad",
    dataIndex: "cantidad",
  },
  {
    title: "Mortalidad",
    render: (rec) => {
      let porc = (rec.mortalidad / rec.cantidad) * 100;
      return `${porc}% (${rec.mortalidad})`;
    },
  },
];

const columnsH = [
  {
    title: "Galpon",
    dataIndex: "id_galpon",
  },
  {
    title: "Huevos buenos",
    dataIndex: "bueno",
  },
  {
    title: "Huevos podridos",
    dataIndex: "podrido",
  },
];

const columnsI = [
  {
    title: "Incubadora",
    dataIndex: "id_inc",
    render: (id) => "Incubadora " + id,
  },
  {
    title: "Huevos totales iniciales",
    dataIndex: "inicial",
  },
  {
    title: "Huevos eclosionados",
    dataIndex: "eclosionados",
  },
];

export default function Report() {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [type, setType] = useState("date");
  const [end, setEnd] = useState(eend);
  const [start, setStart] = useState(sstart);
  const [tipoRepo, setTipoRepo] = useState("M");
  const [form] = Form.useForm();
  // const navigate = useNavigate();

  const getData = async () => {
    setLoading(true);
    let result = (await reqDeath(start, end)).data;
    setLoading(false);
    //   console.log(ventas);
    if (result.status === 0) {
      setData(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const PickerWithType = ({ type, onChange }) => {
    if (type === "date") return <DatePicker onChange={onChange} />;
    return <DatePicker picker={type} onChange={onChange} />;
  };

  const onChangePicker = (value) => {
    let start, end;
    if (type === "week") {
      // Obtener el día de la semana (0 = domingo, 1 = lunes, ..., 6 = sábado)
      const diaSemana = value.day();
      // console.log(diaSemana);
      // Calcular el día inicial de la semana (domingo)
      start = value.subtract(diaSemana, "days").format(DATEFORMAT);
      // Calcular el día final de la semana (sábado)
      end = value.add(6 - diaSemana, "days").format(DATEFORMAT);
    } else if (type === "month") {
      start = value.startOf("month").format(DATEFORMAT);
      end = value.endOf("month").format(DATEFORMAT);
      //   console.log(start, end);
    } else if (type === "date") {
      start = value.format(DATEFORMAT);
      end = value.format(DATEFORMAT);
    } else {
      start = value.startOf("year").format(DATEFORMAT);
      end = value.endOf("year").format(DATEFORMAT);
    }
    // console.log(start, end);

    sstart = start;
    eend = end;
  };

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsModalOpen(true);
      }}
    >
      Generar Reporte
    </Button>
  );

  const title = () => {
    let tipo;
    if (tipoRepo === "M") tipo = "Mortandad";
    else if (tipoRepo === "H") tipo = "Produccion - Huevos";
    else tipo = "Incubacion";

    let title1 = `Reporte De ${tipo} `;

    if (type === "week") {
      title1 += "Semanal: " + start + " ~ " + end;
      //   console.log(start, end);
    } else if (type === "month") {
      title1 += "Mensual: " + start.substring(0, 7);
    } else if (type === "date") {
      title1 += "Diario: " + start;
    } else {
      title1 += "Anual " + start.substring(0, 4);
    }

    console.log(title1);
    return (
      <>
        {/* <PDFDownloadLink
          document={<PdfFile items={data} start={sstart} end={eend} />}
          filename="reportes.pdf"
        >
          {({ loading }) => (
            <Button type="link" disabled={loading}>
              <FilePdfOutlined style={{ fontSize: 25, color: "red" }} />
            </Button>
          )}
        </PDFDownloadLink> */}

        <span style={{ fontWeight: 700 }}>{title1}</span>
      </>
    );
  };

  const handleOk = () => {
    form.submit();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const onFinish = async (value) => {
    setStart(sstart);
    setEnd(eend);
    setTipoRepo(value.tipo);

    const result = (await reqReportType(sstart, eend, value.tipo)).data;

    if (result.status === 0) {
      setData(result.data);
    } else {
      message.error(result.msg);
    }
    handleCancel();
  };

  const sumMortandad = (pageData) => {
    let mort = 0;
    let sum = 0;
    pageData.forEach(({ mortalidad, cantidad }) => {
      mort += parseInt(mortalidad);
      sum += parseInt(cantidad);
    });
    let porc = 0;
    if (sum !== 0) porc = (mort / sum) * 100;

    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <strong>MORTALIDAD</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Text strong>
              {porc}% ({mort})
            </Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };

  const sumHbuenos = (pageData) => {
    const sum = pageData.reduce(
      (acc, current) => acc + parseInt(current.bueno),
      0
    );
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <strong>HUEVOS BUENOS</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Text strong>{sum}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };

  const sumEclosionados = (pageData) => {
    const sum = pageData.reduce(
      (acc, current) => acc + parseInt(current.eclosionados),
      0
    );
    console.log(sum);
    return (
      <>
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={2}>
            <strong>HUEVOS ECLOSIONADOS</strong>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={1}>
            <Text strong>{sum}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </>
    );
  };
  return (
    <Card extra={extra}>
      {tipoRepo === "M" ? (
        <Table
          bordered={true}
          rowKey="id_galpon"
          loading={loading}
          dataSource={data}
          columns={columnsM}
          pagination={false}
          title={title}
          scroll={{
            x: 400,
          }}
          summary={sumMortandad}
        />
      ) : tipoRepo === "H" ? (
        <Table
          bordered={true}
          rowKey="id_galpon"
          loading={loading}
          dataSource={data}
          columns={columnsH}
          pagination={false}
          title={title}
          scroll={{
            x: 400,
          }}
          summary={sumHbuenos}
        />
      ) : (
        <Table
          bordered={true}
          rowKey="id_inc"
          loading={loading}
          dataSource={data}
          columns={columnsI}
          pagination={false}
          title={title}
          scroll={{
            x: 400,
          }}
          summary={sumEclosionados}
        />
      )}

      <Modal
        title="Generar Reporte"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish}>
          <Form.Item label="Reporte de" name="tipo" initialValue="M">
            <Radio.Group>
              <Radio value="M"> Mortandad </Radio>
              <Radio value="H"> Huevos </Radio>
              <Radio value="I"> Incubacion </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Fecha">
            <Space>
              <Select value={type} onChange={setType}>
                <Option value="date">Diario</Option>
                <Option value="week">Semanal</Option>
                <Option value="month">Mensual</Option>
                <Option value="year">Anual</Option>
              </Select>
              <PickerWithType type={type} onChange={onChangePicker} />
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
