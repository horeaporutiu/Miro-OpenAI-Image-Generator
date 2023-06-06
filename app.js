const express = require("express")
const dotenv = require("dotenv")
const { Configuration, OpenAIApi } = require("openai");

dotenv.config()

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

		//stable diffusion 1.5

		//generate the image by passing in the prompt, using leap SDK
		// const response = await leap.generate.generateImage({
		// 	prompt: prompt,
		// });
    console.log(prompt)

    const response = await openai.createImage({
      prompt: prompt,
    });

		//send JSON response to front end, with the data being the image in this case
    res.status(200).json({
    success: true,
    // data: completion.data.choices[0].text
    data: response.data.data[0].url

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