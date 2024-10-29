const express = require("express");
const router = express.Router();
const OpenAI = require("openai");
const { WebClient: SlackWebClient } = require("@slack/web-api");

const apiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI(apiKey);
const assistant_id = process.env.ASSISTANT_ID;

const slackToken = process.env.SLACK_TOKEN;
const slackWebClient = new SlackWebClient(slackToken);

router.get("/chat/create", async (req, res) => {
  try {
    const threadResponse = await openai.beta.threads.create();
    const threadId = threadResponse.id;
    res.json({ chatId: threadId });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/chat", async (req, res) => {
  try {
    if (!req.body.message) {
      return res.status(400).json({ error: "Message field is required" });
    }
    if (!req.body.chatId) {
      return res
        .status(400)
        .json({ error: "Chat/Thread Id field is required" });
    }
    const userMessage = req.body.message;
    const threadId = req.body.chatId;

    // Add a Message to a Thread
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: userMessage,
    });

    // Run the Assistant
    const runResponse = await openai.beta.threads.runs.create(threadId, {
      assistant_id: assistant_id,
    });

    // Track the Run's Status
    let run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
    let messageId = null;
    while (
      (run.status === "in_progress" || run.status === "requires_action") &&
      run.status !== "completed"
    ) {
      if (run.status === "requires_action" && run.required_action) {
        const action = run.required_action;

        // Check if the required action is to submit tool outputs
        if (
          action.type === "submit_tool_outputs" &&
          action.submit_tool_outputs
        ) {
          const toolCalls = action.submit_tool_outputs.tool_calls;
          const toolOutputs = [];

          // Loop through each tool call
          for (const toolCall of toolCalls) {
            const toolName = toolCall.function.name;
            const tool_call_id = toolCall.id;
            let toolResult = null;

            switch (toolName) {
              case "triggerSlackAutomation":
                const {
                  channel = "it-support",
                  message,
                  userName,
                } = JSON.parse(toolCall.function.arguments);

                toolResult = await triggerSlackAutomation(
                  channel,
                  message,
                  userName
                );
                break;

              // Add other tool cases as needed
              default:
                console.error(`Unknown tool: ${toolName}`);
                throw new Error(`Unknown tool: ${toolName}`);
            }

            // Push the tool output into the array
            toolOutputs.push({
              tool_call_id,
              output: toolResult,
            });
          }

          // Submit the outputs for all tool calls in one request
          await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
            tool_outputs: toolOutputs,
          });

          // Re-retrieve the run status after submitting tool outputs
          run = await openai.beta.threads.runs.retrieve(
            threadId,
            runResponse.id
          );
        }
      } else {
        // Wait and re-check the status if still in progress
        await new Promise((resolve) => setTimeout(resolve, 1000));
        run = await openai.beta.threads.runs.retrieve(threadId, runResponse.id);
      }
    }
    // Display the Assistant's Response
    const messagesResponse = await openai.beta.threads.messages.list(threadId);
    const assistantResponses = messagesResponse.data.filter(
      (msg) => msg.role === "assistant"
    );
    // Get the most recent assistant response
    const latestResponse = assistantResponses[0];

    // Construct the response text from the assistant
    const response = latestResponse.content
      .filter((contentItem) => contentItem.type === "text")
      .map((textContent) => textContent.text.value);

    res.json({ text: response });
  } catch (error) {
    console.error("Error processing chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// function to get user ID from Slack
async function getUserId(username) {
  try {
    const result = await slackWebClient.users.list();
    const user = result.members.find((u) => u.real_name === username);
    return user ? user.id : null;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
}

// Function to send message to Slack
async function triggerSlackAutomation(channel, message, userName) {
  const userId = await getUserId(userName);
  const IT_SupportId = await getUserId("IT Support");
  try {
    const ticketMessage = `*IT Ticket Alert!*\n\nPlease check the following details:\n\n> - Query: ${message}\n> - Ticket ID: 12345\n> - Priority: High\n> - User: <@${userId}>\n - Assigned to: <@${IT_SupportId}> \n\nFor more details, visit <https://www.example.com|this link>.`;
    await slackWebClient.chat.postMessage({
      channel: "it-support",
      text: ticketMessage,
    });
    console.log("Message sent to Slack successfully.");
    return "created the ticket on the #it-support channel and assigned it to IT support";
  } catch (error) {
    console.error("Error posting to Slack:", error);
    throw error;
  }
}

module.exports = router;
