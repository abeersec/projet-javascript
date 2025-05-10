let questions = [];

function toggleFields() {
    const type = document.getElementById('type').value;
    document.getElementById('directeFields').style.display = type === 'directe' ? 'block' : 'none';
    document.getElementById('qcmFields').style.display = type === 'qcm' ? 'block' : 'none';
}

function addQCMOption() {
    const optionsContainer = document.getElementById('qcmOptions');
    const existingOptions = document.querySelectorAll('#qcmOptions input[type="text"]');
    const newIndex = existingOptions.length;

    const optionInput = document.createElement('input');
    optionInput.type = 'text';
    optionInput.name = 'option[]';
    optionInput.placeholder = `Option ${newIndex + 1}`;
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'correct[]';
    checkbox.value = newIndex;
    
    const lineBreak = document.createElement('br');
    
    optionsContainer.appendChild(optionInput);
    optionsContainer.appendChild(checkbox);
    optionsContainer.appendChild(document.createTextNode(' Correcte'));
    optionsContainer.appendChild(lineBreak);
}

document.getElementById('questionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const type = document.getElementById('type').value;
    const statement = document.getElementById('statement').value;
    const media = document.getElementById('media').files[0];
    const note = document.getElementById('note').value;
    const duration = document.getElementById('duration').value;
    
    let questionData = {
        type,
        statement,
        media: media ? media.name : null,
        note,
        duration,
        timestamp: new Date().toISOString()
    };

    if (type === 'directe') {
        questionData.answer = document.getElementById('answer').value;
        questionData.tolerance = document.getElementById('tolerance').value;
    } else {
        const options = Array.from(document.querySelectorAll('#qcmOptions input[type="text"]')).map(input => input.value);
        const correctAnswers = Array.from(document.querySelectorAll('#qcmOptions input[type="checkbox"]:checked')).map(checkbox => parseInt(checkbox.value));
        
        questionData.options = options;
        questionData.correctAnswers = correctAnswers;
    }

    questions.push(questionData);
    updateQuestionList();
    this.reset();
    toggleFields();

    try {
        const response = await fetch('http://localhost:5500/api/exams/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ questions })  
        });

        const data = await response.json();
        if (data.lienUnique) {
            document.getElementById('examLink').textContent =
                `Lien à transmettre : http://localhost:5500/PASS/url_exam.html?exam=${data.lienUnique}`;
        }
    } catch (error) {
        console.error("Erreur lors de la création de l'examen :", error);
    }
});

function updateQuestionList() {
    const list = document.getElementById('questions');
    list.innerHTML = '';

    questions.forEach((question, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${question.statement}<br>
            <em>Type:</em> ${question.type.toUpperCase()}<br>
            ${question.media ? `<em>Média:</em> ${question.media}<br>` : ''}
            ${question.type === 'directe' ? `
                <em>Réponse:</em> ${question.answer}<br>
                <em>Tolérance:</em> ${question.tolerance}%
            ` : `
                <em>Options:</em> ${question.options.map((opt, i) => 
                    `${opt}${question.correctAnswers.includes(i) ? ' (Correcte)' : ''}`
                ).join(', ')}
            `}
            <div style="margin-top: 8px; color: #667781; font-size: 0.9em">
                Note: ${question.note} pts | Durée: ${question.duration}s
            </div>
        `;
        list.appendChild(li);
    });
}

toggleFields();

document.getElementById('finalizeExamBtn').addEventListener('click', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const examId = urlParams.get('examId');
    if (!examId) {
        alert("ID d'examen manquant !");
        window.location.href = "creation.html";
        return;
    }
    if (questions.length === 0) {
        alert("Ajoutez au moins une question avant de finaliser l'examen.");
        return;
    }
    console.log(questions); 
    try {
        const response = await fetch(`http://localhost:5500/api/exams/${examId}/questions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ questions })
        });
        const data = await response.json();
        if (data && data.uniqueLink) {
            const examLink = data.uniqueLink.startsWith('http') ? data.uniqueLink : `http://localhost:5500/exam/${data.uniqueLink}`;
            document.getElementById('examLink').innerHTML = `
                <div class="link-container">
                    <input type="text" value="${examLink}" readonly>
                    <button onclick="copyLink('${examLink}')">Copier</button>
                </div>
            `;
        }
    } catch (err) {
        console.error('Erreur:', err);
        alert('Erreur lors de la finalisation');
    }
  });