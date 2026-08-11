(()=>{
  const KEY='constructionos_calc_history';
  const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||[]}catch{return[]}};
  const write=x=>localStorage.setItem(KEY,JSON.stringify(x.slice(0,100)));
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const fmt=n=>Number.isFinite(n)?Number(n.toFixed(10)).toLocaleString('en-IN',{maximumFractionDigits:10}):'Error';
  const evaluate=expr=>{try{const clean=expr.replace(/×/g,'*').replace(/÷/g,'/').replace(/%/g,'/100');if(!/^[0-9+\-*/().\s]+$/.test(clean))return null;const v=Function('"use strict";return ('+clean+')')();return Number.isFinite(v)?v:null}catch{return null}};
  const enhance=()=>{
    const calc=document.querySelector('.calculator');
    if(!calc||calc.dataset.normalized==='1')return;
    calc.dataset.normalized='1';
    calc.innerHTML=`<div class="calc-head"><div><small>QUICK TOOL</small><h3>Calculator</h3><p>Simple calculator with keyboard & numpad support</p></div><button type="button" data-close>×</button></div><div class="calc-display" data-display>0</div><div class="calc-keys">${['C','⌫','%','÷','7','8','9','×','4','5','6','−','1','2','3','+','±','0','.','='].map(k=>`<button type="button" data-key="${k}" class="${['÷','×','−','+','='].includes(k)?'operator':''}">${k}</button>`).join('')}</div><div class="calc-history-bar"><strong>History</strong><button type="button" data-toggle-history>Show (${read().length})</button></div><div class="calc-history-list" data-history></div><p class="calc-hint">Keyboard: 0–9 · Numpad · Enter = result · Esc = close · Backspace</p>`;
    let expr='';let justSolved=false;
    const display=calc.querySelector('[data-display]');
    const render=()=>display.textContent=expr||'0';
    const history=calc.querySelector('[data-history]');
    const renderHistory=()=>{const h=read();history.innerHTML=h.length?h.map(x=>`<div class="calc-history-row"><span>${esc(x.expression)}</span><b>${esc(x.result)}</b></div>`).join(''):'<div class="calc-empty">No calculation history.</div>'};
    const save=()=>{if(!expr)return;const v=evaluate(expr);if(v===null)return;const h=read();h.unshift({id:Date.now(),expression:expr,result:fmt(v),time:new Date().toLocaleString('en-IN')});write(h);renderHistory();calc.querySelector('[data-toggle-history]').textContent=`Show (${h.length})`};
    const press=k=>{
      if(k==='C'){expr='';justSolved=false;render();return}
      if(k==='⌫'){expr=expr.slice(0,-1);justSolved=false;render();return}
      if(k==='±'){if(expr&&/^-?\d+(\.\d+)?$/.test(expr))expr=expr.startsWith('-')?expr.slice(1):'-'+expr;render();return}
      if(k==='='){const v=evaluate(expr);if(v===null){display.textContent='Error';expr='';justSolved=true;return}save();expr=String(v);justSolved=true;render();return}
      if(justSolved&&/^[0-9.]$/.test(k)){expr='';justSolved=false}
      if(k==='−')k='-';
      if(k==='×')k='×';
      if(k==='÷')k='÷';
      expr+=k;render();
    };
    calc.querySelectorAll('[data-key]').forEach(b=>b.addEventListener('click',()=>press(b.dataset.key)));
    calc.querySelector('[data-close]').addEventListener('click',()=>window.__ccClose?.());
    calc.querySelector('[data-toggle-history]').addEventListener('click',()=>{const show=history.classList.toggle('show');if(show)renderHistory();calc.querySelector('[data-toggle-history]').textContent=`${show?'Hide':'Show'} (${read().length})`});
    const key=e=>{
      if(!document.body.contains(calc)){window.removeEventListener('keydown',key);return}
      if(e.key==='Escape'){window.__ccClose?.();return}
      if(['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;
      let k=null;
      if(/^[0-9]$/.test(e.key))k=e.key;
      else if(e.key==='.')k='.';
      else if(e.key==='+')k='+';
      else if(e.key==='-')k='−';
      else if(e.key==='*')k='×';
      else if(e.key==='/')k='÷';
      else if(e.key==='%')k='%';
      else if(e.key==='Enter'||e.key==='=')k='=';
      else if(e.key==='Backspace')k='⌫';
      else if(e.key==='Delete')k='C';
      if(k){e.preventDefault();press(k)}
    };
    window.addEventListener('keydown',key);
    renderHistory();
  };
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
  enhance();
})();
