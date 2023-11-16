import React from "react";
import { Button, Descriptions } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATEFORMAT } from "../../utils/constant";

export default function AveDetalles() {
  const location = useLocation();
  const navigate = useNavigate();
  const { lote } = location.state;
  const week =
    parseInt(moment().diff(moment(lote.fecha_ingreso), "days") / 7) + 1;

  const title = (
    <>
      <Button type="text" onClick={() => navigate(-1)}>
        <ArrowLeftOutlined
          style={{ color: "blue", marginRight: 10, fontSize: 20 }}
        />
      </Button>
      <span style={{ fontWeight: "bold", color: "blue" }}>{lote.nombre}</span>
    </>
  );
  return (
    <Descriptions title={title} bordered column={2}>
      <Descriptions.Item label="Fecha Ingreso">
        {moment(lote.fecha_ingreso).format(DATEFORMAT)}
      </Descriptions.Item>
      <Descriptions.Item label="Fecha Salida">
        {lote.fecha_salida === null
          ? "--"
          : moment(lote.fecha_salida).format(DATEFORMAT)}
      </Descriptions.Item>
      <Descriptions.Item label="Origen">
        {lote.origen === "c"
          ? "Comprado"
          : lote.origen === "n"
          ? "Nacido en granja"
          : "Desconocido"}
      </Descriptions.Item>
      <Descriptions.Item label="Destino">
        {lote.destino === "s"
          ? "Sacrificio y procesamiento"
          : lote.destino === "v"
          ? "Venta como aves vivas"
          : lote.destino === "o"
          ? "Otro"
          : "--"}
      </Descriptions.Item>
      <Descriptions.Item label="Edad">Semana{week}</Descriptions.Item>
      <Descriptions.Item label="Etapa de Desarrollo">
        {week < 3
          ? "Etapa de polluelo"
          : week < 5
          ? "Etapa de crecimiento"
          : week < 9
          ? "Etapa de engorde"
          : "Etapa de producción"}
      </Descriptions.Item>
      <Descriptions.Item label="Especie">{lote.ave.especie}</Descriptions.Item>
      <Descriptions.Item label="Calidad">
        {lote.calidad === "B"
          ? "Buena"
          : lote.calidad === "R"
          ? "Regular"
          : lote.calidad === "M"
          ? "Mala"
          : "-"}
      </Descriptions.Item>
      <Descriptions.Item label="Cantidad inicial">
        {lote.cantidad}
      </Descriptions.Item>
      <Descriptions.Item label="Mortalidad">
        {(lote.mortalidad / lote.cantidad) * 100}% ({lote.mortalidad})
      </Descriptions.Item>
      <Descriptions.Item
        label={
          lote.archivado ? "Cantidad antes de la salida" : "Cantidad actual"
        }
      >
        {lote.cantidad - lote.mortalidad}
      </Descriptions.Item>
      <Descriptions.Item label="Cantidad descartada">
        {lote.archivado ? lote.descarte.cantidad : "--"}
      </Descriptions.Item>
      {/* <Descriptions.Item label="Vacunacion" span={2}>
        <Badge status="processing" text="Running" />
      </Descriptions.Item> */}
      <Descriptions.Item label="Descripcion" span={2}>
        {lote.descripcion === null ? "---" : lote.descripcion}
      </Descriptions.Item>
    </Descriptions>
  );
}
