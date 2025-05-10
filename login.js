window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  if (!form) {
    console.error('Formulaire de connexion non trouvé !');
    return;
  }
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const params = new URLSearchParams(window.location.search);

    let msg = document.getElementById('message');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'message';
      document.querySelector('.wrapper').appendChild(msg);
    }

    try {
      const response = await fetch('http://localhost:5500/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const data = await response.json();
      console.log('Réponse backend:', data);
      msg.textContent = data.message || (data.success ? 'Connexion réussie, redirection...' : 'Erreur de connexion');

      if (data.success && data.token && data.role) {
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          if (data.role === 'teacher') {
            window.location.href = '../teacher/creation.html';
          } else if (data.role === 'student') {
            window.location.href = '../PASS/url_exam.html';
          }
        }, 1200);
      } else {
        msg.textContent = "Erreur d'authentification ou rôle inconnu.";
      }
    } catch (error) {
      msg.textContent = 'Erreur réseau ou serveur.';
      console.error(error);
    }
  });
}); 