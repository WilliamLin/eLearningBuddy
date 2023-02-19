const { Configuration, OpenAIApi } =require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function generateResults(req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const numberOfQuestions = req.body.numberOfQuestions || 1;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      //model: "text-ada-001",
      //model: "text-babbage-001",
      prompt: generatePrompt(),
      temperature: 0.2,
      max_tokens: 100 
    });
    // log the completion data in json format
    console.log("Completion Data\n" + JSON.stringify(completion.data))

    const result = completion.data.choices[0].text;

    console.log("result ="+result)
    res.status(200).json({ result: result });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

module.exports = generateResults;

function generatePrompt() {
    const prompt=  "Generate a 1 digit plus question. response with answer. Example 1+1=2"
    console.log(prompt)
    return prompt
}
