var usernameInput = document.querySelector("#username");
var textInput = document.querySelector("#text");
var postButton = document.querySelector("#post");

postButton.addEventListener("click", function (e) {
  e.preventDefault();
  var msgUser = usernameInput.value;
  var msgText = textInput.value;
  myFirebase.push({
    username: msgUser,
    text: msgText
  });
  textInput.value = "";
});

/** Function to add a data listener **/
var startListening = function () {
  myFirebase.on("child_added", function (snapshot) {
    var msg = snapshot.val();

    var msgUsernameElement = document.createElement("b");
    msgUsernameElement.textContent = msg.username;

    var msgTextElement = document.createElement("p");
    msgTextElement.textContent = msg.text;

    var msgElement = document.createElement("div");
    msgElement.appendChild(msgUsernameElement);
    msgElement.appendChild(msgTextElement);

    msgElement.className = "msg";
    var results = document.getElementById("results");
    results.insertBefore(msgElement, results.firstChild);
  });
};

// Begin listening for data
startListening();