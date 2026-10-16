(function(){
  const MESI=["gennaio","febbraio","marzo","aprile","maggio","giugno","luglio","agosto","settembre","ottobre","novembre","dicembre"];
  const GIORNI=["lunedì","martedì","mercoledì","giovedì","venerdì","sabato","domenica"];
  const eventi=(window.EVENTI||[]).slice().sort((a,b)=>a.data.localeCompare(b.data));
  const pad=n=>String(n).padStart(2,"0");
  const key=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
  const parse=s=>{const [y,m,d]=s.split("-").map(Number);return new Date(y,m-1,d)};
  const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const long=s=>{const d=parse(s);return `${GIORNI[(d.getDay()+6)%7]} ${d.getDate()} ${MESI[d.getMonth()]} ${d.getFullYear()}`};
  const oggi=new Date();const oggiK=key(oggi.getFullYear(),oggi.getMonth(),oggi.getDate());
  let y=oggi.getFullYear(),m=oggi.getMonth(),sel=null;

  const grid=document.getElementById("cal-grid"),title=document.getElementById("cal-title"),panel=document.getElementById("day-panel");

  function scheda(e){
    return `<div class="day-item"><span class="tag">${esc(e.tipo)}</span><h4>${esc(e.titolo)}</h4>
      <div class="meta"><span>${esc(e.ora)}</span><span>${esc(e.luogo)}</span><span>Per: ${esc(e.destinatari)}</span><span>Iscrizione: ${esc(e.iscrizione)}</span><span>Costo: ${esc(e.costo)}</span></div>
      <a class="btn ghost" style="margin-top:12px;padding:9px 18px;font-size:.92rem" href="${esc(e.contatto||'contatti.html')}">Info e contatto</a></div>`;
  }
  function pannello(){
    if(!sel){
      const prox=eventi.find(e=>e.data>=oggiK);
      panel.innerHTML=`<h3>Seleziona un giorno</h3><p class="empty">Clicca su un giorno evidenziato per vedere i dettagli dell'incontro.${prox?`<br><br>Il prossimo appuntamento è <b>${esc(long(prox.data))}</b>.`:""}</p>`;return;
    }
    const es=eventi.filter(e=>e.data===sel);
    panel.innerHTML=`<h3>${esc(long(sel))}</h3>`+(es.length?es.map(scheda).join(""):`<p class="empty">Nessun evento in programma in questo giorno.</p>`);
  }
  function disegna(){
    title.textContent=`${MESI[m]} ${y}`;
    let h=["lun","mar","mer","gio","ven","sab","dom"].map(d=>`<div class="cal-dow">${d}</div>`).join("");
    const primo=(new Date(y,m,1).getDay()+6)%7, giorni=new Date(y,m+1,0).getDate(), prec=new Date(y,m,0).getDate();
    for(let i=0;i<primo;i++)h+=`<div class="cal-day out" aria-hidden="true">${prec-primo+1+i}</div>`;
    for(let d=1;d<=giorni;d++){
      const k=key(y,m,d),n=eventi.filter(e=>e.data===k).length;
      const c=["cal-day",n?"has":"",k===oggiK?"today":"",k===sel?"sel":""].join(" ");
      h+=`<button class="${c}" data-k="${k}" aria-label="${d} ${MESI[m]}${n?`, ${n} event${n>1?"i":"o"}`:""}"${k===sel?' aria-pressed="true"':""}>${d}</button>`;
    }
    const resto=(7-(primo+giorni)%7)%7;
    for(let i=1;i<=resto;i++)h+=`<div class="cal-day out" aria-hidden="true">${i}</div>`;
    grid.innerHTML=h;
  }
  grid.addEventListener("click",ev=>{const b=ev.target.closest("button[data-k]");if(!b)return;sel=b.dataset.k;disegna();pannello()});
  document.getElementById("cal-prev").onclick=()=>{m--;if(m<0){m=11;y--}disegna()};
  document.getElementById("cal-next").onclick=()=>{m++;if(m>11){m=0;y++}disegna()};
  document.getElementById("cal-oggi").onclick=()=>{y=oggi.getFullYear();m=oggi.getMonth();sel=null;disegna();pannello()};
  disegna();pannello();

  /* Prossimi eventi */
  const box=document.getElementById("proximi");
  const prox=eventi.filter(e=>e.data>=oggiK).slice(0,6);
  box.innerHTML=prox.length?prox.map(e=>{const d=parse(e.data);return `<article class="ev-card">
    <div class="ev-img d"><b>${d.getDate()}</b><span>${MESI[d.getMonth()].slice(0,3)} ${d.getFullYear()}</span></div>
    <div class="ev-body"><span class="tag">${esc(e.tipo)}</span><h3>${esc(e.titolo)}</h3>
    <div class="meta"><span>${esc(e.ora)}</span><span>${esc(e.luogo)}</span><span>Per: ${esc(e.destinatari)}</span></div>
    <a class="btn ghost" style="padding:9px 18px;font-size:.92rem" href="${esc(e.contatto||'contatti.html')}">Info e iscrizione</a></div></article>`}).join("")
    :`<p class="note" style="grid-column:1/-1">Al momento non ci sono eventi in programma. Torna a trovarci presto o scrivici per restare aggiornato/a.</p>`;
})();
