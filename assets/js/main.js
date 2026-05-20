const CopaSync = (() => {
  const LS = { theme:'copasync_theme', user:'copasync_user', favTeams:'copasync_fav_teams', favGames:'copasync_fav_games', calendar:'copasync_calendar' };
  const nav = [
    ['index.html','Início','⌂'],['jogos.html','Jogos','◷'],['selecoes.html','Seleções','◉'],['grupos.html','Grupos','▦'],['chaveamento.html','Chaveamento','⌁'],['meu-sync.html','Meu Sync','★'],['calendario.html','Calendário','▣'],['login.html','Login','☻'],['sobre.html','Sobre','?']
  ];
  const mobile = [['index.html','Início','⌂'],['jogos.html','Jogos','◷'],['selecoes.html','Seleções','◉'],['meu-sync.html','Meu Sync','★'],['login.html','Perfil','☻']];
  const flagImages = {
      "México": "assets/img/flags/mexico.svg",
      "África do Sul": "assets/img/flags/africa-do-sul.svg",
      "República da Coreia": "assets/img/flags/republica-da-coreia.svg",
      "Tchéquia": "assets/img/flags/tchequia.svg",
      "Canadá": "assets/img/flags/canada.svg",
      "Bósnia e Herzegovina": "assets/img/flags/bosnia-e-herzegovina.svg",
      "Catar": "assets/img/flags/catar.svg",
      "Suíça": "assets/img/flags/suica.svg",
      "Brasil": "assets/img/flags/brasil.svg",
      "Marrocos": "assets/img/flags/marrocos.svg",
      "Haiti": "assets/img/flags/haiti.svg",
      "Escócia": "assets/img/flags/escocia.svg",
      "Estados Unidos": "assets/img/flags/estados-unidos.svg",
      "Paraguai": "assets/img/flags/paraguai.svg",
      "Austrália": "assets/img/flags/australia.svg",
      "Turquia": "assets/img/flags/turquia.svg",
      "Alemanha": "assets/img/flags/alemanha.svg",
      "Curaçao": "assets/img/flags/curacao.svg",
      "Costa do Marfim": "assets/img/flags/costa-do-marfim.svg",
      "Equador": "assets/img/flags/equador.svg",
      "Países Baixos": "assets/img/flags/paises-baixos.svg",
      "Japão": "assets/img/flags/japao.svg",
      "Tunísia": "assets/img/flags/tunisia.svg",
      "Suécia": "assets/img/flags/suecia.svg",
      "Bélgica": "assets/img/flags/belgica.svg",
      "Egito": "assets/img/flags/egito.svg",
      "Irã": "assets/img/flags/ira.svg",
      "Nova Zelândia": "assets/img/flags/nova-zelandia.svg",
      "Espanha": "assets/img/flags/espanha.svg",
      "Cabo Verde": "assets/img/flags/cabo-verde.svg",
      "Arábia Saudita": "assets/img/flags/arabia-saudita.svg",
      "Uruguai": "assets/img/flags/uruguai.svg",
      "França": "assets/img/flags/franca.svg",
      "Senegal": "assets/img/flags/senegal.svg",
      "Iraque": "assets/img/flags/iraque.svg",
      "Noruega": "assets/img/flags/noruega.svg",
      "Argentina": "assets/img/flags/argentina.svg",
      "Argélia": "assets/img/flags/argelia.svg",
      "Áustria": "assets/img/flags/austria.svg",
      "Jordânia": "assets/img/flags/jordania.svg",
      "Portugal": "assets/img/flags/portugal.svg",
      "RD Congo": "assets/img/flags/rd-congo.svg",
      "Uzbequistão": "assets/img/flags/uzbequistao.svg",
      "Colômbia": "assets/img/flags/colombia.svg",
      "Inglaterra": "assets/img/flags/inglaterra.svg",
      "Croácia": "assets/img/flags/croacia.svg",
      "Gana": "assets/img/flags/gana.svg",
      "Panamá": "assets/img/flags/panama.svg"
  };
  const flagCodes = {
      "México": "MEX",
      "África do Sul": "RSA",
      "República da Coreia": "KOR",
      "Tchéquia": "CZE",
      "Canadá": "CAN",
      "Bósnia e Herzegovina": "BIH",
      "Catar": "QAT",
      "Suíça": "SUI",
      "Brasil": "BRA",
      "Marrocos": "MAR",
      "Haiti": "HAI",
      "Escócia": "SCO",
      "Estados Unidos": "USA",
      "Paraguai": "PAR",
      "Austrália": "AUS",
      "Turquia": "TUR",
      "Alemanha": "GER",
      "Curaçao": "CUW",
      "Costa do Marfim": "CIV",
      "Equador": "ECU",
      "Países Baixos": "NED",
      "Japão": "JPN",
      "Tunísia": "TUN",
      "Suécia": "SWE",
      "Bélgica": "BEL",
      "Egito": "EGY",
      "Irã": "IRN",
      "Nova Zelândia": "NZL",
      "Espanha": "ESP",
      "Cabo Verde": "CPV",
      "Arábia Saudita": "KSA",
      "Uruguai": "URU",
      "França": "FRA",
      "Senegal": "SEN",
      "Iraque": "IRQ",
      "Noruega": "NOR",
      "Argentina": "ARG",
      "Argélia": "ALG",
      "Áustria": "AUT",
      "Jordânia": "JOR",
      "Portugal": "POR",
      "RD Congo": "COD",
      "Uzbequistão": "UZB",
      "Colômbia": "COL",
      "Inglaterra": "ENG",
      "Croácia": "CRO",
      "Gana": "GHA",
      "Panamá": "PAN"
  };
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
  function toast(message){
    const old = $('#copasyncToast'); if(old) old.remove();
    const el = document.createElement('div'); el.id='copasyncToast'; el.className='toast'; el.textContent=message;
    document.body.appendChild(el); setTimeout(()=>el.classList.add('show'),20); setTimeout(()=>el.remove(),3200);
  }
  function requireUser(){ if(getUser()) return true; toast('Entre com um perfil local para favoritar jogos, seleções e usar o calendário.'); setTimeout(()=>{ location.href='login.html'; },650); return false; }
  function renderShell(){
    const user = getUser();
    $('#appHeader').innerHTML = `<header class="topbar"><div class="topbar-inner"><a class="brand" href="index.html" aria-label="CopaSync Início"><img src="assets/img/logo.png" alt="Logo CopaSync"><span>CopaSync</span></a><nav class="desktop-nav" aria-label="Menu principal">${nav.map(([href,label])=>`<a class="${isActive(href)?'active':''}" href="${href}">${label}</a>`).join('')}</nav><div class="top-actions"><button class="icon-btn theme-toggle" aria-label="Alternar tema">☾</button><a class="top-about" href="sobre.html">Sobre</a><a class="pill-btn small" href="login.html">${user?`Olá, ${user.nome.split(' ')[0]}`:'Entrar'}</a></div></div></header>`;
    $('#appMobileNav').innerHTML = `<nav class="mobile-nav" aria-label="Navegação inferior">${mobile.map(([href,label,ico])=>`<a class="${isActive(href)?'active':''}" href="${href}"><strong>${ico}</strong><span>${label}</span></a>`).join('')}</nav>`;
    $('.theme-toggle')?.addEventListener('click', toggleTheme); updateThemeButtons();
  }
  function toggleList(key, id){ const list = get(key,[]); const sid = String(id); const next = list.includes(sid) ? list.filter(x=>x!==sid) : [...list,sid]; set(key,next); return next.includes(sid); }
  const isIn = (key, id) => get(key,[]).includes(String(id));
  const formatDate = iso => iso ? new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'short',year:'numeric'}) : 'Data a definir';
  const gameLabel = j => `${j.selecaoA} x ${j.selecaoB}`;
  const teamWithFlag = name => {
    const code = flagCodes[name] || '';
    const src = flagImages[name] || '';
    const flagMarkup = src
      ? `<img class="flag-img" src="${src}" alt="Bandeira de ${name}" loading="lazy" decoding="async">`
      : `<span class="flag-code">${code || '---'}</span>`;
    return `<span class="team-with-flag"><span class="flag-badge">${flagMarkup}</span><span class="team-text">${name}</span></span>`;
  };
  function matchCard(j, opts={}){
    const fav = isIn(LS.favGames,j.id), cal = isIn(LS.calendar,j.id);
    const disabledCalendar = !j.data || j.horario === 'A definir';
    return `<article class="match-card" data-game-id="${j.id}" data-group="${j.grupo}" data-stage="${j.fase}" data-teams="${j.selecaoA} ${j.selecaoB}"><div class="match-top"><span class="tag">${j.fase}${j.grupo ? ' · '+j.grupo : ''}</span><span class="tag status">${j.status}</span></div><div class="teams-row"><div class="team-name">${teamWithFlag(j.selecaoA)}</div><div class="versus">x</div><div class="team-name">${teamWithFlag(j.selecaoB)}</div></div><div class="meta"><span>${formatDate(j.data)}</span><span>${j.horario || 'A definir'}</span><span>${j.estadio || 'A definir'}</span><span>${j.cidade || 'A definir'}</span></div><div class="card-actions"><button class="pill-btn fav ${fav?'active':''}" data-fav-game="${j.id}">${fav?'Remover favorito':'Favoritar jogo'}</button><button class="primary-btn calendar ${cal?'active':''}" data-calendar-game="${j.id}" ${disabledCalendar?'data-tbd="1"':''}>${cal?'No calendário':'Adicionar ao calendário'}</button>${opts.teamLink?`<a class="ghost-btn" href="jogos.html?selecao=${encodeURIComponent(opts.teamLink)}">Ver jogos</a>`:''}</div></article>`;
  }
  function bindGameButtons(games){
    $$('[data-fav-game]').forEach(btn=>btn.addEventListener('click',()=>{ if(!requireUser()) return; const active = toggleList(LS.favGames,btn.dataset.favGame); btn.classList.toggle('active',active); btn.textContent = active?'Remover favorito':'Favoritar jogo'; }));
    $$('[data-calendar-game]').forEach(btn=>btn.addEventListener('click',()=>{ if(!requireUser()) return; if(btn.dataset.tbd){ toast('Este jogo ainda não tem data e horário confirmados para exportação.'); return; } const active = toggleList(LS.calendar,btn.dataset.calendarGame); btn.classList.toggle('active',active); btn.textContent = active?'No calendário':'Adicionar ao calendário'; }));
  }
  function empty(title,text,href,label){ return `<div class="empty-state"><b>${title}</b><p>${text}</p>${href?`<a class="primary-btn" href="${href}">${label}</a>`:''}</div>`; }
  function makeICS(game){
    if(!requireUser()) return;
    if(!game?.data || game?.horario === 'A definir'){ toast('Este jogo ainda não possui data e horário confirmados para gerar .ics.'); return; }
    const start = new Date(`${game.data}T${game.horario}:00-03:00`);
    const end = new Date(start.getTime()+2*60*60*1000);
    const fmt = d => d.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z';
    const ics = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//CopaSync//PT-BR','BEGIN:VEVENT',`UID:${game.id}@copasync.local`,`DTSTAMP:${fmt(new Date())}`,`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${gameLabel(game)}`,`LOCATION:${game.estadio} - ${game.cidade}`,`DESCRIPTION:Jogo salvo pelo CopaSync. Fase: ${game.fase}.`, 'END:VEVENT','END:VCALENDAR'].join('\r\n');
    const blob = new Blob([ics],{type:'text/calendar;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`copasync-${game.id}.ics`; a.click(); URL.revokeObjectURL(a.href);
  }
  document.addEventListener('DOMContentLoaded',()=>{ applyTheme(); renderShell(); });
  return {LS,$,$$,get,set,remove,uid,fetchData,getUser,setUser,logout,toggleList,isIn,formatDate,gameLabel,matchCard,bindGameButtons,empty,makeICS,requireUser,toast,flagImages,flagCodes,teamWithFlag};
})();
