import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Form, Input, Col, Row, message } from "antd";
import "./login.css";
import { NavLink } from "react-router-dom";
import { reqPwd } from "../api";

const { Item } = Form;

const Password = () => {
  const onFinish = async (values) => {
    const result = (await reqPwd(values)).data;
    if (result.status === 0) {
      message.success("Contraseña modificada.");
    } else {
      message.error(result.msg);
    }
  };

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
              <Form.Item
                name="newPwd"
                // label="Nueva Contraseña"
                rules={[
                  {
                    required: true,
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nueva Contraseña" />
              </Form.Item>

              <Form.Item
                name="confirm"
                // label="Confirmar contraseña"
                dependencies={["newPwd"]}
                hasFeedback
                rules={[
                  {
                    required: true,
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("newPwd") === value) {
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
                <Input.Password placeholder="Confirmar Contraseña" />
              </Form.Item>
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
                  Cambiar Contraseña
                </Button>
                <NavLink to="/login">Iniciar Sesión</NavLink>
              </Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Password;
