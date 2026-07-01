// Clan — Family Care Hub
// Zero dependencies, 100% local-first, IndexedDB storage

const DB_NAME = 'clan';
const DB_VERSION = 1;

let db = null;
let today = new Date();

// ===== IndexedDB Initialization =====
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('medications')) {
        db.createObjectStore('medications', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('medication_logs')) {
        const store = db.createObjectStore('medication_logs', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
        store.createIndex('medId', 'medId', { unique: false });
      }
      if (!db.objectStoreNames.contains('appointments')) {
        db.createObjectStore('appointments', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('care_logs')) {
        const store = db.createObjectStore('care_logs', { keyPath: 'id' });
        store.createIndex('date', 'date', { unique: false });
      }
    };
    req.onsuccess = (e) => { db = e.target.result; resolve(); };
    req.onerror = (e) => { reject(e.target.error); };
  });
}

// ===== CRUD Helpers =====
function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function fmtDate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function fmtDisplay(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  const todayStr = fmtDate(now);
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = fmtDate(tomorrow);

  if (dateStr === todayStr) return 'Today';
  if (dateStr === tomorrowStr) return 'Tomorrow';

  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, '0')} ${ampm}`;
}

async function getAll(storeName) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function getByIndex(storeName, indexName, value) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const index = store.index(indexName);
    const req = index.getAll(value);
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

async function put(storeName, obj) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(obj);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

async function del(storeName, id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

// ===== Theme =====
function toggleTheme() {
  const body = document.body;
  body.classList.toggle('dark');
  localStorage.setItem('clan-theme', body.classList.contains('dark') ? 'dark' : 'light');
}
function loadTheme() {
  if (localStorage.getItem('clan-theme') === 'dark') {
    document.body.classList.add('dark');
  }
}

// ===== Switch Tab =====
function switchTab(name) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`panel-${name}`).classList.add('active');
  document.querySelector(`[data-tab="${name}"]`).classList.add('active');
  renderPanel(name);
}

// ===== Render Panel =====
function renderPanel(name) {
  switch (name) {
    case 'dashboard': renderDashboard(); break;
    case 'meds': renderMeds(); break;
    case 'appointments': renderAppointments(); break;
    case 'log': renderLog(); break;
  }
}

// ===== DASHBOARD =====
function renderDashboard() {
  const todayStr = fmtDate(today);
  const display = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  document.getElementById('today-date').textContent = `📋 ${display}`;

  // Today's meds
  renderTodayMeds(todayStr);
  // Today's appointments
  renderTodayAppts(todayStr);
  // Quick log
  renderQuickLog(todayStr);
}

async function renderTodayMeds(todayStr) {
  const container = document.getElementById('today-meds');
  const meds = await getAll('medications');
  const active = meds.filter(m => m.active !== false);

  // Get today's logs
  const logs = await getByIndex('medication_logs', 'date', todayStr) || [];

  const doses = [];
  for (const med of active) {
    const times = med.times || ['08:00', '20:00'];
    for (const time of times) {
      const logged = logs.find(l => l.medId === med.id && l.time === time);
      doses.push({ ...med, doseTime: time, logged });
    }
  }

  doses.sort((a, b) => a.doseTime.localeCompare(b.doseTime));

  if (doses.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">💊</div><p>No medications scheduled today.<br>Add them in the Meds tab.</p></div>';
    return;
  }

  container.innerHTML = doses.map(d => {
    const taken = d.logged?.status === 'taken';
    const skipped = d.logged?.status === 'skipped';
    const statusClass = taken || skipped ? 'completed' : '';
    const btnClass = taken ? 'taken' : skipped ? 'skipped' : '';
    const btnText = taken ? '✓ Taken' : skipped ? '✗ Skip' : '✔ Dose';
    return `
      <div class="med-card ${statusClass}" data-med-id="${d.id}" data-time="${d.doseTime}">
        <div class="med-indicator">💊</div>
        <div class="med-info">
          <div class="med-name">${escHtml(d.name)}</div>
          <div class="med-detail">${escHtml(d.dosage || '')} · ${formatTime(d.doseTime)}</div>
        </div>
        <button class="med-dose-btn ${btnClass}" onclick="logDose('${d.id}','${d.doseTime}','${todayStr}')">${btnText}</button>
      </div>
    `;
  }).join('');
}

async function logDose(medId, time, dateStr) {
  const logs = await getByIndex('medication_logs', 'date', dateStr) || [];
  const existing = logs.find(l => l.medId === medId && l.time === time);

  if (existing) {
    // Cycle: taken → skipped → remove
    if (existing.status === 'taken') {
      existing.status = 'skipped';
      await put('medication_logs', existing);
    } else {
      await del('medication_logs', existing.id);
    }
  } else {
    await put('medication_logs', {
      id: genId(),
      medId,
      date: dateStr,
      time,
      status: 'taken',
      createdAt: Date.now()
    });
  }
  renderTodayMeds(dateStr);
}

async function renderTodayAppts(todayStr) {
  const container = document.getElementById('today-appts');
  const all = await getAll('appointments');
  const todayAppts = all.filter(a => a.date === todayStr);
  todayAppts.sort((a, b) => (a.time || '00:00').localeCompare(b.time || '00:00'));

  if (todayAppts.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📅</div><p>No appointments today.</p></div>';
    return;
  }

  container.innerHTML = todayAppts.map(a => `
    <div class="appt-card">
      <div class="med-indicator">🏥</div>
      <div class="med-info">
        <div class="med-name">${escHtml(a.title)}</div>
        <div class="med-detail">${a.time ? formatTime(a.time) + ' · ' : ''}${escHtml(a.doctor || '')}${a.location ? ' · ' + escHtml(a.location) : ''}</div>
      </div>
    </div>
  `).join('');
}

async function renderQuickLog(todayStr) {
  const container = document.getElementById('quick-log-area');
  const logs = await getByIndex('care_logs', 'date', todayStr) || [];
  const existing = logs[0];

  const moodEmojis = ['😄', '🙂', '😐', '😕', '😢'];

  container.innerHTML = `
    <div class="log-entry" style="cursor:pointer;" onclick="openQuickLog()">
      ${existing ? `
        <div>
          <span class="log-mood">${moodEmojis[existing.mood] || '😐'}</span>
          <span class="log-notes">${escHtml(existing.notes || 'No notes')}</span>
        </div>
      ` : `
        <div style="color:#94a3b8;">Tap to add today's log entry...</div>
      `}
    </div>
  `;
}

function openQuickLog() {
  const todayStr = fmtDate(today);
  openLogFormForDate(todayStr);
}

// ===== MEDICATIONS =====
async function renderMeds() {
  const container = document.getElementById('med-list');
  const meds = await getAll('medications');
  meds.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  if (meds.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">💊</div><p>No medications added yet.<br>Tap "+ Add Med" to get started.</p></div>';
    return;
  }

  container.innerHTML = meds.map(m => {
    const times = (m.times || ['08:00', '20:00']).map(t => formatTime(t)).join(', ');
    return `
      <div class="med-list-item ${m.active === false ? 'inactive' : ''}">
        <div class="med-list-info">
          <div class="med-list-name">${escHtml(m.name)}</div>
          <div class="med-list-schedule">${escHtml(m.dosage || '')}${m.dosage && times ? ' — ' : ''}${times}</div>
        </div>
        <div class="med-list-actions">
          <button class="icon-btn" onclick="toggleMedActive('${m.id}')" title="${m.active === false ? 'Activate' : 'Pause'}">${m.active === false ? '▶️' : '⏸️'}</button>
          <button class="icon-btn" onclick="editMed('${m.id}')" title="Edit">✏️</button>
          <button class="icon-btn" onclick="deleteMed('${m.id}')" title="Delete">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function openMedForm(existing) {
  const isEdit = !!existing;
  const m = existing || { name: '', dosage: '', times: ['08:00', '20:00'], notes: '', active: true };

  document.getElementById('modal-content').innerHTML = `
    <h2>${isEdit ? 'Edit Medication' : 'Add Medication'}</h2>
    <div class="form-group">
      <label>Medication Name</label>
      <input type="text" id="med-name" value="${escHtml(m.name)}" placeholder="e.g., Lisinopril" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Dosage</label>
        <input type="text" id="med-dosage" value="${escHtml(m.dosage || '')}" placeholder="e.g., 10mg">
      </div>
      <div class="form-group">
        <label>Schedule</label>
        <select id="med-schedule">
          <option value="daily" ${m.schedule === 'daily' || !m.schedule ? 'selected' : ''}>Daily</option>
          <option value="twice" ${m.schedule === 'twice' ? 'selected' : ''}>Twice Daily</option>
          <option value="custom" ${m.schedule === 'custom' ? 'selected' : ''}>Custom Times</option>
        </select>
      </div>
    </div>
    <div class="form-group" id="med-times-group">
      <label>Times</label>
      <div id="med-times-inputs">
        ${(m.times || ['08:00', '20:00']).map((t, i) => `
          <div style="display:flex;gap:8px;margin-bottom:6px;">
            <input type="time" class="med-time-input" value="${t}" style="flex:1;">
            ${i > 0 ? '<button class="icon-btn" onclick="this.parentElement.remove()">✕</button>' : ''}
          </div>
        `).join('')}
      </div>
      <button class="btn-secondary" style="margin-top:6px;padding:6px 12px;font-size:0.8rem;" onclick="addTimeInput()">+ Add Time</button>
    </div>
    <div class="form-group">
      <label>Notes (optional)</label>
      <textarea id="med-notes" rows="2" placeholder="e.g., Take with food">${escHtml(m.notes || '')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveMed('${isEdit ? m.id : ''}')">${isEdit ? 'Save Changes' : 'Add Medication'}</button>
    </div>
  `;

  // Schedule change handler
  document.getElementById('med-schedule').addEventListener('change', function() {
    const group = document.getElementById('med-times-group');
    if (this.value === 'daily') {
      document.getElementById('med-times-inputs').innerHTML = `
        <div style="display:flex;gap:8px;">
          <input type="time" class="med-time-input" value="08:00" style="flex:1;">
        </div>
      `;
    } else if (this.value === 'twice') {
      document.getElementById('med-times-inputs').innerHTML = `
        <div style="display:flex;gap:8px;margin-bottom:6px;"><input type="time" class="med-time-input" value="08:00" style="flex:1;"></div>
        <div style="display:flex;gap:8px;"><input type="time" class="med-time-input" value="20:00" style="flex:1;"></div>
      `;
    }
  });

  document.getElementById('modal-overlay').classList.add('open');
}

function addTimeInput() {
  const container = document.getElementById('med-times-inputs');
  const div = document.createElement('div');
  div.style.cssText = 'display:flex;gap:8px;margin-bottom:6px;';
  div.innerHTML = '<input type="time" class="med-time-input" value="12:00" style="flex:1;"><button class="icon-btn" onclick="this.parentElement.remove()">✕</button>';
  container.appendChild(div);
}

async function saveMed(id) {
  const name = document.getElementById('med-name').value.trim();
  if (!name) { alert('Please enter a medication name.'); return; }

  const dosage = document.getElementById('med-dosage').value.trim();
  const times = Array.from(document.querySelectorAll('.med-time-input')).map(el => el.value).filter(Boolean);
  const notes = document.getElementById('med-notes').value.trim();

  if (times.length === 0) { alert('Please add at least one time.'); return; }

  const med = {
    id: id || genId(),
    name,
    dosage,
    times,
    schedule: document.getElementById('med-schedule').value,
    notes,
    active: true,
    createdAt: id ? undefined : Date.now(),
    updatedAt: Date.now()
  };

  await put('medications', med);
  closeModal();
  renderMeds();
  renderDashboard();
}

async function toggleMedActive(id) {
  const meds = await getAll('medications');
  const med = meds.find(m => m.id === id);
  if (med) {
    med.active = med.active === false ? true : false;
    med.updatedAt = Date.now();
    await put('medications', med);
    renderMeds();
    renderDashboard();
  }
}

async function editMed(id) {
  const meds = await getAll('medications');
  const med = meds.find(m => m.id === id);
  if (med) openMedForm(med);
}

async function deleteMed(id) {
  if (!confirm('Remove this medication?')) return;
  await del('medications', id);
  // Also clean up logs
  const logs = await getAll('medication_logs');
  for (const log of logs.filter(l => l.medId === id)) {
    await del('medication_logs', log.id);
  }
  renderMeds();
  renderDashboard();
}

// ===== APPOINTMENTS =====
async function renderAppointments() {
  const container = document.getElementById('appt-list');
  const all = await getAll('appointments');
  all.sort((a, b) => {
    const dateCmp = (a.date || '').localeCompare(b.date || '');
    if (dateCmp !== 0) return dateCmp;
    return (a.time || '00:00').localeCompare(b.time || '00:00');
  });

  if (all.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📅</div><p>No appointments yet.<br>Tap "+ Add Visit" to add one.</p></div>';
    return;
  }

  // Group by date
  let currentDate = '';
  let html = '';
  for (const a of all) {
    if (a.date !== currentDate) {
      currentDate = a.date;
      html += `<div class="appt-list-date" style="margin-top:12px;margin-bottom:4px;">${fmtDisplay(a.date)}</div>`;
    }
    html += `
      <div class="appt-list-item" onclick="editAppt('${a.id}')">
        <div style="display:flex;justify-content:space-between;align-items:start;">
          <div>
            <div class="appt-list-title">${escHtml(a.title)}</div>
            <div class="appt-list-detail">
              ${a.time ? formatTime(a.time) + ' · ' : ''}
              ${escHtml(a.doctor || '')}
              ${a.location ? ' · ' + escHtml(a.location) : ''}
            </div>
          </div>
          <button class="icon-btn" onclick="event.stopPropagation(); deleteAppt('${a.id}')">🗑️</button>
        </div>
        ${a.notes ? `<div class="appt-list-detail" style="margin-top:4px;">${escHtml(a.notes)}</div>` : ''}
      </div>
    `;
  }
  container.innerHTML = html;
}

function openApptForm(existing) {
  const isEdit = !!existing;
  const a = existing || { title: '', date: fmtDate(today), time: '', doctor: '', location: '', notes: '' };

  document.getElementById('modal-content').innerHTML = `
    <h2>${isEdit ? 'Edit Appointment' : 'Add Appointment'}</h2>
    <div class="form-group">
      <label>Title</label>
      <input type="text" id="appt-title" value="${escHtml(a.title)}" placeholder="e.g., Dr. Smith Checkup" autocomplete="off">
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Date</label>
        <input type="date" id="appt-date" value="${a.date}">
      </div>
      <div class="form-group">
        <label>Time (optional)</label>
        <input type="time" id="appt-time" value="${a.time || ''}">
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Doctor / Provider</label>
        <input type="text" id="appt-doctor" value="${escHtml(a.doctor || '')}" placeholder="e.g., Dr. Sarah">
      </div>
      <div class="form-group">
        <label>Location</label>
        <input type="text" id="appt-location" value="${escHtml(a.location || '')}" placeholder="e.g., 123 Main St">
      </div>
    </div>
    <div class="form-group">
      <label>Notes (optional)</label>
      <textarea id="appt-notes" rows="3">${escHtml(a.notes || '')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveAppt('${isEdit ? a.id : ''}')">${isEdit ? 'Save Changes' : 'Add Appointment'}</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}

async function saveAppt(id) {
  const title = document.getElementById('appt-title').value.trim();
  if (!title) { alert('Please enter a title.'); return; }
  const date = document.getElementById('appt-date').value;
  if (!date) { alert('Please select a date.'); return; }

  const appt = {
    id: id || genId(),
    title,
    date,
    time: document.getElementById('appt-time').value || '',
    doctor: document.getElementById('appt-doctor').value.trim(),
    location: document.getElementById('appt-location').value.trim(),
    notes: document.getElementById('appt-notes').value.trim(),
    createdAt: id ? undefined : Date.now(),
    updatedAt: Date.now()
  };

  await put('appointments', appt);
  closeModal();
  renderAppointments();
  renderDashboard();
}

async function editAppt(id) {
  const all = await getAll('appointments');
  const appt = all.find(a => a.id === id);
  if (appt) openApptForm(appt);
}

async function deleteAppt(id) {
  if (!confirm('Remove this appointment?')) return;
  await del('appointments', id);
  renderAppointments();
  renderDashboard();
}

// ===== CARE LOG =====
async function renderLog() {
  const container = document.getElementById('log-list');
  const logs = await getAll('care_logs');
  logs.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

  const moodEmojis = ['😄', '🙂', '😐', '😕', '😢'];
  const moodLabels = ['Great', 'Good', 'Okay', 'Not Great', 'Difficult'];

  if (logs.length === 0) {
    container.innerHTML = '<div class="empty-state"><div class="icon">📝</div><p>No care log entries yet.<br>Tap "+ Add Entry" to start tracking daily care.</p></div>';
    return;
  }

  container.innerHTML = logs.map(l => `
    <div class="log-entry" onclick="editLogEntry('${l.id}')">
      <div style="display:flex;justify-content:space-between;">
        <span class="log-date">${fmtDisplay(l.date)}</span>
        <div>
          <span class="log-mood">${moodEmojis[l.mood] || '😐'}</span>
          <button class="icon-btn" onclick="event.stopPropagation(); deleteLogEntry('${l.id}')">🗑️</button>
        </div>
      </div>
      ${l.symptoms && l.symptoms.length ? `<div style="font-size:0.8rem;color:#64748b;margin:4px 0;"><b>⚠️</b> ${l.symptoms.map(s => escHtml(s)).join(', ')}</div>` : ''}
      <div class="log-notes">${escHtml(l.notes || 'No notes')}</div>
    </div>
  `).join('');
}

function openLogFormForDate(dateStr) {
  openLogForm(null, dateStr);
}

async function openLogForm(existing, dateStr) {
  const isEdit = !!existing;
  const l = existing || { date: dateStr || fmtDate(today), mood: 2, symptoms: [], meals: '', notes: '' };
  const moodEmojis = ['😄', '🙂', '😐', '😕', '😢'];
  const symptomOptions = ['Fatigue', 'Pain', 'Nausea', 'Dizziness', 'Confusion', 'Fever', 'Cough', 'Other'];

  document.getElementById('modal-content').innerHTML = `
    <h2>${isEdit ? 'Edit Log Entry' : 'Add Log Entry'}</h2>
    <div class="form-group">
      <label>Date</label>
      <input type="date" id="log-date" value="${l.date}">
    </div>
    <div class="form-group">
      <label>Mood</label>
      <div class="mood-selector">
        ${moodEmojis.map((emoji, i) => `
          <button class="mood-btn ${l.mood === i ? 'selected' : ''}" onclick="selectMood(${i})">${emoji}</button>
        `).join('')}
      </div>
      <input type="hidden" id="log-mood" value="${l.mood}">
    </div>
    <div class="form-group">
      <label>Symptoms</label>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">
        ${symptomOptions.map(s => {
          const selected = (l.symptoms || []).includes(s);
          return `<button class="btn-secondary" style="padding:4px 12px;font-size:0.8rem;${selected ? 'background:#2563eb;color:#fff;' : ''}" onclick="toggleSymptom(this,'${s}')">${s}</button>`;
        }).join('')}
      </div>
      <input type="hidden" id="log-symptoms" value="${(l.symptoms || []).join(',')}">
    </div>
    <div class="form-group">
      <label>Meals (optional)</label>
      <input type="text" id="log-meals" value="${escHtml(l.meals || '')}" placeholder="e.g., Ate well, skipped lunch">
    </div>
    <div class="form-group">
      <label>Notes</label>
      <textarea id="log-notes" rows="4" placeholder="How was their day? Any concerns?">${escHtml(l.notes || '')}</textarea>
    </div>
    <div class="modal-actions">
      <button class="btn-secondary" onclick="closeModal()">Cancel</button>
      <button class="btn-primary" onclick="saveLogEntry('${isEdit ? l.id : ''}')">${isEdit ? 'Save Changes' : 'Add Entry'}</button>
    </div>
  `;
  document.getElementById('modal-overlay').classList.add('open');
}

function selectMood(level) {
  document.querySelectorAll('.mood-btn').forEach((btn, i) => {
    btn.classList.toggle('selected', i === level);
  });
  document.getElementById('log-mood').value = level;
}

function toggleSymptom(btn, name) {
  btn.classList.toggle('selected');
  const wasSelected = btn.style.background === 'rgb(37, 99, 235)';
  btn.style.background = wasSelected ? '' : '#2563eb';
  btn.style.color = wasSelected ? '' : '#fff';
  updateSymptoms();
}

function updateSymptoms() {
  const selected = [];
  document.querySelectorAll('#log-content .mood-selector + div + input').forEach(el => {});
  // Re-read from DOM
  const btns = document.querySelectorAll('#modal-content .btn-secondary');
  const active = [];
  btns.forEach(b => {
    if (b.style.background === 'rgb(37, 99, 235)' || b.classList.contains('selected')) {
      active.push(b.textContent);
    }
  });
  document.getElementById('log-symptoms').value = active.join(',');
}

async function saveLogEntry(id) {
  const date = document.getElementById('log-date').value;
  if (!date) { alert('Please select a date.'); return; }

  const mood = parseInt(document.getElementById('log-mood').value) || 2;
  const symText = document.getElementById('log-symptoms').value;
  const symptoms = symText ? symText.split(',').filter(Boolean) : [];
  const meals = document.getElementById('log-meals').value.trim();
  const notes = document.getElementById('log-notes').value.trim();

  const entry = {
    id: id || genId(),
    date,
    mood,
    symptoms,
    meals,
    notes,
    createdAt: id ? undefined : Date.now(),
    updatedAt: Date.now()
  };

  // Check if entry exists for this date (replace)
  if (!id) {
    const existingLogs = await getByIndex('care_logs', 'date', date);
    if (existingLogs.length > 0) {
      entry.id = existingLogs[0].id;
      entry.createdAt = existingLogs[0].createdAt;
    }
  }

  await put('care_logs', entry);
  closeModal();
  renderLog();
  renderDashboard();
}

async function editLogEntry(id) {
  const logs = await getAll('care_logs');
  const entry = logs.find(l => l.id === id);
  if (entry) openLogForm(entry);
}

async function deleteLogEntry(id) {
  if (!confirm('Delete this log entry?')) return;
  await del('care_logs', id);
  renderLog();
  renderDashboard();
}

// ===== EXPORT =====
async function exportData() {
  const data = {
    exportDate: new Date().toISOString(),
    app: 'Clan Care Hub',
    version: 1,
    medications: await getAll('medications'),
    medication_logs: await getAll('medication_logs'),
    appointments: await getAll('appointments'),
    care_logs: await getAll('care_logs')
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `clan-export-${fmtDate(new Date())}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ===== MODAL =====
function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
}
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ===== ESCAPE HTML =====
function escHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== INIT =====
async function init() {
  await openDB();
  loadTheme();
  renderDashboard();
}

init();
