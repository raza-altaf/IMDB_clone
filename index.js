//api
//key= http://www.omdbapi.com/?i=tt3896198&apikey=28a2ff0

// IIFE (Immediately Invoked Function Expression) for encapsulation
(function () {
  // DOM elements
  const searchKeyword = document.getElementById("search");
  const suggestionsContainer = document.getElementById("card-container");
  const favMoviesContainer = document.getElementById("fav-movies-container");
  const emptyText = document.getElementById("empty-search-text");
  const showFavourites = document.getElementById("favorites-section");
  const emptyFavText = document.getElementById("empty-fav-text");

  // Initialize favorites and empty text display
  addToFavDOM();
  showEmptyText();
  let suggestionList = [];
  let favMovieArray = [];

  // Prevent form submission on Enter key press
  searchKeyword.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      event.preventDefault();
    }
  });

  // Show or hide empty favorites text
  function showEmptyText() {
    if (favMoviesContainer.innerHTML == "") {
      emptyFavText.style.display = "block";
    } else {
      emptyFavText.style.display = "none";
    }
  }

  // Event listener on search input
  searchKeyword.addEventListener("keyup", function () {
    let search = searchKeyword.value;
    if (search === "") {
      emptyText.style.display = "block";
      suggestionsContainer.innerHTML = "";
      suggestionList = [];
    } else {
      emptyText.style.display = "none";
      (async () => {
        let data = await fetchMovies(search);
        addToSuggestionContainerDOM(data);
      })();

      suggestionsContainer.style.display = "grid";
    }
  });

  // Fetch movie data from API
  async function fetchMovies(search) {
    const url = `https://www.omdbapi.com/?t=${search}&apikey=62c7db9`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (err) {
      console.log(err);
    }
  }

  // Display movie suggestions in the suggestion container
  function addToSuggestionContainerDOM(data) {
    document.getElementById("empty-fav-text").style.display = "none";
    let isPresent = false;

    // Check if the movie is already present in the suggestionList array
    suggestionList.forEach((movie) => {
      if (movie.Title == data.Title) {
        isPresent = true;
      }
    });

    if (!isPresent && data.Title != undefined) {
      if (data.Poster == "N/A") {
        data.Poster = "";
      }
      suggestionList.push(data);
      const movieCard = document.createElement("div");
      movieCard.setAttribute("class", "text-decoration");

      movieCard.innerHTML = `
        <div class="card my-2" data-id="${data.Title}">
          <a href="movie.html">
            <img
              src="${
                data.Poster ||
                `https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg`
              }"
              class="card-img-top"
              alt="..."
              data-id="${data.Title}"
            />
            <div class="card-body text-start">
              <h5 class="card-title">
                <a href="movie.html" data-id="${data.Title}">${data.Title}</a>
              </h5>
              <p class="card-text card-text-movie">
                <i class="fa-solid fa-star">
                  <span id="rating">&nbsp;${data.imdbRating}</span>
                </i>
                <button class="fav-btn">
                  <i class="fa-solid fa-heart add-fav" data-id="${
                    data.Title
                  }"></i>
                </button>
              </p>
            </div>
          </a>
        </div>
      `;
      suggestionsContainer.prepend(movieCard);
    }
  }

  // Add movie to favorites in localStorage
  async function handleFavBtn(e) {
    const target = e.target;

    let data = await fetchMovies(target.dataset.id);

    let favMoviesLocal = localStorage.getItem("favMoviesList");

    if (favMoviesLocal) {
      favMovieArray = Array.from(JSON.parse(favMoviesLocal));
    } else {
      localStorage.setItem("favMoviesList", JSON.stringify(data));
    }

    // Check if the movie is already present in the fav list
    let isPresent = false;
    favMovieArray.forEach((movie) => {
      if (data.Title == movie.Title) {
        notify("Already added to favorites");
        isPresent = true;
      }
    });

    if (!isPresent) {
      favMovieArray.push(data);
    }

    localStorage.setItem("favMoviesList", JSON.stringify(favMovieArray));
    isPresent = !isPresent;
    addToFavDOM();
  }

  // Add favorites to the favorites list in DOM
  function addToFavDOM() {
    favMoviesContainer.innerHTML = "";

    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    if (favList) {
      favList.forEach((movie) => {
        const div = document.createElement("div");
        div.classList.add(
          "fav-movie-card",
          "d-flex",
          "justify-content-between",
          "align-content-center",
          "my-2"
        );

        div.innerHTML = `
          <div class="card" data-id="${movie.Title}">
            <a href="movie.html">
              <img
                src="${
                  movie.Poster == "N/A"
                    ? `https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg`
                    : movie.Poster
                }"
                class="card-img-top"
                alt="..."
                data-id="${movie.Title}"
              />
              <div class="card-body text-start">
                <h5 class="card-title">
                  <a href="movie.html" data-id="${movie.Title}">${
          movie.Title
        }</a>
                </h5>
                <p class="card-text">
                  <i class="fa-solid fa-star">
                    <span id="rating">&nbsp;${movie.imdbRating}</span>
                  </i>
                   <div class="delete-btn my-4">
                       <i class="fa-solid fa-trash-can" data-id="${
                         movie.Title
                       }"></i>
                   </div>
                </p>
              </div>
            </a>
          </div>
        `;

        favMoviesContainer.prepend(div);
      });
    }
  }

  // Notify function
  function notify(text) {
    window.alert(text);
  }

  // Delete movie from favorites list
  function deleteMovie(name) {
    let favList = JSON.parse(localStorage.getItem("favMoviesList"));
    let updatedList = Array.from(favList).filter((movie) => {
      return movie.Title != name;
    });

    localStorage.setItem("favMoviesList", JSON.stringify(updatedList));

    addToFavDOM();
    showEmptyText();
  }

  // Handle click events
  async function handleClickListner(e) {
    const target = e.target;

    if (target.classList.contains("add-fav")) {
      e.preventDefault();
      handleFavBtn(e);
    } else if (target.classList.contains("fa-trash-can")) {
      deleteMovie(target.dataset.id);
    } else if (target.classList.contains("fa-bars")) {
      if (showFavourites.style.display == "flex") {
        document.getElementById("show-favourites").style.color = "#8b9595";
        showFavourites.style.display = "none";
      } else {
        showFavourites.classList.add("");
        document.getElementById("show-favourites").style.color =
          "var(--logo-color)";
        showFavourites.style.display = "flex";
      }
    }

    localStorage.setItem("movieName", target.dataset.id);
  }

  // Event listener on the whole document
  document.addEventListener("click", handleClickListner);
})();
