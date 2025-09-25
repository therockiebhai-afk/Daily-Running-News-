const apiKey = "pub_a6b74362f3384f14b0ff79353bcb1b86"; // your NewsData.io key
const url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en`;

async function fetchNews() {
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.results) {
      document.getElementById("news-container").innerHTML =
        "<p>Failed to load news.</p>";
      return;
    }

    let newsHTML = "";
    data.results.forEach((article) => {
      const imageUrl = article.image_url
        ? article.image_url
        : "https://via.placeholder.com/400x200?text=No+Image";

      newsHTML += `
        <div class="news-card">
          <img src="${imageUrl}" alt="News Image">
          <div class="news-card-content">
            <h2>${article.title}</h2>
            <p>${article.description ? article.description : ""}</p>
            <a href="${article.link}" target="_blank">Read More</a>
          </div>
        </div>
      `;
    });

    document.getElementById("news-container").innerHTML = newsHTML;
  } catch (error) {
    document.getElementById("news-container").innerHTML =
      "<p>Failed to load news.</p>";
  }
}

fetchNews();