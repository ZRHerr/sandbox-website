document.addEventListener("DOMContentLoaded", function () {
    let text = document.querySelector(".typing-text");
    text.style.animationPlayState = "running";
});

document.addEventListener("DOMContentLoaded", function () {
    // Get references to chat UI elements
    let chatBox = document.getElementById("chat-box");
    let userInput = document.getElementById("user-input");
    let sendBtn = document.getElementById("send-btn");
    let chatLimitMsg = document.getElementById("chat-limit-msg");

    // If any critical elements are missing, log an error and stop execution
    if (!chatBox || !userInput || !sendBtn) {
        console.error("One or more required chat elements are missing from the DOM.");
        return;
    }
    // Define chat attempt limits
    let chatCount = 0;
    const maxChatCount = 3;

    // Event listener for the send button click
    sendBtn.addEventListener("click", function () {
        // Prevent sending if chat limit is reached
        if (chatCount >= maxChatCount) return;

        // Get and sanitize user input
        let userText = userInput.value.trim();

        // Prevent empty messages or messages exceeding the 300-character limit
        if (userText.length === 0 || userText.length > 300) return;

        // Display user's message in the chat
        appendMessage("You: " + userText);
        chatCount++; // Increment chat counter

        // TODO: AI feature
        fetch("/ask-ai", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: userText })
        })
            .then(response => response.json()) // Parse JSON response
            .then(data => appendMessage("AI: " + data.response)) // Display AI response
            .catch(() => appendMessage("AI: Something cool is supposed to be here, but an error is stopping it."));
        // Clear input field after sending message
        userInput.value = "";

        // Disable input and display limit message if max chat limit is reached
        if (chatCount === maxChatCount) {
            userInput.disabled = true;
            sendBtn.disabled = true;
            if (chatLimitMsg) {
                chatLimitMsg.style.display = "block";
            }
        }
    });

    /**
     * Appends a message to the chat window.
     * @param {string} message - The message to display.
     */
    function appendMessage(message) {
        let messageDiv = document.createElement("div");
        messageDiv.textContent = message;

        // Ensure chat-box exists before appending to avoid errors
        if (!chatBox) {
            console.error("chat-box element not found.");
            return;
        }

        chatBox.appendChild(messageDiv);
        // Auto-scroll chat to the latest message
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    let images = document.querySelectorAll(".photo-gallery img");
    let currentIndex = 0;

    function cycleImages() {
        images.forEach((img, index) => {
            img.style.opacity = index === currentIndex ? "1" : "0.5";
        });
        currentIndex = (currentIndex + 1) % images.length;
    }

    setInterval(cycleImages, 5000);
});

document.addEventListener("DOMContentLoaded", function () {
    function updateClocks() {
        document.querySelectorAll('.clock-container').forEach(clock => {
            const hourHand = clock.querySelector('.hour-hand');
            const minuteHand = clock.querySelector('.minute-hand');
            const secondHand = clock.querySelector('.second-hand');

            if (!hourHand || !minuteHand || !secondHand) {
                console.error("Clock hands not found in:", clock);
                return;
            }

            const timezone = clock.getAttribute('data-timezone');
            const now = new Date().toLocaleString('en-US', { timeZone: timezone });
            const time = new Date(now);

            const hours = time.getHours() % 12;
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();

            const hourDeg = (hours + minutes / 60) * 30;
            const minuteDeg = (minutes + seconds / 60) * 6;
            const secondDeg = seconds * 6;

            hourHand.style.transform = `rotate(${hourDeg}deg)`;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            secondHand.style.transform = `rotate(${secondDeg}deg)`;
        });
    }

    setInterval(updateClocks, 1000);
    updateClocks();
});

document.addEventListener("DOMContentLoaded", function () {
    const contentDiv = document.getElementById("content");
    const navLinks = document.querySelectorAll("#navbar a");

    function loadPage(pageUrl) {
        fetch(pageUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Could not load ${pageUrl}: ${response.status}`);
                }
                return response.text();
            })
            .then(html => {
                contentDiv.innerHTML = html;
            })
            .catch(err => {
                contentDiv.innerHTML = `<p style="color:red;">Error loading page.</p>`;
                console.error(err);
            });
    }

    // Attach click event handlers to all nav links
    navLinks.forEach(link => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const page = this.getAttribute("data-page");
            if (!page) return;

            loadPage(page);

            navLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
        });
    });
});
