import {
  HomeOutlined,
  TwitterOutlined,
  UserOutlined,
  AlertOutlined,
  LockOutlined,
  DatabaseOutlined,
  ContainerOutlined,
  StarOutlined,
  BankOutlined,
  CloudOutlined,
  TeamOutlined,
  EditOutlined,
  PlusSquareOutlined,
  CloudSyncOutlined,
  MedicineBoxOutlined,
  CodepenOutlined,
  BgColorsOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const menuList = [
  {
    title: "Inicio",
    key: "/home",
    icon: <HomeOutlined />,
  },
  {
    title: "Gestión de Usuarios",
    key: "1",
    icon: <UserOutlined />,
    children: [
      {
        title: "Usuario",
        key: "/usuario",
        icon: <TeamOutlined />,
      },
      {
        title: "Rol",
        key: "/rol",
        icon: <EditOutlined />,
      },
      {
        title: "Bitacora",
        key: "/log",
        icon: <EditOutlined />,
      },
    ],
  },
  {
    title: "Gestión de Ave",
    key: "/ave",
    icon: <TwitterOutlined />,
  },
  {
    title: "Gestión de Producción",
    key: "2",
    icon: <TwitterOutlined />,
    children: [
      {
        title: "Aves",
        key: "/produccion/aves",
        icon: <TwitterOutlined />,
      },
      {
        title: "Huevos",
        key: "/produccion/huevos",
        icon: <StarOutlined />,
      },
      {
        title: "Incubadora",
        key: "/produccion/incubadora",
        icon: <CodepenOutlined />,
      },
      {
        title: "Descartes",
        key: "/produccion/descartes",
        icon: <DeleteOutlined />,
      },
    ],
  },
  {
    title: "Gestión de Galpones",
    key: "0",
    icon: <DatabaseOutlined />,
    children: [
      {
        title: "Galpones",
        key: "/galpones",
        icon: <BankOutlined />,
      },
      {
        title: "Ambiente",
        key: "/ambiente",
        icon: <CloudOutlined />,
      },
      {
        title: "Mortandad",
        key: "/mortandad",
        icon: <CloudOutlined />,
      },
      {
        title: "Alimentación",
        key: "/feeding",
        icon: <BgColorsOutlined />,
      },
    ],
  },
  {
    title: "Gestión de Salud",
    key: "3",
    icon: <AlertOutlined />,
    children: [
      {
        title: "Registro Vacunacion",
        key: "/salud",
        icon: <PlusSquareOutlined />,
      },
      {
        title: "Vacuna",
        key: "/vacuna",
        icon: <AlertOutlined />,
      },
      {
        title: "Enfermedad",
        key: "/enfermedad",
        icon: <MedicineBoxOutlined />,
      },
    ],
  },
  {
    title: "Gestión de Cuarentena",
    key: "/cuarentena",
    icon: <LockOutlined />,
  },
  {
    title: "Reporte",
    key: "/reporte",
    icon: <ContainerOutlined />,
  },
  {
    title: "Backup/Restore",
    key: "/backup",
    icon: <CloudSyncOutlined />,
  },
];

export default menuList;
