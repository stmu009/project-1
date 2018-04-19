//get the name
var usernameInput = document.querySelector("#username");
var textInputOriginal = document.querySelector("#text");
var postButton = document.querySelector("#post");
var textInput = document.querySelector("#text-in-results");
var postButtonInResults = document.querySelector("#post-in-results");

postButton.addEventListener("click", function (e) {
  e.preventDefault();
  //hook up name to database
  var msgUser = usernameInput.value;
  var msgText = textInputOriginal.value;
  myFirebaseMessages.push({
    username: msgUser,
    text: msgText
  });
  textInput.value = "";
});

postButtonInResults.addEventListener("click", function (e) {
  e.preventDefault();
  //hook up name to database
  var msgUser = usernameInput.value;
  var msgText = textInput.value;
  myFirebaseMessages.push({
    username: msgUser,
    text: msgText
  });
  textInput.value = "";
});

/** Function to add a data listener **/
var startListening = function () {
  myFirebaseMessages.on("child_added", function (snapshot) {
    var msg = snapshot.val();

    var msgUsernameElement = document.createElement("b");
    msgUsernameElement.textContent = msg.username;

    var msgTextElement = document.createElement("p");
    msgTextElement.textContent = msg.text;
    msgTextElement.className = "mb-1";

    var msgElement = document.createElement("div");
    msgElement.appendChild(msgUsernameElement);
    msgElement.appendChild(msgTextElement);

    msgElement.className = "msg list-group-item align-items-start";
    console.log("msgElement", msgElement);
    var messages = document.getElementById("messages");
    messages.insertBefore(msgElement, messages.firstChild);
  });
};

// Begin listening for data
startListening();

var secondListen = function () {
  myFirebaseMessages.on("child_added", function (snapshot) {
    var msg = snapshot.val();

    var msgUsernameElement = document.createElement("b");
    msgUsernameElement.textContent = msg.username;

    var msgTextElement = document.createElement("p");
    msgTextElement.textContent = msg.text;
    msgTextElement.className = "mb-1";

    var msgElement = document.createElement("div");
    msgElement.appendChild(msgUsernameElement);
    msgElement.appendChild(msgTextElement);

    msgElement.className = "msg list-group-item align-items-start";
    console.log("msgElement", msgElement);
    var messagesInResults = document.getElementById("messages-in-results");
    messagesInResults.insertBefore(msgElement, messagesInResults.firstChild);
  });
};

secondListen();
