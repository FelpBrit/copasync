document.addEventListener('DOMContentLoaded', async () => {
  const rows = await CopaSync.fetchData('classificacao.json');
  const groups = [...new Set(rows.map(r=>r.grupo))];
  document.querySelector('#groupsTables').innerHTML = groups.map(g=>{ const data = rows.filter(r=>r.grupo===g); return `<section class="table-card"><div class="section-head"><div><h2>${g}</h2><p>Classificação inicial zerada. Dados serão atualizados conforme o torneio.</p></div></div><div class="table-wrap"><table class="ranking"><thead><tr><th>Pos.</th><th>Seleção</th><th>J</th><th>V</th><th>E</th><th>D</th><th>GP</th><th>GC</th><th>SG</th><th>Pts</th></tr></thead><tbody>${data.map((r,i)=>`<tr><td>${i+1}</td><td><b>${r.selecao}</b></td><td>${r.jogos}</td><td>${r.vitorias}</td><td>${r.empates}</td><td>${r.derrotas}</td><td>${r.golsPro}</td><td>${r.golsContra}</td><td>${r.saldo}</td><td><b>${r.pontos}</b></td></tr>`).join('')}</tbody></table></div></section>`; }).join('');
});
