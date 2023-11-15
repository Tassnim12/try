var searchBtn = document.getElementById('searchbtn');
var mealList = document.getElementById('meal');
var mealDetailsContent = document.querySelector('.mealdetails_content');
var recipeCloseBtn = document.getElementById('recclose_btn');

// event listeners
searchBtn.addEventListener('click', getMealList);
mealList.addEventListener('click', getMealRecipe);
recipeCloseBtn.addEventListener('click', () => {
    mealDetailsContent.parentElement.classList.remove('showRecipe');
});


// get meal list that matches with the ingredients
function getMealList(){
    let searchInputTxt = document.getElementById('searchinput').value.trim();
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchInputTxt}`)
    
    .then(response => response.json())
    .then(data => {
        let html = "";
        if(data.meals){
            data.meals.forEach(meal => {
                html += `
                    <div class = "mealitem" data-id = "${meal.idMeal}">
                        <div class = "mealimg">
                            <img src = "${meal.strMealThumb}" alt = "food">
                        </div>
                        <div class = "mealname">
                            <h3>${meal.strMeal}</h3>
                            <a href = "#" class = "recbtn">Get Recipe</a>
                        </div>
                    </div>
                `;
            });
            mealList.classList.remove('notFound');
        } else{
            html = "Sorry, we didn't find any meal!";
            mealList.classList.add('notFound');
        }

        mealList.innerHTML = html;
    });
}


// get recipe of the meal
function getMealRecipe(mealdata){
    mealdata.preventDefault();
    if(mealdata.target.classList.contains('recbtn')){
        var mealItem = mealdata.target.parentElement.parentElement;
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
        .then(response => response.json())
        .then(data => {
            var mealDetails = data.meals[0];
            mealRecipeModal(mealDetails);
        });
    }
}

// create a modal
function mealRecipeModal(meal){
    let html = `
        <h1 class="rectitle">${meal.strMeal}</h1>
        <h2 class="recarea">${meal.strArea}</h2>
        <br>
        <p class="reccategory">${meal.strCategory}</p>
        <div class="recmeal_img">
            <img src="${meal.strMealThumb}">
        </div>
        <div class="recingredients">
            <h3>Ingredients:</h3>
            <ul>
            ${generateIngredientsList(meal)}
        </ul>
        </div>  
        <div class="recinstruct">
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        </div>
        <div class="reclink">
            <a href="${meal.strYoutube}" target="_blank">Watch Video</a>
        </div>
    `;
    mealDetailsContent.innerHTML = html;
    mealDetailsContent.parentElement.classList.add('showRecipe');
    // Add event listener to the "Add to Wishlist" button
    const addToWishlistButton = document.querySelector('.addToWishlist');
    addToWishlistButton.addEventListener('click', () => {
        const mealId = addToWishlistButton.dataset.id;
        const mealToAdd = {idMeal: mealId, strMeal: meal.strMeal};
        addToWishlist(mealToAdd);
    });
}

function generateIngredientsList(meal) {
    let ingredientsList = '';
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal['strIngredient' + i];
        const measure = meal['strMeasure' + i];
        if (ingredient && measure) {
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        }
    }
    return ingredientsList;
}