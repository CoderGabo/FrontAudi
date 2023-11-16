import { Button, Card, Table, message, Form, Modal, Input, Select } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import {
  reqChangePwd,
  reqChangeRole,
  reqRegister,
  reqRoleList,
  reqUsersList,
} from "../../api";
import { PAGES_SIZE, formItemLayout } from "../../utils/constant";
import storageUtils from "../../utils/storageUtils";

const { Option } = Select;
const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

export default function Usuario() {
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState();
  const [data, setData] = useState([]);

  const [isAdd, setIsAdd] = useState(true);
  const [isChangeRol, setIsChangeRol] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roles, setRoles] = useState([]);
  const [form] = Form.useForm();

  const getData = async () => {
    setLoading(true);

    let result = (await reqUsersList(storageUtils.getUser().id_rol)).data;
    // console.log(result);
    setLoading(false);
    if (result.status === 0) {
      setData(result.data);

      result = (await reqRoleList()).data;
      if (result.status === 0) {
        setRoles(result.data);
      }
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Nombre de Usuario",
      dataIndex: "nombre_usuario",
    },
    {
      title: "Rol",
      dataIndex: "Rol",
      render: (rol) => rol.nombre,
    },
    {
      title: "Acción",
      ellipsis: true,
      render: (user) => (
        <>
          <Button
            type="primary"
            style={{ marginRight: 10 }}
            onClick={() => {
              setId(user.id_user);
              setIsAdd(false);
              setIsChangeRol(false);
              form.setFieldsValue({
                nombre_usuario: user.nombre_usuario,
              });
              showModal();
            }}
          >
            Cambiar contraseña
          </Button>
          <Button
            type="primary"
            danger
            onClick={() => {
              setId(user.id_user);
              setIsAdd(false);
              setIsChangeRol(true);
              form.setFieldsValue({
                nombre_usuario: user.nombre_usuario,
              });
              showModal();
            }}
          >
            Cambiar rol
          </Button>
        </>
      ),
    },
  ];

  const showModal = () => {
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
    value.username = NOMBRE_USUARIO;
    // console.log(value);
    // console.log(NOMBRE_USUARIO);
    if (isAdd) {
      result = (await reqRegister(value)).data;
    } else {
      value.id_user = id;
      if (isChangeRol) {
        result = (await reqChangeRole(value)).data;
      } else result = (await reqChangePwd(value)).data;
    }
    if (result.status === 0) {
      if (isAdd) {
        setData([...data, result.data]);
      }
      if (isChangeRol) {
        let index = data.findIndex((ele) => ele.id === id);
        data[index] = { ...data[index], ...value };
        // console.log(data);
        setData([...data]);
      }
      message.success(result.msg);
    }
    setIsModalOpen(false);
    form.resetFields();
  };

  const extra = (
    <Button
      type="primary"
      onClick={() => {
        setIsAdd(true);
        setIsChangeRol(false);
        showModal();
      }}
    >
      <PlusOutlined /> Registar Usuario
    </Button>
  );

  return (
    <Card extra={extra}>
      <Table
        bordered={true}
        rowKey="id_user"
        loading={loading}
        dataSource={data}
        columns={columns}
        pagination={{ defaultPageSize: PAGES_SIZE }}
      />
      <Modal
        title={
          isAdd
            ? "Registrar Usuario"
            : isChangeRol
            ? "Cambio de rol"
            : "Cambiar contraseña"
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} onFinish={onFinish} {...formItemLayout}>
          <Form.Item
            label="Nombre de Usuario"
            name="nombre_usuario"
            rules={[
              {
                required: true,
              },
              {
                pattern: /^[a-zA-Z0-9_-]+$/,
              },
              { max: 40 },
              { min: 4 },
            ]}
          >
            <Input disabled={!isAdd} />
          </Form.Item>
          {isAdd ? (
            <>
              <Form.Item
                name="contraseña"
                label="Contraseña"
                rules={[
                  {
                    required: true,
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirmar contraseña"
                dependencies={["contraseña"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("contraseña") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Las dos contraseñas introducidas no coinciden!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <Form.Item
                name="id_rol"
                label="Rol"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Select placeholder="seleccione el rol">
                  {roles.map((rol) => (
                    <Option key={rol.id_rol} value={rol.id_rol}>
                      {rol.nombre}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          ) : isChangeRol ? (
            <Form.Item
              name="id_rol"
              label="Rol"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Select placeholder="seleccione el rol">
                {roles.map((rol) => (
                  <Option key={rol.id_rol} value={rol.id_rol}>
                    {rol.nombre}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                name="newpwd"
                label="Nueva contraseña"
                rules={[
                  {
                    required: true,
                  },
                  {
                    min: 6,
                  },
                  {
                    max: 30,
                  },
                ]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>

              <Form.Item
                name="confirm"
                label="Confirmar contraseña"
                dependencies={["newpwd"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newpwd") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          "Las dos contraseñas introducidas no coinciden!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </Card>
  );
}
