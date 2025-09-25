const apiKey = "pub_a6b74362f3384f14b0ff79353bcb1b86";
const newsContainer = document.getElementById("news");

async function fetchNews() {
  try {
    const res = await fetch(`https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en`);
    const data = await res.json();

    newsContainer.innerHTML = "";

    if (data.results) {
      data.results.forEach(article => {
        const card = document.createElement("div");
        card.classList.add("news-card");

        card.innerHTML = `
          <img src="${article.image_url || 'https://via.placeholder.com/400x200?text=No+Image'}" alt="News">
          <h3>${article.title}</h3>
          <p>${article.description || ''}</p>
          <a href="${article.link}" target="_blank">Read More</a>
        `;

        newsContainer.appendChild(card);
      });
    } else {
      newsContainer.innerHTML = "<p>No news found.</p>";
    }
  } catch (error) {
    newsContainer.innerHTML = "<p>Failed to load news.</p>";
  }
}

fetchNews();
