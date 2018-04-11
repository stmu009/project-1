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
            
            $('#submit-choice').click(function (e) { 
                e.preventDefault();
                checkChoice();
            });
            
        }
    })
}

function setQuestion(){
    //show the questions based on random category from list of categories
    addQuestion();
    //show the choices
    addChoices();
    //check choice
    
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

function checkChoice(){
    var userInput = $(":checked")[0].labels[0].innerText;
    console.log("checked:", userInput);
    console.log("correct answer", questions[0].correct_answer)
    //determine if correct 
    //out of time
    if (userInput === questions[0].correct_answer)
    {
        roundScore++;
        console.log("Correct Answer")
        //next question if not the end
        questions.splice(0,1)
        console.log("questions after slice", questions)
        setQuestion();
    }
    else
    {
        console.log("Not correct Answer")
        //next question if not the end
        questions.splice(0,1)
        console.log("questions after slice", questions)
        setQuestion();
    }
}

getQuestions();

//modal to tell if correct, 3 second timer to next question
//add gifs

//end of round

//start next round with new category

//*allow them to change their mind. radio buttons