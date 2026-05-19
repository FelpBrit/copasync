const CopaSync = (() => {
  const LS = { theme:'copasync_theme', user:'copasync_user', favTeams:'copasync_fav_teams', favGames:'copasync_fav_games', calendar:'copasync_calendar' };
  const nav = [
    ['index.html','Início','⌂'],['jogos.html','Jogos','◷'],['selecoes.html','Seleções','◉'],['grupos.html','Grupos','▦'],['chaveamento.html','Chaveamento','⌁'],['meu-sync.html','Meu Sync','★'],['calendario.html','Calendário','▣'],['login.html','Login','☻'],['sobre.html','Sobre','?']
  ];
  const mobile = [['index.html','Início','⌂'],['jogos.html','Jogos','◷'],['grupos.html','Grupos','▦'],['meu-sync.html','Sync','★'],['sobre.html','Mais','☰']];
  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
  const get = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } };
  const set = (key, value) => localStorage.setItem(key, JSON.stringify(value));
  const remove = key => localStorage.removeItem(key);
  const uid = value => String(value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
  const fetchData = async file => (await fetch(`assets/data/${file}`)).json();
  const currentFile = () => location.pathname.split('/').pop() || 'index.html';
  const isActive = href => currentFile() === href || (currentFile()==='' && href==='index.html');
  function applyTheme(){ const saved = get(LS.theme,'light'); document.documentElement.dataset.theme = saved; }
  function toggleTheme(){ const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = next; set(LS.theme,next); updateThemeButtons(); }
  function updateThemeButtons(){ $$('.theme-toggle').forEach(btn => btn.textContent = document.documentElement.dataset.theme === 'dark' ? '☀︎' : '☾'); }
  function getUser(){ return get(LS.user,null); }
  function setUser(user){ set(LS.user,user); }
  function logout(){ remove(LS.user); location.href='login.html'; }
  function showToast(message){
    let toast = document.querySelector('.app-toast');
    if(!toast){
      toast = document.createElement('div');
      toast.className = 'app-toast';
      toast.setAttribute('role','status');
      toast.setAttribute('aria-live','polite');
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(()=>toast.classList.remove('show'), 2800);
  }
  function requireUser(actionText='usar esta função'){
    if(getUser()) return true;
    showToast(`Entre com um perfil local para ${actionText}.`);
    return false;
  }
  function renderShell(){
    const user = getUser();
    $('#appHeader').innerHTML = `<header class="topbar"><div class="topbar-inner"><a class="brand" href="index.html" aria-label="CopaSync Início"><img src="assets/img/logo.png" alt="Logo CopaSync"><span>CopaSync</span></a><nav class="desktop-nav" aria-label="Menu principal">${nav.slice(0,7).map(([href,label])=>`<a class="${isActive(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav><div class="top-actions"><button class="icon-btn theme-toggle" aria-label="Alternar tema">☾</button><a class="pill-btn small" href="login.html">${user?`Perfil · ${user.nome.split(' ')[0]}`:'Entrar'}</a></div></div></header>`;
    $('#appMobileNav').innerHTML = `<nav class="mobile-nav" aria-label="Navegação inferior">${mobile.map(([href,label,ico])=>`<a class="${isActive(href)?'active':''}" href="${href}"><strong>${ico}</strong><span>${label}</span></a>`).join('')}</nav>`;
    $('.theme-toggle')?.addEventListener('click', toggleTheme); updateThemeButtons();
  }
  function toggleList(key, id){ const list = get(key,[]); const sid = String(id); const next = list.includes(sid) ? list.filter(x=>x!==sid) : [...list,sid]; set(key,next); return next.includes(sid); }
  const isIn = (key, id) => get(key,[]).includes(String(id));
  const formatDate = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'});
  const gameLabel = j => `${j.selecaoA} x ${j.selecaoB}`;
  function matchCard(j, opts={}){
    const fav = isIn(LS.favGames,j.id), cal = isIn(LS.calendar,j.id);
    return `<article class="match-card" data-game-id="${j.id}" data-group="${j.grupo}" data-stage="${j.fase}" data-teams="${j.selecaoA} ${j.selecaoB}"><div class="match-top"><span class="tag">${j.fase}${j.grupo ? ' · '+j.grupo : ''}</span><span class="tag status">${j.status}</span></div><div class="teams-row"><div class="team-name">${j.selecaoA}</div><div class="versus">x</div><div class="team-name">${j.selecaoB}</div></div><div class="meta"><span>${formatDate(j.data)}</span><span>${j.horario}</span><span>${j.estadio}</span><span>${j.cidade}</span></div><div class="card-actions"><button class="pill-btn fav ${fav?'active':''}" data-fav-game="${j.id}">${fav?'Remover favorito':'Favoritar jogo'}</button><button class="primary-btn calendar ${cal?'active':''}" data-calendar-game="${j.id}">${cal?'No calendário':'Adicionar ao calendário'}</button>${opts.teamLink?`<a class="ghost-btn" href="jogos.html?selecao=${encodeURIComponent(opts.teamLink)}">Ver jogos</a>`:''}</div></article>`;
  }
  function bindGameButtons(games){
    $$('[data-fav-game]').forEach(btn=>btn.addEventListener('click',()=>{
      if(!requireUser('favoritar jogos')) return;
      const active = toggleList(LS.favGames,btn.dataset.favGame);
      btn.classList.toggle('active',active);
      btn.textContent = active?'Remover favorito':'Favoritar jogo';
    }));
    $$('[data-calendar-game]').forEach(btn=>btn.addEventListener('click',()=>{
      if(!requireUser('adicionar jogos ao calendário')) return;
      const active = toggleList(LS.calendar,btn.dataset.calendarGame);
      btn.classList.toggle('active',active);
      btn.textContent = active?'No calendário':'Adicionar ao calendário';
    }));
  }
  function empty(title,text,href,label){ return `<div class="empty-state"><b>${title}</b><p>${text}</p>${href?`<a class="primary-btn" href="${href}">${label}</a>`:''}</div>`; }
  function makeICS(game){
    const start = new Date(`${game.data}T${game.horario}:00`);
    const end = new Date(start.getTime()+2*60*60*1000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CopaSync//PT-BR','BEGIN:VEVENT',`UID:${game.id}@copasync.local`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${gameLabel(game)}`,`LOCATION:${game.estadio} - ${game.cidade}`,`DESCRIPTION:Jogo salvo pelo CopaSync. Dados de pré-Copa sujeitos a atualização. Fase: ${game.fase}.`, 'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob = new Blob([ics],{type:'text/calendar;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`copasync-${game.id}.ics`; a.click(); URL.revokeObjectURL(a.href);
  }
  document.addEventListener('DOMContentLoaded',()=>{ applyTheme(); renderShell(); });
  return {LS,$,$$,get,set,remove,uid,fetchData,getUser,setUser,logout,showToast,requireUser,toggleList,isIn,formatDate,gameLabel,matchCard,bindGameButtons,empty,makeICS};
})();
