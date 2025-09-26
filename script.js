const newsContainer = document.getElementById("news-container");
const apiKey = "pub_a6b74362f3384f14b0ff79353bcb1b86"; // your key
const apiUrl = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en`;

async function fetchNews() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("API request failed");
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      newsContainer.innerHTML = "<p>No news available right now.</p>";
      return;
    }

    newsContainer.innerHTML = "";

    data.results.forEach(article => {
      const card = document.createElement("div");
      card.classList.add("news-card");

      card.innerHTML = `
        <img src="${article.image_url || 'https://via.placeholder.com/300x200?text=No+Image'}" alt="News">
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.link}" target="_blank">Read more</a>
      `;
      newsContainer.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading news:", error);
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

fetchNews();
