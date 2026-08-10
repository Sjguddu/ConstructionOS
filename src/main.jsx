import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const modules = [
  ['Overview', '⌂'], ['Projects', '▣'], ['BOQ', '▤'], ['Planning', '◷'], ['Site Progress', '↗'],
  ['Measurements', '⌁'], ['Materials', '◈'], ['Contractors', '♙'], ['Billing', '₹'], ['Reconciliation', '≋'],
  ['Documents', '▱'], ['Reports', '▥']
];

const starterProjects = [
  { id: 'p1', name: 'Pune–Satara Railway Electrification', client: 'Railway / KEC', location: 'Maharashtra', value: 48.5, progress: 68, status: 'Execution', due: '31 Mar 2027' },
  { id: 'p2', name: 'Riverfront Civil Package', client: 'Urban Development Authority', location: 'Vadodara, Gujarat', value: 18.2, progress: 42, status: 'Execution', due: '15 Dec 2026' },
  { id: 'p3', name: 'City Flyover Package', client: 'NHAI', location: 'Ahmedabad, Gujarat', value: 72.0, progress: 12, status: 'Planning', due: '30 Sep 2027' }
];

const money = (n) => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 1 })} Cr`;

function App() {
  const [active, setActive] = useState('Overview');
  const [projects, setProjects] = useState(() => JSON.parse(localStorage.getItem('constructionos_projects') || 'null') || starterProjects);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', client: '', location: '', value: '' });
  const [toast, setToast] = useState('');

  const save = (next) => { setProjects(next); localStorage.setItem('constructionos_projects', JSON.stringify(next)); };
  const notify = (text) => { setToast(text); clearTimeout(window.__cosToast); window.__cosToast = setTimeout(() => setToast(''), 2600); };
  const filtered = useMemo(() => projects.filter(p => `${p.name} ${p.client} ${p.location}`.toLowerCase().includes(search.toLowerCase())), [projects, search]);
  const total = projects.reduce((s, p) => s + Number(p.value || 0), 0);
  const avg = projects.length ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length) : 0;

  const createProject = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.client.trim()) return;
    const next = [{ id: `p-${Date.now()}`, name: form.name.trim(), client: form.client.trim(), location: form.location.trim() || 'Not set', value: Number(form.value) || 0, progress: 0, status: 'Planning', due: 'Not set' }, ...projects];
    save(next); setForm({ name: '', client: '', location: '', value: '' }); setShowCreate(false); setActive('Projects'); notify('Project created successfully.');
  };

  const renderModule = () => {
    if (active === 'Overview') return <Overview projects={projects} total={total} avg={avg} filtered={filtered} setSelected={setSelected} />;
    if (active === 'Projects') return <Projects projects={filtered} setSelected={setSelected} onCreate={() => setShowCreate(true)} />;
    return <ModulePage title={active} onAction={() => notify(`${active} workspace is ready for the next build step.`)} />;
  };

  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark">C</div><div><strong>ConstructionOS</strong><span>Construction, simplified.</span></div></div>
      <div className="label">WORKSPACE</div>
      <nav>{modules.map(([name, icon]) => <button key={name} className={`nav ${active === name ? 'active' : ''}`} onClick={() => setActive(name)}><b>{icon}</b><span>{name}</span></button>)}</nav>
      <div className="side-bottom"><button className="help" onClick={() => notify('Help centre coming soon.')}>? <span>Help & Support</span></button><div className="profile"><div className="avatar">SR</div><div><strong>Sayanjit Roy</strong><span>Project Admin</span></div></div></div>
    </aside>

    <main className="main">
      <header className="topbar"><div className="mobile-brand"><div className="brand-mark">C</div><strong>ConstructionOS</strong></div><div className="crumb">Workspace <span>/</span> <strong>{active}</strong></div><div className="top-right"><label className="search">⌕<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search projects..." /></label><button className="bell" onClick={() => notify('You are all caught up.')}>♢</button><div className="top-avatar">SR</div></div></header>
      <section className="content">{renderModule()}</section>
    </main>

    {showCreate && <div className="backdrop" onMouseDown={() => setShowCreate(false)}><form className="modal" onSubmit={createProject} onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><small>PROJECT SETUP</small><h2>Create a project</h2><p>Start with four simple details. Everything else can be added later.</p></div><button type="button" className="close" onClick={() => setShowCreate(false)}>×</button></div><label>Project name<input autoFocus required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. North Bridge Package" /></label><label>Client / owner<input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="e.g. NHAI" /></label><div className="form-grid"><label>Location<input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="City, State" /></label><label>Contract value (Cr)<input type="number" min="0" step="0.1" value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} placeholder="25.5" /></label></div><div className="actions"><button type="button" className="secondary" onClick={() => setShowCreate(false)}>Cancel</button><button className="primary">Create project</button></div></form></div>}
    {selected && <div className="backdrop" onMouseDown={() => setSelected(null)}><div className="modal detail" onMouseDown={e => e.stopPropagation()}><div className="modal-head"><div><small>PROJECT</small><h2>{selected.name}</h2><p>{selected.client} · {selected.location}</p></div><button className="close" onClick={() => setSelected(null)}>×</button></div><div className="detail-grid"><div><span>Progress</span><strong>{selected.progress}%</strong></div><div><span>Contract</span><strong>{money(selected.value)}</strong></div><div><span>Status</span><strong>{selected.status}</strong></div></div><div className="journey">{['Setup','BOQ','Planning','Execution','Billing','Reconciliation','Handover'].map((x,i) => <span className={i === 0 ? 'done' : ''} key={x}>{x}</span>)}</div><button className="primary full" onClick={() => { setSelected(null); setActive('BOQ'); }}>Open project workspace →</button></div></div>}
    {toast && <div className="toast">✓ {toast}</div>}
  </div>;
}

function Overview({ projects, total, avg, filtered, setSelected }) { return <><div className="hero"><div><small>MONDAY · 10 AUG 2026</small><h1>Your projects, one simple workspace.</h1><p>Plan, build, measure, bill and close projects without jumping between disconnected tools.</p></div><button className="primary" onClick={() => document.querySelector('[data-create]')?.click()}>＋ New project</button></div><div className="stats"><Stat label="Active projects" value={projects.length} note="Across workspace" /><Stat label="Contract value" value={money(total)} note="Total portfolio" /><Stat label="Average progress" value={`${avg}%`} note="Execution progress" /><Stat label="Planning projects" value={projects.filter(p => p.status === 'Planning').length} note="Ready to mobilise" /></div><div className="section-title"><div><h2>Projects</h2><p>Everything stays connected from start to handover.</p></div><span>{filtered.length} visible</span></div><div className="cards">{filtered.map(p => <button className="project" key={p.id} onClick={() => setSelected(p)}><div className="project-head"><span className={p.status === 'Planning' ? 'amber' : 'green'}>● {p.status}</span><b>↗</b></div><h3>{p.name}</h3><p>{p.client} · {p.location}</p><div className="progress-row"><span>Overall progress</span><strong>{p.progress}%</strong></div><div className="progress"><i style={{ width: `${p.progress}%` }} /></div><footer><span>Contract value</span><strong>{money(p.value)}</strong></footer></button>)}</div><div className="lower"><section className="panel"><h2>Project pulse</h2><p>Signals worth checking today.</p><Signal icon="!" title="BOQ quantity nearing limit" text="Excavation · 92% consumed" tone="red" /><Signal icon="₹" title="RA Bill awaiting review" text="Contractor submission · ₹18.4 L" tone="amber" /><Signal icon="✓" title="Material reconciliation completed" text="July cycle · verified" tone="green" /></section><section className="panel"><h2>Project lifecycle</h2><p>One system, from start to close.</p><div className="lifecycle">{['Contract','BOQ','Plan','Execute','Measure','Bill','Reconcile','Handover'].map((x,i) => <span key={x}><b>{i+1}</b>{x}</span>)}</div></section></div></> }
function Projects({ projects, setSelected, onCreate }) { return <><div className="hero"><div><small>PROJECT MANAGEMENT</small><h1>Projects</h1><p>Create and manage every project from one place.</p></div><button className="primary" onClick={onCreate}>＋ New project</button></div><div className="cards">{projects.map(p => <button className="project" key={p.id} onClick={() => setSelected(p)}><div className="project-head"><span className={p.status === 'Planning' ? 'amber' : 'green'}>● {p.status}</span><b>↗</b></div><h3>{p.name}</h3><p>{p.client} · {p.location}</p><div className="progress-row"><span>Progress</span><strong>{p.progress}%</strong></div><div className="progress"><i style={{ width: `${p.progress}%` }} /></div><footer><span>Contract</span><strong>{money(p.value)}</strong></footer></button>)}</div></> }
function ModulePage({ title, onAction }) { const descriptions = { BOQ:'Manage contract items, quantities, rates and variations.', Planning:'Turn contract scope into clear work packages and targets.', 'Site Progress':'Capture daily work, location, photos and progress.', Measurements:'Record MB measurements and connect them to BOQ quantities.', Materials:'Track purchase, receipt, issue, consumption and reconciliation.', Contractors:'Manage work orders, subcontractors and contractor performance.', Billing:'Prepare RA, contractor and client bills with automatic calculations.', Reconciliation:'Compare contract, executed, billed and certified quantities.', Documents:'Keep contracts, drawings, DPRs, bills and certificates together.', Reports:'Turn project data into clear management reports.' }; return <div className="empty-module"><div className="module-icon">✦</div><small>CONSTRUCTION WORKSPACE</small><h1>{title}</h1><p>{descriptions[title] || 'A focused workspace for your construction project.'}</p><button className="primary" onClick={onAction}>Explore {title} →</button><div className="module-note">This module is part of the connected project lifecycle. Data will flow between modules instead of being entered repeatedly.</div></div> }
function Stat({ label, value, note }) { return <div className="stat"><span>{label}</span><strong>{value}</strong><small>{note}</small></div> }
function Signal({ icon, title, text, tone }) { return <div className="signal"><b className={tone}>{icon}</b><div><strong>{title}</strong><span>{text}</span></div><em>Today</em></div> }

createRoot(document.getElementById('root')).render(<App />);
