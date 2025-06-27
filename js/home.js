const apiKey = "76324910ca15f543396c779ace8cb604";
const baseUrl = "https://api.themoviedb.org/3";
const youtubeBase = "https://www.youtube.com/embed/";

const seasonSelect = document.querySelector("#seasons");
const episodeSelect = document.querySelector("#episodes");
const playBtn = document.querySelector("#play-episode");
const videoTitle = document.querySelector("#video-title");
const videoPlayer = document.querySelector("#video-player");

function updateEpisodeOptions() {
    const selectedSeason = seasonSelect.value;

    // Fetch episode data for the selected season (this can be expanded with an actual API call)
    const episodes = getEpisodesForSeason(selectedSeason);
    
    // Update episode options dynamically
    episodeSelect.innerHTML = ''; // Clear existing episodes
    episodes.forEach(episode => {
        const option = document.createElement('option');
        option.value = episode.id;
        option.textContent = episode.title;
        episodeSelect.appendChild(option);
    });
}

function getEpisodesForSeason(season) {
    // Replace this with actual API fetching or data logic
    const episodes = {
        "season-1": [
            { id: 'episode-1', title: 'Episode 1' },
            { id: 'episode-2', title: 'Episode 2' },
        ],
        "season-2": [
            { id: 'episode-1', title: 'Episode 1' },
            { id: 'episode-2', title: 'Episode 2' },
        ]
    };

    return episodes[season] || [];
}

seasonSelect.addEventListener("change", updateEpisodeOptions);

playBtn.addEventListener("click", () => {
    const selectedEpisode = episodeSelect.value;
    playEpisode(selectedEpisode);
});

function playEpisode(episodeId) {
    // Logic to play the selected episode, e.g., updating the iframe source
    console.log("Playing episode:", episodeId);
    const trailerUrl = `${baseUrl}/movie/${episodeId}/videos?api_key=${apiKey}`;
    fetch(trailerUrl)
        .then(res => res.json())
        .then(data => {
            const videoKey = data.results[0]?.key;
            if (videoKey) {
                videoPlayer.src = `${youtubeBase}${videoKey}`;
                videoTitle.textContent = episodeId; // Set episode title dynamically
            }
        })
        .catch(err => console.error("Error loading episode:", err));
}

document.addEventListener("DOMContentLoaded", () => {
    updateEpisodeOptions();
});
