const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const config = require("./config");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: config.email.from, pass: config.email.password }
});

app.post("/ask-ai", async (req, res) => {
    let userPrompt = req.body.prompt;

    // Simulate AI Response (TODO: Replace with actual AI call)
    let aiResponse = "That's an interesting question! Unfortunately I'm not ready yet..";

    // Send Email to Zach
    await transporter.sendMail({
        from: config.email.from,
        to: config.email.to,
        subject: "New AI Chat Prompt",
        text: `User asked: ${userPrompt}`
    });

    res.json({ response: aiResponse });
});

app.listen(config.server.port, () => console.log(`Server running on port ${config.server.port}`));
