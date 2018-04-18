$('#modelId').modal('show');

questions = [{}];

testRef = myFirebase.ref().push()
console.log('user key', testRef.key);

globalCategory = ''



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
    // console.log(categories);
    randomCategory = categories[Math.floor(Math.random() * categories.length)]
    // console.log("randomCategory:", randomCategory)
    category = randomCategory.id;
    difficulty = randomCategory.difficulty;
    globalCategory = randomCategory.categoryName

};


//connect to api and get results
function getQuestions() {
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
            // console.log("questions", questions)
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
    // console.log("chocies", choices)
    $.each(choices, (index, value) => {
        // console.log("index:", index)
        // console.log("value:", value)
        // console.log("choice0:", $("#choice0"))
        $("#choice" + index).html(value);
    });
}

function nextQuestion() {
    showSubmit();
    if (questions.length === 0) {
        countdown.stop();
        //update score for next round
        $('#total-score').text(roundScore)
        //set a new category setCategory()
        setCategory();
        $('#next-category').text(globalCategory)
        var queryURL = "https:api.giphy.com/v1/gifs/random?tag=" + globalCategory + "&api_key=Wmowk73oEjiCgiZeGWDSiSZ3sxUZP282";
        var imageURL =''
        $.ajax({
            type: "GET",
            method: "GET",
            url: queryURL,
            success: function (response) {
                console.log( "image url:",response.data.images.fixed_height.url)
                imageURL = response.data.images.fixed_height.url;
                $('#category-image').attr('src', imageURL);
            }
        });
        // console.warn("category:", randomCategory.categoryName)
        $('#results-modal').modal('show');
    } else {
        // console.log("questions after slice", questions)
        setQuestion();
        //restart the counter
        countdown.reset();
        countdown.start();
    }
}

function checkChoice() {
    var userInput = $(":checked")[0].labels[0].innerText;
    // console.log("checked:", userInput);
    // console.log("correct answer", questions[0].correct_answer)
    //determine if correct 
    //out of time

    if (userInput === questions[0].correct_answer) {
        roundScore++;
        newUser.score = roundScore;
        testRef.update(newUser)
        // console.log("Correct Answer")
        showCorrect();
        //next question if not the end
        questions.splice(0, 1)
        //if out of questions then round results
        setTimeout(nextQuestion, 2000);

    } else {
        // console.log("Not correct Answer")
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

function showIncorrect() {
    $('#submit-choice').text('Wrong!');
    $('#submit-choice').removeClass('btn-primary');
    $('#submit-choice').addClass('btn-danger');
}

function showOutOfTime() {
    $('#submit-choice').text('Out of time!');
    $('#submit-choice').removeClass('btn-primary');
    $('#submit-choice').addClass('btn-warning');

}

function showSubmit() {
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

    var f = document.createElement('div');
    $(f).html('<iframe width="100%" height="260" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/74776996&color=%23ff5500&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>')
    $('#soundcloud-section').append(f);
});

setCategory();
getQuestions();

newUser = {
    username: usernameInput.value,
    score: roundScore
}

$('#launch-button').click(function (e) {
    e.preventDefault();
    countdown.start();

    newUser.username = usernameInput.value
    testRef.update(newUser)
});

$('#results-button').click(function (e) {
    e.preventDefault();
    countdown.reset();
    //////get new questions getQuestions()
    getQuestions();
    ////// setQuestion()
    // setQuestion();
    console.log('before start');
    countdown.start();
    console.log('after start');
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
    });
};

// Begin listening for data
startListeningScores();

//add gifs