// ------------------------------ //
// Title: Discord Bot with OpenAI //
// Author: Kylo P (@cywf)         //
// Date: 2023-03-11               //
// ------------------------------ // 

// Description: This is a simple Discord bot that uses OpenAI's API to respond to messages.

// To run this code, you need to install the following packages:
// npm install discord.js
// npm install openai

// Note: You will need to protect your API keys. This example uses https://replit.com/ to run the code. However, you can use any other service that allows you to set environment variables. You can also use a .env file to store your API keys. Or use .gitignore to prevent your API keys from being uploaded to GitHub.
const openApiKey = process.env['OpenAPIKey'] // Get from https://beta.openai.com/account/api-keys
const discordKey = process.env['DiscordKey'] // Get from https://discord.com/developers/applications
const openAIOrg = process.env['OpenAIOrg'] // Get from https://beta.openai.com/account/api-keys

// Setup Discord
const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

// Setup OpenAI
const { Configuration, OpenAIApi } = require('openai')
const Configuration = new Configuration({
    organization: openAIOrg,
    apiKey: openApiKey
})

const openai = new OpenAIApi(Configuration)

// Message configuration
client.on('messageCreate', async (message) => {
    try {
        if (message.author.bot) return // Prevents infinite loop
        const response = await openai.createCompletion({
            model: "txt-davinci-003", // You can use any model here. See https://beta.openai.com/docs/engines for more information.
            prompt: message.content,
            temperature: 0.9,
            max_tokens: 150,
            top_p: 1,
            frequency_penalty: 0.0,
            presence_penalty: 0.6,
            stop: [" Human:", " AI:"],
        });
        message.reply('${response.data.choices[0].text}') // Send the response to the channel
    } catch (error) {
        console.error(error)
    }
})

client.login(discordKey)