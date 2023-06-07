const express = require('express');
const dotenv = require('dotenv');
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');

dotenv.config();

// BoardID needed for API request to Miro to add the image to a particular board
const boardID = process.env.MIRO_BOARD_ID;
// Token needed to authenticate to Miro API
const token = process.env.MIRO_BEARER_TOKEN;

// OpenAI API Key needed for OpenAI API request to create an image using AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Set up Express app
const app = express();
app.use(express.json());
// Use public directory for CSS, HTML, and JS
app.use(express.static('public'));
const port = 3000;

// Function to generate images using OpenAI SDK
app.post('/generate', async (req, res) => {
  // grab prompt from the front end
  const { prompt } = req.body;

  try {
    // use OpenAI SDK to generate image using the prompt from the front end
    const response = await openai.createImage({
      prompt,
    });

    // the URL to the image we will display
    const { url } = response.data.data[0];

    // send url to front end to display the image
    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    console.log(error);
    // send error to front end, so user can easily see that something went wrong
    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
});

// Function to make API call to Miro to add the Image to the Board
app.post('/addToMiro', async (req, res) => {
  // grab the URL from the front end
  const url = req.body.imgUrl;

  try {
    // Data to pass into the request body, specifically the URL and the position
    // of where to place the image on the Miro board
    const data = JSON.stringify({
      data: {
        url,
      },
      position: {
        x: 0,
        y: 0,
        origin: 'center',
      },
    });

    // API call configuration, such as method, URL,
    // and auth token needed to auth into the Miro REST API
    const config = {
      method: 'post',
      url: `https://api.miro.com/v2/boards/${boardID}/images`,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      data,
    };

    // Make from API call
    await axios.request(config);

    res.status(200).json({
      success: true,
      data: url,
    });
  } catch (error) {
    console.log(error);
    // send error to front end, so user can easily see that something went wrong
    res.status(400).json({
      success: false,
      error: 'The image could not be generated',
    });
  }
});

app.listen(port);
console.log(`Running on localhost:${port}`);
