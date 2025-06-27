<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { useRouter } from 'vue-router';
import movieApi from '../services/movieApi';

const router = useRouter();

// Estados reactivos
const allMovies = ref([]);
const displayedMovies = ref([]);
const genres = ref({});
const searchQuery = ref('');
const likedMovies = ref(JSON.parse(localStorage.getItem('likedMovies')) || []);

// Obtener datos iniciales
onMounted(async () => {
  try {
    // Obtener géneros
    const genresResponse = await movieApi.get('/genre/movie/list');
    genres.value = genresResponse.data.genres.reduce((acc, genre) => {
      acc[genre.id] = genre.name;
      return acc;
    }, {});

    // Obtener películas populares
    const moviesResponse = await movieApi.getPopularMovies();
    allMovies.value = moviesResponse.data.results;
    displayedMovies.value = moviesResponse.data.results;
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
});

// Formatear fecha
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-MX');
};

// Watcher para búsqueda reactiva
watch(searchQuery, (newValue) => {
  if (!newValue.trim()) {
    displayedMovies.value = allMovies.value;
  } else {
    const query = newValue.toLowerCase().trim();
    displayedMovies.value = allMovies.value.filter(movie => 
      movie.title.toLowerCase().includes(query)
    );
  }
});

// Función para alternar like
const toggleLike = (movie) => {
  const index = likedMovies.value.findIndex(m => m.id === movie.id);
  
  if (index === -1) {
    likedMovies.value.push({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      genre_ids: movie.genre_ids,
      vote_average: movie.vote_average,
      release_date: movie.release_date,
      overview: movie.overview
    });
  } else {
    likedMovies.value.splice(index, 1);
  }
  
  localStorage.setItem('likedMovies', JSON.stringify(likedMovies.value));
};

// Verificar si una película está likeada
const isLiked = (movieId) => {
  return likedMovies.value.some(movie => movie.id === movieId);
};

// Contador de likes computado
const likesCount = computed(() => likedMovies.value.length);

// Redirigir a la vista de likes
const goToLikes = () => {
  router.push('/likes');
};

// Función para manejar búsqueda
const handleSearch = () => {
  // La búsqueda ya se maneja reactivamente con el watcher
};
</script>

<template>
<div>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <router-link to="/" class="navbar-brand">
        <i class="bi bi-film"></i> PelículasAPI
      </router-link>
      
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link 
              to="/likes" 
              class="nav-link d-flex align-items-center"
              active-class="active"
            >
              <i class="bi bi-heart-fill me-2"></i>
              <span>Mis Likes</span>
              <span v-if="likesCount > 0" class="badge bg-danger ms-2">{{ likesCount }}</span>
            </router-link>
          </li>
        </ul>
        
        <form class="d-flex" role="search" @submit.prevent="handleSearch">
          <input 
            v-model="searchQuery"
            class="form-control me-2" 
            type="search" 
            placeholder="Buscar película..." 
            aria-label="Buscar"
          />
          <button class="btn btn-outline-light" type="submit">
            <i class="bi bi-search"></i> Buscar
          </button>
        </form>
      </div>
    </div>
  </nav>

  <div class="movie-container">
    <h1>BIENVENIDOS</h1>
    
    <div v-if="displayedMovies.length === 0 && searchQuery.trim()" class="alert alert-warning mt-3">
      No se encontraron películas con el término "{{ searchQuery }}"
    </div>
    
    <div class="movie-grid">
      <div v-for="movie in displayedMovies" :key="movie.id" class="movie-card">
        <div class="poster-container">
          <img 
            v-if="movie.poster_path"
            :src="`https://image.tmdb.org/t/p/w300${movie.poster_path}`" 
            :alt="movie.title"
            class="poster"
          >
          <div v-else class="no-poster">Imagen no disponible</div>
          
          <!-- Botón de Me Gusta -->
          <button 
            @click.stop="toggleLike(movie)"
            class="like-button"
            :class="{ 'liked': isLiked(movie.id) }"
            aria-label="Me gusta esta película"
          >
           <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-hand-thumbs-up-fill" viewBox="0 0 16 16">
  <path d="M6.956 1.745C7.021.81 7.908.087 8.864.325l.261.066c.463.116.874.456 1.012.965.22.816.533 2.511.062 4.51a10 10 0 0 1 .443-.051c.713-.065 1.669-.072 2.516.21.518.173.994.681 1.2 1.273.184.532.16 1.162-.234 1.733q.086.18.138.363c.077.27.113.567.113.856s-.036.586-.113.856c-.039.135-.09.273-.16.404.169.387.107.819-.003 1.148a3.2 3.2 0 0 1-.488.901c.054.152.076.312.076.465 0 .305-.089.625-.253.912C13.1 15.522 12.437 16 11.5 16H8c-.605 0-1.07-.081-1.466-.218a4.8 4.8 0 0 1-.97-.484l-.048-.03c-.504-.307-.999-.609-2.068-.722C2.682 14.464 2 13.846 2 13V9c0-.85.685-1.432 1.357-1.615.849-.232 1.574-.787 2.132-1.41.56-.627.914-1.28 1.039-1.639.199-.575.356-1.539.428-2.59z"/>
</svg>
          </button>
        </div>

        <div class="movie-info">
          <h2>{{ movie.title }}</h2>
          
          <div class="genres">
            <span 
              v-for="genreId in movie.genre_ids.slice(0, 3)" 
              :key="genreId"
              :class="`genre-${genres[genreId]?.toLowerCase().replace(' ', '-')}`"
            >
              {{ genres[genreId] }}
            </span>
          </div>

          <div class="meta">
            <span class="rating">⭐ {{ movie.vote_average.toFixed(1) }}</span>
            <span class="date">{{ formatDate(movie.release_date) }}</span>
          </div>

          <p class="overview">{{ movie.overview || "Descripción no disponible" }}</p>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>


h1 {
  text-align: center;
  margin-bottom: 50px;
  color: #0004ff;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 50px;
}

.movie-card {
  background: rgb(255, 255, 255);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
}

.movie-card:hover {
  transform: translateY(10px);
  box-shadow: 0 10px 20px rgb(0, 174, 255);
}

.poster-container {
  height: 600px;
}

.poster {
  width: 100%;
  height: 100%;
}

.movie-info {
  padding: 15px;
}

h2 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #00264d;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #666;
}

.rating {
  color: #f39600;
  font-weight: bold;
}

.date {
  font-size: 0.9rem;
}

.overview {
  color: #000000;
  line-height: 1.5;
  font-size: 0.9rem;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.genres span {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  margin-right: 5px;
  color: white;
  font-weight: 500;
}

/* Colores específicos por género */
.genre-terror {
  background-color: #8b0000;
}

.genre-misterio {
  background-color: #6a5acd;
}

.genre-acción {
  background-color: #ff4500;
}

.genre-aventura {
  background-color: #32cd32;
}

.genre-drama {
  background-color: #9932cc;
}

.genre-familia {
  background-color: #ffa500;
}

.genre-ciencia-ficción {
  background-color: #20b2aa;
}

.genre-comedia {
  background-color: #ffd700;
  color: #333;
}

.genre-fantasía {
  background-color: #9370db;
}

.genre-suspense {
  background-color: #a0522d;
}

.genre-animación {
  background-color: #ff69b4;
}

.genre-crimen {
  background-color: #2f4f4f;
}

/* Si necesitas más géneros, puedes agregarlos aquí */
.genre-romance {
  background-color: #ff1493;
}

.genre-historia {
  background-color: #8b4513;
}

.genre-guerra {
  background-color: #556b2f;
}

.like-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgb(239, 239, 239);
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
}

.like-button i {
  color: white;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.like-button:hover {
  background: rgba(255, 0, 0, 0.9);
  transform: scale(1.1);
}

.like-button.liked i {
  color: #ff2d2d;
  text-shadow: 0 0 5px rgba(255, 45, 45, 0.7);
}

.poster-container {
  position: relative;
}

/* Estilos para el contador de likes en el navbar */
.nav-link .badge {
  font-size: 0.75rem;
  padding: 0.25em 0.4em;
  margin-left: 0.3rem;
}

</style>