export async function getAgentReply(message, history, config) {
  if (!config.endpoint) {
    return getMockReply(message);
  }

  return callBackendEndpoint(message, history, config.endpoint);
}

async function callBackendEndpoint(message, history, endpoint) {
  const previousMessages = history.slice(0, -1);

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, history: previousMessages }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Backend chat endpoint failed");
  }

  if (!data.reply && !data.assistant?.answer) {
    throw new Error("Backend chat endpoint did not return a reply");
  }

  return normalizeAssistantReply(data.assistant || data.reply);
}

async function getMockReply(message) {
  await new Promise((resolve) => window.setTimeout(resolve, 850));

  return {
    answer:
      message.toLowerCase() === "hello"
        ? "Hello! How can I help you today?"
        : `I can help with "${message}". For now I am running in demo mode because no backend endpoint is configured.`,
    suggestedQuestions: [
      "What can you do?",
      "How do I use the workspace?",
      "Can you help me write a document?",
    ],
  };
}

function normalizeAssistantReply(reply) {
  if (typeof reply === "string") {
    return {
      answer: reply,
      suggestedQuestions: [],
    };
  }

  return {
    answer: reply?.answer || "I could not generate a response.",
    suggestedQuestions: Array.isArray(reply?.suggestedQuestions)
      ? reply.suggestedQuestions
          .filter((question) => typeof question === "string")
          .map((question) => question.trim())
          .filter(Boolean)
          .slice(0, 3)
      : [],
  };
}
