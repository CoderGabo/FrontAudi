import { ajax } from "./ajax";

const LOGIN = "/api";
export const reqLogin = (nombre_usuario, contraseña) =>
  ajax(LOGIN + "/login", { nombre_usuario, contraseña }, "POST");
export const reqRegister = (value) => ajax(LOGIN + "/register", value, "POST");
export const reqPwd = (value) => ajax(LOGIN + "/pwd", value, "PUT");
export const reqLogOut = (nombre_usuario) =>
  ajax(LOGIN + "/logout", { nombre_usuario });

const USER = "/user";
export const reqUsersList = (id_rol) => ajax(USER, { id_rol });
export const reqChangePwd = (value) => ajax(USER + "/pwd", value, "PUT");
export const reqLogList = () => ajax(USER + "/log");
export const reqChangeRole = (value) => ajax(USER + "/role", value, "PUT");
export const reqSearchLogs = (str) => ajax(USER + "/search", { str });

const ROL = "/role";
export const reqRoleList = () => ajax(ROL);
export const reqAddRole = (value) => ajax(ROL + "/addRole", value, "POST");
export const reqUpdateRole = (id_rol, permisos, nombre_usuario) =>
  ajax(ROL + "/updateRole", { id_rol, permisos, nombre_usuario }, "PUT");

const AVE = "/poultry";
export const reqSpeciesList = () => ajax(AVE);
export const reqAddSpecies = (especie, nombre_usuario) =>
  ajax(AVE, { especie, nombre_usuario }, "POST");
export const reqUpdateSpecies = (id, especie, nombre_usuario) =>
  ajax(AVE, { id, especie, nombre_usuario }, "PUT");

const PRODAVE = "/prod/aves";
export const reqBatchList = () => ajax(PRODAVE);
export const reqBatchId = () => ajax(PRODAVE + "/ids");
export const reqAddBatch = (batch) => ajax(PRODAVE, batch, "POST");
export const reqEditBatch = (batch) => ajax(PRODAVE, batch, "PUT");
export const reqEndBatch = (batch) => ajax(PRODAVE + "/end", batch, "PUT");
export const reqDeleteBatch = (id_lote, nombre_usuario) =>
  ajax(PRODAVE, { id_lote, nombre_usuario }, "DELETE");
export const reqSearchBatch = (str) => ajax(PRODAVE + "/search", { str });
export const reqUpdateShedBatch = (id_lote, id_galpon, nombre_usuario) =>
  ajax(PRODAVE + "/shed", { id_lote, id_galpon, nombre_usuario }, "PUT");

export const reqDescarteList = () => ajax(PRODAVE + "/descarte");
export const reqAddDescarte = (value) =>
  ajax(PRODAVE + "/descarte", value, "POST");
export const reqDeleteDescarte = (nombre_usuario, id_des) =>
  ajax(PRODAVE + "/descarte", { nombre_usuario, id_des }, "DELETE");
export const reqUpdateDescarte = (value) =>
  ajax(PRODAVE + "/descarte", value, "PUT");

const PRODHUEVO = "/prod/eggs";
export const reqEggsList = () => ajax(PRODHUEVO);
export const reqAddEggRec = (value) => ajax(PRODHUEVO, value, "POST");
export const reqUpdateEggRec = (value) => ajax(PRODHUEVO, value, "PUT");

export const reqIncuList = () => ajax(PRODHUEVO + "/incu");
export const reqIncuDetailsById = (id_inc) =>
  ajax(PRODHUEVO + "/incu/id", { id_inc });
export const reqaddIncu = (nombre_usuario) =>
  ajax(PRODHUEVO + "/incu", { nombre_usuario }, "POST");
export const reqStartIncu = (value) =>
  ajax(PRODHUEVO + "/incu/start", value, "POST");
export const reqEndIncu = (value) =>
  ajax(PRODHUEVO + "/incu/end", value, "POST");

const GALPON = "/galpon";
export const reqShedList = () => ajax(GALPON);
export const reqAddShed = (galpon) => ajax(GALPON, galpon, "POST");
export const reqUpdateShed = (galpon) => ajax(GALPON, galpon, "PUT");
export const reqShedId = () => ajax(GALPON + "/id");
export const reqShedIdQuar = () => ajax(GALPON + "/cuar");

export const reqFeedingList = () => ajax(GALPON + "/feeding");
export const reqAddFeeding = (value) =>
  ajax(GALPON + "/feeding", value, "POST");
export const reqUpdateFeeding = (value) =>
  ajax(GALPON + "/feeding", value, "PUT");

const AMBIENTE = "/weather";
export const reqAmbienteList = (id_galpon) => ajax(AMBIENTE, { id_galpon });
export const reqAddAmbiente = (ambiente) => ajax(AMBIENTE, ambiente, "POST");
export const reqMortList = () => ajax(AMBIENTE + "/mort");
export const reqAddMort = (ambLote) =>
  ajax(AMBIENTE + "/mort", ambLote, "POST");
export const reqUpdateMort = (ambLote) =>
  ajax(AMBIENTE + "/mort", ambLote, "PUT");

const SALUD = "/health";
export const reqHealthList = () => ajax(SALUD);
export const reqAddRecordHealth = (value) => ajax(SALUD, value, "POST");
export const reqUpdateRecordHealth = (value) => ajax(SALUD, value, "PUT");
export const reqVaccList = () => ajax(SALUD + "/vac");
export const reqAddVacc = (value) => ajax(SALUD + "/vac", value, "POST");
export const reqUpdateVacc = (value) => ajax(SALUD + "/vac", value, "PUT");
export const reqEnfList = () => ajax(SALUD + "/enf");
export const reqAddEnf = (value) => ajax(SALUD + "/enf", value, "POST");
export const reqUpdateEnf = (value) => ajax(SALUD + "/enf", value, "PUT");

const CUARENTENA = "/quar";
export const reqQuarList = () => ajax(CUARENTENA);
export const reqAddQuar = (value) => ajax(CUARENTENA, value, "POST");
export const reqUpdateQuar = (value) => ajax(CUARENTENA, value, "PUT");
export const reqEndDate = (value) => ajax(CUARENTENA + "/end", value, "PUT");

const REPORT = "/report";
export const reqDeath = (start, end) => ajax(REPORT, { start, end });
export const reqReportType = (start, end, tipo) =>
  ajax(REPORT + "/type", { start, end, tipo });

const SCHEDULE = "/schedule";
export const reqScheduleDB = (value) => ajax(SCHEDULE, value, "POST");
export const reqScheduleData = (value) => ajax(SCHEDULE);

const BACKUP = "/back";
export const reqBackupList = () => ajax(BACKUP + "/list");
export const reqRestorDB = (filename, nombre_usuario) =>
  ajax(BACKUP + "/restore", { filename, nombre_usuario }, "POST");
