document.addEventListener('DOMContentLoaded', async () => {
  const games = await CopaSync.fetchData('jogos.json');
  const render = () => {
    const calGames = games.filter(g=>CopaSync.isIn(CopaSync.LS.calendar,g.id));
    document.querySelector('#calendarList').innerHTML = calGames.length ? calGames.map(g=>`<article class="match-card"><div class="match-top"><span class="tag">${g.fase}${g.grupo?' · '+g.grupo:''}</span><span class="tag status">${g.status}</span></div><div class="teams-row"><div class="team-name">${CopaSync.teamWithFlag(g.selecaoA)}</div><div class="versus">x</div><div class="team-name">${CopaSync.teamWithFlag(g.selecaoB)}</div></div><div class="meta"><span>${CopaSync.formatDate(g.data)}</span><span>${g.horario}</span><span>${g.estadio}</span><span>${g.cidade}</span></div><div class="card-actions"><button class="danger-btn" data-remove-cal="${g.id}">Remover</button><button class="primary-btn" data-ics="${g.id}">Exportar .ics</button></div></article>`).join('') : CopaSync.empty('Nenhum jogo no calendário','Adicione partidas pela página de jogos para montar sua agenda local.','jogos.html','Ver jogos');
    document.querySelectorAll('[data-remove-cal]').forEach(btn=>btn.addEventListener('click',()=>{ if(!CopaSync.requireUser()) return; CopaSync.toggleList(CopaSync.LS.calendar,btn.dataset.removeCal); render(); }));
    document.querySelectorAll('[data-ics]').forEach(btn=>btn.addEventListener('click',()=>{ const game = games.find(g=>g.id===btn.dataset.ics); CopaSync.makeICS(game); }));
  };
  document.querySelector('#exportAll')?.addEventListener('click',()=>{
    if(!CopaSync.requireUser()) return;
    const calGames = games.filter(g=>CopaSync.isIn(CopaSync.LS.calendar,g.id));
    if(!calGames.length) return CopaSync.toast('Adicione pelo menos um jogo ao calendário.');
    calGames.forEach(g=>CopaSync.makeICS(g));
  });
  render();
});
