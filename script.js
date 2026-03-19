const modules = [
  { code: 'W3WI_101',   name: 'Methoden der Wirtschaftsinformatik I',               year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_104',   name: 'Grundlegende Konzepte der IT',                        year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_108',   name: 'Programmierung I',                                    year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_109',   name: 'Programmierung II',                                   year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_201',   name: 'Grundlagen der Betriebswirtschaftslehre',             year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_202',   name: 'Grundlagen der Rechnungslegung',                      year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_506',   name: 'Recht',                                               year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_601',   name: 'Mathematik I',                                        year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_701',   name: 'Schlüsselqualifikationen I',                          year: 1, ects: 5,  graded: false },
  { code: 'W3WI_BE301', name: 'Grundlagen Business Engineering',                     year: 1, ects: 5,  graded: true  },
  { code: 'W3WI_801',   name: 'Praxismodul I',                                       year: 1, ects: 20, graded: false },
  { code: 'W3WI_102',   name: 'Methoden der Wirtschaftsinformatik II',               year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_105',   name: 'Datenbanken',                                         year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_110',   name: 'Entwicklung verteilter Systeme',                      year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_203',   name: 'Finanzierung und Rechnungswesen',                     year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_505',   name: 'VWL',                                                 year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_602',   name: 'Mathematik II',                                       year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_702',   name: 'Schlüsselqualifikationen II',                         year: 2, ects: 5,  graded: false },
  { code: 'W3WI_BE302', name: 'Datenbanken im Business-Engineering-Kontext',         year: 2, ects: 5,  graded: true  },
  { code: 'W3WI_802',   name: 'Praxismodul II',                                      year: 2, ects: 20, graded: true  },
  { code: 'W3WI_103',   name: 'Integrationsseminar zu ausgewählten Themen der WI',  year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_106',   name: 'Geschäftsprozesse und deren Umsetzung',              year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_107',   name: 'Projekt',                                             year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_111',   name: 'Neue Konzepte',                                       year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_204',   name: 'Management',                                          year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_703',   name: 'Schlüsselqualifikationen III',                        year: 3, ects: 5,  graded: false },
  { code: 'W3WI_BE303', name: 'Ausgewählte Managementaspekte des Business Engineering', year: 3, ects: 5, graded: true },
  { code: 'W3WI_BE304', name: 'IT-Management und IT-Recht',                          year: 3, ects: 5,  graded: true  },
  { code: 'W3WI_803',   name: 'Praxismodul III',                                     year: 3, ects: 8,  graded: false },
  { code: 'W3WI_901',   name: 'Bachelorarbeit',                                      year: 3, ects: 12, graded: true  },
  { code: 'W3WI_BE405', name: 'Supply Chain Management – Consulting',                year: 4, ects: 5,  graded: true  },
  { code: 'W3WI_BE406', name: 'Entwicklung und Einsatz von ERP-Systemen',            year: 4, ects: 5,  graded: true  },
  { code: 'W3WI_BE407', name: 'Data Science und Business Intelligence',              year: 4, ects: 5,  graded: true  },
  { code: 'W3WI_BE408', name: 'Modelle des Business Engineering und der digitalen Transformation', year: 4, ects: 5, graded: true },
];

const STORAGE_KEY = 'wi_notenrechner_v2';

const YEAR_LABELS = {
  1: 'Jahr 1',
  2: 'Jahr 2',
  3: 'Jahr 3',
  4: 'Wahlpflichtmodule',
};

// Ordered by max grade; first match wins
const GRADE_THRESHOLDS = [
  { max: 1.5, cssClass: 'pill-1', label: 'Sehr gut'     },
  { max: 2.5, cssClass: 'pill-2', label: 'Gut'          },
  { max: 3.5, cssClass: 'pill-3', label: 'Befriedigend' },
  { max: 4.0, cssClass: 'pill-4', label: 'Ausreichend'  },
];

const state = {
  grades: {}, // { [moduleCode]: number }
  locked: {}, // { [moduleCode]: true } — confirmed/locked grades
};

let activeYear = 0; // 0 = show all years

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    // Backwards compatibility: older format stored grades directly without a wrapper object
    Object.assign(state.grades, data.grades ?? data);
    Object.assign(state.locked, data.locked ?? {});
  } catch (e) {
    console.warn('Failed to load saved data:', e);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      grades: state.grades,
      locked: state.locked,
    }));
  } catch (e) {
    console.warn('Failed to save data:', e);
  }
}

// Parses user input into a valid grade (1.0–4.0), returns null if invalid
function parseGrade(rawValue) {
  if (!rawValue?.trim()) return null;

  const normalized = rawValue.trim().replace(',', '.');
  const number = parseFloat(normalized);

  if (isNaN(number)) return null;

  const rounded = Math.round(number * 10) / 10;
  if (rounded < 1.0 || rounded > 4.0) return null;

  return rounded;
}

function getGradeLabel(grade) {
  return GRADE_THRESHOLDS.find(t => grade <= t.max) ?? { cssClass: 'pill-4', label: 'Nicht bestanden' };
}

// Formats a number using German decimal notation (e.g. 1.7 → "1,7")
function formatGrade(number) {
    if (number !== null){
        return number.toFixed(1).replace('.', ',');
    }

    return undefined;
}

// Returns the ECTS-weighted average for a list of modules; null if no grades entered yet
function calcWeightedAverage(moduleList, onlyLocked = false) {
  let weightedSum = 0;
  let totalEcts   = 0;

  for (const mod of moduleList) {
    if (!mod.graded) continue;

    const grade = state.grades[mod.code];
    if (grade === undefined) continue;
    if (onlyLocked && !state.locked[mod.code]) continue;

    weightedSum += grade * mod.ects;
    totalEcts   += mod.ects;
  }

  return totalEcts > 0 ? weightedSum / totalEcts : null;
}

function countGradedEcts(onlyLocked = false) {
  return modules
    .filter(mod => {
      if (!mod.graded || state.grades[mod.code] === undefined) return false;
      return !onlyLocked || state.locked[mod.code];
    })
    .reduce((sum, mod) => sum + mod.ects, 0);
}

function countGradedModules(onlyLocked = false) {
  return modules.filter(mod => {
    if (!mod.graded || state.grades[mod.code] === undefined) return false;
    return !onlyLocked || state.locked[mod.code];
  }).length;
}

function updateSummary() {
  const totalEcts    = modules.reduce((sum, mod) => sum + mod.ects, 0);
  const ungradedEcts = modules.filter(mod => !mod.graded).reduce((sum, mod) => sum + mod.ects, 0);

  const avgAll       = calcWeightedAverage(modules, false);
  const avgConfirmed = calcWeightedAverage(modules, true);

  // Include ungraded ECTS in progress so the arc reflects overall completion
  const ectsAllTotal       = countGradedEcts(false) + ungradedEcts;
  const ectsConfirmedTotal = countGradedEcts(true)  + ungradedEcts;

  const progressAll       = totalEcts > 0 ? ectsAllTotal       / totalEcts : 0;
  const progressConfirmed = totalEcts > 0 ? ectsConfirmedTotal / totalEcts : 0;

  const modulesAll       = countGradedModules(false);
  const modulesConfirmed = countGradedModules(true);

  document.getElementById('totalEctsTag').textContent       = `${totalEcts} ECTS gesamt`;
  document.getElementById('sumAvg').textContent             = avgConfirmed !== null ? formatGrade(avgConfirmed) : '—';
  document.getElementById('sumEctsGraded').textContent      = ectsConfirmedTotal;
  document.getElementById('sumModules').textContent         = modulesConfirmed;
  document.getElementById('totalGradedEcts').textContent    = totalEcts;
  document.getElementById('totalGradedModules').textContent = modules.filter(m => m.graded).length;

  const pillEl = document.getElementById('sumPill');
  if (avgAll !== null) {
    const { cssClass, label } = getGradeLabel(avgAll);
    pillEl.innerHTML = `<span class="grade-pill ${cssClass}">${label}</span>`;
  } else {
    pillEl.innerHTML = '';
  }

  // Confirmed arc renders solid; forecast layer sits behind it, dimmed
  const circumference = 144.5;
  document.getElementById('arcFill').style.strokeDashoffset     = circumference * (1 - progressConfirmed);
  document.getElementById('arcFillPred').style.strokeDashoffset = circumference * (1 - progressAll);
  document.getElementById('arcText').textContent = `${Math.round(progressConfirmed * 100)}%`;

    document.getElementById('avgConfirmed').textContent  = avgConfirmed !== null ? formatGrade(avgConfirmed) : '—';
    document.getElementById('avgPredicted').textContent  = avgAll       !== null ? formatGrade(avgAll)       : '—';
    document.getElementById('ectsConfirmed').textContent = ectsConfirmedTotal;
    document.getElementById('ectsPredicted').textContent = ectsAllTotal;
    document.getElementById('modsConfirmed').textContent = modulesConfirmed;
    document.getElementById('modsPredicted').textContent = modulesAll;
    document.getElementById('arcConfirmed').textContent  = `${Math.round(progressConfirmed * 100)}%`;
    document.getElementById('arcPredicted').textContent  = `${Math.round(progressAll * 100)}%`;
}

function calcYearAverage(year) {
  const yearModules = modules.filter(mod => mod.year === year);
  return {
    all:       calcWeightedAverage(yearModules, false),
    confirmed: calcWeightedAverage(yearModules, true),
  };
}

function buildYearHeaderRow(year) {
  const { all, confirmed } = calcYearAverage(year);
  const showBothPills = all !== null && confirmed !== null && Math.abs(all - confirmed) > 0.009;

  let pillsHtml = '';
  if (confirmed !== null) {
    pillsHtml += `<span class="year-gpa-pill confirmed"><span class="pill-line"></span>${formatGrade(confirmed)}</span>`;
  }
  
  console.log(all, confirmed)
  if(formatGrade(all) !== undefined){
    pillsHtml += `<span class="year-gpa-pill forecast"><span class="pill-line"></span>${formatGrade(all)}</span>`;
  }
  
  const pillsWrapper = pillsHtml ? `<div class="year-gpa-pills">${pillsHtml}</div>` : '';
  return `<tr class="year-row">
    <td colspan="4">
      <div class="year-row-inner">
        <span>${YEAR_LABELS[year]}</span>
        ${pillsWrapper}
      </div>
    </td>
  </tr>`;
}

const LOCK_ICON = {
  locked: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>`,
  unlocked: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
               <rect x="3" y="11" width="18" height="11" rx="2"/>
               <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
             </svg>`,
};

function buildModuleRow(mod) {
  const grade       = state.grades[mod.code];
  const isLocked    = !!state.locked[mod.code];
  const weightedPts = (mod.graded && grade !== undefined) ? (grade * mod.ects).toFixed(1) : '—';

  const ectsClass   = mod.ects >= 12 ? 'ects-chip ects-big' : 'ects-chip';
  const ungradedTag = !mod.graded ? `<span class="ungraded-tag">ohne Benotung</span>` : '';

  let inputClass = 'grade-input';
  if (isLocked)                inputClass += ' locked';
  else if (grade !== undefined) inputClass += ' prediction';

  const inputValue   = grade !== undefined ? String(grade).replace('.', ',') : '';
  const lockDisabled = !grade && !isLocked ? 'style="opacity:0.3;pointer-events:none"' : '';
  const lockIcon     = isLocked ? LOCK_ICON.locked : LOCK_ICON.unlocked;
  const lockTitle    = isLocked ? 'Note entsperren' : 'Note bestätigen';

  const gradeCell = mod.graded
    ? `<div class="grade-wrap">
         <div class="grade-input-wrap">
           <input
             class="${inputClass}"
             type="text"
             placeholder="—"
             value="${inputValue}"
             data-code="${mod.code}"
             ${isLocked ? 'readonly' : ''}
             oninput="onGradeInput(this)"
             onblur="onGradeCommit(this)"
             onkeydown="if(event.key==='Enter') this.blur()"
           />
           <div class="grade-error" id="err-${mod.code}">Note zu hoch (max. 4,0)</div>
         </div>
         <button
           class="lock-btn${isLocked ? ' is-locked' : ''}"
           title="${lockTitle}"
           onclick="toggleLock('${mod.code}')"
           ${lockDisabled}
         >${lockIcon}</button>
       </div>`
    : `<div style="text-align:right;color:var(--text3);font-family:'DM Mono',monospace;font-size:12px">—</div>`;

  return `<tr class="module-row">
    <td>
      <div class="mod-code">${mod.code}</div>
      <div class="mod-name">${mod.name}${ungradedTag}</div>
    </td>
    <td style="text-align:right"><span class="${ectsClass}">${mod.ects}</span></td>
    <td>${gradeCell}</td>
    <td class="weighted-cell${weightedPts !== '—' ? ' has-val' : ''}">${weightedPts}</td>
  </tr>`;
}

function render() {
  const visibleModules = activeYear === 0
    ? modules
    : modules.filter(mod => mod.year === activeYear);

  let html = '';
  let lastRenderedYear = null;

  for (const mod of visibleModules) {
    if (mod.year !== lastRenderedYear) {
      html += buildYearHeaderRow(mod.year);
      lastRenderedYear = mod.year;
    }
    html += buildModuleRow(mod);
  }

  document.getElementById('moduleBody').innerHTML = html;
  updateSummary();
}

// Fires on every keystroke: shows validation feedback and updates the weighted points cell live
function onGradeInput(inputEl) {
  const code   = inputEl.dataset.code;
  const number = parseFloat(inputEl.value.trim().replace(',', '.'));
  const errEl  = document.getElementById(`err-${code}`);

  errEl?.classList.toggle('visible', !isNaN(number) && number > 4.0);

  const parsedGrade = parseGrade(inputEl.value);
  const hasInput    = inputEl.value.trim() !== '';
  inputEl.classList.toggle('valid',   parsedGrade !== null && hasInput);
  inputEl.classList.toggle('invalid', parsedGrade === null && hasInput);

  if (parsedGrade !== null) {
    const mod   = modules.find(m => m.code === code);
    const wCell = inputEl.closest('tr')?.querySelectorAll('td')[3];
    if (mod && wCell) {
      wCell.textContent = (parsedGrade * mod.ects).toFixed(1);
      wCell.classList.add('has-val');
    }
  }
}

// Fires on blur/Enter: saves the grade and automatically locks it
function onGradeCommit(inputEl) {
  const code  = inputEl.dataset.code;
  const errEl = document.getElementById(`err-${code}`);

  if (state.locked[code]) return;

  if (!inputEl.value.trim()) {
    delete state.grades[code];
    inputEl.classList.remove('valid', 'invalid', 'prediction');
    errEl?.classList.remove('visible');
    saveToStorage();
    updateSummary();
    render();
    return;
  }

  const parsedGrade = parseGrade(inputEl.value);

  if (parsedGrade !== null) {
    state.grades[code] = parsedGrade;
    state.locked[code] = true;

    inputEl.value    = formatGrade(parsedGrade);
    inputEl.readOnly = true;
    inputEl.classList.remove('invalid', 'prediction');
    inputEl.classList.add('locked');

    inputEl.closest('.grade-wrap')?.querySelector('.lock-btn')?.classList.add('is-locked');
    errEl?.classList.remove('visible');
  } else {
    inputEl.classList.add('invalid');
    inputEl.classList.remove('valid', 'prediction');
  }

  render();
  saveToStorage();
  updateSummary();
}

function toggleLock(code) {
  if (state.locked[code]) {
    delete state.locked[code];
  } else if (state.grades[code] !== undefined) {
    state.locked[code] = true;
  }
  saveToStorage();
  render();
}

// year = 0 shows all years
function showYear(year) {
  activeYear = year;
  document.querySelectorAll('.tab').forEach((tab, index) => {
    tab.classList.toggle('active', index === year);
  });
  render();
}

function clearAll() {
  if (!confirm('Alle eingetragenen Noten löschen?')) return;

  for (const key of Object.keys(state.grades)) delete state.grades[key];
  for (const key of Object.keys(state.locked)) delete state.locked[key];

  saveToStorage();
  render();
}

function exportSummary() {
  const avg  = calcWeightedAverage(modules, false);
  const ects = countGradedEcts(false);
  const mods = countGradedModules(false);

  const lines = ['Notenübersicht – Wirtschaftsinformatik B.Sc.', ''];

  for (const year of [1, 2, 3, 4]) {
    const gradedInYear = modules.filter(mod =>
      mod.year === year && mod.graded && state.grades[mod.code] !== undefined
    );
    if (!gradedInYear.length) continue;

    lines.push(YEAR_LABELS[year]);
    for (const mod of gradedInYear) {
      lines.push(`  ${mod.code}  ${mod.name}  →  ${formatGrade(state.grades[mod.code])}  (${mod.ects} ECTS)`);
    }
    lines.push('');
  }

  if (avg !== null) {
    lines.push(`⌀ Durchschnitt: ${formatGrade(avg)}  (${ects} ECTS benotet, ${mods} Module)`);
  }

  const summaryText = lines.join('\n');

  navigator.clipboard.writeText(summaryText)
    .then(() => {
      const btn  = document.querySelector('.btn-accent');
      const orig = btn.textContent;
      btn.textContent = 'Kopiert ✓';
      setTimeout(() => btn.textContent = orig, 2000);
    })
    .catch(() => alert(summaryText));
}

function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('wi_theme', next); } catch (e) {}
}

// Restore saved theme before first render to avoid a flash
try {
  const savedTheme = localStorage.getItem('wi_theme');
  if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
} catch (e) {}

loadFromStorage();
render();