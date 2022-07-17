const searchBtn = document.getElementById("search-btn");
const mealList = document.getElementById("meal");
const mealDetailsContent = document.querySelector(".meal-details-content");
const recipeCloseBtn = document.getElementById("recipe-close-btn");
let html;
// const recipeCloseBtn = document.querySelector('');

//event listener
searchBtn.addEventListener("click", getMealList);
mealList.addEventListener("click", getDrinkRecipe);
// recipeCloseBtn.addEventListener('onclick', () => {
//     mealDetailsContent.parentElement.classList.remove('showRecipe');
// });

if (recipeCloseBtn)
  recipeCloseBtn.onclick = (e) => {
    mealDetailsContent.parentElement.classList.remove("showRecipe");
  };

//get meal list that search with the ingredients
function getMealList() {
  let searchInputTxt = document.getElementById("search-input").value.trim();
  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchInputTxt}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let html = "";
      if (data.drinks) {
        data.drinks.forEach((drink) => {
          html += `
                <div class="meal-item" data-id="${drink.idDrink}">
                   <div class="meal-img">
                     <img src="${drink.strDrinkThumb}" alt="Food" />
                  </div>
                  <div class="meal-name">
                     <h3>${drink.strDrink}</h3>
                     <a href="#" class=
                     "recipe-btn"> Get Recipe</a>
                  </div>
                 </div>
             `;
        });
        mealList.classList.remove("notFound");
      } else {
        html = "Sorry, could you check your cocktail input!";
        mealList.classList.add("notFound");
      }

      mealList.innerHTML = html;
    });
  // console.log(searchInputTx.length);
}

//get recipe of the meal
function getDrinkRecipe(e) {
  e.preventDefault();
  if (e.target.classList.contains("recipe-btn")) {
    let drinkItem = e.target.parentElement.parentElement;
    // console.log(parseInt(drinkItem.dataset.id));
    fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkItem.dataset.id}`
    )
      .then((response) => response.json())
      .then((data) => drinkRecipeModal(data.drinks));
  }
}

// create a modal

function drinkRecipeModal(drink) {
  // console.log(drink);
  const ingredientList = [];
  const drinkIngredientKeys = Object.keys(drink);

  // drink.filter(ingredient => ingredient.)
  drink.map((ingredients) => {
    let newObject;
    newObject = { ...ingredients };
    const allIngredientKeys = Object.keys(newObject).filter((key) =>
      key.includes("strIngredient")
    );

    const result = allIngredientKeys.map((value) => {
      if (newObject[value] !== null) return newObject[value];
    });

    const filteredResult = result.filter((item) => item !== undefined);

    // console.log(nonNullableIngredientProps);
    html = `
          <h2 class="recipe-title">${ingredients.strDrink}</h2>
          <p class="recipe-category">${ingredients.strAlcoholic}</p>
          <div class="recipe-intruct">
          <h3>Instructions</h3>
          <p>${ingredients.strInstructions}</p>
          </div>
          <h3>Ingredients</h3>
          <div class="recipe-intruct">
          <p>${filteredResult.map((res) => {
            return res;
          })} </p>
          </div>
          <div class="recipe-meal-img">
          <img src="${ingredients.strDrinkThumb}" alt="">
          </div>
          <div class="recipe-link">
          ${ingredients.strGlass}
          </div>
  
      `;
  });
  mealDetailsContent.innerHTML = html;
  mealDetailsContent.parentElement.classList.add("showRecipe");
}
