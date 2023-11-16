import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ConfigProvider } from "antd";
import {
  BrowserRouter,
  // HashRouter,
} from "react-router-dom";
import es_ES from "antd/locale/es_ES";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ConfigProvider locale={es_ES}>
      <App />
    </ConfigProvider>
  </BrowserRouter>
);
