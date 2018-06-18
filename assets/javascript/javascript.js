$(document).ready(function()
{
     // Initial array of foods
      var foods = ["cheeseburgers", "cake"];

      var favArray = [];
      var firstTime = true;
      var valid = "abcdefghijklmnopqrstuvwxyz";

      // displayFoodInfo function re-renders the HTML to display the appropriate content
      function displayFoodInfo() 
      {
        var food = $(this).attr("data-name");
        var queryURL = "https://api.giphy.com/v1/gifs/search?q=" +
        food + "&api_key=yCyV2ynWSh8G8J9AU8zCDfxSurChUHeL&limit=10";
        
        console.log("In Displaying the food");

        // Clear out last gifs
        $("#food-view").empty();

        // Creating an AJAX call for the specific food button being clicked
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {

          console.log(response);
          var results = response.data;

          for (var i = 0; i < results.length; i++)
          {
            // Creating and storing div tag
            var foodDiv = $("<div class='food-container'>");

            // Storing the Title
            title = titleCase(results[i].title);

            // Remove "GIF"
            var title = title.replace(/Gif/g,'');

            console.log("new title ", title);

            // Creating an element to have the Title displayed
            var pOne = $("<p>").text(title);

            // Displaying the Title
            foodDiv.append(pOne);

            // Creating an element to have the rating displayed
            var pOne = $("<p>").text("Rating: " + results[i].rating);

            // Displaying the rating
            foodDiv.append(pOne);

            // Creating and storing the image tag
            var foodImage = $("<img>");

            var still = results[i].images.fixed_height_still.url; 
            var animate = results[i].images.fixed_height.url;

            // Add still and moving gif tags.  We'll swap between the two
            foodImage.attr("data-still", still);
            foodImage.attr("data-animate", animate);
            foodImage.attr("data-state", "still");

            // Creating an element to hold the image and initialize to not move
            foodImage.attr("src", still);;

            // Adding attribute and buttons so we can start and stop this puppy
            foodImage.attr("fooddata", i);
            foodImage.addClass("foodgif");


            // Appending the image 
            foodDiv.append(foodImage);

            // Displaying the image
            $("#food-view").append(foodDiv);
          } // Loop end

          $("#food-view").append("</div>");
        });

      }

      // (NOTE: Pay attention to the unusual syntax here for the click event.
      // Because we are creating click events on "dynamic" content, we can't just use the usual "on" "click" syntax.)
      $(document).on("click", ".foodgif", function() 
      {
        // Get the number of the button from its data attribute and hold in a variable called  toDoNumber.
        // var foodNumber = $(this).attr("fooddata");

        console.log("clicked on the image")

        // See if this thing is moving or not
        var state = $(this).attr("data-state");

        // If the clicked image's state is still, update its src attribute to what its data-animate value is.
        // Then, set the image's data-state to animate
        // Else set src to the data-still value
        if (state === "still") 
        {
          $(this).attr("src", $(this).attr("data-animate"));
          $(this).attr("data-state", "animate");
        } 
        else 
        {
          $(this).attr("src", $(this).attr("data-still"));
          $(this).attr("data-state", "still");
        }

       });

      // Function for displaying food data
      function renderButtons() {

        // Deleting the food prior to adding new food
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();
        $("#fav-view").empty();

        // Check our favorites before rendering the buttons
        favArray = JSON.parse(localStorage.getItem("favlist"));

        if (firstTime && Array.isArray(favArray)) {
            // We have favorites.  If there's something there, we'll kill our priming buttons
            if (favArray.length > 0)
                foods = [];

            firstTime = false;
        }
        // Looping through the array of foods
        for (var i = 0; i < foods.length; i++) {
          // Then dynamicaly generating buttons for each food in the array
          // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
          var a = $("<button>");
          // Adding a class of movie-btn to our button
          a.addClass("food-btn");
          // Adding a data-attribute
          a.attr("data-name", foods[i]);
          // Providing the initial button text
          a.text(foods[i]);
          // Adding the button to the buttons-view div
          $("#buttons-view").append(a);
        }

        console.log("fav array ", favArray)

        if (!Array.isArray(favArray)) {
            // Nothing here yet
            favArray = [];
        }
        else
        {
            // Looping through the favorite array of foods
            for (var i = 0; i < favArray.length; i++) 
            {
                console.log("rendering fav array");
                // Then dynamicaly generating buttons for each food in the array
                // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
                var a = $("<button>");
                // Adding a class of movie-btn to our button
                a.addClass("food-btn");
                // Adding a data-attribute
                a.attr("data-name", favArray[i]);
                // Providing the initial button text
                a.text(favArray[i]);
                // Adding the button to the buttons-view div
                $("#fav-view").append(a);
            }
        }
      }

      // This function handles when the add food button is clicked
      $("#add-food").on("click", function(event) 
      {
        event.preventDefault();

        $("#error").empty();

        // This line grabs the input from the textbox
        var food = $("#food-input").val().trim();

        food = food.toLowerCase(food);
        console.log("food", food);

        // Pulling out my spaces so that I can test if they only enter characters
        var testit = food.replace(/\s/g, '')

        // Has to have only characters to be valid
        // Yes, it's a regular expression.  Pulled this from stack overflow, but I know how to use them
        // This says if all the characters are in the range from a-z
        if (!/^[a-z]+$/.test(testit)) {
            console.log("not valid");
            return;
        }


        // Check to make sure it's not already there
        if (foods.indexOf(food) == -1)
        {
            {  // Check if it's already in the fav food array
            favArray = JSON.parse(localStorage.getItem("favlist"));

            if (favArray.indexOf(food) != -1)
                // It's already here - don't let them add again
                return;
            }

            // Adding food from the textbox to our array
            foods.push(food);

            // Calling renderButtons which handles the processing of our food array
            renderButtons();
        }
        else
            $("#error").text("Entry is already there.");

      });

      // This function handles when the remove food button is clicked
      $("#remove-food").on("click", function(event) 
      {
        event.preventDefault();
        var x;

        $("#error").empty();

        // This line grabs the input from the textbox
        var food = $("#food-input").val().trim();

        food = food.toLowerCase(food);
        
        x = foods.indexOf(food);

        if (x == -1)
        {
            // Not in standard array - look now in favorite array
            favArray = JSON.parse(localStorage.getItem("favlist"));
            x = favArray.indexOf(food);

            if (x == -1)
            {
                $("#error").text("Entry is not found");
                return;
            }

            favArray.splice(x, 1);
            localStorage.setItem("favlist", JSON.stringify(favArray));
        }
        else
        {   // In standard array
            console.log("want to remove this one ", food, "array element - ", x);

            // Remove from the array
            foods.splice(x, 1);
        }

         // Re-show the buttons
         renderButtons();
        });

        // This function handles when the add to favorites food button is clicked
        $("#fav-food").on("click", function(event) 
        {
            event.preventDefault();
            var x;
    
            $("#error").empty();
    
            // This line grabs the input from the textbox
            var food = $("#food-input").val().trim();

            food = food.toLowerCase(food);

            // Pulling out my spaces so that I can test if they only enter characters
            var testit = food.replace(/\s/g, '')

            // Has to have only characters to be valid
            // Yes, it's a regular expression.  Pulled this from stack overflow, but I know how to use them
            // This says if all the character is in the range from a-z
            if (!/^[a-z]+$/.test(testit)) 
            {
                console.log("not valid");
                return;
            }

            food = food.toLowerCase(food);
            
            x = foods.indexOf(food);
    
            if (x != -1)
            {  // Exists.  Need to remove from the other array
                foods.splice(x, 1);
            }
            else
            {  // Check if it's already in the fav food array
                favArray = JSON.parse(localStorage.getItem("favlist"));

                if (favArray.indexOf(food) != -1)
                    // It's already here - don't let them add again
                    return;
            }

            favArray.push(food);
            localStorage.setItem("favlist", JSON.stringify(favArray));

            // Re-show the buttons
            renderButtons();
        });

        // Pulled this from this site: https://medium.freecodecamp.org/three-ways-to-title-case-a-sentence-in-javascript-676a9175eb27
        function titleCase(str) {
            // Step 1. Lowercase the string
            str = str.toLowerCase();
            // str = "I'm a little tea pot".toLowerCase();
            // str = "i'm a little tea pot";
            
            // Step 2. Split the string into an array of strings
            str = str.split(' ');
            // str = "i'm a little tea pot".split(' ');
            // str = ["i'm", "a", "little", "tea", "pot"];
            
            // Step 3. Create the FOR loop
            for (var i = 0; i < str.length; i++) {
              str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1); 
            }
            
            // Step 4. Return the output
            return str.join(' '); // ["I'm", "A", "Little", "Tea", "Pot"].join(' ') => "I'm A Little Tea Pot"
          }


      // Adding a click event listener to all elements with a class of "food-btn"
      // This will change the gifs
      $(document).on("click", ".food-btn", displayFoodInfo);

      // Calling the renderButtons function to display the intial buttons
      renderButtons();
});