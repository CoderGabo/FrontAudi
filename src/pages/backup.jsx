import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  message,
  Form,
  Select,
  Switch,
  TimePicker,
  Divider,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { formItemLayout } from "../utils/constant";
import {
  reqBackupList,
  reqRestorDB,
  reqScheduleDB,
  reqScheduleData,
} from "../api";
import dayjs from "dayjs";
import storageUtils from "../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Backup() {
  const [visible, setVisible] = useState(false);
  const [backs, setBacks] = useState([]);
  const [bForm] = Form.useForm();

  const getData = async () => {
    const result = (await reqBackupList()).data;
    let { data } = (await reqScheduleData()).data;

    // console.log(result);
    if (result.status === 0) {
      setBacks(result.data);
      if (data.auto === false) {
        setVisible(true);
      }
      // console.log(data);
      bForm.setFieldsValue({
        auto: data.auto,
        hora: dayjs(
          `${data.hour.toString().padStart(2, "0")}:${data.min
            .toString()
            .padStart(2, "0")}:00`,
          "HH:mm:ss"
        ),
      });
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFinish = async (value) => {
    value.hour = value.hora.hour();
    value.min = value.hora.minute();
    const result = (await reqScheduleDB(value)).data;
    if (result.status === 0) {
      message.success(result.msg);
    }
  };

  const handleSwitch = async (checked) => {
    // console.log(checked);
    if (checked) {
      setVisible(false);
      let value = { auto: checked };
      const result = (await reqScheduleDB(value)).data;
      if (result.status === 0) {
        message.success("Backup automatico");
      }
    } else {
      setVisible(true);
    }
  };

  const handleChange = (value) => {
    // console.log(value);
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de realizar el restore de base de datos?",
      onOk: async () => {
        // console.log(value, NOMBRE_USUARIO);
        const { data } = await reqRestorDB(value, NOMBRE_USUARIO);
        if (data.status === 0) {
          message.success(data.msg);
        } else {
          message.error(data.msg);
        }
      },
    });
  };

  return (
    <>
      <Divider>BACKUP</Divider>
      <Form form={bForm} onFinish={onFinish} {...formItemLayout}>
        <Form.Item
          label="Backup automatico"
          name="auto"
          valuePropName="checked"
        >
          <Switch onChange={handleSwitch} />
        </Form.Item>
        {visible ? (
          <>
            <Form.Item label="Switch" name="hora">
              <TimePicker />
            </Form.Item>
            <Form.Item
              wrapperCol={{
                xs: {
                  span: 24,
                  offset: 0,
                },
                sm: {
                  span: 16,
                  offset: 8,
                },
              }}
            >
              <Button type="primary" htmlType="submit">
                Guardar
              </Button>
            </Form.Item>
          </>
        ) : null}
      </Form>
      <Divider>RESTORE</Divider>

      <Select
        style={{
          width: "100%",
        }}
        placeholder="Seleccionar una opción para restaurar los datos de la base de datos hasta esa fecha específica."
        onChange={handleChange}
      >
        {backs.map((ele) => (
          <Select.Option key={ele.index} value={ele.filename}>
            {ele.filename}
          </Select.Option>
        ))}
      </Select>
    </>
  );
}
