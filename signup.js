window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('signupForm');
  if (!form) {
    console.error('Formulaire d\'inscription non trouvé !');
    return;
  }
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const nom = document.getElementById('nom-input').value;
    const prenom = document.getElementById('Prenom-input').value;
    const email = document.getElementById('email-input').value;
    const dateNaissance = document.getElementById('date').value;
    const sexe = document.getElementById('sexe').value;
    const role = document.getElementById('Profession-input').value === 'professeur' ? 'teacher' : 'student';
    const etablissement = document.getElementById('etablissement').value;
    const filiere = document.getElementById('filiere').value;
    const password = document.getElementById('password-input').value;
    const repeatPassword = document.getElementById('repeat-password-input').value;

    let msg = document.getElementById('message');
    if (!msg) {
      msg = document.createElement('div');
      msg.id = 'message';
      document.querySelector('.container').appendChild(msg);
    }

    if (password !== repeatPassword) {
      msg.textContent = 'Les mots de passe ne correspondent pas.';
      return;
    }

    try {
      const response = await fetch('http://localhost:5500/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, nom, prenom, dateNaissance, sexe, etablissement, filiere, role })
      });

      const data = await response.json();
      msg.textContent = data.message || (data.success ? 'Inscription réussie' : 'Erreur lors de l\'inscription');
      if (data.success) {
        setTimeout(() => {
          window.location.href = 'connection.html';
        }, 1500); 
      }
    } catch (error) {
      msg.textContent = 'Erreur réseau ou serveur.';
      console.error(error);
    }
  });
}); 