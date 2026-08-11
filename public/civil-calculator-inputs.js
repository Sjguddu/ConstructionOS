(()=>{
  const activeCalc=()=>document.querySelector('.calculator[data-civil-enhanced="1"]');
  const clean=()=>{const c=activeCalc();if(!c)return;const preset=c.querySelector('[data-k="preset"]');if(preset){const wrap=preset.closest('.cc-field');if(wrap)wrap.outerHTML='<div class="cc-size-note"><span>Your standard bar size</span><strong>Enter the diameter above — no preset is forced.</strong></div>'}};
  const append=(el,ch)=>{if(!el)return;el.focus();const start=el.selectionStart??el.value.length,end=el.selectionEnd??el.value.length;el.value=el.value.slice(0,start)+ch+el.value.slice(end);el.setSelectionRange(start+1,start+1);el.dispatchEvent(new Event('input',{bubbles:true}))};
  document.addEventListener('keydown',e=>{const c=activeCalc();if(!c)return;const tag=document.activeElement?.tagName;if(tag==='INPUT'||tag==='SELECT'||tag==='TEXTAREA')return;let ch=null;if(/^Numpad[0-9]$/.test(e.code))ch=e.code.slice(-1);else if(e.code==='NumpadDecimal')ch='.';if(ch!==null){const first=c.querySelector('input[data-k]');if(first){e.preventDefault();append(first,ch)}}},true);
  new MutationObserver(clean).observe(document.body,{childList:true,subtree:true});clean();
})();
