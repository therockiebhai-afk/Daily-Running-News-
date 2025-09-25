/* CONFIG */
const apiKey = "pub_a6b74362f3384f14b0ff79353bcb1b86"; // your NewsData.io key
let page = 1;
let currentCategory = "";
const pageSize = 12;

const newsEl = document.getElementById("news");
const newsListEl = document.getElementById("news-list"); // used in older code path
const breakingEl = document.getElementById("breaking");
const loadMoreBtn = document.getElementById("load-more");

/* Helper - safe image */
function safeImage(url){
  if(!url) return "https://via.placeholder.com/800x450?text=No+Image";
  return url;
}

/* Render one article card (returns element) */
function makeCard(article){
  const a = document.createElement("article");
  a.className = "news-card";
  const image = safeImage(article.image_url || article.image || article.thumbnail);
  const t = article.title || "";
  const desc = article.description || (article.content ? article.content.slice(0,150) : "");
  const link = article.link || article.url || "#";
  a.innerHTML = `
    <img loading="lazy" src="${image}" alt="${t}">
    <h3>${escapeHtml(t)}</h3>
    <p>${escapeHtml(truncate(desc, 180))}</p>
    <a href="${link}" target="_blank" rel="noopener">Read More</a>
  `;
  return a;
}

/* small helpers */
function truncate(str, n){ return str && str.length>n ? str.slice(0,n-1)+"…" : str || ""; }
function escapeHtml(s){ return s ? s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') : ""; }

/* Fetch news from NewsData.io */
async function fetchNews(cat = "", pageNo = 1){
  const container = document.querySelector(".news-list");
  if(!container) return;
  if(pageNo===1) container.innerHTML = ""; // first load - clear

  // show simple loader
  const loader = document.createElement("div");
  loader.textContent = "Loading…";
  loader.style.padding = "12px";
  container.appendChild(loader);

  try{
    let url = `https://newsdata.io/api/1/news?apikey=${apiKey}&country=in&language=en&page=${pageNo}&page_size=${pageSize}`;
    if(cat) url += `&category=${encodeURIComponent(cat)}`;
    const res = await fetch(url);
    const json = await res.json();
    container.removeChild(loader);

    if(!json || !json.results || !json.results.length){
      if(pageNo===1) container.innerHTML = "<p>No news found.</p>";
      return;
    }

    json.results.forEach(item => {
      const card = makeCard(item);
      container.appendChild(card);
    });

    // update breaking marquee (first few titles)
    const headlines = json.results.slice(0,8).map(i=>i.title).filter(Boolean);
    if(breakingEl) breakingEl.textContent = headlines.join("  •  ");

  }catch(err){
    console.error("Fetch error:", err);
    container.removeChild(loader);
    if(pageNo===1) container.innerHTML = "<p>Failed to load news. Try again later.</p>";
  }
}

/* load more handler */
if(loadMoreBtn){
  loadMoreBtn.addEventListener("click", ()=>{
    page++;
    fetchNews(currentCategory, page);
  });
}

/* category nav */
document.querySelectorAll(".nav-link, .chip").forEach(el=>{
  el.addEventListener("click", e=>{
    e.preventDefault();
    const cat = el.dataset.cat || el.getAttribute("data-cat") || el.textContent.toLowerCase();
    // update UI active states
    document.querySelectorAll(".nav-link").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".chip").forEach(x=>x.classList.remove("active"));
    if(el.classList) el.classList.add("active");
    currentCategory = cat==="top" ? "" : cat;
    page = 1;
    fetchNews(currentCategory, page);
    window.scrollTo({top: 200, behavior: 'smooth'});
  });
});

/* subscription form (simple client-side) */
const subscribeForm = document.getElementById("subscribe-form");
if(subscribeForm){
  subscribeForm.addEventListener("submit", e=>{
    e.preventDefault();
    const email = document.getElementById("subscribe-email").value;
    alert("Thanks! " + (email || "You") + " — subscription functionality not set up in this demo.");
    subscribeForm.reset();
  });
}

/* mobile menu toggle */
const mobileBtn = document.getElementById("mobile-menu-btn");
const navList = document.getElementById("nav-list");
if(mobileBtn && navList){
  mobileBtn.addEventListener("click", ()=> navList.classList.toggle("open"));
}

/* initial load */
fetchNews(currentCategory, page);

/* Utility — re-initialize ad units if inserted dynamically (optional) */
/* (AdSense prefers static ad tags; dynamically inserting repeatedly may or may not serve) */
