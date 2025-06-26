const apiKey = "76324910ca15f543396c779ace8cb604";
const baseUrl = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w500";

const endpoints = {
  trending: `${baseUrl}/trending/all/week?api_key=${apiKey}`,
  movieDetails: (id) => `${baseUrl}/movie/${id}?api_key=${apiKey}&append_to_response=videos`,
  tvDetails: (id) => `${baseUrl}/tv/${id}?api_key=${apiKey}&append_to_response=videos`,
};

// Fetch random trending movie or TV show to play the trailer
function fetchRandomVideo() {
  fetch(endpoints.trending)
    .then(res => res.json())
    .then(data => {
      const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
      const isMovie = randomItem.media_type === 'movie';
      const detailsUrl = isMovie 
        ? endpoints.movieDetails(randomItem.id) 
        : endpoints.tvDetails(randomItem.id);

      fetch(detailsUrl)
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
    })
    .catch(err => {
      console.error("Error fetching random video:", err);
    });
}

// Smooth transition to main content when clicking "Enter ZETFLIX"
function showMainContent() {
  document.getElementById("landing").style.display = "none";
  document.getElementById("mainContent").style.display = "block";
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  // Fetch random video to display on the landing page
  fetchRandomVideo();

  // Set up the "Enter ZETFLIX" button
  document.getElementById("enterSiteBtn").addEventListener("click", () => {
    showMainContent();
  });
});
