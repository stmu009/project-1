questions = [{}];

//create a list of categories
categories = [{
        id: 12,
        categoryName: 'music',
        difficulty: 'easy',
    }, {
        id: 10,
        categoryName: 'books',
        difficulty: 'any',
    }, {
        id: 19,
        categoryName: 'math',
        difficulty: 'easy',
    }, {
        id: 9,
        categoryName: 'general knowledge',
        difficulty: 'any',
    }, {
        id: 11,
        categoryName: 'film',
        difficulty: 'any',
    }, {
        id: 14,
        categoryName: 'television',
        difficulty: 'easy',
    }

]

roundScore = 0;

var amount = 5;
var category = 15;
var difficulty = 'easy';

function setCategory() {
    console.log(categories);
    randomCategory = categories[Math.floor(Math.random() * categories.length)]
    console.log("randomCategory:", randomCategory)
    category = randomCategory.id;
    difficulty = randomCategory.difficulty;

};


//connect to api and get results
function getQuestions() {
    setCategory();
    var difficultString = "&difficulty=" + difficulty;
    if (difficulty === 'any') {
        difficultString = ''
    }
    url = "https://opentdb.com/api.php?amount=" +
        amount + "&category=" +
        category + difficultString + "&type=multiple";
    console.log("url:", url)
    $.ajax({
        type: "GET",
        url: url,
        success: function (response) {
            questions = response.results;

            console.log("questions", questions)
            
            setQuestion();



        }
    })
}

function setQuestion() {
    //show the questions based on random category from list of categories
    addQuestion();
    //show the choices
    addChoices();
    //check choice
    // $('#submit-choice').addClass('btn-primary');
    // $('#submit-choice').removeClass('btn-success');
    // $('#submit-choice').removeClass('btn-danger');
    // $('#submit-choice').removeClass('btn-warning');
}

function addQuestion() {
    $("#question-div").html(questions[0].question)
}

function addChoices() {

    choices = [...questions[0].incorrect_answers];
    choices.push(questions[0].correct_answer);
    choices.sort(() => Math.random() - 0.5);
    console.log("chocies", choices)
    $.each(choices, (index, value) => {
        console.log("index:", index)
        console.log("value:", value)
        console.log("choice0:", $("#choice0"))
        $("#choice" + index).html(value);
    });
}
function nextQuestion() {
        showSubmit();
        if (questions.length === 0) {
            //set a new category setCategory()
            setCategory();
            console.warn("category:", randomCategory.categoryName)
            $('#results-modal').modal('show');
        } else {
            console.log("questions after slice", questions)
            setQuestion();
            //restart the counter
            countdown.reset();
            countdown.start();
        }
    }

function checkChoice() {
    var userInput = $(":checked")[0].labels[0].innerText;
    console.log("checked:", userInput);
    console.log("correct answer", questions[0].correct_answer)
    //determine if correct 
    //out of time
    
    if (userInput === questions[0].correct_answer) {
        roundScore++;
        newUser.score = roundScore;
        myFirebase.ref().push(newUser)
        console.log("Correct Answer")
        showCorrect();
        //next question if not the end
        questions.splice(0, 1)
        //if out of questions then round results
        setTimeout(nextQuestion, 2000);
        
    } else {
        console.log("Not correct Answer")
        showIncorrect()
        //next question if not the end
        questions.splice(0, 1)
        setTimeout(nextQuestion, 2000);
    }
}

//change button color to tell if correct, incorrect, or out time
function showCorrect() {
    $('#submit-choice').text('Correct!');
    $('#submit-choice').removeClass('btn-primary');
    $('#submit-choice').addClass('btn-success');
    
}
function showIncorrect(){
    $('#submit-choice').text('Wrong!');
    $('#submit-choice').removeClass('btn-primary');
    $('#submit-choice').addClass('btn-danger');
}
function showOutOfTime(){
    $('#submit-choice').text('Out of time!');
    $('#submit-choice').removeClass('btn-primary');
    $('#submit-choice').addClass('btn-warning');

}
function showSubmit(){
    $('#submit-choice').text('Submit');
    $('#submit-choice').removeClass('btn-danger btn-warning btn-success');
    $('#submit-choice').addClass('btn-primary');

}

$('body').on('click', '#submit-choice', function (e) {
    e.preventDefault();
    countdown.reset();
    checkChoice();
});
//show modal to start the game
$(window).on('load', function () {
    $('#modelId').modal('show');
});

getQuestions();

newUser = {
    username: usernameInput.value,
    score: roundScore
}

$('#launch-button').click(function (e) {
    e.preventDefault();
    countdown.start();
    
    newUser.username = usernameInput.value
    myFirebase.ref().push(newUser)
});

$('#results-button').click(function (e) {
    e.preventDefault();

    //////get new questions getQuestions()
    getQuestions();
    ////// setQuestion()
    setQuestion();
    countdown.start();
});

var startListeningScores = function () {
    myFirebase.on("value", function (snapshot) {
      var userObject = snapshot.val();
    var marquee = $('<marquee beahviour="scroll" direction="left"></marquee>')
    console.log('marquee', marquee);
      for (const key in userObject) {
          if (userObject.hasOwnProperty(key)) {
              const element = userObject[key];
              var span = $('<span>')
              span.text(`${element.username}: ${element.score}pts;   `)
              $(marquee).append(span);              
          }
      }
      $('#mq-section').html(marquee)
    //   console.log("childSnapshot", childSnapshot);
  
    //   var msgUsernameElement = document.createElement("b");
    //   msgUsernameElement.textContent = msg.username;
  
    //   var msgTextElement = document.createElement("p");
    //   msgTextElement.textContent = msg.text;
    //   msgTextElement.className = "mb-1";
  
    //   var msgElement = document.createElement("div");
    //   msgElement.appendChild(msgUsernameElement);
    //   msgElement.appendChild(msgTextElement);
  
    //   msgElement.className = "msg list-group-item align-items-start";
    //   var results = document.getElementById("results");
    //   results.insertBefore(msgElement, results.firstChild);
    });
  };
  
  // Begin listening for data
  startListeningScores();

//transition button back to submit
//out of time logic
//add gifs

