import { Departamento } from "./IDepartamento";
import { Usuario } from "./IUsuario";

export interface Redzone {
  id_redzone?: number,
  nome_redzone?: string,
  responsavel_id?: Usuario,
  camera?: string,
  capacidade_maxima?: number,
  id_departamento?: Departamento
  status?: boolean
  delete_at?: any
}
