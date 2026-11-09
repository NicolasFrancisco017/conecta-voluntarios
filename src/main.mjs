import {
  oportunidades,
  validarInscricao,
  contarPorOportunidade,
  filtrarOportunidades,
} from './core.mjs';

const STORAGE_KEY = 'conecta-voluntarios-inscricoes-v1';
const listaOportunidades = document.querySelector('#oportunidades');
const listaInscricoes = document.querySelector('#inscricoes');
const campoPesquisa = document.querySelector('#pesquisa');
const campoNome = document.querySelector('#nome');
const campoOportunidade = document.querySelector('#oportunidade');
const mensagem = document.querySelector('#mensagem');
const totalInscritos = document.querySelector('#total-inscritos');

function carregarInscricoes() {
  try {
    const dados = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    return Array.isArray(dados)
      ? dados.filter((item) => item && typeof item.id === 'string' &&
          typeof item.nome === 'string' && typeof item.oportunidadeId === 'string')
      : [];
  } catch {
    return [];
  }
}

let inscricoes = carregarInscricoes();

function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(inscricoes));
}

function elemento(tag, classe, conteudo) {
  const el = document.createElement(tag);
  if (classe) el.className = classe;
  if (conteudo !== undefined) el.textContent = conteudo;
  return el;
}

function renderizarOportunidades() {
  listaOportunidades.replaceChildren();
  const filtradas = filtrarOportunidades(campoPesquisa.value);

  if (!filtradas.length) {
    listaOportunidades.append(elemento('p', 'vazio', 'Nenhuma oportunidade encontrada.'));
    return;
  }

  for (const oportunidade of filtradas) {
    const card = elemento('article', 'oportunidade-card');
    const topo = elemento('div', 'card-topo');
    topo.append(
      elemento('span', 'emoji', oportunidade.emoji),
      elemento('span', 'categoria', oportunidade.categoria),
    );
    const titulo = elemento('h3', '', oportunidade.titulo);
    const dados = elemento('p', 'card-meta', `${oportunidade.horario} · ${oportunidade.vagas} vagas de referência`);
    const total = contarPorOportunidade(inscricoes, oportunidade.id);
    const inscritos = elemento('p', 'inscritos', `${total} inscrição${total === 1 ? '' : 'ões'} nesta atividade`);
    const botao = elemento('button', 'botao-secundario', 'Quero participar');
    botao.type = 'button';
    botao.addEventListener('click', () => {
      campoOportunidade.value = oportunidade.id;
      campoNome.focus();
      document.querySelector('#cadastro').scrollIntoView({ behavior: 'smooth' });
    });
    card.append(topo, titulo, dados, inscritos, botao);
    listaOportunidades.append(card);
  }
}

function renderizarInscricoes() {
  listaInscricoes.replaceChildren();
  totalInscritos.textContent = String(inscricoes.length);
  if (inscricoes.length === 0) {
    listaInscricoes.append(elemento('li', 'vazio', 'Nenhuma inscrição cadastrada nesta demonstração.'));
    return;
  }
  for (const inscricao of [...inscricoes].reverse()) {
    const atividade = oportunidades.find(({ id }) => id === inscricao.oportunidadeId);
    const linha = elemento('li', 'item-inscricao');
    const descricao = elemento('div');
    descricao.append(elemento('strong', '', inscricao.nome), elemento('span', 'subtitulo', atividade?.titulo ?? 'Atividade removida'));
    const remover = elemento('button', 'botao-texto', 'Remover');
    remover.type = 'button';
    remover.setAttribute('aria-label', `Remover inscrição de ${inscricao.nome}`);
    remover.addEventListener('click', () => {
      inscricoes = inscricoes.filter(({ id }) => id !== inscricao.id);
      salvar();
      renderizarInscricoes();
      renderizarOportunidades();
      mensagem.textContent = 'Inscrição removida.';
    });
    linha.append(descricao, remover);
    listaInscricoes.append(linha);
  }
}

for (const oportunidade of oportunidades) {
  const option = document.createElement('option');
  option.value = oportunidade.id;
  option.textContent = oportunidade.titulo;
  campoOportunidade.append(option);
}

document.querySelector('#form-inscricao').addEventListener('submit', (event) => {
  event.preventDefault();
  const resultado = validarInscricao({ nome: campoNome.value, oportunidadeId: campoOportunidade.value });
  if (!resultado.valida) {
    mensagem.textContent = resultado.mensagem;
    mensagem.dataset.tipo = 'erro';
    return;
  }
  inscricoes.push({
    id: crypto.randomUUID(),
    nome: resultado.nome,
    oportunidadeId: resultado.oportunidadeId,
  });
  salvar();
  mensagem.textContent = 'Inscrição registrada nesta demonstração local!';
  mensagem.dataset.tipo = 'sucesso';
  campoNome.value = '';
  renderizarInscricoes();
  renderizarOportunidades();
});

campoPesquisa.addEventListener('input', renderizarOportunidades);
renderizarOportunidades();
renderizarInscricoes();
