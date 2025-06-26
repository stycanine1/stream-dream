const apiKey = "76324910ca15f543396c779ace8cb604";
const baseUrl = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w500";

const endpoints = {
  trending: `${baseUrl}/trending/all/week?api_key=${apiKey}`,
  topRated: `${baseUrl}/movie/top_rated?api_key=${apiKey}`,
  tvSeries: `${baseUrl}/tv/popular?api_key=${apiKey}`,
};

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

        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error(`Error fetching ${containerId}:`, err);
    });
}

function setupSearch() {
  const input = document.getElementById("searchInput");

  input.addEventListener("keydown", e => {
    if (e.key === "Enter" && input.value.trim()) {
      const query = encodeURIComponent(input.value.trim());
      const searchUrl = `${baseUrl}/search/multi?api_key=${apiKey}&query=${query}`;
      fetchAndDisplay(searchUrl, "trendingGrid");
    }
  });
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplay(endpoints.trending, "trendingGrid");
  fetchAndDisplay(endpoints.topRated, "topRatedGrid");
  fetchAndDisplay(endpoints.tvSeries, "tvGrid");
  setupSearch();
});
