const modules = [
  {code:'W3WI_101',name:'Methoden der Wirtschaftsinformatik I',year:1,ects:5,graded:true},
  {code:'W3WI_104',name:'Grundlegende Konzepte der IT',year:1,ects:5,graded:true},
  {code:'W3WI_108',name:'Programmierung I',year:1,ects:5,graded:true},
  {code:'W3WI_109',name:'Programmierung II',year:1,ects:5,graded:true},
  {code:'W3WI_201',name:'Grundlagen der Betriebswirtschaftslehre',year:1,ects:5,graded:true},
  {code:'W3WI_202',name:'Grundlagen der Rechnungslegung',year:1,ects:5,graded:true},
  {code:'W3WI_506',name:'Recht',year:1,ects:5,graded:true},
  {code:'W3WI_601',name:'Mathematik I',year:1,ects:5,graded:true},
  {code:'W3WI_701',name:'Schlüsselqualifikationen I',year:1,ects:5,graded:false},
  {code:'W3WI_BE301',name:'Grundlagen Business Engineering',year:1,ects:5,graded:true},
  {code:'W3WI_801',name:'Praxismodul I',year:1,ects:20,graded:false},
  {code:'W3WI_102',name:'Methoden der Wirtschaftsinformatik II',year:2,ects:5,graded:true},
  {code:'W3WI_105',name:'Datenbanken',year:2,ects:5,graded:true},
  {code:'W3WI_110',name:'Entwicklung verteilter Systeme',year:2,ects:5,graded:true},
  {code:'W3WI_203',name:'Finanzierung und Rechnungswesen',year:2,ects:5,graded:true},
  {code:'W3WI_505',name:'VWL',year:2,ects:5,graded:true},
  {code:'W3WI_602',name:'Mathematik II',year:2,ects:5,graded:true},
  {code:'W3WI_702',name:'Schlüsselqualifikationen II',year:2,ects:5,graded:false},
  {code:'W3WI_BE302',name:'Datenbanken im Business-Engineering-Kontext',year:2,ects:5,graded:true},
  {code:'W3WI_802',name:'Praxismodul II',year:2,ects:20,graded:true},
  {code:'W3WI_103',name:'Integrationsseminar zu ausgewählten Themen der WI',year:3,ects:5,graded:true},
  {code:'W3WI_106',name:'Geschäftsprozesse und deren Umsetzung',year:3,ects:5,graded:true},
  {code:'W3WI_107',name:'Projekt',year:3,ects:5,graded:true},
  {code:'W3WI_111',name:'Neue Konzepte',year:3,ects:5,graded:true},
  {code:'W3WI_204',name:'Management',year:3,ects:5,graded:true},
  {code:'W3WI_703',name:'Schlüsselqualifikationen III',year:3,ects:5,graded:false},
  {code:'W3WI_BE303',name:'Ausgewählte Managementaspekte des Business Engineering',year:3,ects:5,graded:true},
  {code:'W3WI_BE304',name:'IT-Management und IT-Recht',year:3,ects:5,graded:true},
  {code:'W3WI_803',name:'Praxismodul III',year:3,ects:8,graded:false},
  {code:'W3WI_901',name:'Bachelorarbeit',year:3,ects:12,graded:true},
  {code:'W3WI_BE405',name:'Supply Chain Management – Consulting',year:4,ects:5,graded:true},
  {code:'W3WI_BE406',name:'Entwicklung und Einsatz von ERP-Systemen',year:4,ects:5,graded:true},
  {code:'W3WI_BE407',name:'Data Science und Business Intelligence',year:4,ects:5,graded:true},
  {code:'W3WI_BE408',name:'Modelle des Business Engineering und der digitalen Transformation',year:4,ects:5,graded:true},
];

const STORAGE_KEY = 'wi_notenrechner_v2';
const grades = {};
const locked = {};
let activeYear = 0;

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      Object.assign(grades, data.grades || data);
      Object.assign(locked, data.locked || {});
    }
  } catch(e) {}
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({grades, locked})); } catch(e) {}
}

function parseGrade(v) {
  if (!v || !v.trim()) return null;
  const n = parseFloat(v.trim().replace(',','.'));
  if (isNaN(n)) return null;
  const rounded = Math.round(n * 10) / 10;
  if (rounded < 1.0 || rounded > 4.0) return null;
  return rounded;
}

function gradeLabel(g) {
  if (g <= 1.5) return {cls:'pill-1',txt:'Excellent'};
  if (g <= 2.5) return {cls:'pill-2',txt:'Good'};
  if (g <= 3.5) return {cls:'pill-3',txt:'Satisfactory'};
  if (g <= 4.0) return {cls:'pill-4',txt:'Sufficient'};
  return {cls:'pill-4',txt:'Failing'};
}

function updateSummary() {
  let wSumAll = 0, ectsGAll = 0, modsAll = 0;
  let wSumConf = 0, ectsGConf = 0, modsConf = 0;
  const totalEcts = modules.reduce((s,m)=>s+m.ects,0);
  const ungradedEcts = modules.filter(m=>!m.graded).reduce((s,m)=>s+m.ects,0);

  modules.forEach(m => {
    const g = grades[m.code];
    const isLocked = !!locked[m.code];
    if (m.graded && g !== undefined) {
      wSumAll += g * m.ects; ectsGAll += m.ects; modsAll++;
      if (isLocked) { wSumConf += g * m.ects; ectsGConf += m.ects; modsConf++; }
    }
  });

  const avgAll  = ectsGAll  > 0 ? wSumAll  / ectsGAll  : null;
  const avgConf = ectsGConf > 0 ? wSumConf / ectsGConf : null;

  const ectsTotalAll  = ectsGAll  + ungradedEcts;
  const ectsTotalConf = ectsGConf + ungradedEcts;
  const pctAll  = totalEcts > 0 ? ectsTotalAll  / totalEcts : 0;
  const pctConf = totalEcts > 0 ? ectsTotalConf / totalEcts : 0;

  const totalGradedMods = modules.filter(m=>m.graded).length;
  const hasPredictions = modsAll > modsConf;

  // Big value shows "with prediction" if any exist, else confirmed
  const displayAvg  = avgAll  !== null ? avgAll  : avgConf;
  const displayEcts = ectsTotalAll;
  const displayMods = modsAll;
  const displayPct  = pctAll;

  document.getElementById('totalEctsTag').textContent = totalEcts + ' ECTS total';
  document.getElementById('sumAvg').textContent = displayAvg !== null ? displayAvg.toFixed(1).replace('.',',') : '—';
  document.getElementById('sumEctsGraded').textContent = displayEcts;
  document.getElementById('sumModules').textContent = displayMods;
  document.getElementById('totalGradedEcts').textContent = totalEcts;
  document.getElementById('totalGradedModules').textContent = totalGradedMods;

  const pillEl = document.getElementById('sumPill');
  if (displayAvg !== null) {
    const lbl = gradeLabel(displayAvg);
    pillEl.innerHTML = `<span class="grade-pill ${lbl.cls}">${lbl.txt}</span>`;
  } else { pillEl.innerHTML = ''; }

  // Arc — confirmed solid, prediction dim layer behind
  const circ = 144.5;
  document.getElementById('arcFill').style.strokeDashoffset     = circ * (1 - pctConf);
  document.getElementById('arcFillPred').style.strokeDashoffset = circ * (1 - pctAll);
  document.getElementById('arcText').textContent = Math.round(pctAll * 100) + '%';

  // Show/hide split rows
  const show = hasPredictions;
  ['avgSplit','ectsSplit','modSplit','arcSplit'].forEach(id => {
    document.getElementById(id).style.display = show ? 'flex' : 'none';
  });

  if (show) {
    document.getElementById('avgConfirmed').textContent  = avgConf  !== null ? avgConf.toFixed(1).replace('.',',')  : '—';
    document.getElementById('avgPredicted').textContent  = avgAll   !== null ? avgAll.toFixed(1).replace('.',',')   : '—';
    document.getElementById('ectsConfirmed').textContent = ectsTotalConf;
    document.getElementById('ectsPredicted').textContent = ectsTotalAll;
    document.getElementById('modsConfirmed').textContent = modsConf;
    document.getElementById('modsPredicted').textContent = modsAll;
    document.getElementById('arcConfirmed').textContent  = Math.round(pctConf * 100) + '%';
    document.getElementById('arcPredicted').textContent  = Math.round(pctAll  * 100) + '%';
  }
}

const yearLabels = {1:'Year 1',2:'Year 2',3:'Year 3',4:'Elective Modules'};

function calcYearGpa(yr) {
  let wAll=0, ectsAll=0, wConf=0, ectsConf=0;
  modules.filter(m=>m.year===yr&&m.graded).forEach(m=>{
    const g=grades[m.code];
    if(g!==undefined){ wAll+=g*m.ects; ectsAll+=m.ects; }
    if(g!==undefined&&locked[m.code]){ wConf+=g*m.ects; ectsConf+=m.ects; }
  });
  return {
    all:  ectsAll  > 0 ? wAll  / ectsAll  : null,
    conf: ectsConf > 0 ? wConf / ectsConf : null,
  };
}

function render() {
  const filtered = activeYear === 0 ? modules : modules.filter(m => m.year === activeYear);
  let html = '';
  let lastYear = null;

  filtered.forEach(m => {
    if (m.year !== lastYear) {
      const yGpa = calcYearGpa(m.year);
      const hasBoth = yGpa.all !== null && yGpa.conf !== null && Math.abs(yGpa.all - yGpa.conf) > 0.009;
      let pillsHtml = '';
      if (yGpa.conf !== null) {
        pillsHtml += `<span class="year-gpa-pill confirmed"><span class="pill-line"></span>${yGpa.conf.toFixed(1).replace('.',',')}</span>`;
      }
      if (hasBoth) {
        pillsHtml += `<span class="year-gpa-pill forecast"><span class="pill-line"></span>${yGpa.all.toFixed(1).replace('.',',')}</span>`;
      }
      html += `<tr class="year-row"><td colspan="4"><div class="year-row-inner"><span>${yearLabels[m.year]}</span>${pillsHtml ? `<div class="year-gpa-pills">${pillsHtml}</div>` : ''}</div></td></tr>`;
      lastYear = m.year;
    }
    const g = grades[m.code];
    const isLocked = !!locked[m.code];
    const isPrediction = m.graded && g !== undefined && !isLocked;
    const weighted = (m.graded && g !== undefined) ? (g * m.ects).toFixed(1) : '—';
    const ectsClass = m.ects >= 12 ? 'ects-chip ects-big' : 'ects-chip';
    const ungraded = !m.graded ? `<span class="ungraded-tag">ungraded</span>` : '';
    const lockedTag = isLocked ? `<span class="locked-tag">confirmed</span>` : '';
    const predTag = isPrediction ? `<span class="prediction-tag">forecast</span>` : '';

    let inputClass = 'grade-input';
    if (isLocked) inputClass += ' locked';
    else if (g !== undefined) inputClass += ' prediction';

    const inputVal = g !== undefined ? String(g).replace('.',',') : '';
    const lockSvg = isLocked
      ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
      : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`;
    const lockTitle = isLocked ? 'Unlock grade' : 'Lock grade';

    const gradeCell = m.graded
      ? `<div class="grade-wrap">
           <div class="grade-input-wrap">
             <input class="${inputClass}" type="text" placeholder="—" value="${inputVal}"
               data-code="${m.code}" ${isLocked ? 'readonly' : ''}
               oninput="liveVal(this)" onblur="commitGrade(this)" onkeydown="if(event.key==='Enter'){this.blur()}" />
             <div class="grade-error" id="err-${m.code}">Failing grade (max. 4.0)</div>
           </div>
           <button class="lock-btn${isLocked?' is-locked':''}" title="${lockTitle}" onclick="toggleLock('${m.code}')" ${!g && !isLocked ? 'style="opacity:0.3;pointer-events:none"' : ''}>${lockSvg}</button>
         </div>`
      : `<div style="text-align:right;color:var(--text3);font-family:'DM Mono',monospace;font-size:12px">—</div>`;

    html += `<tr class="module-row">
      <td>
        <div class="mod-code">${m.code}</div>
        <div class="mod-name">${m.name}${ungraded}</div>
      </td>
      <td style="text-align:right"><span class="${ectsClass}">${m.ects}</span></td>
      <td>${gradeCell}</td>
      <td class="weighted-cell${weighted !== '—' ? ' has-val' : ''}">${weighted}</td>
    </tr>`;
  });

  document.getElementById('moduleBody').innerHTML = html;
  updateSummary();
}

function toggleLock(code) {
  if (locked[code]) {
    delete locked[code];
  } else {
    if (grades[code] !== undefined) locked[code] = true;
  }
  save(); render();
}

function liveVal(el) {
  const code = el.dataset.code;
  const raw = el.value.trim().replace(',','.');
  const n = parseFloat(raw);
  const errEl = document.getElementById('err-' + code);
  const overLimit = !isNaN(n) && n > 4.0;

  if (errEl) errEl.classList.toggle('visible', overLimit);

  const v = parseGrade(el.value);
  el.classList.toggle('valid', v !== null && el.value.trim() !== '');
  el.classList.toggle('invalid', v === null && el.value.trim() !== '');
  // Update weighted cell live
  const row = el.closest('tr');
  const cells = row.querySelectorAll('td');
  const mod = modules.find(m => m.code === code);
  if (mod && v !== null) {
    const wCell = cells[3];
    wCell.textContent = (v * mod.ects).toFixed(1);
    wCell.classList.add('has-val');
  }
}

function commitGrade(el) {
  const code = el.dataset.code;
  if (locked[code]) return;
  const raw = el.value.trim();
  const errEl = document.getElementById('err-' + code);
  if (!raw) {
    delete grades[code];
    el.classList.remove('valid','invalid','prediction');
    if (errEl) errEl.classList.remove('visible');
    save(); updateSummary(); render(); return;
  }
  const v = parseGrade(raw);
  if (v !== null) {
    grades[code] = v;
    locked[code] = true;
    el.value = String(v).replace('.',',');
    el.classList.remove('invalid','prediction');
    el.classList.add('locked');
    el.readOnly = true;
    const lockBtn = el.closest('.grade-wrap').querySelector('.lock-btn');
    if (lockBtn) { lockBtn.classList.add('is-locked'); }
    if (errEl) errEl.classList.remove('visible');
  } else {
    el.classList.add('invalid'); el.classList.remove('valid','prediction');
  }
  save(); updateSummary();
}

function showYear(y) {
  activeYear = y;
  document.querySelectorAll('.tab').forEach((t,i) => t.classList.toggle('active', i === y));
  render();
}

function clearAll() {
  if (!confirm('Clear all entered grades?')) return;
  Object.keys(grades).forEach(k => delete grades[k]);
  Object.keys(locked).forEach(k => delete locked[k]);
  save(); render();
}

function exportSummary() {
  const {avg, ectsG, mods} = (() => {
    let wSum=0,ectsG=0,mods=0;
    modules.forEach(m=>{const g=grades[m.code];if(m.graded&&g!==undefined){wSum+=g*m.ects;ectsG+=m.ects;mods++;}});
    return {avg:ectsG>0?wSum/ectsG:null,ectsG,mods};
  })();

  let lines = ['Grade Overview — Business Informatics B.Sc.',''];
  [1,2,3,4].forEach(yr => {
    const mods = modules.filter(m=>m.year===yr&&m.graded&&grades[m.code]!==undefined);
    if (!mods.length) return;
    lines.push(yearLabels[yr]);
    mods.forEach(m => { lines.push(`  ${m.code}  ${m.name}  →  ${String(grades[m.code]).replace('.',',')}  (${m.ects} ECTS)`); });
    lines.push('');
  });
  if (avg !== null) lines.push(`⌀ GPA: ${avg.toFixed(1).replace('.',',')}  (${ectsG} ECTS graded, ${mods} modules)`);

  navigator.clipboard.writeText(lines.join('\n'))
    .then(() => { const btn = document.querySelector('.btn-accent'); const orig = btn.textContent; btn.textContent = 'Copied ✓'; setTimeout(()=>btn.textContent=orig, 2000); })
    .catch(() => alert(lines.join('\n')));
}

// Theme
function toggleTheme() {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  try { localStorage.setItem('wi_theme', next); } catch(e) {}
}

// Init
try { const t = localStorage.getItem('wi_theme'); if (t) document.documentElement.setAttribute('data-theme', t); } catch(e) {}
load();
render();