import { Card, Col, Input, Row, Table, message } from "antd";
import React, { useState, useEffect } from "react";
import { reqLogList, reqSearchLogs } from "../../api";
import { DATEHOURFORMAT, PAGES_SIZE } from "../../utils/constant";
import moment from "moment";

export default function Bitacora() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  const getData = async (response) => {
    if (response) {
    } else {
      setLoading(true);
      response = await reqLogList();
    }
    const result = response.data;
    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setData(result.data);
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Fecha Hora",
      dataIndex: "fecha",
      render: (fecha) => moment(fecha).format(DATEHOURFORMAT),
    },
    {
      title: "Usuario",
      dataIndex: "username",
    },
    {
      title: "Operación",
      dataIndex: "operacion",
    },
  ];

  const onSearch = async (value) => {
    const response = await reqSearchLogs(value);
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
        <Input.Search
          placeholder="Introduzca ..."
          onSearch={onSearch}
          enterButton
        />
      </Col>
    </Row>
  );

  return (
    <Card title={title}>
      <Table
        bordered={true}
        rowKey="id_log"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
    </Card>
  );
}
