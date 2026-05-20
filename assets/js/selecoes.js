document.addEventListener('DOMContentLoaded', async () => {
  const teams = await CopaSync.fetchData('selecoes.json');
  const groups = [...new Set(teams.map(t=>t.grupo))];
  const state = { grupo:'todos', busca:'' };
  document.querySelector('#teamGroupChips').innerHTML = `<select class="select" id="teamGroupFilter"><option value="todos">Todos os grupos</option>${groups.map(g=>`<option value="${g}">${g}</option>`).join('')}</select>`;
  const render = () => {
    const list = teams.filter(t => (state.grupo==='todos'||t.grupo===state.grupo) && t.nome.toLowerCase().includes(state.busca.toLowerCase()));
    document.querySelector('#teamsList').innerHTML = list.length ? list.map(t=>`<article class="team-card ${CopaSync.isIn(CopaSync.LS.favTeams,t.id)?'favorite':''}"><div class="team-header"><div><div class="team-display">${CopaSync.teamWithFlag(t.nome)}</div><p class="muted">${t.grupo} · ${t.continente}</p></div><button class="pill-btn fav ${CopaSync.isIn(CopaSync.LS.favTeams,t.id)?'active':''}" data-fav-team="${t.id}">${CopaSync.isIn(CopaSync.LS.favTeams,t.id)?'Favorita':'Favoritar'}</button></div><a class="ghost-btn" href="jogos.html?selecao=${encodeURIComponent(t.nome)}">Ver jogos da seleção</a></article>`).join('') : CopaSync.empty('Nenhuma seleção encontrada','Tente buscar por outro nome ou grupo.');
    document.querySelectorAll('[data-fav-team]').forEach(btn=>btn.addEventListener('click',()=>{ if(!CopaSync.requireUser()) return; CopaSync.toggleList(CopaSync.LS.favTeams,btn.dataset.favTeam); render(); }));
  };
  document.querySelector('#teamGroupFilter').addEventListener('change', e=>{ state.grupo=e.target.value; render(); });
  document.querySelector('#searchTeam').addEventListener('input', e=>{ state.busca=e.target.value; render(); });
  render();
});
