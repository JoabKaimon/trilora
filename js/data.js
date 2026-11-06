export const STORAGE_KEY = 'trilora-v1'; // Mantém os registros salvos na versão anterior.

export function localDate(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function daysFromToday(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return localDate(date);
}

export function initialData() {
  return {
    subjects: [
      { id: 's1', name: 'Engenharia de Software', color: '#7363dc' },
      { id: 's2', name: 'Estruturas de Dados', color: '#51b7a2' },
      { id: 's3', name: 'Banco de Dados', color: '#f3ad67' },
    ],
    tasks: [
      { id: 't1', title: 'Entregar levantamento de requisitos', subject: 's1', date: daysFromToday(2), priority: 'Alta', done: false },
      { id: 't2', title: 'Revisar árvores binárias', subject: 's2', date: daysFromToday(4), priority: 'Média', done: false },
      { id: 't3', title: 'Modelar diagrama entidade-relacionamento', subject: 's3', date: daysFromToday(7), priority: 'Média', done: false },
      { id: 't4', title: 'Definir proposta do projeto', subject: 's1', date: daysFromToday(-1), priority: 'Baixa', done: true },
    ],
  };
}

export function normalizeData(candidate) {
  if (!candidate || !Array.isArray(candidate.tasks) || !Array.isArray(candidate.subjects)) return initialData();
  return {
    subjects: candidate.subjects.filter(s => s && typeof s.id === 'string' && typeof s.name === 'string' && /^#[a-f\d]{6}$/i.test(s.color)),
    tasks: candidate.tasks.filter(t => t && typeof t.id === 'string' && typeof t.title === 'string' && typeof t.subject === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(t.date) && ['Alta', 'Média', 'Baixa'].includes(t.priority) && typeof t.done === 'boolean'),
  };
}

export function loadData(storage = localStorage) {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw === null ? initialData() : normalizeData(JSON.parse(raw));
  } catch {
    return initialData();
  }
}

export function saveData(data, storage = localStorage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch {
    return false;
  }
}

export function progress(tasks) {
  return tasks.length ? Math.round(tasks.filter(t => t.done).length * 100 / tasks.length) : 0;
}

export function filterTasks(tasks, { status = 'Todas', subject = 'Todas', query = '' } = {}) {
  const search = query.trim().toLocaleLowerCase('pt-BR');
  return tasks.filter(t =>
    (status === 'Todas' || (status === 'Pendentes' ? !t.done : t.done)) &&
    (subject === 'Todas' || t.subject === subject) &&
    t.title.toLocaleLowerCase('pt-BR').includes(search)
  ).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title, 'pt-BR'));
}

export function validTask(input, subjects) {
  const title = String(input.title || '').trim();
  const date = String(input.date || '');
  const parsed = new Date(`${date}T12:00:00`);
  return title.length >= 2 && title.length <= 120 &&
    subjects.some(s => s.id === input.subject) &&
    /^\d{4}-\d{2}-\d{2}$/.test(date) && !Number.isNaN(parsed.getTime()) && localDate(parsed) === date &&
    ['Alta', 'Média', 'Baixa'].includes(input.priority);
}

export function escapeHTML(value) {
  return String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
