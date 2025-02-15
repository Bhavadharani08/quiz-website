
// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDX0_vo237bFjBM42JfeBfKgR2JqT0T1pw",
    authDomain: "quiz-website-ff879.firebaseapp.com",
    databaseURL: "https://quiz-website-ff879-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "quiz-website-ff879",
    storageBucket: "quiz-website-ff879.appspot.com",
    messagingSenderId: "654431450111",
    appId: "1:654431450111:web:57de9375d327b6531bedca"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Function to save the user's score in Firebase
function saveScore(name, score) {
    set(ref(db, 'scores/' + name), {
        name: name,
        score: score
    }).then(() => {
        console.log("Score saved successfully!");
    }).catch((error) => {
        console.error("Error saving score:", error);
    });
}

// Quiz Questions
const questions = [
    {
        question: "What is the primary goal of Artificial Intelligence?",
        options: [
            "A) To create systems that can mimic human intelligence",
            "B) To replace human workers entirely",
            "C) To improve the speed of traditional computing",
            "D) To make computers self-aware"
        ],
        answer: "A) To create systems that can mimic human intelligence"
    },
    {
        question: "Which of the following is NOT a type of machine learning?",
        options: [
            "A) Supervised Learning",
            "B) Unsupervised Learning",
            "C) Reinforcement Learning",
            "D) Random Learning"
        ],
        answer: "D) Random Learning"
    },
    {
        question: "In Data Science, which step comes first in the data analysis process?",
        options: [
            "A) Data Cleaning",
            "B) Data Visualization",
            "C) Model Training",
            "D) Model Deployment"
        ],
        answer: "A) Data Cleaning"
    },
    {
        question: "Which algorithm is commonly used for classification tasks in Machine Learning?",
        options: [
            "A) K-Means Clustering",
            "B) Decision Tree",
            "C) Apriori Algorithm",
            "D) K-Nearest Neighbors (KNN)"
        ],
        answer: "D) K-Nearest Neighbors (KNN)"
    },
    {
        question: "Which of the following is an example of a supervised learning algorithm?",
        options: [
            "A) K-Means Clustering",
            "B) Principal Component Analysis (PCA)",
            "C) Support Vector Machine (SVM)",
            "D) Generative Adversarial Networks (GANs)"
        ],
        answer: "C) Support Vector Machine (SVM)"
    },
    {
        question: "What does NLP stand for in Artificial Intelligence?",
        options: [
            "A) Natural Logic Processing",
            "B) Neural Language Programming",
            "C) Natural Language Processing",
            "D) Neural Learning Process"
        ],
        answer: "C) Natural Language Processing"
    },
    {
        question: "Which of the following is a popular deep learning framework?",
        options: [
            "A) TensorFlow",
            "B) Excel",
            "C) MySQL",
            "D) Tableau"
        ],
        answer: "A) TensorFlow"
    },
    {
        question: "Which metric is commonly used to evaluate the performance of a classification model?",
        options: [
            "A) Mean Squared Error (MSE)",
            "B) Accuracy",
            "C) R-squared",
            "D) Gradient Descent"
        ],
        answer: "B) Accuracy"
    },
    {
        question: "Which technique is used to prevent overfitting in machine learning models?",
        options: [
            "A) Using larger datasets",
            "B) Regularization",
            "C) Increasing the number of layers in a neural network",
            "D) Reducing the number of features"
        ],
        answer: "B) Regularization"
    },
    {
        question: "Which term describes a model's ability to generalize well to unseen data?",
        options: [
            "A) Overfitting",
            "B) Underfitting",
            "C) Generalization",
            "D) Bias"
        ],
        answer: "C) Generalization"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let selectedOption = null;
let attemptedQuestions = 0;

// Track if deduction has been used
let deductionUsed = false;
let deductionEnabled = false;

// Get elements
const questionElement = document.getElementById("question");
const optionsContainer = document.getElementById("options-container");
const submitButton = document.getElementById("submit-btn");
const nextButton = document.getElementById("next-btn");

// Create Skip Button
const skipButton = document.createElement("button");
skipButton.textContent = "Skip";
skipButton.id = "skip-btn";
skipButton.style.display = "block";
skipButton.onclick = skipQuestion;
document.querySelector(".quiz-container").appendChild(skipButton);

// Create Attempt Counter
const attemptCounter = document.createElement("p");
attemptCounter.id = "attempt-counter";
attemptCounter.style.marginTop = "15px";
document.querySelector(".quiz-container").appendChild(attemptCounter);

// Create Option Deduction Button
const deductionButton = document.createElement("button");
deductionButton.textContent = "Option Deduction";
deductionButton.id = "deduction-btn";
deductionButton.style.display = "none";
deductionButton.onclick = applyOptionDeduction;
document.querySelector(".quiz-container").appendChild(deductionButton);

// Load question
function loadQuestion() {
    selectedOption = null;
    const currentQuestion = questions[currentQuestionIndex];

    questionElement.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";
    submitButton.style.display = "none";

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option");
        button.setAttribute("data-correct", option === currentQuestion.answer ? "true" : "false");
        button.onclick = () => selectOption(button);
        optionsContainer.appendChild(button);
    });

    nextButton.style.display = "none";
    skipButton.style.display = "block"; // Ensure skip button is available during questions

    updateAttemptCounter();

    // Enable deduction if criteria met
    if ((score + 1) / questions.length >= 0.8 && !deductionUsed) {
        deductionEnabled = true;
        deductionButton.style.display = "block";
    } else {
        deductionButton.style.display = "none";
    }
}

// Select option
function selectOption(button) {
    selectedOption = button;
    Array.from(optionsContainer.children).forEach(btn => btn.classList.remove("selected", "correct", "wrong"));
    button.classList.add("selected");
    submitButton.style.display = "block";
}

// Submit answer
function submitAnswer() {
    if (!selectedOption) return;

    attemptedQuestions++;

    const correctAnswer = questions[currentQuestionIndex].answer;
    Array.from(optionsContainer.children).forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.classList.add("correct");
        } else if (btn === selectedOption) {
            btn.classList.add("wrong");
        }
    });

    if (selectedOption.textContent === correctAnswer) {
        score++;
    }

    submitButton.style.display = "none";
    nextButton.style.display = "block";
    skipButton.style.display = "none";

    updateAttemptCounter();
}

// Skip question
function skipQuestion() {
    nextQuestion();
}

// Load next question
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show final results and save score to Firebase
function showResults() {
    const username = localStorage.getItem("username") || "Guest"; // Get username
    saveScore(username, score); // Save score to Firebase

    questionElement.innerHTML = `
        <div class="results-container">
            <h2>Quiz Completed!</h2>
            <p class="score">Your Score: ${score}/${questions.length}</p>
            <div class="stats">
                <p>Attempted Questions: ${attemptedQuestions}</p>
                <p>Unattempted Questions: ${questions.length - attemptedQuestions}</p>
            </div>
        </div>
    `;

    optionsContainer.innerHTML = "";
    submitButton.style.display = "none";
    nextButton.style.display = "none";
    skipButton.style.display = "none"; // Hide skip button after quiz ends
    deductionButton.style.display = "none";

    updateAttemptCounter();
}

// Apply Option Deduction (Remove two wrong options)
function applyOptionDeduction() {
    if (!deductionEnabled || deductionUsed) return;

    const currentQuestion = questions[currentQuestionIndex];
    const wrongOptions = [];

    // Find wrong answers
    Array.from(optionsContainer.children).forEach(btn => {
        if (btn.textContent !== currentQuestion.answer) {
            wrongOptions.push(btn);
        }
    });

    if (wrongOptions.length >= 2) {
        // Remove two wrong answers
        wrongOptions[0].style.display = "none";
        wrongOptions[1].style.display = "none";
    }

    // Disable further use
    deductionUsed = true;
    deductionButton.style.display = "none";
}

// Update Attempt Counter
function updateAttemptCounter() {
    attemptCounter.innerHTML = `Attempted: ${attemptedQuestions} | Unattempted: ${questions.length - attemptedQuestions}`;
}

// Expose functions globally
window.submitAnswer = submitAnswer;
window.nextQuestion = nextQuestion;
window.skipQuestion = skipQuestion;
window.applyOptionDeduction = applyOptionDeduction;

// Initialize quiz
loadQuestion();
