const { Configuration, OpenAIApi } =require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

// list the available models
async function listModels() {
    const models = await openai.listModels();
    console.log(models.data);
  }
  
  listModels();
  
