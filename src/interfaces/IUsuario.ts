export default interface IUsuario {
  id_usuario: number,
  nome_usuario: string,
  email: string,
  matricula_empresa: string,
  senha: string,
  tipo_usuario: string,
  delete_at?: string | null ,
  create_at?: string,
  update_at?: string,
  status: boolean
  }