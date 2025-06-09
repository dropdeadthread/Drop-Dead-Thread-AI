import { useState } from 'react';

export default function Ask() {
  console.log('Ask component loaded');

  const [messages, setMessages] = useState<string[]>([]);

  return (
    <div style={{ background: 'black', color: 'lime', padding: '2rem' }}>
      <h1>✅ Ask Component Loaded</h1>
      <button
        onClick={() => setMessages((prev) => [...prev, 'Test message'])}
        style={{ marginTop: '1rem' }}
      >
        Add Message
      </button>
      <div style={{ marginTop: '1rem' }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
    </div>
  );
}
