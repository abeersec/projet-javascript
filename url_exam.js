
  document.getElementById('examUrlForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const url = document.getElementById('examUrl').value;
    const examId = url.split('exam=')[1] || url;
    window.location.href = `K.html?exam=${examId}`;
  });