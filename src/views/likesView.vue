<template>
  <div class="likes-view">
    <h1>Mis Películas Favoritas</h1>
    
    <div v-if="likedMovies.length === 0" class="empty-likes">
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="#ccc" viewBox="0 0 16 16">
        <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
      </svg>
      <p>Aún no has agregado películas a favoritos</p>
    </div>
    
    <div v-else class="movie-grid">
      <div v-for="movie in likedMovies" :key="movie.id" class="movie-card">
        <div class="poster-container">
          <img 
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" 
            :alt="movie.title"
            class="poster"
          >
          <div v-else class="no-poster">Imagen no disponible</div>
          
          <button 
            @click.stop="toggleLike(movie)"
            class="like-button"
            :class="{ 'liked': isLiked(movie.id) }"
            aria-label="Quitar de favoritos"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
            </svg>
          </button>
        </div>

        <div class="movie-info">
          <h2>{{ movie.title }}</h2>
          
          <div class="genres">
            <span 
              v-for="genreId in movie.genre_ids?.slice(0, 3)" 
              :key="genreId"
              :class="`genre-${genres[genreId]?.toLowerCase().replace(' ', '-')}`"
            >
              {{ genres[genreId] }}
            </span>
          </div>

          <div class="meta">
            <span class="rating">⭐ {{ movie.vote_average?.toFixed(1) }}</span>
            <span class="date">{{ formatDate(movie.release_date) }}</span>
          </div>

          <p class="overview">{{ movie.overview || "Descripción no disponible" }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const likedMovies = ref([]);
const genres = ref({});

// Cargar películas guardadas y géneros
onMounted(() => {
  likedMovies.value = JSON.parse(localStorage.getItem('likedMovies')) || [];
  genres.value = JSON.parse(localStorage.getItem('movieGenres')) || {};
});

// Formatear fecha
const formatDate = (dateString) => {
  return dateString ? new Date(dateString).toLocaleDateString('es-MX') : 'Fecha no disponible';
};

// Verificar si una película está likeada
const isLiked = (movieId) => {
  return likedMovies.value.some(movie => movie.id === movieId);
};

// Alternar like
const toggleLike = (movie) => {
  const index = likedMovies.value.findIndex(m => m.id === movie.id);
  
  if (index === -1) {
    likedMovies.value.push(movie);
  } else {
    likedMovies.value.splice(index, 1);
  }
  
  localStorage.setItem('likedMovies', JSON.stringify(likedMovies.value));
};

// Contador de likes
const likesCount = computed(() => likedMovies.value.length);
</script>

<style scoped>
.likes-view {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.empty-likes {
  text-align: center;
  padding: 50px;
  color: #666;
}

.empty-likes svg {
  margin-bottom: 20px;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 20px;
}

.movie-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.poster-container {
  position: relative;
  height: 450px;
}

.poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-poster {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
}

.movie-info {
  padding: 15px;
}

h2 {
  font-size: 1.4rem;
  margin-bottom: 10px;
  color: #333;
}

.genres {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.genres span {
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  color: #555;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #666;
}

.rating {
  color: #f39c12;
  font-weight: bold;
}

.date {
  font-size: 0.9rem;
}

.overview {
  color: #333;
  line-height: 1.5;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Estilos para el botón de like */
.like-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.7);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 2;
  padding: 0;
}

.like-button svg {
  fill: white;
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.like-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.like-button.liked svg {
  fill: #e74c3c; /* Rojo para indicar que se puede quitar el like */
  filter: drop-shadow(0 0 2px rgba(231, 76, 60, 0.7));
}

.like-button.liked {
  animation: pulse 0.5s;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

/* Estilos para los géneros */
.genre-acción { background-color: #e74c3c; color: white; }
.genre-aventura { background-color: #3498db; color: white; }
.genre-comedia { background-color: #f1c40f; color: #333; }
.genre-drama { background-color: #9b59b6; color: white; }
/* Agrega más estilos de géneros según necesites */
</style>