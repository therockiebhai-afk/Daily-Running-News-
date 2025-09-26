const API_KEY = "pub_a6b74362f3384f14b0ff79353bcb1b86";
const API_URL = "https://newsdata.io/api/1/news";

const fetchNews = async (category = "top", page = 1) => {
  const url = `${API_URL}?apikey=${API_KEY}&country=in&language=en&category=${category}&page=${page}`;
  
  loadingSpinner.classList.remove('hidden');
  if (page === 1) newsList.innerHTML = "";

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("API error: " + response.status);

    const data = await response.json();
    loadingSpinner.classList.add('hidden');

    return data.results || [];
  } catch (err) {
    console.error("Fetch error:", err);
    loadingSpinner.classList.add('hidden');
    newsList.innerHTML = `<p class="text-center text-red-500 col-span-2">Failed to load news.</p>`;
    return [];
  }
};

const renderNews = (articles) => {
  if (articles.length === 0 && currentPage === 1) {
    newsList.innerHTML = `<p class="text-center col-span-2">No news found.</p>`;
    return;
  }

  articles.forEach(article => {
    const card = document.createElement("article");
    card.className = "bg-white rounded-xl shadow-md overflow-hidden transition-transform duration-300 hover:scale-105";

    const imageUrl = article.image_url || "https://via.placeholder.com/600x400?text=Daily+News";

    card.innerHTML = `
      <a href="${article.link}" target="_blank" rel="noopener noreferrer">
        <img src="${imageUrl}" alt="${article.title}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h2 class="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">${article.title}</h2>
          <p class="text-gray-600 text-sm line-clamp-3">${article.description || ""}</p>
          <div class="mt-4 flex justify-between items-center text-xs text-gray-400">
            <span class="font-bold">${article.source_id || "Unknown"}</span>
            <span>${new Date(article.pubDate).toLocaleDateString()}</span>
          </div>
        </div>
      </a>
    `;
    newsList.appendChild(card);
  });
};
