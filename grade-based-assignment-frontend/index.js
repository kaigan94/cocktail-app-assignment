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
}

// Funktion för att hämta cocktaildata baserat på användarens sökfråga
async function searchCocktails(cocktailName) {
  try {
    // Gör en fetch-request för att söka efter en cocktail med användarens namn
    const response = await fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktailName}`);
    const data = await response.json(); // Konvertera svaret till JSON
    if (data.drinks) {
      displaySearchResults(data.drinks); // Visa sökresultaten om några cocktails hittades
    } else {
      displayNoResults(); // Visa ett meddelande om inga resultat hittades
    }
  } catch (error) {
    console.error("Fetch Error:", error); // Logga eventuella fel
  }
}

// Funktion för att visa sökresultaten som en lista
function displaySearchResults(cocktails) {
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = ""; // Rensa tidigare resultat

  cocktails.forEach(cocktail => {
    const cocktailItem = document.createElement("li");
    cocktailItem.innerText = cocktail.strDrink; // Namnet på cocktailen
    cocktailItem.addEventListener("click", () => {
      fetchCocktailDetails(cocktail.strDrink); // Hämta detaljer för den valda cocktailen
      switchPage("details"); // Byt till detaljsidan
    });
    resultsDiv.appendChild(cocktailItem); // Lägg till cocktailen i listan
  });
}

// Funktion för att visa ett meddelande om inga resultat hittades
function displayNoResults() {
  const resultsDiv = document.getElementById("search-results");
  resultsDiv.innerHTML = "<li>No cocktails found.</li>";
}

// Event listener för att hantera sökknappen och formuläret
document.getElementById("search-form").addEventListener("submit", (event) => {
  event.preventDefault(); // Förhindra att formuläret skickas på traditionellt sätt
  const searchQuery = document.getElementById("search-input").value.trim(); // Hämta sökfrågan
  if (searchQuery) {
    searchCocktails(searchQuery); // Sök efter cocktails med det namnet
  }
});

// Byta till söksidan när användaren klickar på "search-link"
document.getElementById("search-link").addEventListener("click", () => switchPage("search"));

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
