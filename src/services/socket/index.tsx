import { useEffect, useState } from "react";

type UseSocketProps = {
  url: string;
  onMessage?: (message: any) => void;
  onError?: (err: any) => void;
  onClose?: () => void;
  onOpen?: () => void;
};

// Simple socket service
// TODO: Implement reconnect functionality
export const useSocket = ({
  url,
  onMessage,
  onError,
  onClose,
  onOpen,
}: UseSocketProps) => {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(url);

    if (onMessage) {
      ws.onmessage = onMessage;
    }

    if (onError) {
      ws.onerror = onError;
    }

    if (onClose) {
      ws.onclose = onClose;
    }

    if (onOpen) {
      ws.onopen = onOpen;
    }

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [url, setSocket, onClose, onError, onMessage, onOpen]);

  return socket;
};
