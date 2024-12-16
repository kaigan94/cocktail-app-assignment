// Import function for data mapping
import { mapRawCocktailData } from './utilities.js';

// DOM Elements
const pages = {
  start: document.querySelector("#start-page"),
  details: document.querySelector("#details-page"),
  search: document.querySelector("#search-page")
};

// Fetch and display a random cocktail
async function fetchRandomCocktail() {
  document.getElementById("search-results").innerHTML = '';
  try {
    const response = await fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php");
    const data = await response.json();
    displayCocktail(data.drinks[0]);
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// Display cocktail info on Home page
function displayCocktail(cocktail) {
  const cocktailDiv = document.getElementById("cocktail");
  const searchForm = document.getElementById("search-form"); 
  searchForm.style.display = "none"; 
  cocktailDiv.innerHTML = `
    <h1>${cocktail.strDrink}</h1>
    <img src="${cocktail.strDrinkThumb}" alt="${cocktail.strDrink}" />
  `;
}

// Fetch and display cocktail details
async function fetchCocktailDetails(name) {
  try {
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`);
    const data = await response.json();
    displayCocktailDetails(mapRawCocktailData(data.drinks[0]));
    switchPage("details");
  } catch (error) {
    console.error("Fetch Error:", error);
  }
}

// Display detailed cocktail info
function displayCocktailDetails(cocktail) {
  const detailsDiv = document.getElementById("cocktail-details");
  detailsDiv.innerHTML = `
    <h2>${cocktail.name}</h2>
    <img src="${cocktail.thumbnail}" alt="${cocktail.name}" />
    <p><strong>Category:</strong> ${cocktail.category}</p>
    <p><strong>Alcoholic:</strong> ${cocktail.alcoholic ? "Yes" : "No"}</p>
    <p><strong>Glass:</strong> ${cocktail.glass}</p>
    <p><strong>Instructions:</strong> ${cocktail.instructions}</p>
    <ul><strong>Ingredients:</strong> ${cocktail.ingredients.map(i => `<li>${i.measure || ""} ${i.ingredient}</li>`).join("")}</ul>
  `;
}

// Page switching function
function switchPage(page) {
  Object.values(pages).forEach(p => p.classList.remove("open"));
  pages[page].classList.add("open");
  if (page === "search") {
    document.getElementById("search-form").style.display = "block";  // Show the form on the search page
  } else {
    document.getElementById("search-form").style.display = "none";  // Hide on other pages
  }
}

// Fetch and display cocktails based on the search
async function searchCocktails(cocktailName) {
  try { 
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);
    const data = await response.json();
    if (data.drinks) {
      displaySearchResults(data.drinks); 
    } else {
      displayNoResults(); 
    }
  } catch (error) {
    console.error("Fetch Error:", error); 
  }
}

// Search results function
function displaySearchResults(cocktails) {
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = ""; 
  cocktails.forEach(cocktail => {
    const cocktailItem = document.createElement("li");
    cocktailItem.innerText = cocktail.strDrink; 
    cocktailItem.addEventListener("click", () => {
      fetchCocktailDetails(cocktail.strDrink);
      switchPage("details"); 
    });
    resultsDiv.appendChild(cocktailItem);
  });
}

function displayNoResults() {
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "<li>No cocktails found.</li>";
}
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Förhindra att formuläret skickas på traditionellt sätt
  const searchQuery = document.getElementById("search-input").value.trim(); // Hämta sökfrågan
  if (searchQuery) {
    searchCocktails(searchQuery);
  }
});

// Event Listeners
document.getElementById("new-cocktail").addEventListener("click", fetchRandomCocktail);
document.getElementById("details-link").addEventListener("click", () => {
  const cocktailName = document.querySelector("#cocktail h1").innerText;
  fetchCocktailDetails(cocktailName);
});
document.getElementById("search-link").addEventListener("click", () => switchPage("search"));
document.getElementById("start-link").addEventListener("click", () => {
  document.getElementById("cocktail-details").innerHTML = "";
  location.reload();
});

// Initial cocktail fetch
fetchRandomCocktail();