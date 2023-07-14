import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
    organization: "org-9eK5ps4TUckwvyKZOubms7M6",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const response = await openai.engines.list();