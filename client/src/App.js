import React, { useState, useEffect } from "react";
import ChatWindow from "./components/ChatWindow";
import Axios from "./Axios";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const createChatSession = async () => {
      try {
        const response = await Axios.get("/chat/create"); // Use the Axios instance
        setChatId(response.data.chatId);
        console.log("Chat ID:", response.data.chatId);
      } catch (error) {
        console.error("Error creating chat session:", error);
      }
    };

    createChatSession();

    // Add introductory message from bot on load
    const introMessage = {
      text: "👋 Hi there! I'm IT Copilot Assistant, here to help you. Feel free to ask any questions you have!",
      sender: "bot",
    };
    setMessages([introMessage]);
  }, []);

  const sendMessage = async () => {
    if (input.trim()) {
      const userMessage = { text: input, sender: "user", chatId };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setLoading(true); // Set loading to true
      setInput("");

      try {
        const response = await Axios.post("/chat", { message: input, chatId }); // Call the chat endpoint
        const botMessage = {
          text: response.data.text,
          sender: "bot",
        };
        console.log({ message: response.data });
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <ChatWindow
        socketConnected={true}
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
};

export default App;
