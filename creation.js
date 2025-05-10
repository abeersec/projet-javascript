document.getElementById('examForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const title = document.getElementById('examTitle').value;
    const description = document.getElementById('examDescription').value;
    const targetAudience = document.getElementById('targetAudience').value;

    try {
        const response = await fetch('http://localhost:5500/api/exams/creer', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ title, description, targetAudience })
        });
        const data = await response.json();
        if (data && data._id) {
            window.location.href = `teacher.html?examId=${data._id}`;
        } else {
            alert('Erreur lors de la création de l\'examen : ' + (data.error || JSON.stringify(data)));
        }
    } catch (error) {
        alert('Erreur réseau ou serveur.');
        console.error(error);
    }
});


