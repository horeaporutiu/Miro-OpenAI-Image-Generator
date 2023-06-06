const express = require("express")
const dotenv = require("dotenv")
const axios = require("axios")
const { Configuration, OpenAIApi } = require("openai");

dotenv.config()

//BoardID needed for API request to Miro to add the image to a particular board
const boardID = process.env.MIRO_BOARD_ID;
//Token needed to authenticate to Miro API
const token = process.env.MIRO_BEARER_TOKEN;

//OpenAI API Key needed for OpenAI API request to create an image using AI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(express.json());
app.use(express.static("public"));
const port = 3000;

app.post('/generate', async (req, res) => {

  const prompt = req.body.prompt;

  try {

    const response = await openai.createImage({
      prompt: prompt,
    });

    let url = response.data.data[0].url

    res.status(200).json({
      success: true,
      data: url
    });
    
  } catch (error) {
    console.log(error)
    //send error to front end, so user can easily see that something went wrong
    res.status(400).json({
      success: false,
      error: 'The image could not be generated'
    });
  }
})

app.post('/addToMiro', async (req, res) => {

  let url = req.body.imgUrl

  try {

    let data = JSON.stringify({
      "data": {
        "url": url
      },
      "position": {
        "x": 0,
        "y": 0,
        "origin": "center"
      },
    });

    let config = {
      method: 'post',
      url: 'https://api.miro.com/v2/boards/' + boardID + '/images',
      headers: { 
        'Authorization': 'Bearer ' + token, 
        'Content-Type': 'application/json', 
      },
      data: data
    };
    
    const createMiroImageResponse = await axios.request(config)

    res.status(200).json({
      success: true,
      data:url
    });

  } catch (error) {
    console.log(error)
    //send error to front end, so user can easily see that something went wrong
    res.status(400).json({
      success: false,
      error: 'The image could not be generated'
    });
  }
})

app.listen(port);
console.log(`Running on localhost:${port}` );