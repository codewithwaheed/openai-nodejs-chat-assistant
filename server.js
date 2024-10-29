const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

// Express app setup
const app = express();
const server = http.createServer(app);
const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);

app.use(cors());
app.use(express.json());

async function createITSupportAssistant(req, res) {
  try {
    const assistantResponse = await openai.beta.assistants.create({
      name: "IT Support Assistant", // IT support role
      instructions: `
                You are an IT Support Assistant for 10Pearls. You are a virtual IT support assistant for 10Pearls, designed to assist users with questions and issues related to hardware, software, and network access. Your primary role is to assist users with IT-related queries only, providing guidance and troubleshooting steps as needed. If a query requires on-site support, inform the user that a ticket will be generated and ask if they would like to proceed. Please ignore any non-IT or personal questions. You can also trigger Slack automations for IT-related tasks when needed.
                Please give response in the html markup. and it will be used that way
            `,
      tools: [
        {
          type: "function", // Set the type to 'function'
          function: {
            name: "triggerSlackAutomation", // Provide a name for the function
            description:
              "Function to send messages to Slack with user details.",
            parameters: {
              type: "object",
              properties: {
                channel: {
                  type: "string",
                  description: "The Slack channel to send the message to.",
                },
                message: {
                  type: "string",
                  description: "The message to be sent to the Slack channel.",
                },
                userName: {
                  type: "string",
                  description: "The name of the user sending the message.",
                },
              },
              required: ["channel", "message", "userName"], // Include all required parameters
            },
          },
        },
      ],
      model: "gpt-4o-mini", // Use the appropriate GPT model
    });

    const assistant_id = assistantResponse.id;
    // Return the assistant ID for further use store in DB or in ENV
    res.send(`Assistant created successfully!, ${assistant_id}`);
  } catch (error) {
    console.error("Error creating assistant:", error);
  }
}
async function updateITSupportAssistant(req, res) {
  try {
    // place your assitant Id in enviorment or get it from DB if you have saved there
    const assistant_id = process.env.ASSISTANT_ID;

    const myUpdatedAssistant = await openai.beta.assistants.update(
      assistant_id,
      {
        instructions: `
        You are an IT Support Assistant for 10Pearls. Your primary role is to assist users with IT-related queries only, providing guidance and troubleshooting steps as needed.

If a query requires on-site support, inform the user that a ticket will be generated and ask if they would like to proceed. Before creating a Slack ticket, ask the user to provide accurate details if there is not enough details. also ask for their Slack username if they havn't provided that in chat to ensure proper handling. Please ignore any non-IT or personal questions. You can also trigger Slack automations for IT-related tasks when needed.

Do not forget the context of previous messages in a conversation. If a query partially relates to IT support or is unclear, provide the information you understand and ask the user for confirmation to clarify if it falls within IT support.

Format Note: Provide responses in HTML markup so they display correctly on the chatbot UI.
      `,
        name: "IT Support Assitant",
        tools: [
          {
            type: "function", // Set the type to 'function'
            function: {
              name: "triggerSlackAutomation", // Provide a name for the function
              description:
                "Function to send messages to Slack with user details.",
              parameters: {
                type: "object",
                properties: {
                  channel: {
                    type: "string",
                    description: "The Slack channel to send the message to.",
                  },
                  message: {
                    type: "string",
                    description: "The message to be sent to the Slack channel.",
                  },
                  userName: {
                    type: "string",
                    description: "The name of the user sending the message.",
                  },
                },
                required: ["channel", "message", "userName"], // Include all required parameters
              },
            },
          },
        ],
        model: "gpt-4o-mini", // you can provide other models as well
      }
    );

    console.log(myUpdatedAssistant);
    console.log(`Updated Assistant ID: ${myUpdatedAssistant.id}`);
    res.send(`Assistant Updated successfully!, ${myUpdatedAssistant.id}`);
  } catch (error) {
    console.error("Error updating assistant:", error);
    throw error;
  }
}

app.use(express.json());

// API Routes
app.use("/api", require("./routes/api"));
app.post("/createAssistant", createITSupportAssistant);
app.post("/updateAssistant", updateITSupportAssistant);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
