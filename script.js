// 1. QUESTION BANK (10 Questions)

const questions = [
    {
        question: "What does HTML stand for?",
        options: [
            "Hyper Text Markup Language",
            "High Tech Modern Language",
            "Hyper Transfer Markup Language",
            "Home Tool Markup Language"
        ],
        answer: 0
    },
    {
        question: "Which CSS property controls text size?",
        options: [
            "font-style",
            "text-size",
            "font-size",
            "text-style"
        ],
        answer: 2
    },
    {
        question: "What is the correct JavaScript syntax to change content?",
        options: [
            "document.getElementById('demo').innerHTML = 'Hello';",
            "document.getElement('demo').innerHTML = 'Hello';",
            "document.getElementsById('demo').innerHTML = 'Hello';",
            "document.getElementById('demo').textContent = 'Hello';"
        ],
        answer: 0
    },
    {
        question: "Which HTML tag is used to link an external CSS file?",
        options: [
            "<style>",
            "<link>",
            "<css>",
            "<script>"
        ],
        answer: 1
    },
    {
        question: "What does the 'display: flex' property do?",
        options: [
            "Creates a flexible box layout",
            "Makes elements invisible",
            "Adds padding to elements",
            "Aligns text to center"
        ],
        answer: 0
    },
    {
        question: "Which operator is used for strict equality in JavaScript?",
        options: [
            "==",
            "=",
            "===",
            "!=="
        ],
        answer: 2
    },
    {
        question: "What is the correct way to write a comment in CSS?",
        options: [
            "// This is a comment",
            "<!-- This is a comment -->",
            "/* This is a comment */",
            "# This is a comment"
        ],
        answer: 2
    },
    {
        question: "Which HTML element is used to create a hyperlink?",
        options: [
            "<link>",
            "<a>",
            "<href>",
            "<url>"
        ],
        answer: 1
    },
    {
        question: "What is the default value of 'position' in CSS?",
        options: [
            "relative",
            "absolute",
            "fixed",
            "static"
        ],
        answer: 3
    },
    {
        question: "Which method adds an element to the end of an array?",
        options: [
            "push()",
            "pop()",
            "unshift()",
            "shift()"
        ],
        answer: 0
    }
];


// 2. DOM REFERENCES

const questionElement = document.getElementById('question');
const optionsElement = document.getElementById('options');
const nextButton = document.getElementById('next-btn');
const questionNumberElement = document.getElementById('question-number');
const scoreElement = document.getElementById('score');
const quizElement = document.getElementById('quiz');
const resultElement = document.getElementById('result');
const finalScoreElement = document.getElementById('final-score');
const percentageElement = document.getElementById('percentage');
const performanceMessageElement = document.getElementById('performance-message');
const highScoreMessageElement = document.getElementById('high-score-message');
const restartButton = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');
const timerElement = document.getElementById('timer');
const timerContainer = document.getElementById('timer-container');
const reviewSection = document.getElementById('review-section');
const reviewContainer = document.getElementById('review-answers');


// 3. STATE VARIABLES

let currentQuestion = 0;
let score = 0;
let selectedOption = null;
let answered = false;
let userAnswers = [];
let timeLeft = 30;
let questionsCopy = [];         


// 4. UTILITY FUNCTIONS

// Shuffle an array (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


// 5. LOAD QUESTION

function loadQuestion() {
    // Shuffle questions only once at the start
    if (currentQuestion === 0 && questionsCopy.length === 0) {
        questionsCopy = shuffleArray([...questions]);
        userAnswers = new Array(questionsCopy.length).fill(undefined);
    }

    const q = questionsCopy[currentQuestion];
    questionElement.textContent = q.question;
    questionNumberElement.textContent = currentQuestion + 1;

    // Update progress bar
    const progress = (currentQuestion / questionsCopy.length) * 100;
    progressBar.style.width = progress + '%';

    // Clear old options
    optionsElement.innerHTML = '';

    // Create shuffled options (randomize order)
    const optionIndices = [0, 1, 2, 3];
    shuffleArray(optionIndices);
    const optionLabels = ['A', 'B', 'C', 'D'];

    optionIndices.forEach((origIndex, displayIndex) => {
        const button = document.createElement('button');
        button.classList.add('option-btn');
        button.textContent = optionLabels[displayIndex] + '. ' + q.options[origIndex];
        button.dataset.index = origIndex;   // store the real index (correct answer)
        button.addEventListener('click', selectOption);
        optionsElement.appendChild(button);
    });

    // Reset state for this question
    selectedOption = null;
    answered = false;
    nextButton.disabled = true;
    nextButton.style.opacity = '0.5';

    // Start timer
    startTimer();
}


// 6. TIMER

function startTimer() {
    // Clear any previous timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    timeLeft = 30;
    timerElement.textContent = timeLeft;
    timerElement.classList.remove('warning');
    timerContainer.innerHTML = '⏱️ Time left: <span id="timer">30</span> seconds';

    timerInterval = setInterval(function() {
        timeLeft--;
        timerElement.textContent = timeLeft;

        if (timeLeft <= 5) {
            timerElement.classList.add('warning');
        }

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Auto-fail if not answered
            if (!answered) {
                autoFailQuestion();
            }
        }
    }, 1000);
}

// Auto-fail when time runs out
function autoFailQuestion() {
    // Disable all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.add('disabled');
    });

    // Show correct answer
    const q = questionsCopy[currentQuestion];
    document.querySelectorAll('.option-btn').forEach((btn, index) => {
        if (index === q.answer) {
            btn.classList.add('correct');
        }
    });

    // Store as wrong answer (user didn't select)
    userAnswers[currentQuestion] = -1; // -1 means not answered

    timerContainer.innerHTML = '⏰ Time ran out! <span style="color:#dc3545;">Moving to next...</span>';
    answered = true;
    nextButton.disabled = false;
    nextButton.style.opacity = '1';
}


// 7. OPTION SELECTION

function selectOption(event) {
    if (answered) return;

    const button = event.target;
    const selectedIndex = parseInt(button.dataset.index);
    const q = questionsCopy[currentQuestion];

    // Store the user's answer
    userAnswers[currentQuestion] = selectedIndex;

    // Disable all options
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.add('disabled');
    });

    // Check correctness
    if (selectedIndex === q.answer) {
        button.classList.add('correct');
        score++;
        scoreElement.textContent = score;
    } else {
        button.classList.add('wrong');
        // Show the correct answer
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            if (index === q.answer) {
                btn.classList.add('correct');
            }
        });
    }

    answered = true;
    selectedOption = selectedIndex;
    nextButton.disabled = false;
    nextButton.style.opacity = '1';

    // Stop timer (we have answer)
    clearInterval(timerInterval);
}


// 8. NEXT BUTTON

nextButton.addEventListener('click', function() {
    if (!answered) return;

    currentQuestion++;

    if (currentQuestion < questionsCopy.length) {
        loadQuestion();
        this.disabled = true;
        this.style.opacity = '0.5';
    } else {
        showResults();
    }
});


// 9. SHOW RESULTS

function showResults() {
    // Clear timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }

    quizElement.style.display = 'none';
    resultElement.style.display = 'block';

    const total = questionsCopy.length;
    const percentage = (score / total) * 100;

    finalScoreElement.textContent = score;
    percentageElement.textContent = percentage.toFixed(1) + '%';

    // Performance message
    let message = '';
    let color = '';
    if (percentage >= 80) {
        message = '🎉 Excellent! You are a quiz champion!';
        color = '#28a745';
    } else if (percentage >= 60) {
        message = '👏 Good job! Keep learning!';
        color = '#17a2b8';
    } else if (percentage >= 40) {
        message = '📚 You need more practice. Keep studying!';
        color = '#ffc107';
    } else {
        message = '😅 Better luck next time. Review the material!';
        color = '#dc3545';
    }

    performanceMessageElement.textContent = message;
    performanceMessageElement.style.color = color;

    // High score (localStorage)
    const savedHighScore = localStorage.getItem('quizHighScore');
    let highScore = savedHighScore ? parseInt(savedHighScore) : 0;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('quizHighScore', highScore);
        highScoreMessageElement.innerHTML = '🏆 New High Score!';
    } else {
        highScoreMessageElement.innerHTML = '🏆 Best Score: ' + highScore + ' / ' + total;
    }

    // Show review of answers
    showReview();
}


// 10. REVIEW ANSWERS

function showReview() {
    reviewSection.style.display = 'block';
    reviewContainer.innerHTML = '';

    questionsCopy.forEach((q, index) => {
        const userAns = userAnswers[index];
        let isCorrect = false;
        let userAnswerText = 'Not answered';
        if (userAns !== undefined && userAns !== -1) {
            userAnswerText = q.options[userAns];
            isCorrect = (userAns === q.answer);
        } else if (userAns === -1) {
            userAnswerText = '⏰ Time ran out';
        }

        const div = document.createElement('div');
        div.className = 'review-item ' + (isCorrect ? 'correct' : 'wrong');

        div.innerHTML = `
            <div class="q-text">Q${index+1}: ${q.question}</div>
            <div class="your-answer">
                Your answer: <span class="${isCorrect ? 'correct-text' : 'wrong-text'}">${userAnswerText}</span>
                ${!isCorrect ? `<br>Correct answer: <span style="color:#28a745;">${q.options[q.answer]}</span>` : ''}
            </div>
        `;
        reviewContainer.appendChild(div);
    });
}


// 11. RESTART QUIZ

restartButton.addEventListener('click', function() {
    // Reset all state
    currentQuestion = 0;
    score = 0;
    answered = false;
    userAnswers = [];
    questionsCopy = [];
    scoreElement.textContent = score;
    quizElement.style.display = 'block';
    resultElement.style.display = 'none';
    reviewSection.style.display = 'none';
    progressBar.style.width = '0%';
    timerContainer.innerHTML = '⏱️ Time left: <span id="timer">30</span> seconds';
    // Clear any timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    // Load first question
    loadQuestion();
    nextButton.disabled = true;
    nextButton.style.opacity = '0.5';
});


// 12. START THE QUIZ

loadQuestion();