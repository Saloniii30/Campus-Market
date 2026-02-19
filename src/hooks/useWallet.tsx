import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { PeraWalletConnect } from "@perawallet/connect";

interface WalletContextType {
  accountAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  accountAddress: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

const peraWallet = new PeraWalletConnect({
  chainId: 416002, // TestNet — change to 416001 for MainNet
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnectedRef = useRef(false);

  const handleDisconnect = useCallback(() => {
    peraWallet.disconnect();
    setAccountAddress(null);
    isConnectedRef.current = false;
  }, []);

  // Reconnect on mount if session exists
  useEffect(() => {
    peraWallet
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length) {
          setAccountAddress(accounts[0]);
          isConnectedRef.current = true;
          peraWallet.connector?.on("disconnect", handleDisconnect);
        }
      })
      .catch(() => {
        // No existing session — ignore
      });
  }, [handleDisconnect]);

  const connectWallet = useCallback(async () => {
    if (isConnectedRef.current) return;
    setIsConnecting(true);
    try {
      const accounts = await peraWallet.connect();
      setAccountAddress(accounts[0]);
      isConnectedRef.current = true;
      peraWallet.connector?.on("disconnect", handleDisconnect);
    } catch (error: any) {
      if (error?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Pera Wallet connect error:", error);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [handleDisconnect]);

  const disconnectWallet = useCallback(() => {
    handleDisconnect();
  }, [handleDisconnect]);

  return (
    <WalletContext.Provider value={{ accountAddress, isConnecting, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
