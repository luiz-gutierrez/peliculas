import axios from 'axios';

const API_KEY = 'f7043c6acc59ff28ebc18db2cc1a60b8';
const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  params: { api_key: API_KEY, language: 'es-MX' },
});
export default {
  getPopularMovies() {
    return tmdb.get('/movie/popular');
  },
  // ¡Añade este nuevo método!
  get(endpoint) {
    return tmdb.get(endpoint);
  }
};