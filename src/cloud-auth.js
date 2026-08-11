import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const cloudConfigured = Boolean(url && anonKey);
export const supabase = cloudConfigured ? createClient(url, anonKey) : null;

const css = document.createElement('style');
css.textContent = `
.cos-auth{position:fixed;inset:0;background:rgba(9,34,29,.72);backdrop-filter:blur(8px);display:grid;place-items:center;padding:18px;z-index:9999}.cos-auth-card{width:min(430px,100%);background:#fff;border-radius:20px;padding:28px;box-shadow:0 30px 90px rgba(0,0,0,.25)}.cos-auth-brand{display:flex;align-items:center;gap:10px;margin-bottom:22px}.cos-auth-mark{width:38px;height:38px;border-radius:11px;background:#0f766e;color:#fff;display:grid;place-items:center;font-weight:900}.cos-auth-card h2{margin:0 0 5px;font-size:22px;color:#172522}.cos-auth-card p{margin:0 0 20px;color:#7b8984;font-size:11px;line-height:1.6}.cos-auth-card label{display:block;font-size:9px;font-weight:800;color:#52605d;margin:12px 0}.cos-auth-card input{display:block;width:100%;height:43px;margin-top:6px;border:1px solid #d8e3df;border-radius:9px;padding:0 11px;font-size:11px;box-sizing:border-box}.cos-auth-actions{display:flex;gap:8px;margin-top:16px}.cos-auth-btn{height:42px;flex:1;border:0;border-radius:9px;background:#0f766e;color:#fff;font-weight:800;font-size:10px;cursor:pointer}.cos-auth-btn.alt{background:#edf4f1;color:#38655c}.cos-auth-msg{min-height:17px;margin-top:10px;font-size:9px;color:#bd554b}.cos-auth-user{position:fixed;right:18px;bottom:18px;z-index:9000;background:#fff;border:1px solid #dfe8e4;border-radius:12px;padding:9px 11px;box-shadow:0 8px 30px rgba(20,55,48,.12);font-size:9px;color:#52605d}.cos-auth-user button{margin-left:8px;border:0;background:#edf4f1;border-radius:7px;padding:6px 8px;font-size:8px;font-weight:800;cursor:pointer}
`;
document.head.appendChild(css);

function mount(){
  if(!cloudConfigured)return;
  supabase.auth.getSession().then(({data})=>render(data.session));
  supabase.auth.onAuthStateChange((_event,session)=>render(session));
}

function render(session){
  document.querySelector('.cos-auth')?.remove();
  document.querySelector('.cos-auth-user')?.remove();
  if(session?.user){
    const el=document.createElement('div');el.className='cos-auth-user';el.innerHTML=`Signed in as <strong>${escapeHtml(session.user.email||'user')}</strong><button id="cos-signout">Sign out</button>`;document.body.appendChild(el);document.getElementById('cos-signout').onclick=()=>supabase.auth.signOut();return;
  }
  const el=document.createElement('div');el.className='cos-auth';el.innerHTML=`<div class="cos-auth-card"><div class="cos-auth-brand"><div class="cos-auth-mark">C</div><strong>ConstructionOS</strong></div><h2>Welcome back</h2><p>Sign in to keep your projects, billing and site records connected across devices.</p><label>Email<input id="cos-email" type="email" autocomplete="email" placeholder="you@example.com"></label><label>Password<input id="cos-password" type="password" autocomplete="current-password" placeholder="••••••••"></label><div class="cos-auth-actions"><button class="cos-auth-btn" id="cos-login">Log in</button><button class="cos-auth-btn alt" id="cos-signup">Create account</button></div><div class="cos-auth-msg" id="cos-msg"></div></div>`;document.body.appendChild(el);
  const msg=t=>document.getElementById('cos-msg').textContent=t;
  document.getElementById('cos-login').onclick=async()=>{const email=document.getElementById('cos-email').value.trim(),password=document.getElementById('cos-password').value;if(!email||!password)return msg('Enter email and password.');const {error}=await supabase.auth.signInWithPassword({email,password});if(error)msg(error.message)};
  document.getElementById('cos-signup').onclick=async()=>{const email=document.getElementById('cos-email').value.trim(),password=document.getElementById('cos-password').value;if(!email||password.length<6)return msg('Use an email and a password of at least 6 characters.');const {error}=await supabase.auth.signUp({email,password});msg(error?error.message:'Account created. Check your email if verification is enabled.')};
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}

mount();
