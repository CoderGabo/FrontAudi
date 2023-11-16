import { Button, Card, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import moment from "moment";
import { DATEHOURFORMAT, PAGES_SIZE } from "../../utils/constant";
import { reqIncuDetailsById } from "../../api";
export default function IncuDetalles() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { incu } = location.state;
  //   console.log(incu);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      const result = (await reqIncuDetailsById(incu.id_inc)).data;

      // console.log(result);
      setLoading(false);
      if (result.status === 0) {
        setData(result.data);
      } else {
        message.error(result.msg);
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "Fecha Inicio",
      dataIndex: "inicio",
      render: (ini) =>
        ini === null ? "-" : moment(ini).format(DATEHOURFORMAT),
    },
    {
      title: "Fecha Finalizacion",
      dataIndex: "finalizacion",
      render: (fin) =>
        fin === null ? "-" : moment(fin).format(DATEHOURFORMAT),
    },
    {
      title: "Eclosionados / total",
      render: (inc) =>
        inc.finalizado === false
          ? 0 + " /" + inc.nro_huevos
          : inc.nro_eclosionado + " / " + inc.nro_huevos,
    },
  ];
  const title = (
    <span>
      <Button type="text" onClick={() => navigate(-1)}>
        <ArrowLeftOutlined
          style={{ color: "blue", marginRight: 10, fontSize: 20 }}
        />
      </Button>
      <span style={{ fontWeight: "bold", color: "blue" }}>
        Incubadora Nro. {incu.id_inc}
      </span>
    </span>
  );
  return (
    <Card title={title}>
      <Table
        bordered={true}
        rowKey="id_incub"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
    </Card>
  );
}
