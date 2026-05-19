document.addEventListener('DOMContentLoaded', async () => {
  const [games, teamsData] = await Promise.all([CopaSync.fetchData('jogos.json'), CopaSync.fetchData('selecoes.json')]);
  const teams = [...new Set(games.flatMap(g=>[g.selecaoA,g.selecaoB]).filter(t=>t && !t.startsWith('A definir') && !t.includes('Grupo') && !t.includes('Vencedor') && !t.includes('Perdedor') && !t.includes('Classificado')))].sort();
  const groups = [...new Set(games.map(g=>g.grupo).filter(Boolean))];
  const stages = [...new Set(games.map(g=>g.fase))];
  const params = new URLSearchParams(location.search);
  const state = { grupo:'todos', fase:'Fase de grupos', selecao: params.get('selecao') || '', data:'', favoritos:false };
  const teamById = Object.fromEntries(teamsData.map(t=>[String(t.id), t.nome]));
  document.querySelector('#teamFilter').innerHTML = `<option value="">Todas as seleções</option>${teams.map(t=>`<option ${state.selecao===t?'selected':''}>${t}</option>`).join('')}`;
  const groupSelect = document.querySelector('#groupChips');
  groupSelect.innerHTML = `<select class="select" id="groupFilter"><option value="todos">Todos os grupos</option>${groups.map(g=>`<option value="${g}">${g}</option>`).join('')}</select>`;
  document.querySelector('#stageFilter').innerHTML = `<option value="todos">Todas as fases</option>${stages.map(s=>`<option ${state.fase===s?'selected':''}>${s}</option>`).join('')}`;
  const render = () => {
    const favGameIds = CopaSync.get(CopaSync.LS.favGames,[]).map(String);
    const favTeams = CopaSync.get(CopaSync.LS.favTeams,[]).map(id=>teamById[String(id)]).filter(Boolean);
    let filtered = games.filter(g =>
      (state.grupo==='todos'||g.grupo===state.grupo) &&
      (state.fase==='todos'||g.fase===state.fase) &&
      (!state.selecao || g.selecaoA===state.selecao || g.selecaoB===state.selecao) &&
      (!state.data || g.data===state.data) &&
      (!state.favoritos || favGameIds.includes(String(g.id)) || favTeams.includes(g.selecaoA) || favTeams.includes(g.selecaoB))
    );
    document.querySelector('#gamesCount').textContent = `${filtered.length} jogo(s) encontrado(s)`;
    document.querySelector('#gamesList').innerHTML = filtered.length ? filtered.map(g=>CopaSync.matchCard(g)).join('') : CopaSync.empty('Nenhum jogo encontrado','Ajuste os filtros para encontrar partidas da Copa 2026.');
    CopaSync.bindGameButtons(filtered);
  };
  document.querySelector('#groupFilter').addEventListener('change', e=>{ state.grupo=e.target.value; render(); });
  document.querySelector('#teamFilter').addEventListener('change', e=>{ state.selecao=e.target.value; render(); });
  document.querySelector('#stageFilter').addEventListener('change', e=>{ state.fase=e.target.value; render(); });
  document.querySelector('#dateFilter').addEventListener('change', e=>{ state.data=e.target.value; render(); });
  document.querySelector('#favOnly').addEventListener('click', e=>{ if(!CopaSync.requireUser()) return; state.favoritos=!state.favoritos; e.target.classList.toggle('active',state.favoritos); render(); });
  render();
});
