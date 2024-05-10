document.addEventListener("DOMContentLoaded", function() {
    // Function to perform FizzBuzz logic
    function fizzBuzz(num) {
        if (num % 3 === 0 && num % 5 === 0)
            return "FizzBuzz";
        else if (num % 3 === 0) 
            return "Fizz";
        else if (num % 5 === 0)
            return "Buzz";
        else
            return num;
    }

    // Function to update score and display
    function updateScore() {
        score++;
        let fizzBuzzText = fizzBuzz(score);
        document.getElementById("score").textContent = fizzBuzzText;
        // sendScoreToServer();
    }

    // Function to send score to server
    function sendScoreToServer() {
        const username = document.getElementById("username").value;
        fetch("http://basic-web.dev.avc.web.usf.edu/", {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify({
            username: username,
            score: score
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error("Error:", error));
    }

    // Loading Login info 
    function LoadPage() {
        let storedData = localStorage.getItem("userData");
        if (storedData) {
            let userData = JSON.parse(storedData);
            let name = userData.user;
            let num = userData.userNumber;

            document.getElementById("userDisplay").innerText = name;
            document.getElementById("score").innerText = num
            console.log("Username: " + name + "   Score: " + num);
        } 
        // clearing stored data after loading
        localStorage.removeItem("userData");
    }



    // Login page
    function getUsername() {
        username = document.getElementById("username").value;
        console.log("Username:", username);
        Redirect();
    }

    function Redirect(){
        let data = {
            user: username,
            userNumber: score
        };

        localStorage.setItem("userData", JSON.stringify(data));
        window.location.href = "index.html";
    }



    // Main script
    let score = 0;
    let username = "";

    const incrementBtn = document.getElementById("increment_btn");
    const loginBtn = document.getElementById("loginButton");
    const userDisplay = document.getElementById("userDisplay");

    console.log("Increment button:", incrementBtn);
    console.log("Login button:", loginBtn);

    if (loginBtn){
        document.getElementById("loginButton").addEventListener("click", function() {
            if (document.getElementById("username").value !== ""){
                getUsername();
            }
        });

        document.getElementById("username").addEventListener("keypress", function(event) {
            if (event.key === "Enter" && document.getElementById("username").value !== "") {
                event.preventDefault(); 
                getUsername();
            }
        });
    }

    if (incrementBtn){
        LoadPage();
        document.getElementById("increment_btn").addEventListener("click", function() {
            //   if (!document.getElementById("username").value) {
            //     alert("Please enter your username");
            //     return;
            //   }
            updateScore();
            console.log(score);
        });
    }

    if (userDisplay && username !== ""){
        userDisplay.value = username;
    }

});