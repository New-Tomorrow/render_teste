export function obterDataFormatada() {
  const data = new Date();
  const dataFormatada = data.toISOString().slice(0, 19).replace('T', ' ');
  return dataFormatada;
}


export function converterComEspaco(dataHora: string): string {
  const dtObj = new Date(dataHora);
  const dia = dtObj.getDate().toString().padStart(2, '0');
  const mes = (dtObj.getMonth() + 1).toString().padStart(2, '0');
  const ano = dtObj.getFullYear();
  const hora = dtObj.getHours().toString().padStart(2, '0');
  const minutos = dtObj.getMinutes().toString().padStart(2, '0');
  const segundos = dtObj.getSeconds().toString().padStart(2, '0');
  const formato = `${dia}/${mes}/${ano} ${hora}:${minutos}:${segundos}`;
  return formato;
}
