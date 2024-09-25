import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json({ limit: '100mb' })); // Increased JSON payload limit

dotenv.config();

// Text generation using the Gemini 1.5 flash model
app.route("/Gemini")
  .get(async (req, res) => {
    const api_key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(api_key);
    const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

    const prompt = req.query.prompt || "Hello";

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      res.send(response.text());
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).send('Error generating content');
    }
  })
  .post(async (req, res) => {
    const api_key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(api_key);
    const generationConfig = { temperature: 0.9, topP: 1, topK: 1, maxOutputTokens: 4096 };
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

    const requestData = req.body.data;

    try {
      const result = await model.generateContent(requestData);
      const response = await result.response;
      res.send(response.text());
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).send('Error generating content');
    }
  });

// Text analysis route with Gemini 1.5 flash model
app.route("/analyse_text")
  .post(async (req, res) => {
    const api_key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(api_key);
    const generationConfig = { temperature: 0.4, topP: 1, topK: 32, maxOutputTokens: 4096 };

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig });

    try {
      const { text } = req.body; // Get text from request body
      let inputText = text + " Give me the strengths, weaknesses, and best suitable job for the given resume";

      // Use the input text as input for the generative model
      const result = await model.generateContent(inputText);
      const response = await result.response;

      res.send(response.text());
    } catch (error) {
      console.error('Error processing text:', error);
      res.status(500).send('Error analyzing text');
    }
  });

// Start the server
app.listen(3000, () => {
  console.log("Server started on port 3000");
});