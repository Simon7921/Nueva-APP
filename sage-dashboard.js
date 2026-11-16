/* Decorative dashboard data derives exclusively from already-rendered app data.
   Does not read, calculate, recommend, or persist any insulin doses. */
(function(){'use strict';
const qs=s=>document.querySelector(s);
const pageTitle=qs('#pageTitle');
const titles={inicio:'Dashboard',alimentos:'Alimentos',recetas:'Recetas',favoritos:'Favoritos',pauta:'Mi pauta',perfil:'Ajustes',historial:'Historial'};
const links=[...document.querySelectorAll('.sidebar-nav button')];
function syncNav(){const s=(location.hash||'#inicio').slice(1);if(pageTitle)pageTitle.textContent=titles[s]||'Dashboard';links.forEach(b=>{if(b.dataset.go===s)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current')})}
function syncPlate(){
  const t=qs('#total'),plate=qs('#plate'),count=qs('#dashFoods'),hc=qs('#dashHC'),bars=qs('#plateBars');
  if(!t||!plate||!bars)return;
  const txt=t.textContent.replace(/\s*g\s*HC.*/i,'').trim();
  if(hc)hc.textContent=txt||'0';
  const list=[...plate.querySelectorAll('li.li')];if(count)count.textContent=String(list.length);
  bars.replaceChildren();
  if(!list.length){let p=document.createElement('p');p.textContent='Tu plato está vacío. Agrega algo rico y aquí verás su composición.';bars.append(p);return}
  const rows=list.map(li=>{const label=li.querySelector('.nm2,.nm');const hcEl=li.querySelector('.hcpill,.hc');const n=hcEl?Number(hcEl.textContent.replace(/[^\d,.-]/g,'').replace(',','.')):0;return{name:label?label.textContent:'Alimento',hc:Number.isFinite(n)?n:0}});
  const max=Math.max(1,...rows.map(x=>x.hc));
  for(const item of rows.slice(0,7)){
    const wrap=document.createElement('div');wrap.className='bar-row';
    const label=document.createElement('span');label.className='bar-label';label.textContent=item.name;
    const track=document.createElement('div');track.className='bar-track';const fill=document.createElement('div');fill.className='bar-fill';fill.style.width=(100*item.hc/max)+'%';track.append(fill);
    const val=document.createElement('span');val.className='bar-value';val.textContent=item.hc.toLocaleString('es-CL',{maximumFractionDigits:1})+' g';
    wrap.append(label,track,val);bars.append(wrap)
  }
}
const plate=qs('#plate');if(plate)new MutationObserver(syncPlate).observe(plate,{childList:true,subtree:true});
const total=qs('#total');if(total)new MutationObserver(syncPlate).observe(total,{childList:true,characterData:true,subtree:true});
window.addEventListener('hashchange',syncNav);window.addEventListener('popstate',syncNav);
document.addEventListener('click',e=>{if(e.target.closest('[data-go]'))requestAnimationFrame(syncNav)});
syncNav();syncPlate();
})();
