// Immediately invoked function expression (IIFE) to encapsulate the code
(function () {
  // DOM elements
  const title = document.getElementById("title");
  const year = document.getElementById("year");
  const runtime = document.getElementById("runtime");
  const rating = document.getElementById("rating");
  const poster = document.getElementById("poster");
  const plot = document.getElementById("plot");
  const directorsName = document.getElementById("director-names");
  const castName = document.getElementById("cast-names");
  const genre = document.getElementById("genre");

  // Set the movie title from local storage
  title.innerHTML = localStorage.getItem("movieName");

  // Function to fetch movie details using the OMDB API
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&type=movie&apikey=28a2ff0`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      // Update DOM elements with fetched movie details
      year.innerHTML = data.Year;
      runtime.innerHTML = data.Runtime;
      rating.innerHTML = `${data.imdbRating}/10`;
      poster.setAttribute(
        "src",
        data.Poster == "N/A"
          ? `https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg`
          : data.Poster
      );
      plot.innerHTML = data.Plot;
      directorsName.innerHTML = data.Director;
      castName.innerHTML = data.Actors;
      genre.innerHTML = data.Genre;
    } catch (err) {
      console.log(err);
    }
  }

  // Call the fetchMovies function with the movie title
  fetchMovies(title.innerHTML);
})();
