import { loadData, saveData, localDate, daysFromToday, progress, filterTasks, validTask, escapeHTML as e } from './data.js';

let data = loadData();
let page = 'dashboard';
let statusFilter = 'Todas';
let subjectFilter = 'Todas';
let searchQuery = '';
let month = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const pageElement = document.getElementById('page');
const modalElement = document.getElementById('modalroot');

function persist() {
  if (!saveData(data)) alert('Não foi possível salvar os dados neste navegador. Verifique o armazenamento disponível.');
}

function subject(id) { return data.subjects.find(s => s.id === id); }
function dateLabel(date) { return new Date(`${date}T12:00:00`).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }); }

function taskList(tasks) {
  if (!tasks.length) return '<div class="empty">Nenhuma tarefa encontrada. ✨</div>';
  return tasks.map(task => `<div class="task ${task.done ? 'done' : ''}">
    <input class="check" type="checkbox" aria-label="Concluir ${e(task.title)}" data-toggle="${e(task.id)}" ${task.done ? 'checked' : ''}>
    <div class="taskinfo"><b>${e(task.title)}</b><small>${e(subject(task.subject)?.name || 'Sem disciplina')} · ${dateLabel(task.date)}</small></div>
    <span class="chip ${task.priority === 'Alta' ? 'alta' : task.priority === 'Média' ? 'media' : 'baixa'}">${e(task.priority)}</span>
    <button class="editbtn" title="Editar tarefa" aria-label="Editar tarefa" data-edit-task="${e(task.id)}">✎</button>
    <button class="delete" title="Excluir tarefa" aria-label="Excluir tarefa" data-delete-task="${e(task.id)}">×</button>
  </div>`).join('');
}

function subjectList() {
  if (!data.subjects.length) return '<div class="empty">Nenhuma disciplina cadastrada.</div>';
  return data.subjects.map(s => {
    const tasks = data.tasks.filter(t => t.subject === s.id);
    const completed = tasks.filter(t => t.done).length;
    return `<div class="subject"><div class="subjectrow"><i class="dot" style="background:${e(s.color)}"></i>
      <b>${e(s.name)}</b><small>${completed}/${tasks.length} tarefas</small>
      <button class="delete" title="Excluir disciplina" aria-label="Excluir disciplina" data-delete-subject="${e(s.id)}">×</button></div>
      <div class="progress"><div class="bar" style="width:${progress(tasks)}%;background:${e(s.color)}"></div></div></div>`;
  }).join('');
}

function dashboard() {
  const pending = filterTasks(data.tasks, { status: 'Pendentes' });
  return `<section class="hero"><div><h2>Organize hoje. Conquiste amanhã. ✨</h2>
    <p>Seu semestre fica mais leve quando cada tarefa tem seu lugar. Que tal planejar o próximo passo?</p></div>
    <button data-add-task>+ Nova tarefa</button></section>
    <section class="stats"><div class="stat"><small>Disciplinas</small><strong>${data.subjects.length}</strong><div class="sub">Em acompanhamento</div></div>
    <div class="stat"><small>Tarefas pendentes</small><strong>${pending.length}</strong><div class="sub">Para organizar</div></div>
    <div class="stat"><small>Concluídas</small><strong>${progress(data.tasks)}%</strong><div class="sub">Do total de atividades</div></div></section>
    <div class="content"><section class="panel"><div class="sectionhead"><h2>Próximas tarefas</h2><button class="linkbtn" data-go="tasks">Ver todas →</button></div>
    ${taskList(pending.slice(0, 5))}</section><section class="panel"><div class="sectionhead"><h2>Suas disciplinas</h2><button class="linkbtn" data-add-subject>+ Adicionar</button></div>
    ${subjectList()}</section></div>`;
}

function tasksPage() {
  return `<div class="toolbar filters">
    <input class="field" id="searchTasks" aria-label="Pesquisar tarefas" placeholder="Pesquisar tarefas..." value="${e(searchQuery)}">
    <select class="field" id="filter" aria-label="Filtrar por situação">${['Todas', 'Pendentes', 'Concluídas'].map(v => `<option ${statusFilter === v ? 'selected' : ''}>${v}</option>`).join('')}</select>
    <select class="field" id="subjectFilter" aria-label="Filtrar por disciplina"><option value="Todas">Todas as disciplinas</option>
    ${data.subjects.map(s => `<option value="${e(s.id)}" ${subjectFilter === s.id ? 'selected' : ''}>${e(s.name)}</option>`).join('')}</select>
    <button class="primary" data-add-task>+ Nova tarefa</button></div>
    <section class="panel" id="taskResults">${taskList(filterTasks(data.tasks, { status: statusFilter, subject: subjectFilter, query: searchQuery }))}</section>`;
}

function calendarPage() {
  const year = month.getFullYear(), monthIndex = month.getMonth();
  const first = (new Date(year, monthIndex, 1).getDay() + 6) % 7;
  const last = new Date(year, monthIndex + 1, 0).getDate();
  let cells = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => `<div class="dayname">${day}</div>`).join('');
  for (let i = 0; i < Math.ceil((first + last) / 7) * 7; i++) {
    const day = i - first + 1;
    const date = localDate(new Date(year, monthIndex, day));
    const outside = day < 1 || day > last;
    const tasks = data.tasks.filter(t => t.date === date);
    cells += `<div class="day ${outside ? 'outside' : ''} ${date === localDate() ? 'today' : ''}">${outside ? '' : day}
      ${tasks.slice(0, 3).map(t => `<em title="${e(t.title)}">${e(t.title)}</em>`).join('')}
      ${tasks.length > 3 ? `<em>+${tasks.length - 3} tarefa(s)</em>` : ''}</div>`;
  }
  return `<div class="toolbar"><button class="primary" data-add-task>+ Nova tarefa</button></div><section class="panel">
    <div class="calendarhead"><button class="secondary" data-month="-1" aria-label="Mês anterior">‹</button>
    <h2>${month.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
    <button class="secondary" data-month="1" aria-label="Próximo mês">›</button></div><div class="calendar">${cells}</div></section>`;
}

function render() {
  const labels = {
    dashboard: ['Seu painel de estudos 👋', 'Tudo o que importa para seu semestre, em um só lugar.'],
    tasks: ['Minhas tarefas', 'Organize entregas, provas e atividades.'],
    subjects: ['Minhas disciplinas', 'Acompanhe suas matérias e seu progresso.'],
    calendar: ['Calendário acadêmico', 'Visualize seus compromissos e prazos.'],
  };
  document.querySelectorAll('[data-page]').forEach(button => button.classList.toggle('active', button.dataset.page === page));
  document.getElementById('pagetitle').textContent = labels[page][0];
  document.getElementById('subtitle').textContent = labels[page][1];
  pageElement.innerHTML = page === 'dashboard' ? dashboard() : page === 'tasks' ? tasksPage() :
    page === 'subjects' ? `<div class="toolbar"><button class="primary" data-add-subject>+ Nova disciplina</button></div><section class="panel">${subjectList()}</section>` : calendarPage();
}

function closeModal() { modalElement.innerHTML = ''; }

function openTaskModal(taskId = null) {
  if (!data.subjects.length) { alert('Cadastre uma disciplina antes de adicionar uma tarefa.'); page = 'subjects'; render(); return; }
  const task = taskId ? data.tasks.find(t => t.id === taskId) : null;
  if (taskId && !task) return;
  modalElement.innerHTML = `<div class="overlay" id="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <h2 id="modalTitle">${task ? 'Editar tarefa' : 'Criar nova tarefa'}</h2><form class="form" id="taskForm">
    <label>Título da tarefa<input class="field" name="title" minlength="2" maxlength="120" required placeholder="Ex.: Revisar capítulo 2" value="${e(task?.title ?? '')}"></label>
    <label>Disciplina<select class="field" name="subject">${data.subjects.map(s => `<option value="${e(s.id)}" ${s.id === task?.subject ? 'selected' : ''}>${e(s.name)}</option>`).join('')}</select></label>
    <label>Prazo<input class="field" type="date" name="date" required value="${e(task?.date ?? daysFromToday(1))}"></label>
    <label>Prioridade<select class="field" name="priority">${['Média', 'Alta', 'Baixa'].map(v => `<option ${v === (task?.priority ?? 'Média') ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
    <div class="actions"><button class="secondary" type="button" data-close>Cancelar</button><button class="primary" type="submit">${task ? 'Salvar alterações' : 'Criar tarefa'}</button></div>
    </form></div></div>`;
  document.getElementById('taskForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const values = { title: String(form.get('title')).trim(), subject: String(form.get('subject')), date: String(form.get('date')), priority: String(form.get('priority')) };
    if (!validTask(values, data.subjects)) { alert('Confira o título, a disciplina, o prazo e a prioridade.'); return; }
    if (task) Object.assign(task, values);
    else data.tasks.push({ id: crypto.randomUUID(), ...values, done: false });
    persist(); closeModal(); render();
  });
  modalElement.querySelector('input')?.focus();
}

function openSubjectModal() {
  modalElement.innerHTML = `<div class="overlay" id="overlay"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
    <h2 id="modalTitle">Adicionar disciplina</h2><form class="form" id="subjectForm">
    <label>Nome da disciplina<input class="field" name="name" minlength="2" maxlength="80" required placeholder="Ex.: Cálculo I"></label>
    <label>Cor de identificação<input class="field" type="color" name="color" value="#7363dc"></label>
    <div class="actions"><button class="secondary" type="button" data-close>Cancelar</button><button class="primary" type="submit">Salvar</button></div>
    </form></div></div>`;
  document.getElementById('subjectForm').addEventListener('submit', event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    if (name.length < 2 || name.length > 80) { alert('Informe um nome entre 2 e 80 caracteres.'); return; }
    if (data.subjects.some(s => s.name.toLocaleLowerCase('pt-BR') === name.toLocaleLowerCase('pt-BR'))) { alert('Essa disciplina já foi cadastrada.'); return; }
    data.subjects.push({ id: crypto.randomUUID(), name, color: String(form.get('color')) });
    persist(); closeModal(); render();
  });
  modalElement.querySelector('input')?.focus();
}

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (event.target.id === 'overlay' || button?.hasAttribute('data-close')) { closeModal(); return; }
  if (!button) return;
  if (button.dataset.page || button.dataset.go) { page = button.dataset.page || button.dataset.go; render(); }
  else if (button.hasAttribute('data-add-task')) openTaskModal();
  else if (button.hasAttribute('data-add-subject')) openSubjectModal();
  else if (button.dataset.editTask) openTaskModal(button.dataset.editTask);
  else if (button.dataset.month) { month = new Date(month.getFullYear(), month.getMonth() + Number(button.dataset.month), 1); render(); }
  else if (button.dataset.deleteTask && confirm('Excluir esta tarefa?')) {
    data.tasks = data.tasks.filter(t => t.id !== button.dataset.deleteTask); persist(); render();
  } else if (button.dataset.deleteSubject) {
    if (data.tasks.some(t => t.subject === button.dataset.deleteSubject)) { alert('Remova as tarefas desta disciplina antes de excluí-la.'); return; }
    if (confirm('Excluir esta disciplina?')) { data.subjects = data.subjects.filter(s => s.id !== button.dataset.deleteSubject); persist(); render(); }
  }
});

document.addEventListener('change', event => {
  const target = event.target;
  if (target.dataset.toggle) {
    const task = data.tasks.find(t => t.id === target.dataset.toggle);
    if (task) { task.done = target.checked; persist(); render(); }
  } else if (target.id === 'filter') { statusFilter = target.value; render(); }
  else if (target.id === 'subjectFilter') { subjectFilter = target.value; render(); }
});

document.addEventListener('input', event => {
  if (event.target.id !== 'searchTasks') return;
  searchQuery = event.target.value;
  // Atualiza somente os resultados, preservando o foco e a posição do cursor.
  document.getElementById('taskResults').innerHTML = taskList(filterTasks(data.tasks, { status: statusFilter, subject: subjectFilter, query: searchQuery }));
});

document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });
render();
