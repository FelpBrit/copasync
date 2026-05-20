document.addEventListener('DOMContentLoaded', async () => {
  const [games, teams] = await Promise.all([CopaSync.fetchData('jogos.json'), CopaSync.fetchData('selecoes.json')]);
  const user = CopaSync.getUser();
  document.querySelector('#syncGreeting').textContent = user ? `Olá, ${user.nome}. Este é o seu painel da Copa.` : 'Monte seu painel favorito da Copa.';
  const favTeams = teams.filter(t=>CopaSync.isIn(CopaSync.LS.favTeams,t.id));
  const favGames = games.filter(g=>CopaSync.isIn(CopaSync.LS.favGames,g.id));
  const calGames = games.filter(g=>CopaSync.isIn(CopaSync.LS.calendar,g.id));
  const favNames = favTeams.map(t=>t.nome);
  const nextFavGames = games.filter(g=>favNames.includes(g.selecaoA)||favNames.includes(g.selecaoB)).slice(0,6);
  document.querySelector('#favTeamsBox').innerHTML = favTeams.length ? favTeams.map(t=>`<article class="team-card favorite"><div class="team-display">${CopaSync.teamWithFlag(t.nome)}</div><span class="muted">${t.grupo}</span></article>`).join('') : CopaSync.empty('Nenhuma seleção favorita','Favorite seleções para criar o seu torneio personalizado.','selecoes.html','Escolher seleções');
  document.querySelector('#favGamesBox').innerHTML = favGames.length ? favGames.map(g=>CopaSync.matchCard(g)).join('') : CopaSync.empty('Nenhum jogo favorito','Marque partidas importantes para acompanhar mais rápido.','jogos.html','Ver jogos');
  document.querySelector('#nextFavGamesBox').innerHTML = nextFavGames.length ? nextFavGames.map(g=>CopaSync.matchCard(g)).join('') : CopaSync.empty('Sem próximos jogos personalizados','Favorite uma seleção para listar automaticamente os jogos relacionados.');
  document.querySelector('#calendarPreviewBox').innerHTML = calGames.length ? calGames.slice(0,4).map(g=>CopaSync.matchCard(g)).join('') : CopaSync.empty('Calendário vazio','Adicione jogos ao calendário local para organizar sua rotina.','jogos.html','Adicionar jogos');
  CopaSync.bindGameButtons(games);
});
