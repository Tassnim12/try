const { app, BrowserWindow } = require('electron');
const fs = require('fs')
const path = require('path')

// CRUD operations
var btnCreate = document.getElementById('btnCreate');
var btnRead = document.getElementById('btnRead');
var btnUpdate = document.getElementById('btnUpdate');
var btnDelete = document.getElementById('btnDelete');
var date = document.getElementById('date');
var mealType = document.getElementById('mealType');
var recipeName = document.getElementById('recipeName');
var recipeContents = document.getElementById('recipeContents');

let pathName = path.join(__dirname, 'Files');

btnCreate.addEventListener('click', function(){ 
    let mealTypeValue = mealType.value;
    let recipeNameValue = recipeName.value;
    let dateValue = date.value; // Get the value of the date input

    let file = path.join(pathName, dateValue, recipeNameValue + '.txt'); // Include date in the file path

    // Fetch meal data based on mealType
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealTypeValue}`)
    .then(response => response.json())
    .then(data => {
        const mealData = data.meals[0];
        let contents = `Meal Name: ${mealData.strMeal}\nInstructions: ${mealData.strInstructions}\nDate: ${dateValue}`; // Add date to contents

        fs.writeFile(file, contents, function(err){ 
            if(err){
                return console.log(err);
            }
            var txtfile = recipeNameValue;
            alert(txtfile + " recipe file was created");
            console.log("The file was created");
        });
    })
    .catch(error => {
        console.error('Error fetching meal data:', error);
        alert('Error fetching meal data. Please try again.');
    });
});

btnRead.addEventListener('click', function(){ //read contents of the created text file
    let recipeNameValue = recipeName.value;
    let file = path.join(pathName, recipeNameValue + '.txt'); // Change file extension to .txt

    fs.readFile(file, 'utf8', function(err, data){ 
        if(err){
            return console.log(err);
        }

        let contents = data; // Set contents to the data read from the file
        recipeContents.value = contents; // Update the textarea with the recipe contents

        console.log("File contents:", data);
        let jsonData = JSON.parse(data);
        console.log("Parsed JSON data:", jsonData);

        // Now you have the meal data in jsonData, and you can access its properties like 'strInstructions', etc.
    });
});


btnDelete.addEventListener('click', function(){ 
    let file = path.join(pathName, recipeName.value)
    
    fs.unlink(file, function(err){ 
        if(err){
            return console.log(err);
        }
        recipeName.value = "";
        recipeContents.value = "";
        console.log("The file was deleted!");
        alert("File "+ file+" has been deleted");
    })
});

btnUpdate.addEventListener('click', function(){ 
    let file = path.join(pathName, recipeName.value + '.txt'); // Add file extension

    let contents = recipeContents.value; // Get the updated content from the textarea

    fs.writeFile(file, contents, function(err){ 
        if(err){
            return console.log(err);
        }
        var txtfile = document.getElementById("recipeName").value;
        alert(txtfile + " recipe file was updated");
        console.log("The file was updated!");
        recipeName.value = "";
        recipeContents.value = "";
    });
});




