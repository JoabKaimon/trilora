import test from 'node:test';
import assert from 'node:assert/strict';
import { progress, filterTasks, validTask, normalizeData, escapeHTML, saveData, loadData, STORAGE_KEY } from '../js/data.js';

const subjects = [{ id: 's1', name: 'Lógica', color: '#7363dc' }, { id: 's2', name: 'Cálculo', color: '#51b7a2' }];
const tasks = [
  { id: 'a', title: 'Prova de lógica', subject: 's1', date: '2026-11-10', priority: 'Alta', done: false },
  { id: 'b', title: 'Lista de cálculo', subject: 's2', date: '2026-11-05', priority: 'Média', done: true },
  { id: 'c', title: 'Revisar lógica', subject: 's1', date: '2026-11-07', priority: 'Baixa', done: false },
];

test('calcula o percentual de conclusão e trata lista vazia', () => {
  assert.equal(progress(tasks), 33);
  assert.equal(progress([]), 0);
});

test('filtra por situação, disciplina e pesquisa sem diferenciar maiúsculas', () => {
  assert.deepEqual(filterTasks(tasks, { status: 'Pendentes', subject: 's1', query: 'LÓGICA' }).map(t => t.id), ['c', 'a']);
  assert.deepEqual(filterTasks(tasks, { status: 'Concluídas' }).map(t => t.id), ['b']);
});

test('não altera a ordem original ao filtrar', () => {
  const ids = tasks.map(t => t.id);
  filterTasks(tasks);
  assert.deepEqual(tasks.map(t => t.id), ids);
});

test('valida tarefas e rejeita datas impossíveis', () => {
  const valid = { title: '  Fazer exercício  ', subject: 's1', date: '2026-11-30', priority: 'Alta' };
  assert.equal(validTask(valid, subjects), true);
  assert.equal(validTask({ ...valid, date: '2026-02-30' }, subjects), false);
  assert.equal(validTask({ ...valid, subject: 'inexistente' }, subjects), false);
  assert.equal(validTask({ ...valid, title: ' ' }, subjects), false);
});

test('normaliza dados inválidos e preserva dados válidos da versão anterior', () => {
  const result = normalizeData({ subjects, tasks });
  assert.equal(result.subjects.length, 2);
  assert.equal(result.tasks.length, 3);
  assert.equal(normalizeData(null).subjects.length, 3);
});

test('escapa conteúdo HTML fornecido pelo usuário', () => {
  assert.equal(escapeHTML('<script>"&</script>'), '&lt;script&gt;&quot;&amp;&lt;/script&gt;');
});

test('salva e recupera no mesmo formato de localStorage da versão 1.0', () => {
  const memory = new Map();
  const storage = { getItem: key => memory.get(key) ?? null, setItem: (key, value) => memory.set(key, value) };
  assert.equal(saveData({ subjects, tasks }, storage), true);
  assert.ok(memory.has(STORAGE_KEY));
  assert.deepEqual(loadData(storage), { subjects, tasks });
});
