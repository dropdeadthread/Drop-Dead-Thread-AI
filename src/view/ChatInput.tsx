import { useState, useRef } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import SendIcon from '~icons/Send';
import useInfo from '~hooks/useInfo';

interface ChatInputProps {
  onSend: (msg: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState('');
  const { isMac } = useInfo();

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
  };

  useHotkeys(
    isMac ? 'meta+enter' : 'ctrl+enter',
    (e) => {
      e.preventDefault();
      handleSend();
    },
    { enableOnFormTags: true },
    [message]
  );

  return (
    <div className="relative flex items-center gap-2">
      <textarea
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        spellCheck="false"
        className="w-full pl-3 pr-[40px] py-2 outline-none resize-none bg-transparent border rounded"
        placeholder="Type your message here..."
      />
      <SendIcon
        size={30}
        className="absolute right-2 text-gray-400/80 dark:text-gray-600 cursor-pointer"
        onClick={handleSend}
        title={`Send message (${isMac ? '⌘⏎' : '⌃⏎'})`}
      />
    </div>
  );
}
