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
        sendScoreToServer();
    }

    // Function to send score to server
    function sendScoreToServer() {
        PostData(username, score)
        .then(response => {
            console.log("User updated/created successfully:", response);
        })
        .catch(error => {
            console.error("Error updating/creating user:", error);
        });
    }

    // Loading Login info 
    function LoadPage() {
        let storedData = localStorage.getItem("userData");
        if (storedData) {
            let userData = JSON.parse(storedData);
            let name = userData.user;
            let num = userData.userNumber;

            username = name;
            score = num;

            document.getElementById("userDisplay").innerText = name;
            document.getElementById("score").innerText = num
            console.log("Username: " + name + "   Score: " + num);
        }
        else {
            alert("Please give a Username");
            window.location.href = "login.html";
        }

        // clearing stored data after loading
        localStorage.removeItem("userData");
    }



    // Login page functions
    function getUsername() {
        username = document.getElementById("username").value;
        console.log("Username:", username);

        //add API call stuff here (finding username, then replace score with saved score) (getscore call)
        GetData(username)
            .then(score => {
                if (score === 0) {  // If score is 0, possible that new user is being created so instaintly PostData to create new user
                    PostData(username, 0)
                        .then(response => {
                            console.log("User data posted successfully:", response);
                        })
                        .catch(error => {
                            console.error("Error posting user data:", error);
                        });
                } else {
                    console.log("Username:", username, "\tUser's score:", score);
                }
                Redirect();
            })
        .catch(error => {
            console.error("Error getting user score:", error);
            Redirect();
        });
    }

    function Redirect(){
        let data = {
            user: username,
            userNumber: score
        };

        localStorage.setItem("userData", JSON.stringify(data));
        window.location.href = "index.html";
    }


    //API stuff
    function GetData(username){
        const baseURL = " http://basic-web.dev.avc.web.usf.edu";
        const url = `${baseURL}/${username}`;
        
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();
            http.onload = function() {
                if (http.status >= 200 && http.status < 300) {
                    resolve(JSON.parse(http.responseText).score);
                } else if (http.status === 404) {
                    resolve(0);     //in loading next page, if score === 0, then imedieatly post to api    
                } else {
                    reject(new Error("HTTP request failed with status: " + http.status));
                }
            };
            
            http.onerror = function() {
                reject(new Error("Network Error"));
            };
            
            http.open("GET", url);
            http.send();
        });
    }

    function PostData(username, score){
        const baseURL = " http://basic-web.dev.avc.web.usf.edu";
        const url = `${baseURL}/${username}`;
        const data = { score: score };

        const jsonData = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            const http = new XMLHttpRequest();

            http.onload = function() {
                if (http.status >= 200 && http.status < 300) 
                    resolve({ status: http.status, data: JSON.parse(http.response) });
                else if (http.status >= 400 && http.status < 500) 
                    reject(new Error(`Invalid request: ${http.responseText}`));
                else if (http.status >= 500) 
                    reject(new Error(`Internal server error: ${http.responseText}`));
                else 
                    reject(new Error(`Error: ${http.statusText}`));
                
            };

            http.onerror = function() {
                reject(new Error("Network Error"));
            };

            http.open("POST", url);
            
            http.setRequestHeader("Content-Type", "application/json");
            http.send(jsonData);
        });
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
            updateScore();
            console.log(score);
        });
    }

    if (userDisplay && username !== ""){
        userDisplay.value = username;
    }

});