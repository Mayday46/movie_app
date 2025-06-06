import { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import { getTrendingMovies, updateSearchCount } from './appwrite.js'; // Import the updateSearchCount function from appwrite.js
import MovieCard from './components/MovieCard';
import Search from './components/Search';
import Spinner from './components/Spinner';


const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY; // Using Vite's environment variable

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {

  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [trendingMovies, setTrendingMovies] = useState([]);


  // debounce the search term to avoid too many API calls
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]); // Debounce the search term to avoid too many API calls

  const fetchMovies = async (query = '') => {
    setIsLoading(true); // Set loading state to true before fetching
    setErrorMessage(''); // Reset error message before fetching
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      // alert(response);
      if (!response.ok) {
        throw new Error('Failed to fetch movies');
      }

      const data = await response.json(); // This retrieves moive data in JSON format
      // console.log(data);

      if (data.response === 'False') {
        setErrorMessage(data.Error || 'No movies found');
        setMovieList([]);
        return;
      }
      setMovieList(data.results || []);
      // updateSearchCount(); // Update the search count in the database

      if (query && data.results.length > 0) {
        // If a search term is provided and movies are found, update the search count
        await updateSearchCount(query, data.results[0]); // Use the first movie as a reference
      }

    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage('Failed to fetch movies. Please try again later.');

    } finally {
      setIsLoading(false); // Set loading state to false after fetching
    }
  }

  const loadTrendingMovies = async() => {
    try {
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    } catch (error) {
      console.error(`Error fetching trending movies: ${error}`);
    }
  }

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]); // Fetch movie will be recalled whenever the searchTerm changes.

  useEffect(() => {
    loadTrendingMovies();
  }, []);

  return (
    <main>
      <div className = "pattern" />
      <div className = "wrapper">
        <header>

          <img src = "./hero.png" alt = "Hero Image" />
          <h1>
            Find <span className = "text-gradient">Movies</span> You'll Enjoy Without the Hassle
          </h1>
          <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm}/>
        </header>

        {trendingMovies.length > 0 && (
          <section className = "trending">
            <h2> Trending Movies </h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key = {movie.$id}>
                  <p> {index + 1} </p>
                  <img src = {movie.poster_url} alt = {movie.title} />
                </li>
              ))}

            </ul>
          </section>
        )
        
        
        }

        <section className = "all-movies">
          <h2> All Movies </h2>

          {isLoading ? (
            <Spinner />
            // <p className = "text-white"> Loading... </p>
          ) : errorMessage ? (
            <p className = "text-red-500"> {errorMessage} </p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                // <p key = {movie.id} className = "text-white"> {movie.title} </p>
                <MovieCard key = {movie.id} movie = {movie}/>
              ))}
            </ul>
          )}
          
        </section>

      </div>
    </main>
  )
}


export default App
