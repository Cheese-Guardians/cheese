require('dotenv').config();

import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-7GLaTXTfTgwXFCwfOM1fxb57",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.engines.list();