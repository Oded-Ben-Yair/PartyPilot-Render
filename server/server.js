// server.js
// This file sets up the Express server and routes for the PartyPilot project.
// It delegates OpenAI API interactions to functions defined in service.js.

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { getChatResponse, generateInvitation } = require('./service');

const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'online' });
});

// Chat endpoint: handles general conversation for planning birthday events
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: 'No messages provided' });
    }
    // Call the service function to get a chat response
    const result = await getChatResponse(messages);
    res.json(result);
  } catch (error) {
    console.error('[/api/chat] Error:', error);
    res.status(500).json({
      error: 'Failed to get chat response',
      message: 'There was an error processing your request. Please try again later.'
    });
  }
});

// Invitation endpoint: generates a digital invitation based on conversation context
app.post('/api/generate-invitation', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages) {
      return res.status(400).json({ error: 'No messages provided' });
    }
    // Call the service function to generate an invitation
    const invitationData = await generateInvitation(messages);
    res.json(invitationData);
  } catch (error) {
    console.error('[/api/generate-invitation] Error:', error);
    res.status(500).json({
      error: 'Failed to generate invitation',
      message: 'There was an error processing your invitation. Please try again later.'
    });
  }
});

// Start the server on the configured port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
