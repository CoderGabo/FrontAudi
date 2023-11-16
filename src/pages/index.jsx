import { Button, Layout, Modal, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";
import LeftNav from "../components/left-nav";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import storageUtils from "../utils/storageUtils";
import { reqLogOut } from "../api";

const { Sider, Content, Header } = Layout;

const Mylayout = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const logout = () => {
    Modal.confirm({
      icon: <ExclamationCircleOutlined />,
      content: "¿Estás seguro de que quieres cerrar la sesión?",
      onOk: async () => {
        // const { nombre_usuario } = storageUtils.getUser();
        // const result = (await reqLogOut(nombre_usuario)).data;
        // console.log(result);
        // if (result.status === 0) {
        //   storageUtils.removeUser();
        //   navigate("/login", { replace: true });
        // }
        storageUtils.removeUser();
        navigate("/login", {replace: true})
      },
    });
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider breakpoint="lg" collapsedWidth="0" width={250}>
          <LeftNav />
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="link"
              onClick={logout}
              style={{ float: "right", lineHeight: "60px", marginRight: 50 }}
            >
              LogOut
            </Button>
          </Header>
          <Content
            style={{
              margin: "24px 16px",
              padding: 24,
              background: colorBgContainer,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Mylayout;
