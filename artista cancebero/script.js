// Elementos del DOM
const discographySection = document.getElementById('discography');
const loadDiscographyButton = document.getElementById('loadDiscography');

// Función para cargar la discografía
function loadDiscography() {
  // Mostrar mensaje de carga
  discographySection.innerHTML = "<p>Cargando discografía...</p>";

  // Usar fetch para obtener el JSON de discografía
  fetch('discography.json')
    .then(response => {
      if (!response.ok) {
        throw new Error("Error al cargar la discografía");
      }
      return response.json();
    })
    .then(data => {
      displayDiscography(data);  // Mostrar los datos de la discografía
    })
    .catch(error => {
      discographySection.innerHTML = `<p style="color: red;">${error.message}</p>`;
    });
}

// Función para mostrar la discografía en el HTML
function displayDiscography(data) {
  // Limpiar el contenido previo
  discographySection.innerHTML = "";

  // Recorrer y mostrar cada álbum
  data.albums.forEach(album => {
    const albumCard = document.createElement("div");
    albumCard.classList.add("album-card");

    // Crear un enlace con el id del álbum
    const albumLink = document.createElement("a");
    albumLink.href = `${album.id}.html`; // Redirigir a la página del álbum correspondiente

    // Crear la estructura HTML de cada card con la imagen
    albumLink.innerHTML = `
      <img src="${album.image}" alt="Imagen del álbum ${album.title}" class="album-image">
      <h3 class="album-title">${album.title}</h3>
    `;

    // Añadir el enlace (que contiene la imagen y título) a la tarjeta
    albumCard.appendChild(albumLink);
    discographySection.appendChild(albumCard);
  });
}

// Función para cargar las canciones en la página del álbum
function loadAlbumDetails() {
  // Usar la parte de la URL para determinar qué álbum mostrar
  const albumId = window.location.pathname.split('/').pop().replace('.html', '');

  fetch('discography.json')
    .then(response => response.json())
    .then(data => {
      // Buscar el álbum correspondiente en los datos
      const album = data.albums.find(a => a.id === albumId);
      if (album) {
        displayAlbumDetails(album); // Mostrar las canciones del álbum
      } else {
        console.error('Álbum no encontrado');
        document.getElementById('song-List').innerHTML = '<p>Álbum no encontrado.</p>';
      }
    })
    .catch(error => {
      console.error('Error al cargar los detalles del álbum', error);
      document.getElementById('song-List').innerHTML = '<p>Error al cargar las canciones.</p>';
    });
}

// Función para mostrar las canciones del álbum como botones
function displayAlbumDetails(album) {
  const songList = document.getElementById('song-List');  // Asegúrate de usar el ID correcto
  songList.innerHTML = ''; // Limpiar la lista de canciones

  // Añadir cada canción del álbum a la lista como un botón
  album.songs.forEach(song => {
    const songButton = document.createElement('button');
    songButton.textContent = song;  // Nombre de la canción
    songButton.classList.add('song-button'); // Puedes añadir una clase para estilizar los botones

    // Añadir evento de clic para obtener la letra de la canción
    songButton.addEventListener('click', function() {
      fetchLyrics(song, album.artist); // Llamar a la función para obtener la letra
    });

    songList.appendChild(songButton); // Añadir el botón al contenedor de canciones
  });
}

// Función para obtener la letra de la canción
function fetchLyrics(songName, artistName) {
  // Limpiar la letra anterior
  document.getElementById('lyrics').innerHTML = 'Cargando letra...';

  // Hacer la consulta a la API (Lyrics.ovh)
  fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('No se encontró la letra de la canción.');
      }
      return response.json();
    })
    .then(data => {
      const lyrics = data.lyrics;
      if (lyrics) {
        // Mostrar la letra de la canción
        document.getElementById('lyrics').innerHTML = lyrics.replace(/(\r\n|\r|\n)/g, '<br>');
      } else {
        document.getElementById('lyrics').innerHTML = 'No se encontró la letra de la canción.';
      }
    })
    .catch(error => {
      console.error('Error al cargar la letra:', error);
      document.getElementById('lyrics').innerHTML = 'Hubo un error al cargar la letra.';
    });
}

// Ejecutar la carga del álbum cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', loadAlbumDetails);

// Event Listener para el botón de carga de discografía
loadDiscographyButton.addEventListener("click", loadDiscography);

// Seleccionar el toggle switch y el body para el modo oscuro
const modeToggle = document.getElementById("mode-toggle");
const body = document.body;

// Comprobar si el modo oscuro está habilitado desde el localStorage
if (localStorage.getItem("dark-mode") === "enabled") {
  body.classList.add("dark-mode");
  modeToggle.checked = true;
}

// Función para cambiar entre modo claro y oscuro
modeToggle.addEventListener("change", () => {
  if (modeToggle.checked) {
    body.classList.add("dark-mode");
    localStorage.setItem("dark-mode", "enabled"); // Guardar la preferencia
  } else {
    body.classList.remove("dark-mode");
    localStorage.setItem("dark-mode", "disabled"); // Guardar la preferencia
  }
});



