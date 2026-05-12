# ai-chatbot-package-demo

Installable React AI chatbot overlay for any frontend application. Add the package, configure one backend endpoint, wrap your app once, and the assistant is ready to use.

The package only calls your backend API. It does not expose any model API key in the browser.

## Install

```bash
npm install ai-chatbot-package-demo
```

## Environment Variable

Create or update your frontend `.env` file:

```env
VITE_AI_AGENT_ENDPOINT=https://epyc-frontend-engineering-assignment-ai.onrender.com/api/chat
```

After changing `.env`, restart your frontend dev server so Vite can read the updated value.

## App-Level Usage

Import the provider and package CSS once at the top level of your app.

```jsx
import { createRoot } from "react-dom/client";
import { AiAgentProvider } from "ai-chatbot-package-demo";
import "ai-chatbot-package-demo/style.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <AiAgentProvider
    title="AI Assistant"
    endpoint={import.meta.env.VITE_AI_AGENT_ENDPOINT}
  >
    <App />
  </AiAgentProvider>
);
```

That is the main integration. Your application stays unchanged, and the chatbot renders as a floating overlay above it.

## React Router Example

```jsx
import { BrowserRouter } from "react-router-dom";
import { AiAgentProvider } from "ai-chatbot-package-demo";
import "ai-chatbot-package-demo/style.css";

export default function Root() {
  return (
    <AiAgentProvider endpoint={import.meta.env.VITE_AI_AGENT_ENDPOINT}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AiAgentProvider>
  );
}
```

## Available Props

```jsx
<AiAgentProvider
  title="AI Assistant"
  placeholder="Ask anything..."
  endpoint={import.meta.env.VITE_AI_AGENT_ENDPOINT}
>
  <App />
</AiAgentProvider>
```

`title` controls the widget label.

`placeholder` controls the input placeholder text.

`endpoint` is the backend chat API URL.

`initialMessages` can provide custom starting assistant messages.

`onSend` can override the default backend request behavior if you need a custom client-side handler.

## Manual Widget Usage

Use `AiAgentProvider` for most apps. If you need manual placement, import the widget directly:

```jsx
import { AiAgentWidget } from "ai-chatbot-package-demo";
import "ai-chatbot-package-demo/style.css";

export function App() {
  return (
    <>
      <YourExistingApp />
      <AiAgentWidget
        title="AI Assistant"
        provider={{
          endpoint: import.meta.env.VITE_AI_AGENT_ENDPOINT,
        }}
      />
    </>
  );
}
```

## Backend Endpoint Contract

The widget sends this request to the configured endpoint:

```json
{
  "message": "User message",
  "history": []
}
```

The backend should return:

```json
{
  "reply": "Assistant response",
  "assistant": {
    "answer": "Assistant response",
    "suggestedQuestions": [
      "Useful follow-up question?",
      "Another useful follow-up question?"
    ]
  }
}
```

The widget displays `reply` or `assistant.answer`, then renders `assistant.suggestedQuestions` as clickable follow-up chips.

## Features

- Floating overlay above any React UI
- Compact bottom-centered input
- Smooth expand and minimize behavior
- Word-by-word assistant response reveal
- Clickable suggested question chips
- Thinking state
- Copy button for assistant messages
- Hidden but usable chat scrollbar
- Chat history saved in `localStorage`
- Saved chats restored on reload
- New-chat and clear-chat controls
- Responsive mobile layout
