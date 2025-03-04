require('dotenv').config();
const express = require('express');
const cors = require('cors');
// const { OpenAI } = require('openai');
const fetch = require('node-fetch');

const app = express();
const port = 5000;

app.use(cors({ 
    origin: "*",
    methods: "GET,POST",
    allowedHeaders: "Content-Type"
  }));
app.use(express.json());



const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyB0JG3yKmXJn4dqznQayATzel3w0I3S-aI`;

// Endpoint to generate resume & cover letter
app.post('/generate', async (req, res) => {
    try {
        const { jobDescription } = req.body;

        if (!jobDescription) {
            return res.status(400).json({ error: 'Job description is required' });
        }

        const requestBody = {
            contents: [
                { parts: [{ text: `Generate a professional resume and a cover letter for this job: ${jobDescription}` }] }
            ]
        };
        
        

        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });



        const data = await response.json();

        console.log(data)

        if (data.candidates && data.candidates.length > 0) {
            res.json({ text: data.candidates[0].content.parts[0].text });
        } else {
            res.status(500).json({ error: 'Failed to generate text' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error generating content' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});