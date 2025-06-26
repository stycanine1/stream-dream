const apiKey = "76324910ca15f543396c779ace8cb604";
const baseUrl = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w500";

const endpoints = {
  trending: `${baseUrl}/trending/all/week?api_key=${apiKey}`,
  topRated: `${baseUrl}/movie/top_rated?api_key=${apiKey}`,
  tvSeries: `${baseUrl}/tv/popular?api_key=${apiKey}`,
  search: (query) => `${baseUrl}/search/multi?api_key=${apiKey}&query=${encodeURIComponent(query)}`,
  movieDetails: (id) => `${baseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=videos`,
  tvDetails: (id) => `${baseUrl}/tv/${id}?api_key=${apiKey}&append_to_response=videos`,
};

// Fetch and display content in the movie grid
function fetchAndDisplay(url, containerId) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById(containerId);
      container.innerHTML = "";

      data.results.forEach(item => {
        const title = item.title || item.name;
        const poster = item.poster_path
          ? `${imageBase}${item.poster_path}`
          : "https://via.placeholder.com/300x450?text=No+Image";

        const card = document.createElement("div");
        card.classList.add("movie-card");

        card.innerHTML = `
          <img src="${poster}" alt="${title}" />
          <p>${title}</p>
        `;

        // Add click event to show movie trailer
        card.addEventListener("click", () => {
          showPlayerModal(item);
        });

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(`Error fetching ${containerId}:`, err);
    });
}

// Show trailer modal
function showPlayerModal(item) {
  const isMovie = !!item.title;
  const fetchDetails = isMovie
    ? fetch(endpoints.movieDetails(item.id))
    : fetch(endpoints.tvDetails(item.id));

  fetchDetails
    .then(res => res.json())
    .then(details => {
      const videoKey = details.videos?.results?.find(v => v.type === "Trailer")?.key;
      const title = details.title || details.name;

      const playerModal = document.createElement("div");
      playerModal.classList.add("player-modal");
      playerModal.innerHTML = `
        <div class="player-content">
          <span class="close-btn">&times;</span>
          <h2>${title}</h2>
          ${
            videoKey
              ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`
              : `<p style="text-align:center;">No trailer available.</p>`
          }
        </div>
      `;

      document.body.appendChild(playerModal);

      playerModal.querySelector(".close-btn").addEventListener("click", () => {
        document.body.removeChild(playerModal);
      });
    });
}

// Fetch random movie/trailer for the landing page
function fetchRandomMovie() {
  fetch(endpoints.trending)
    .then(res => res.json())
    .then(data => {
      const randomMovie = data.results[Math.floor(Math.random() * data.results.length)];
      const movieDetailsUrl = randomMovie.media_type === "movie"
        ? endpoints.movieDetails(randomMovie.id)
        : endpoints.tvDetails(randomMovie.id);

      fetch(movieDetailsUrl)
        .then(res => res.json())
        .then(details => {
          const videoKey = details.videos?.results?.find(v => v.type === "Trailer")?.key;
          const title = details.title || details.name;

          const trailerContainer = document.getElementById("trailerPlayer");
          trailerContainer.innerHTML = `
            <h2>Now Playing: ${title}</h2>
            ${
              videoKey
                ? `<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`
                : `<p>No trailer available</p>`
            }
          `;
        });
    });
}

// Setup search functionality
function setupSearch() {
  const input = document.getElementById("searchInput");
  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) {
      const query = input.value.trim();
      fetchAndDisplay(endpoints.search(query), "trendingGrid");
    }
  });
}

// Smooth navigation to sections
function setupNavLinks() {
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const text = link.textContent.trim().toLowerCase();

      switch (text) {
        case "home":
          fetchAndDisplay(endpoints.trending, "trendingGrid");
          fetchAndDisplay(endpoints.topRated, "topRatedGrid");
          fetchAndDisplay(endpoints.tvSeries, "tvGrid");
          break;
        case "movies":
          fetchAndDisplay(endpoints.topRated, "trendingGrid");
          break;
        case "tv shows":
          fetchAndDisplay(endpoints.tvSeries, "trendingGrid");
          break;
        case "genres":
          alert("Genres coming soon!");
          break;
      }
    });
  });
}

// Hide landing page and show main content
function showMainContent() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Fetch random movie for landing page hero section
  fetchRandomMovie();

  // Setup navigation and search
  setupSearch();
  setupNavLinks();

  // Enter site button functionality
  document.getElementById("enterSiteBtn").addEventListener("click", () => {
    showMainContent();
  });
});
