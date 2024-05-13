interface IdResponsavel {
    id_usuario: string | null 
}

export default interface INovoDepartamento {
    nome_departamento: string,
    responsavel_id: IdResponsavel
}