import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Col, Row, message } from "antd";
import "./login.css";
import { NavLink, useNavigate } from "react-router-dom";
import { reqLogin } from "../api";
import storageUtils from "../utils/storageUtils";
import { useEffect } from "react";
const { Item } = Form;

const Login = () => {
  const navigate = useNavigate();
  const onFinish = async (values) => {
    const { nombre_usuario, contraseña } = values;
    // console.log(username, password);
    const result = (await reqLogin(nombre_usuario, contraseña)).data;
    if (result.status === 0) {
      message.success("Inicio de sesión con éxito");
      //guardar datos del usuario
      const user = result.data;
      storageUtils.saveUser(user); // guardar en localStorage
      navigate("/", { replace: true });
    } else {
      message.error(result.msg);
    }
  };

  useEffect(() => {
    let isAuth = storageUtils.getUser().token;
    if (isAuth) {
      navigate("/");
    }
  });
  const title = (
    <div
      style={{
        textAlign: "center",
        color: "rgb(22, 119, 255)",
        fontSize: "25px",
        textDecoration: "underline",
      }}
    >
      S.I. AVÍCOLA
    </div>
  );

  return (
    <div className="login-page">
      <Row>
        <Col
          xs={{
            span: 20,
            offset: 2,
          }}
          lg={{
            span: 8,
            offset: 8,
          }}
        >
          <Card
            title={title}
            // bordered={false}
            style={{
              marginTop: "150px",
              boxShadow: "5px 5px 10px #ccc",
              backgroundColor: "transparent",
            }}
          >
            <Form
              name="normal_login"
              className="login-form"
              onFinish={onFinish}
            >
              <Item
                name="nombre_usuario"
                rules={[
                  {
                    required: true,
                    // message: "Este campo no puede ser vacío!",
                  },
                  {
                    pattern: /^[a-zA-Z0-9_-]+$/,
                  },
                  { max: 40 },
                  { min: 4 },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Nombre de Usuario"
                />
              </Item>
              <Item
                name="contraseña"
                rules={[
                  {
                    required: true,
                  },
                  { max: 30 },
                  { min: 6 },
                ]}
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Contraseña"
                />
              </Item>
              <Item
              // wrapperCol={{
              //   offset: 7,
              //   span: 16,
              // }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  // className="login-form-button"
                  style={{ width: "100%" }}
                >
                  Iniciar Sesión
                </Button>
                <NavLink to="/changepwd">Cambiar contraseña</NavLink>
              </Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Login;
