document.addEventListener('DOMContentLoaded', async () => {
  const games = await CopaSync.fetchData('jogos.json');
  const selections = await CopaSync.fetchData('selecoes.json');
  const flagByTeam = Object.fromEntries(selections.map(s => [s.nome, s.bandeira || '']));
  const idByTeam = Object.fromEntries(selections.map(s => [s.nome, s.id]));

  const teams = [...new Set(games
    .filter(g => g.fase === 'Primeira fase')
    .flatMap(g => [g.selecaoA, g.selecaoB])
    .filter(t => t && !t.includes('Grupo') && !t.includes('Vencedor') && !t.includes('Perdedor'))
  )].sort((a,b)=>a.localeCompare(b,'pt-BR'));

  const groups = [...new Set(games.map(g => g.grupo).filter(Boolean))];
  const stages = [...new Set(games.map(g => g.fase))];
  const params = new URLSearchParams(location.search);
  const initialStage = params.get('fase') || 'Primeira fase';
  const state = {
    grupo: params.get('grupo') || 'todos',
    fase: stages.includes(initialStage) ? initialStage : 'Primeira fase',
    selecao: params.get('selecao') || '',
    data: '',
    favoritos: false
  };

  const teamFilter = document.querySelector('#teamFilter');
  const groupFilter = document.querySelector('#groupFilter');
  const stageFilter = document.querySelector('#stageFilter');

  teamFilter.innerHTML = `<option value="">Todas as seleções</option>${teams.map(t => `<option value="${t}" ${state.selecao===t?'selected':''}>${t}</option>`).join('')}`;
  groupFilter.innerHTML = `<option value="todos">Todos os grupos</option>${groups.map(g => `<option value="${g}" ${state.grupo===g?'selected':''}>${g}</option>`).join('')}`;
  stageFilter.innerHTML = stages.map(s => `<option value="${s}" ${state.fase===s?'selected':''}>${s}</option>`).join('');

  const dateLabel = iso => new Date(`${iso}T12:00:00`).toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
  });

  const renderFlag = team => flagByTeam[team] ? `<span class="fixture-flag" aria-hidden="true">${flagByTeam[team]}</span>` : `<span class="fixture-flag muted-flag" aria-hidden="true"></span>`;

  const renderFixture = game => {
    const fav = CopaSync.isIn(CopaSync.LS.favGames, game.id);
    const cal = CopaSync.isIn(CopaSync.LS.calendar, game.id);
    return `
      <article class="fixture-row" data-game-id="${game.id}">
        <div class="fixture-main">
          <div class="fixture-team fixture-team-a">
            <span>${game.selecaoA}</span>${renderFlag(game.selecaoA)}
          </div>
          <div class="fixture-time">
            <strong>${game.horario}</strong>
            <span>Jogo ${game.numero}</span>
          </div>
          <div class="fixture-team fixture-team-b">
            ${renderFlag(game.selecaoB)}<span>${game.selecaoB}</span>
          </div>
        </div>
        <div class="fixture-meta">
          <span>${game.fase}${game.grupo ? ' · ' + game.grupo : ''}</span>
          <span>${game.estadio} (${game.cidade})</span>
          <span>${game.status}</span>
        </div>
        <div class="fixture-actions">
          <button class="icon-action fav ${fav ? 'active' : ''}" data-fav-game="${game.id}">${fav ? 'Favorito' : 'Favoritar'}</button>
          <button class="icon-action calendar ${cal ? 'active' : ''}" data-calendar-game="${game.id}">${cal ? 'No calendário' : 'Adicionar ao calendário'}</button>
        </div>
      </article>`;
  };

  const render = () => {
    let filtered = games.filter(g =>
      (state.grupo === 'todos' || g.grupo === state.grupo) &&
      (state.fase === 'todos' || g.fase === state.fase) &&
      (!state.selecao || g.selecaoA === state.selecao || g.selecaoB === state.selecao) &&
      (!state.data || g.data === state.data) &&
      (!state.favoritos || CopaSync.isIn(CopaSync.LS.favGames, g.id) || CopaSync.isIn(CopaSync.LS.favTeams, idByTeam[g.selecaoA]) || CopaSync.isIn(CopaSync.LS.favTeams, idByTeam[g.selecaoB]))
    );

    filtered.sort((a,b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));
    document.querySelector('#gamesCount').textContent = `${filtered.length} jogo(s) encontrado(s)`;

    if (!filtered.length) {
      document.querySelector('#gamesList').innerHTML = CopaSync.empty('Nenhum jogo encontrado', 'Ajuste os filtros para encontrar partidas da Copa 2026.');
      return;
    }

    const grouped = filtered.reduce((acc, game) => {
      (acc[game.data] ||= []).push(game);
      return acc;
    }, {});

    document.querySelector('#gamesList').innerHTML = Object.entries(grouped).map(([date, items]) => `
      <section class="fixture-day">
        <header class="fixture-day-head">
          <h3>${dateLabel(date)}</h3>
          <a href="grupos.html">Ver grupos</a>
        </header>
        <div class="fixture-list">
          ${items.map(renderFixture).join('')}
        </div>
      </section>
    `).join('');

    CopaSync.bindGameButtons(filtered);
  };

  groupFilter.addEventListener('change', e => { state.grupo = e.target.value; render(); });
  teamFilter.addEventListener('change', e => { state.selecao = e.target.value; render(); });
  stageFilter.addEventListener('change', e => { state.fase = e.target.value; render(); });
  document.querySelector('#dateFilter').addEventListener('change', e => { state.data = e.target.value; render(); });
  document.querySelector('#favOnly').addEventListener('click', e => {
    if(!CopaSync.getUser()){ CopaSync.showToast('Entre com um perfil local para filtrar seus favoritos.'); return; }
    state.favoritos = !state.favoritos;
    e.currentTarget.classList.toggle('active', state.favoritos);
    e.currentTarget.textContent = state.favoritos ? 'Mostrar todos' : 'Somente favoritos';
    render();
  });

  render();
});
