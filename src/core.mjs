/** Regras de negócio sem dependência do navegador para facilitar os testes. */
export const oportunidades = Object.freeze([
  { id: 'alimentos', titulo: 'Distribuição de alimentos', categoria: 'Solidariedade', horario: 'Sábados, 09h', vagas: 8, emoji: '🥫' },
  { id: 'reforco', titulo: 'Reforço escolar', categoria: 'Educação', horario: 'Quartas, 14h', vagas: 5, emoji: '📚' },
  { id: 'animais', titulo: 'Apoio a abrigo animal', categoria: 'Bem-estar animal', horario: 'Domingos, 10h', vagas: 6, emoji: '🐾' },
]);

export function normalizarNome(nome) {
  return String(nome ?? '').trim().replace(/\s+/g, ' ');
}

export function validarInscricao({ nome, oportunidadeId } = {}) {
  const nomeNormalizado = normalizarNome(nome);
  if (nomeNormalizado.length < 2 || nomeNormalizado.length > 60) {
    return { valida: false, mensagem: 'Informe um nome entre 2 e 60 caracteres.' };
  }
  if (!oportunidades.some(({ id }) => id === oportunidadeId)) {
    return { valida: false, mensagem: 'Selecione uma oportunidade válida.' };
  }
  return { valida: true, mensagem: '', nome: nomeNormalizado, oportunidadeId };
}

export function contarPorOportunidade(inscricoes, oportunidadeId) {
  return inscricoes.filter((item) => item.oportunidadeId === oportunidadeId).length;
}

export function filtrarOportunidades(termo) {
  const pesquisa = String(termo ?? '').trim().toLocaleLowerCase('pt-BR');
  return oportunidades.filter((item) =>
    `${item.titulo} ${item.categoria}`.toLocaleLowerCase('pt-BR').includes(pesquisa)
  );
}
