interface IRegistro {
    id: number,
    entrada: string,
    data: string,
    lotacaoAtual: number
}

interface IRegistroRedzone {
  id: number,
  entradaAsString: string,
  data: string,
  lotacao: number
  redzoneNome: string;
}
