import { Usuario } from "./IUsuario";

export interface Departamento {
  id_departamento?: number | null,
  nome_departamento?: string,
  responsavel_id?: Usuario
}
