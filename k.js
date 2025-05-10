document.getElementById('geoBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        localStorage.setItem('latitude', position.coords.latitude);
        localStorage.setItem('longitude', position.coords.longitude);
        document.getElementById('geoMsg').textContent = 'Géolocalisation activée. Vous pouvez passer l\'examen.';
      }, function(error) {
        document.getElementById('geoMsg').textContent = 'Erreur de géolocalisation : ' + error.message;
      });
    } else {
      document.getElementById('geoMsg').textContent = 'La géolocalisation n\'est pas supportée par ce navigateur.';
    }
  });