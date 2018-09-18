$( document ).ready(function() {

// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<div class='card'> <div class='card-header'> "  + data[i].headline + "</div> <div class='card-body'> <p class='card-text'>" + data[i].summary + "<br />" + data[i].link + "</p><button type='button' class='btn btn-dark commentBtn' data-toggle='modal' data-target='#commentModal' data-id ='" + data[i]._id + "'>Comment</button></div>");
  }
  $(".commentBtn").click(function(event) {
    event.preventDefault();
    $("#commentTitle").empty();
    $("#commentHeadline").empty();
    $("#commentBody").empty();
    $("#commentSave").empty();
    // Save the id from the p tag
    var thisId = $(this).attr("data-id");
    console.log("clicked")
    console.log(thisId);
    // Now make an ajax call for the Article
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      // With that done, add the note information to the page
      .then(function(data) {
        console.log(data);
        // The title of the article
        $("#commentHeadline").append("<h2>" + data.headline + "</h2>");
        // An input to enter a new title
        $("#commentTitle").append("<input type='text' class='form-control' id='titleinput' name='title' >");
        // A textarea to add a new note body
        $("#commentBody").append("<textarea class='form-control' id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $("#commentSave").append("<button type='button' class='btn btn-dark' data-id='" + data._id + "' id='savenote'>Save Comment</button>");
  
        // If there's a note in the article
        if (data.note) {
          // Place the title of the note in the title input
          $("#titleinput").val(data.note.title);
          // Place the body of the note in the body textarea
          $("#bodyinput").val(data.note.body);
        }
      });
  });
});

$("#scraper").click(function(event) {
  event.preventDefault();
  $.get("/scrape").then(function(data) {
    console.log("pressed");  
    console.log(data);
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});

});