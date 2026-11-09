import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizarNome,
  validarInscricao,
  contarPorOportunidade,
  filtrarOportunidades,
} from '../src/core.mjs';

test('normaliza espaços do nome', () => {
  assert.equal(normalizarNome('  Ana   Maria '), 'Ana Maria');
});

test('aceita inscrição válida', () => {
  assert.deepEqual(validarInscricao({ nome: ' Ana  Maria ', oportunidadeId: 'reforco' }), {
    valida: true,
    mensagem: '',
    nome: 'Ana Maria',
    oportunidadeId: 'reforco',
  });
});

test('rejeita nome muito curto', () => {
  assert.equal(validarInscricao({ nome: 'A', oportunidadeId: 'reforco' }).valida, false);
});

test('rejeita oportunidade inexistente', () => {
  assert.equal(validarInscricao({ nome: 'Ana', oportunidadeId: 'desconhecida' }).valida, false);
});

test('conta inscrições por oportunidade', () => {
  const inscricoes = [
    { oportunidadeId: 'alimentos' },
    { oportunidadeId: 'reforco' },
    { oportunidadeId: 'alimentos' },
  ];
  assert.equal(contarPorOportunidade(inscricoes, 'alimentos'), 2);
  assert.equal(contarPorOportunidade(inscricoes, 'animais'), 0);
});

test('filtra oportunidades sem diferenciar maiúsculas', () => {
  assert.equal(filtrarOportunidades('ESCOLAR').length, 1);
  assert.equal(filtrarOportunidades('').length, 3);
});
