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
