let perfumes = [];

// Load data and initialize
window.addEventListener('DOMContentLoaded', () => {
  fetch('data/perfumes.json')
    .then(res => res.json())
    .then(data => {
      perfumes = data;
      if (window.location.pathname.includes('index.html') || window.location.pathname === '/' || window.location.pathname === '/perfume-recommender/') {
        displayPerfumes(perfumes);
      } else if (window.location.pathname.includes('perfume.html')) {
        loadPerfumeDetail();
      }
    });
});

// Display perfume list
function displayPerfumes(perfumesToShow) {
  const list = document.getElementById('perfumeList');
  if (!list) return;
  list.innerHTML = '';

  if (perfumesToShow.length === 0) {
    list.innerHTML = '<p>No perfumes match your filters.</p>';
    return;
  }

  perfumesToShow.forEach(perfume => {
    const card = document.createElement('div');
    card.className = 'perfume-card';
    card.innerHTML = `
      <img src="${perfume.image}" alt="${perfume.name}" class="perfume-image" />
      <h3>${perfume.name}</h3>
      <p>${perfume.brand}</p>
      <button onclick="location.href='perfume.html?id=${perfume.id}'">View Details</button>
    `;
    list.appendChild(card);
  });
}

// Apply filters and search
function applyFilters() {
  const gender = document.getElementById('gender').value;
  const ageGroup = document.getElementById('ageGroup').value;
  const family = document.getElementById('olfactoryFamily').value;
  const season = document.getElementById('season').value;
  const time = document.getElementById('timeOfDay').value;
  const minPrice = document.getElementById('minPrice').value;
  const maxPrice = document.getElementById('maxPrice').value;
  const concentration = document.getElementById('concentration').value;
  const search = document.getElementById('search').value.toLowerCase();

  const filtered = perfumes.filter(p => {
    return (
      (!gender || p.gender === gender) &&
      (!ageGroup || p.ageGroup === ageGroup) &&
      (!family || p.olfactoryFamily === family) &&
      (!season || p.season === season) &&
      (!time || p.timeOfDay === time) &&
      (!minPrice || p.price >= parseFloat(minPrice)) &&
      (!maxPrice || p.price <= parseFloat(maxPrice)) &&
      (!concentration || p.concentration === concentration) &&
      (!search || p.name.toLowerCase().includes(search))
    );
  });

  displayPerfumes(filtered);
}

// Load perfume detail based on URL ID
function loadPerfumeDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get('id'));

  const perfume = perfumes.find(p => p.id === id);
  const container = document.getElementById('perfumeDetail');

  if (!perfume || !container) {
    container.innerHTML = '<p>Perfume not found.</p>';
    return;
  }

  container.innerHTML = `
    <img src="${perfume.image}" alt="${perfume.name}" class="detail-image"/>
    <h2>${perfume.name}</h2>
    <h4>${perfume.brand}</h4>
    <p><strong>Price:</strong> $${perfume.price}</p>
    <p><strong>Concentration:</strong> ${perfume.concentration}</p>
    <p><strong>Description:</strong> ${perfume.description}</p>
    <p><strong>Olfactory Family:</strong> ${perfume.olfactoryFamily}</p>
    <p><strong>Notes:</strong> ${perfume.notes.join(', ')}</p>
    <h3>User Reviews</h3>
    ${perfume.reviews.map(r => `<p><strong>${r.user}:</strong> ${r.text}</p>`).join('')}
  `;
}
