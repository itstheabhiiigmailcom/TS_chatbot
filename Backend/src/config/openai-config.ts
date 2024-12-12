import { Configuration } from "openai";

function configureOpenAI() {
    const config = new Configuration({
        apiKey: process.env.OPEN_AI_SECRET,
        organization: process.env.OPENAI_ORGANIZATION_ID,
    })
    return config;
}

export {configureOpenAI}