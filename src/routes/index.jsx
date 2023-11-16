import Galpon from "../pages/galpon/galpones";
import Home from "../pages/home";
import Login from "../pages/login";
import Produccion from "../pages/Produccion";
import Salud from "../pages/salud/salud";
import Cuarentena from "../pages/cuarentena";
import Reporte from "../pages/reporte";
import Usuario from "../pages/usuario/usuario";
import Mylayout from "../pages";
import ProdAve from "../pages/Produccion/prod-ave";
import ProdHuevo from "../pages/Produccion/prod-huevo";
import Ambiente from "../pages/galpon/ambiente";
import Rol from "../pages/usuario/rol";
import Ave from "../pages/ave";
import Mortandad from "../pages/galpon/mortandad";
import Password from "../pages/password";
import Vacuna from "../pages/salud/vacuna";
import Bitacora from "../pages/usuario/bitacora";
import PdfReport from "../pages/pdf";
import Backup from "../pages/backup";
import Enfermedad from "../pages/salud/enfermedad";
import Incubadora from "../pages/Produccion/incubadora";
import IncuDetalles from "../pages/Produccion/incu-details";
import AveDetalles from "../pages/Produccion/ave-details";
import Alimentacion from "../pages/galpon/alimentacion";
import Descarte from "../pages/Produccion/descarte";

const router = [
  {
    path: "/",
    element: <Mylayout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "usuario",
        element: <Usuario />,
      },
      {
        path: "rol",
        element: <Rol />,
      },
      {
        path: "log",
        element: <Bitacora />,
      },
      {
        path: "galpones",
        element: <Galpon />,
      },
      {
        path: "ambiente",
        element: <Ambiente />,
      },
      {
        path: "mortandad",
        element: <Mortandad />,
      },
      {
        path: "feeding",
        element: <Alimentacion />,
      },
      {
        path: "ave",
        element: <Ave />,
      },
      {
        path: "produccion",
        element: <Produccion />,
        children: [
          {
            path: "aves",
            element: <ProdAve />,
          },
          {
            path: "ave-detalles",
            element: <AveDetalles />,
          },
          {
            path: "huevos",
            element: <ProdHuevo />,
          },
          {
            path: "incubadora",
            element: <Incubadora />,
          },
          {
            path: "incu-detalles",
            element: <IncuDetalles />,
          },
          {
            path: "descartes",
            element: <Descarte />,
          },
        ],
      },
      {
        path: "cuarentena",
        element: <Cuarentena />,
      },

      {
        path: "salud",
        element: <Salud />,
      },
      {
        path: "enfermedad",
        element: <Enfermedad />,
      },
      {
        path: "vacuna",
        element: <Vacuna />,
      },
      {
        path: "usuario",
        element: <Usuario />,
      },
      {
        path: "reporte",
        element: <Reporte />,
      },
      {
        path: "backup",
        element: <Backup />,
      },
    ],
  },
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/changepwd",
    element: <Password />,
  },
  {
    path: "/pdf",
    element: <PdfReport />,
  },
];

export default router;
