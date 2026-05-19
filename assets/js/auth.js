document.addEventListener('DOMContentLoaded', () => {
  const user = CopaSync.getUser();
  const form = document.querySelector('#loginForm');
  const logged = document.querySelector('#loggedBox');
  function render(){ const u=CopaSync.getUser(); if(u){ form.style.display='none'; logged.style.display='grid'; document.querySelector('#loggedName').textContent=`Você está usando o perfil local de ${u.nome}.`; } else { form.style.display='grid'; logged.style.display='none'; } }
  form.addEventListener('submit', e=>{ e.preventDefault(); const nome=document.querySelector('#nome').value.trim(); const email=document.querySelector('#email').value.trim(); if(!nome) return; CopaSync.setUser({nome,email,createdAt:new Date().toISOString()}); location.href='meu-sync.html'; });
  document.querySelector('#logoutBtn').addEventListener('click',()=>{ CopaSync.remove(CopaSync.LS.user); location.href='login.html'; });
  render();
});
