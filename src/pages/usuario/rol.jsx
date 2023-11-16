import { Button, Card, Modal, Table, Form, Input, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { reqAddRole, reqRoleList, reqUpdateRole } from "../../api";

import AuthForm from "./auth-form";
import storageUtils from "../../utils/storageUtils";

const NOMBRE_USUARIO = storageUtils.getUser().nombre_usuario;

const columns = [
  {
    title: "Rol",
    dataIndex: "nombre",
    render: (nombre) => nombre.toUpperCase(),
  },
];

const Rol = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAdd, setIsAdd] = useState(true);
  const [data, setData] = useState([]);

  const [selectedRow, setSelectedRow] = useState([]);
  const [form] = Form.useForm();
  const auth = useRef();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    if (isAdd) form.submit();
    else {
      // console.log(NOMBRE_USUARIO);
      const { id_rol } = selectedRow;
      // getMenu() ===  permisos seleccionados
      const menu = auth.current.getMenu();
      // console.log("getmenu", menu);

      const result = (await reqUpdateRole(id_rol, menu, NOMBRE_USUARIO)).data;
      if (result.status === 0) {
        message.success(result.msg);

        selectedRow.permisos = menu;
        selectedRow.menu = menu;
        // console.log("smenu", selectedRow.menu);
        setSelectedRow({ ...selectedRow });

        const index = data.findIndex((ele) => ele.id_rol === id_rol);
        data[index] = { ...data[index], permisos: menu };
        // console.log(selectedRow);
        // console.log("dataindex: ", data[index]);
        setData([...data]);
        handleCancel();
      } else {
        message.error(result.msg);
      }
    }
  };
  const handleCancel = () => {
    if (isAdd) {
      form.resetFields();
    } else {
      //   console.log(selectedRow);
      auth.current.setMenu(selectedRow.permisos);
    }
    setIsModalOpen(false);
  };

  const getRoles = async () => {
    const result = (await reqRoleList()).data;
    if (result.status === 0) {
      const { data } = result;
      setData(data);
    }
  };

  useEffect(() => {
    getRoles();
  }, []);

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (_, selectedRows) => {
      setSelectedRow((_) => selectedRows[0]);
      // console.log(selectedRow);
    },
  };

  const addRole = () => {
    setIsAdd(true);
    showModal();
  };
  //
  const authRole = () => {
    setIsAdd(false);
    showModal();
  };

  const extra = (
    <>
      <Button type="primary" style={{ marginRight: 15 }} onClick={addRole}>
        <PlusOutlined /> Crear Rol
      </Button>
      <Button type="primary" onClick={authRole} disabled={!selectedRow.id_rol}>
        Asignar permisos
      </Button>
    </>
  );

  const normalize = (value, _, prevValues) => value.toUpperCase();

  const onFinish = async (value) => {
    value.nombre_usuario = NOMBRE_USUARIO;
    // console.log(value);
    const result = (await reqAddRole(value)).data;
    if (result.status === 0) {
      message.success("rol creado existosamente");
      const rol = result.data;
      setData([...data, rol]);
    } else {
      message.error(result.msg);
    }
    form.resetFields();

    handleCancel();
  };

  return (
    <Card extra={extra}>
      <Table
        rowSelection={{
          type: "radio",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        rowKey="id_rol"
      />
      <Modal
        title={isAdd ? "Crear Rol" : "Asignar Permisos"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {isAdd ? (
          <Form form={form} onFinish={onFinish}>
            <Form.Item
              name="nombre"
              label="Rol"
              rules={[{ required: true }]}
              normalize={normalize}
            >
              <Input placeholder="Introduzca el rol que desea crear" />
            </Form.Item>
          </Form>
        ) : (
          <AuthForm ref={auth} role={selectedRow} />
        )}
      </Modal>
    </Card>
  );
};
export default Rol;
