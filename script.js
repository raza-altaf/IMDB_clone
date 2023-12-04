// API configuration
const apiBaseUrl = "https://api.themoviedb.org/3";
const apiKey = "49e3be45df1c1a483b5eb9560e3c73ab";
const imageBaseUrl = "https://image.tmdb.org/t/p/w500/";

// DOM element for displaying movies
const moviesGrid = document.getElementById("movies-grid");
console.log(moviesGrid);

// Function to fetch now playing movies from the API
const fetchMoviesNowPlaying = async () => {
  // Fetch data from the API
  const response = await fetch(
    `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`
  );
  const jsonResponse = await response.json();

  // Extract the movies from the API response
  const movies = jsonResponse.results;
  console.log(movies);

  // Display the movies on the webpage
  displayMovies(movies);
};

// Function to display movies on the webpage
const displayMovies = async (movies) => {
  console.log(movies[0]);

  // Update the inner HTML of the movies grid with movie posters
  moviesGrid.innerHTML = movies
    .map(
      (movie) =>
        `<img src="${imageBaseUrl}/${movie.poster_path}" alt="movie-poster">`
    )
    .join("");
};

// Initial call to fetch and display now playing movies
fetchMoviesNowPlaying();
