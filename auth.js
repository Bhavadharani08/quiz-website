// Login function
function login() {
    const username = document.getElementById("username").value;
    if (username.trim() === "") {
        alert("Please enter your name!");
        return;
    }
    localStorage.setItem("username", username);
    window.location.href = "welcome.html"; // Redirect to Welcome Page
}

// Display username on Welcome Page
window.onload = function () {
    const user = localStorage.getItem("username");
    if (user) {
        const nameElement = document.getElementById("user-name");
        const quizUserElement = document.getElementById("quiz-user");

        if (nameElement) nameElement.textContent = user;
        if (quizUserElement) quizUserElement.textContent = user;
    } else {
        window.location.href = "index.html"; // Redirect to Login if not logged in
    }
};

// Start quiz function
function startQuiz() {
    window.location.href = "quiz.html"; // Redirect to Quiz Page
}

// Logout function
function logout() {
    localStorage.removeItem("username");
    window.location.href = "index.html"; // Redirect to Login Page
}
