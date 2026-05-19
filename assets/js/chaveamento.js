document.addEventListener('DOMContentLoaded', async () => {
  const bracket = await CopaSync.fetchData('chaveamento.json');
  document.querySelector('#bracket').innerHTML = bracket.map(phase=>`<section class="bracket-phase ${phase.lado || ''}"><h3>${phase.fase}</h3>${phase.confrontos.map(c=>`<article class="bracket-card"><div class="bracket-match-head"><span>${c.id}</span><span>${c.status}</span></div><div class="bracket-team">${c.timeA}</div><div class="bracket-team">${c.timeB}</div></article>`).join('')}</section>`).join('');
});
