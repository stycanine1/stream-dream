const apiKey = '76324910ca15f543396c779ace8cb604';
const baseURL = 'https://api.themoviedb.org/3';
const imageBase = 'https://image.tmdb.org/t/p/w500';
const sectionIDs = {
    'trending': `${baseURL}/trending/all/week?api_key=${apiKey}`,
    'top-rated': `${baseURL}/movie/top_rated?api_key=${apiKey}`,
    'tv-series': `${baseURL}/discover/tv?api_key=${apiKey}`
};

function createCard(item) {
    const div = document.createElement('div');
    div.className = 'movie-card';
    div.innerHTML = `
        <img src="${imageBase + item.poster_path}" alt="${item.title || item.name}" />
        <p>${item.title || item.name}</p>
    `;
    return div;
}

function loadSection(id, url) {
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById(id);
            container.innerHTML = '';
            data.results.forEach(item => {
                if (item.poster_path) {
                    const card = createCard(item);
                    container.appendChild(card);
                }
            });
        })
        .catch(err => {
            console.error(`Error loading ${id}:`, err);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    for (let section in sectionIDs) {
        loadSection(section, sectionIDs[section]);
    }
});
