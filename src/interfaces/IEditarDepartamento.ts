interface IdResponsavel {
    id_usuario: string | null | undefined
}

export default interface IEditarDepartamento {
    id_departamento?: string,
    nome_departamento: string,
    responsavel_id: IdResponsavel
}