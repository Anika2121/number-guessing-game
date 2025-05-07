document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed"); // Debugging

    window.submitGuess = function() {
        console.log("Submit Guess button clicked"); // Debugging
        const guessInput = document.getElementById('guessInput');
        
        if (!guessInput) {
            console.error("guessInput element not found");
            document.getElementById('message').textContent = 'Error: Input field not found.';
            return;
        }

        const guess = guessInput.value;
        if (!guess || guess < 1 || guess > 100) {
            document.getElementById('message').textContent = 'Please enter a number between 1 and 100';
            console.log("Invalid input:", guess); // Debugging
            return;
        }

        const data = new FormData();
        data.append('guess', guess);
        data.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        fetch('/guess/', {
            method: 'POST',
            body: data
        })
        .then(response => {
            console.log("Fetch response status:", response.status); // Debugging
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log("Fetch data:", data); // Debugging
            document.getElementById('message').textContent = data.message;
            if (data.status === 'continue') {
                document.getElementById('attempts').textContent = `Attempts: ${data.attempts}`;
            } else if (data.status === 'win') {
                document.getElementById('attempts').textContent = `Attempts: ${data.attempts}`;
                if (data.show_leaderboard_form) {
                    document.getElementById('scoreForm').style.display = 'block';
                }
            }
            guessInput.value = '';
        })
        .catch(error => {
            console.error("Fetch error:", error); // Debugging
            document.getElementById('message').textContent = 'An error occurred. Please try again.';
        });
    };

    window.saveScore = function() {
        const nameInput = document.getElementById('playerName');
        const name = nameInput.value.trim();
        const attempts = document.getElementById('attempts').textContent.split(': ')[1];

        if (!name) {
            alert('Please enter your name!');
            return;
        }

        const data = new FormData();
        data.append('name', name);
        data.append('score', attempts);
        data.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        fetch('/save-score/', {
            method: 'POST',
            body: data
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                document.getElementById('scoreForm').style.display = 'none';
                nameInput.value = '';
                alert('Score saved successfully! Click "View Leaderboard" to see your ranking.');
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Save score error:", error);
            alert('An error occurred while saving your score.');
        });
    };

    window.resetGame = function() {
        console.log("New Game button clicked"); // Debugging
        const data = new FormData();
        data.append('csrfmiddlewaretoken', document.querySelector('[name=csrfmiddlewaretoken]').value);

        fetch('/reset/', {
            method: 'POST',
            body: data
        })
        .then(response => {
            console.log("Reset response status:", response.status); // Debugging
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            console.log("Reset data:", data); // Debugging
            document.getElementById('message').textContent = 'New game started!';
            document.getElementById('attempts').textContent = 'Attempts: 0';
            document.getElementById('scoreForm').style.display = 'none';
            const guessInput = document.getElementById('guessInput');
            if (guessInput) guessInput.value = '';
        })
        .catch(error => {
            console.error("Reset error:", error); // Debugging
            document.getElementById('message').textContent = 'An error occurred. Please try again.';
        });
    };
});