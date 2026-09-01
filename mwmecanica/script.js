document.documentElement.classList.add('js');

const PASSWORD = 'MW2026';
const STORAGE_KEY = 'mw-proposta-access';

const access = document.getElementById('access');
const site = document.getElementById('site');
const form = document.getElementById('access-form');
const input = document.getElementById('password');
const error = document.getElementById('access-error');
const togglePass = document.getElementById('toggle-pass');
const logout = document.getElementById('logout');
const menuToggle = document.getElementById('menu-toggle');
const nav = document.getElementById('nav');
const progress = document.getElementById('progress-bar');

function unlock(){
  sessionStorage.setItem(STORAGE_KEY,'ok');
  access.hidden = true;
  site.hidden = false;
  document.body.classList.remove('is-locked');
  window.scrollTo({top:0,behavior:'auto'});
  requestAnimationFrame(initReveal);
}

function lock(){
  sessionStorage.removeItem(STORAGE_KEY);
  site.hidden = true;
  access.hidden = false;
  input.value = '';
  error.hidden = true;
  document.body.classList.add('is-locked');
  input.focus();
}

if(sessionStorage.getItem(STORAGE_KEY)==='ok') unlock();
else {
  document.body.classList.add('is-locked');
  requestAnimationFrame(()=>input.focus());
}

form.addEventListener('submit',e=>{
  e.preventDefault();
  if(input.value.trim()===PASSWORD){ unlock(); }
  else { error.hidden=false; input.select(); }
});

togglePass.addEventListener('click',()=>{
  const show = input.type === 'password';
  input.type = show ? 'text' : 'password';
  togglePass.textContent = show ? 'Ocultar' : 'Mostrar';
  togglePass.setAttribute('aria-label', show ? 'Ocultar senha' : 'Mostrar senha');
});

logout.addEventListener('click',lock);

menuToggle.addEventListener('click',()=>{
  const open = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded',String(open));
  menuToggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu');
});

nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
}));

document.addEventListener('click',e=>{
  if(!nav.classList.contains('is-open')) return;
  if(nav.contains(e.target) || menuToggle.contains(e.target)) return;
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
});

document.addEventListener('keydown',e=>{
  if(e.key !== 'Escape' || !nav.classList.contains('is-open')) return;
  nav.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded','false');
  menuToggle.setAttribute('aria-label','Abrir menu');
  menuToggle.focus();
});

function updateProgress(){
  const d=document.documentElement;
  const den=d.scrollHeight-d.clientHeight;
  const pct=den?Math.max(0,Math.min(1,d.scrollTop/den))*100:0;
  progress.style.width=pct+'%';
}
window.addEventListener('scroll',updateProgress,{passive:true});
window.addEventListener('resize',updateProgress);
updateProgress();

const sections=[...document.querySelectorAll('.section-anchor')];
const links=[...document.querySelectorAll('.nav__link')];
const linkMap=new Map(links.map(a=>[a.getAttribute('href').slice(1),a]));
const sectionObserver=new IntersectionObserver(entries=>{
  const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
  if(!visible) return;
  links.forEach(a=>{ a.classList.remove('is-active'); a.removeAttribute('aria-current'); });
  const activeLink=linkMap.get(visible.target.id);
  activeLink?.classList.add('is-active');
  activeLink?.setAttribute('aria-current','location');
},{rootMargin:'-30% 0px -58% 0px',threshold:[0,.1,.25,.5]});
sections.forEach(s=>sectionObserver.observe(s));

let revealObserver;
function initReveal(){
  const items=[...document.querySelectorAll('.reveal:not(.shown)')];
  if(matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)){
    items.forEach(x=>x.classList.add('shown')); return;
  }
  revealObserver?.disconnect();
  revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{
    if(e.isIntersecting){ e.target.classList.add('shown'); revealObserver.unobserve(e.target); }
  }),{threshold:.07,rootMargin:'0px 0px -4% 0px'});
  items.forEach(x=>revealObserver.observe(x));
}
initReveal();
