import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  message,
  Select,
  DatePicker,
  Divider,
  Row,
  Col,
  Button,
} from "antd";
import { FilePdfOutlined } from "@ant-design/icons";
import moment from "moment";

import { DATEFORMAT } from "../utils/constant";
import { reqDeath } from "../api";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PdfFile from "../components/pdf-file";
// import { useNavigate } from "react-router-dom";
const { Option } = Select;
const { Text } = Typography;

export default function Report() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [type, setType] = useState("date");
  const [start, setStart] = useState(moment().format(DATEFORMAT));
  const [end, setEnd] = useState(moment().format(DATEFORMAT));
  const [flag, setFlag] = useState(false);
  // const navigate = useNavigate();

  const columns = [
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

  useEffect(() => {
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
    if (flag) {
      getData();
      setFlag(false);
    }
  }, [start, end, flag]);

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
    setStart(start);
    setEnd(end);
    setFlag(true);
  };

  const extra = (
    <Row>
      <Col xs={24} xl={18}>
        <Select value={type} onChange={setType}>
          <Option value="date">Diario</Option>
          <Option value="week">Semanal</Option>
          <Option value="month">Mensual</Option>
          <Option value="year">Anual</Option>
        </Select>
        <PickerWithType type={type} onChange={onChangePicker} />
      </Col>
    </Row>
  );

  const title = () => {
    let title1 = "Reporte De Produccion - Mortandad ";

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

    return (
      <>
        <PDFDownloadLink
          document={<PdfFile items={data} start={start} end={end} />}
          filename="reportes.pdf"
        >
          {({ loading }) => (
            <Button type="link" disabled={loading}>
              <FilePdfOutlined style={{ fontSize: 25, color: "red" }} />
            </Button>
          )}
        </PDFDownloadLink>
        {/* <Button
          type="link"
          onClick={() =>
            navigate("/pdf", { state: { items: data, start: start, end: end } })
          }
        >
          <FilePdfOutlined style={{ fontSize: 25, color: "red" }} />
        </Button> */}

        <span style={{ fontWeight: 700 }}>{title1}</span>
      </>
    );
  };

  return (
    <>
      <Divider
        orientation="left"
        orientationMargin="0"
        style={{ color: "white", fontSize: 20 }}
      >
        <span style={{ marginRight: 20 }}>REPORTE DE VENTAS</span>

        {extra}
      </Divider>

      <Table
        bordered={true}
        rowKey="id_galpon"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={false}
        title={title}
        scroll={{
          x: 400,
        }}
        summary={(pageData) => {
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
        }}
      />
    </>
  );
}
