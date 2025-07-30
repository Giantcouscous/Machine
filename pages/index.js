import { useState, useEffect } from "react";

export default function Home() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Check localStorage for previous login
  useEffect(() => {
    if (localStorage.getItem("authenticated") === "true") {
      setAuthenticated(true);
    }
  }, []);

  // Handle password submit
  const handlePasswordSubmit = () => {
    if (password === process.env.NEXT_PUBLIC_CHATBOT_PASSWORD) {
      localStorage.setItem("authenticated", "true");
      setAuthenticated(true);
    } else {
      alert("Wrong password");
    }
  };

  // Handle message submit
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: [...messages, userMessage] }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
  };

  if (!authenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        <h2>Enter Password</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handlePasswordSubmit}>Submit</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>My Private Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300 }}>
        {messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role === "user" ? "You" : "Bot"}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ width: "80%" }}
        />
        <button onClick={handleSend} style={{ width: "18%" }}>Send</button>
      </div>
    </div>
  );
}
