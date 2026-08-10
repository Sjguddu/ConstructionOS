(() => {
  const units = ['m³','m²','m','mm','cm','km','kg','t','L','Nos','Set','LS','Job','%','Day','Hour'];
  const style = document.createElement('style');
  style.textContent = `
    .cos-unit-select{width:100%;height:43px;margin-top:7px;border:1px solid #d8e3df;border-radius:10px;padding:0 12px;outline:0;color:#26332f;font-size:11px;background:#fcfdfd;cursor:pointer}
    .cos-unit-select:focus{border-color:#73bcb2;box-shadow:0 0 0 3px rgba(15,118,110,.08)}
    .cos-calc-fab{position:fixed;right:22px;bottom:22px;width:48px;height:48px;border:0;border-radius:15px;background:#0f766e;color:#fff;font-size:20px;font-weight:800;box-shadow:0 12px 28px rgba(15,118,110,.25);cursor:pointer;z-index:90}
    .cos-calc-fab:hover{background:#0b625c;transform:translateY(-2px)}
    .cos-calc-panel{position:fixed;right:22px;bottom:82px;width:310px;background:#fff;border:1px solid #dfe8e5;border-radius:18px;box-shadow:0 25px 70px rgba(18,52,46,.2);z-index:91;overflow:hidden}
    .cos-calc-head{display:flex;justify-content:space-between;align-items:center;padding:15px 16px;background:#f6faf8;border-bottom:1px solid #e6eeeb}
    .cos-calc-head strong{font-size:12px;color:#173f3a}.cos-calc-close{border:0;background:transparent;font-size:18px;color:#73807b;cursor:pointer}
    .cos-calc-display{margin:14px;height:58px;border:1px solid #dfe8e5;border-radius:11px;background:#fbfcfc;padding:10px 12px;text-align:right;font-size:22px;font-weight:750;color:#172522;overflow:auto}
    .cos-calc-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;padding:0 14px 14px}
    .cos-calc-grid button{height:42px;border:1px solid #e2ebe8;background:#f8faf9;border-radius:9px;color:#35433f;font-size:12px;font-weight:700;cursor:pointer}.cos-calc-grid button:hover{background:#e7f5f1;color:#0f766e}
    .cos-calc-grid .op{color:#0f766e;background:#eef8f5}.cos-calc-grid .equal{background:#0f766e;color:#fff;border-color:#0f766e}.cos-calc-grid .wide{grid-column:span 2}
    @media(max-width:600px){.cos-calc-panel{right:12px;bottom:72px;width:calc(100vw - 24px)}.cos-calc-fab{right:14px;bottom:14px}}
  `;
  document.head.appendChild(style);

  function enhanceUnits(){
    document.querySelectorAll('input').forEach(input=>{
      if(input.dataset.cosUnitEnhanced) return;
      const label=input.closest('label');
      const placeholder=(input.getAttribute('placeholder')||'').toLowerCase();
      const labelText=label?.firstChild?.textContent?.trim().toLowerCase()||'';
      if(placeholder==='unit' || labelText==='unit' || labelText.includes('unit')){
        const select=document.createElement('select');
        select.className='cos-unit-select';
        units.forEach(u=>{const o=document.createElement('option');o.value=u;o.textContent=u;select.appendChild(o)});
        const current=input.value; if(units.includes(current)) select.value=current;
        select.addEventListener('change',()=>{input.value=select.value;input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));});
        input.style.display='none'; input.dataset.cosUnitEnhanced='1'; input.parentNode.insertBefore(select,input);
      }
    });
  }

  function calculator(){
    if(document.querySelector('.cos-calc-fab')) return;
    const fab=document.createElement('button');fab.className='cos-calc-fab';fab.title='Calculator';fab.setAttribute('aria-label','Open calculator');fab.textContent='🧮';
    const panel=document.createElement('div');panel.className='cos-calc-panel';panel.hidden=true;
    panel.innerHTML=`<div class="cos-calc-head"><strong>Quick Calculator</strong><button class="cos-calc-close" aria-label="Close">×</button></div><div class="cos-calc-display">0</div><div class="cos-calc-grid"><button data-k="C" class="op">C</button><button data-k="⌫" class="op">⌫</button><button data-k="%" class="op">%</button><button data-k="/" class="op">÷</button><button data-k="7">7</button><button data-k="8">8</button><button data-k="9">9</button><button data-k="*" class="op">×</button><button data-k="4">4</button><button data-k="5">5</button><button data-k="6">6</button><button data-k="-" class="op">−</button><button data-k="1">1</button><button data-k="2">2</button><button data-k="3">3</button><button data-k="+" class="op">+</button><button data-k="0" class="wide">0</button><button data-k=".">.</button><button data-k="=" class="equal">=</button></div>`;
    document.body.append(fab,panel);
    const display=panel.querySelector('.cos-calc-display');let expr='';
    const render=()=>display.textContent=expr||'0';
    panel.querySelectorAll('[data-k]').forEach(btn=>btn.addEventListener('click',()=>{
      const k=btn.dataset.k;
      if(k==='C') expr='';
      else if(k==='⌫') expr=expr.slice(0,-1);
      else if(k==='='){
        try{if(!/^[0-9+\-*/%.()\s]+$/.test(expr))throw Error();const result=Function('"use strict";return ('+expr+')')();expr=Number.isFinite(result)?String(Math.round(result*1e10)/1e10):'';}catch{expr='Error';setTimeout(()=>{expr='';render()},700)}
      }else if(expr==='Error') expr=k; else expr+=k;
      render();
    }));
    fab.addEventListener('click',()=>{panel.hidden=!panel.hidden});panel.querySelector('.cos-calc-close').addEventListener('click',()=>panel.hidden=true);
  }
  const observer=new MutationObserver(enhanceUnits);observer.observe(document.documentElement,{childList:true,subtree:true});
  const boot=()=>{enhanceUnits();calculator()};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
