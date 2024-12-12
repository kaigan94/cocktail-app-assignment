import { mapRawCocktailData } from './utilities.js';

const startPage = document.querySelector("#start-page");
const seeMorePage = document.querySelector("#details-page");
const searchPage = document.querySelector("#search-page");

// Random cocktail API
fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
  .then((response) => {
    if (response.ok) {
      return response.json(); // Konvertera till JSON
    } else {
      throw new Error("Error");
    }
  })
  .then((data) => {   
    console.log(data); // Skriv ut den hämtade datan
    displayCocktail(data); // Skicka datan för att visa drinken
  })
  .catch((error) => console.error("Fetch Error:", error)); // Felhantering

function displayCocktail(data) {
  const cocktail = data.drinks[0]; // Plocka första drinken från den hämtade datan
  const cocktailDiv = document.getElementById("cocktail"); // Hämta div:en från min html med id:t cocktail

  const cocktailName = cocktail.strDrink; // Hämta namnet på drinken
  const heading = document.createElement("h1");
  heading.innerHTML = cocktailName; // Sätt namnet på drinken som innehåll i h1
  cocktailDiv.appendChild(heading); // Lägg till h1 i div:en

  const cocktailImg = document.createElement("img"); // Skapa en bild-element
  cocktailImg.src = cocktail.strDrinkThumb; // Sätt bildens källa till bildens URL
  cocktailDiv.appendChild(cocktailImg); // Lägg till bilden i div:en
}

// Hämta knappen som genererar en ny drink
const button = document.getElementById("new-cocktail");

// Lägg till en eventlyssnare för knappen
button.addEventListener("click", function () {
  document.getElementById("cocktail").innerHTML = ""; // Rensa innehållet i div:en

  // Hämta en ny slumpmässig cocktail från API:et
  fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then(function (response) {
      return response.json(); // Om svaret är OK, konvertera till JSON
    })
    .then(function (data) {
      displayCocktail(data); // Skicka den nya datan till displayCocktail
    })
    .catch(function (error) {
      console.error("Fetch Error:", error); // Hantera fel
    });
});

// "See more" details
document.getElementById("details-link").addEventListener("click", () => {
  const cocktail = document.querySelector("#cocktail h1").innerText; // Hämta namnet på den aktuella drinken

  // Gör en sökning för att hitta detaljer om den cocktailen via API:et
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
    .then((response) => response.json()) // Om OK, konvertera till JSON
    .then((data) => {
      const cocktailDetails = mapRawCocktailData(data.drinks[0]); // Använd den importerade funktionen för att strukturera data
      displayCocktailDetails(cocktailDetails); // Visa detaljer om drinken
      linkClick("details-link"); // Byt till "See More"-sidan
    })
    .catch((error) => console.error("Fetch Error:", error)); // Hantera fel
});

// Hämta knappen för "Search"
document.getElementById("search-link").addEventListener("click", () => {
  // Visa bara "Search"-sidan, utan att öppna "See More"-detaljer
  linkClick("search-link"); 
  // Eventuellt här kan du lägga till sökfunktionalitet
});

// Funktion för att byta mellan sidor
function linkClick(id) {
  // Denna funktion byter mellan sidor baserat på knappen som trycks
  if (id === "start-link") {
    startPage.classList.add("open"); // Visa startsidan
    seeMorePage.classList.remove("open"); // Dölj "See More"-sidan
    searchPage.classList.remove("open"); // Dölj söksidan
  }
  if (id === "search-link") {
    searchPage.classList.add("open"); // Visa söksidan
    startPage.classList.remove("open"); // Dölj startsidan
    seeMorePage.classList.remove("open"); // Dölj "See More"-sidan
  }
  if (id === "details-link") {
    seeMorePage.classList.add("open"); // Visa "See More"-sidan
    startPage.classList.remove("open"); // Dölj startsidan
    searchPage.classList.remove("open"); // Dölj söksidan
  }
}

// När användaren trycker på "See More"-knappen
document.getElementById("details-link").addEventListener("click", () => {
  const cocktail = document.querySelector("#cocktail h1").innerText; // Hämta namnet på den aktuella drinken

  // Gör en sökning för att hitta detaljer om den cocktailen via API:et
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${cocktail}`)
    .then((response) => response.json()) // Om OK, konvertera till JSON
    .then((data) => {
      const cocktailDetails = mapRawCocktailData(data.drinks[0]); // Använd funktionen från utilities.js för att strukturera data
      displayCocktailDetails(cocktailDetails); // Visa detaljer om drinken på "See More"-sidan
      linkClick("details-link"); // Byt till "See More"-sidan
    })
    .catch((error) => console.error("Fetch Error:", error)); // Hantera fel
});

// Eventlyssnare för "Search"-knappen
document.getElementById("search-link").addEventListener("click", () => {
  linkClick("search-link"); // Byt till "Search"-sidan
});

// Eventlyssnare för "Home"-knappen
document.getElementById("start-link").addEventListener("click", () => {
  linkClick("start-link"); // Byt till "Home"-sidan
});
// Funktion för att visa detaljer om en cocktail (på "See More"-sidan)
function displayCocktailDetails(cocktail) {
  const detailsDiv = document.getElementById("cocktail-details"); // Hämta div för att visa detaljer

  // Sätt upp detaljer om drinken
  detailsDiv.innerHTML = `
    <h2>${cocktail.name}</h2> <!-- Visa cocktailens namn -->
    <img src="${cocktail.thumbnail}" alt="${cocktail.name}" /> <!-- Visa cocktailens bild -->
    <p><strong>Category:</strong> ${cocktail.category}</p> <!-- Visa kategori -->
    <p><strong>Alcoholic:</strong> ${cocktail.alcoholic ? "Yes" : "No"}</p> <!-- Visa om den är alkoholhaltig -->
    <p><strong>Glass:</strong> ${cocktail.glass}</p> <!-- Visa glaset -->
    <p><strong>Instructions:</strong> ${cocktail.instructions}</p> <!-- Visa instruktioner -->
    <ul>
      <strong>Ingredients:</strong>
      ${cocktail.ingredients
        .map(
          (item) => `<li>${item.measure || ""} ${item.ingredient}</li>` // Lista ingredienser
        )
        .join("")}
    </ul>
  `;
}
