$(document).ready(function()
{
     // Initial array of foods
      var foods = ["Cheeseburgers", "Cake"];

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

            // Storing the rating data
            var rating = response.Rated;

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

      // When a user clicks a check box then delete the specific content
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

        // Deleting the movies prior to adding new movies
        // (this is necessary otherwise you will have repeat buttons)
        $("#buttons-view").empty();

        // Looping through the array of movies
        for (var i = 0; i < foods.length; i++) {

          // Then dynamicaly generating buttons for each movie in the array
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
      }

      // This function handles events where a food button is clicked
      $("#add-food").on("click", function(event) {
        event.preventDefault();
        // This line grabs the input from the textbox
        var food = $("#food-input").val().trim();

        // Adding movie from the textbox to our array
        foods.push(food);

        // Calling renderButtons which handles the processing of our movie array
        renderButtons();
      });

      // Adding a click event listener to all elements with a class of "food-btn"
      // This will change the gifs
      $(document).on("click", ".food-btn", displayFoodInfo);

      // Calling the renderButtons function to display the intial buttons
      renderButtons();
});