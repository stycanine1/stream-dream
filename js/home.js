const apiKey = "76324910ca15f543396c779ace8cb604";
const baseUrl = "https://api.themoviedb.org/3";
const imageBase = "https://image.tmdb.org/t/p/w500";
const youtubeBase = "https://www.youtube.com/embed/";

function fetchRandomTrendingVideo() {
  const trendingUrl = `${baseUrl}/trending/all/week?api_key=${apiKey}`;

  fetch(trendingUrl)
    .then(res => res.json())
    .then(data => {
      const randomItem = data.results[Math.floor(Math.random() * data.results.length)];
      const videoTitle = randomItem.title || randomItem.name;
      const videoId = randomItem.id;
      
      // Set video title
      document.getElementById("video-title").textContent = videoTitle;
      
      // Set YouTube trailer link (assuming the trailer is available for that movie/show)
      const trailerUrl = `${baseUrl}/movie/${videoId}/videos?api_key=${apiKey}`;
      fetch(trailerUrl)
        .then(res => res.json())
        .then(trailerData => {
          const videoKey = trailerData.results[0]?.key;
          if (videoKey) {
            document.getElementById("video-player").src = `${youtubeBase}${videoKey}`;
          }
        });
    })
    .catch(err => {
      console.error("Error fetching trending video:", err);
    });
}

// Call function to fetch and display a random video
document.addEventListener("DOMContentLoaded", () => {
  fetchRandomTrendingVideo();
});

// Function to enter the main site
function enterSite() {
  window.location.href = "index.html"; // Redirect to main site
}
