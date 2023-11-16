/* eslint-disable react-hooks/exhaustive-deps */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Form, Input, Tree } from "antd";
import menuList from "../../config/menuConfig";
const { Item } = Form;

const AuthForm = forwardRef((props, _ref) => {
  const { role } = props;
  const { permisos } = role;
  const [checkedKeys, setCheckedKeys] = useState([]);
  // console.log(role);
  let treeData = null;
  const [prevRow, setPrevRow] = useState(null);

  const onCheck = (checkedKeys, _) => {
    // console.log("onCheck", checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const getTreeData = (menuList) => {
    let newTreeData = [];
    menuList.map((menu) => {
      if (!menu.children) {
        return newTreeData.push({ title: menu.title, key: menu.key });
      } else {
        return newTreeData.push({
          title: menu.title,
          key: menu.key,
          children: getTreeData(menu.children),
        });
      }
    });
    return newTreeData;
  };

  const getDerivedStateFromProps = (row) => {
    // console.log("row", row);
    // console.log("prerow", prevRow);
    if (row !== prevRow) {
      setCheckedKeys(row);
      setPrevRow(row);
    }
  };
  //proporcionar al componente padre Rol permisos actualizados
  useImperativeHandle(_ref, () => ({
    getMenu,
    setMenu,
  }));
  const getMenu = () => checkedKeys;
  const setMenu = (menu) => {
    setCheckedKeys(menu);
  };

  // actualizar checkedKeys si se selecciono una nueva fila de rol
  getDerivedStateFromProps(permisos);

  const setTree = () => {
    const data = getTreeData(menuList);
    treeData = [
      {
        title: "Permisos",
        key: "all",
        children: data,
      },
    ];
  };
  setTree();

  return (
    <Form>
      <Item label="Rol">
        <Input value={role.nombre} disabled />
      </Item>
      <Item>
        <Tree
          checkable
          defaultExpandAll
          checkedKeys={checkedKeys}
          onCheck={onCheck}
          treeData={treeData}
        />
      </Item>
    </Form>
  );
});

export default AuthForm;
