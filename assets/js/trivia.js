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

function checkChoice() {
    var userInput = $(":checked")[0].labels[0].innerText;
    console.log("checked:", userInput);
    console.log("correct answer", questions[0].correct_answer)
    //determine if correct 
    //out of time
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
    if (userInput === questions[0].correct_answer) {
        roundScore++;
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

$('#launch-button').click(function (e) {
    e.preventDefault();
    countdown.start();
});

$('#results-button').click(function (e) {
    e.preventDefault();

    //////get new questions getQuestions()
    getQuestions();
    ////// setQuestion()
    setQuestion();
    countdown.start();
});

//transition button back to submit
//out of time logic
//add gifs

