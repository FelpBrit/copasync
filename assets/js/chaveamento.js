document.addEventListener('DOMContentLoaded', async () => {
  const bracket = await CopaSync.fetchData('chaveamento.json');
  const byPhase = Object.fromEntries(bracket.map(phase => [phase.fase, phase.confrontos]));

  const card = (match, phaseName) => `
    <article class="fifa-node">
      <div class="node-date"><span>${CopaSync.formatDate(match.data).replace('.', '')}</span><b>${match.horario}</b></div>
      <div class="node-team"><span>${match.timeA}</span></div>
      <div class="node-team"><span>${match.timeB}</span></div>
      <a class="node-id" href="jogos.html?fase=${encodeURIComponent(phaseName)}">J${match.numero}</a>
    </article>`;

  const phaseColumn = (title, matches, extra='') => `
    <section class="fifa-col ${extra}">
      <h3>${title}</h3>
      <div class="fifa-col-list">${matches.map(m => card(m, title)).join('')}</div>
    </section>`;

  const r32 = byPhase['Segundas de final'] || [];
  const r16 = byPhase['Oitavas de final'] || [];
  const qf = byPhase['Quartas de final'] || [];
  const sf = byPhase['Semifinal'] || [];
  const third = byPhase['Decisão do 3º lugar'] || [];
  const final = byPhase['Final'] || [];

  document.querySelector('#bracket').innerHTML = `
    <div class="fifa-bracket-shell">
      <div class="fifa-bracket-title">
        <div><b>Copa do Mundo da FIFA 2026™</b><span>Chaveamento preparado conforme a estrutura oficial do torneio.</span></div>
        <a href="jogos.html?fase=Segundas%20de%20final">Ver jogos eliminatórios</a>
      </div>
      <div class="fifa-bracket-board" aria-label="Chaveamento da Copa 2026">
        ${phaseColumn('Segundas de final', r32.slice(0,8), 'left-round')}
        ${phaseColumn('Oitavas de final', r16.slice(0,4), 'left-round compact')}
        ${phaseColumn('Quartas de final', qf.slice(0,2), 'left-round slim')}
        ${phaseColumn('Semifinal', sf.slice(0,1), 'left-round single')}
        <section class="fifa-center">
          <h3>Final</h3>
          ${final.map(m => card(m, 'Final')).join('')}
          <h3>Decisão do 3º lugar</h3>
          ${third.map(m => card(m, 'Decisão do 3º lugar')).join('')}
        </section>
        ${phaseColumn('Semifinal', sf.slice(1,2), 'right-round single')}
        ${phaseColumn('Quartas de final', qf.slice(2), 'right-round slim')}
        ${phaseColumn('Oitavas de final', r16.slice(4), 'right-round compact')}
        ${phaseColumn('Segundas de final', r32.slice(8), 'right-round')}
      </div>
    </div>`;
});
