import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { Menu } from "antd";

import logo from "../../assets/images/logo.png";
import "./index.css";
import menuList from "../../config/menuConfig";
import storageUtils from "../../utils/storageUtils";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

export default function LeftNav() {
  let location = useLocation();
  let path = location.pathname;
  // console.log(path);

  //determinar si el item esta en permisos del usuario
  const hasAuth = (item) => {
    const { key } = item;
    const { permisos } = storageUtils.getUser();
    // console.log(permisos);

    if (permisos.indexOf(key) !== -1) {
      return true;
    } else if (item.children) {
      // 3. o si el hijo de item esta en menu
      return !!item.children.find(
        (child) => permisos.indexOf(child.key) !== -1
      );
    } else {
      return false;
    }
  };
  const getMenuNodes = (menuList) => {
    return menuList.map((item => {
      if(!item.children){
        return getItem(
          <NavLink to={item.key}>{item.title}</NavLink>,
          item.key,
          item.icon
        );
      }else {
        return getItem(
          item.title,
          item.key,
          item.icon,
          getMenuNodes(item.children)
        );
      }
    }))
  };

  return (
    <>
      <div className="left-nav">
        <NavLink to="/home" className="left-nav-header">
          <img src={logo} alt="logo" />
          <h1>SI Avicola</h1>
        </NavLink>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[path]}
        defaultOpenKeys={[true]}
        items={getMenuNodes(menuList)}
      />
    </>
  );
}
