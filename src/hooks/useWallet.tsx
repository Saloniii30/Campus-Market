import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { PeraWalletConnect } from "@perawallet/connect";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WalletContextType {
  accountAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  peraWallet: PeraWalletConnect;
}

const WalletContext = createContext<WalletContextType>({
  accountAddress: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  peraWallet: null as any,
});

const peraWallet = new PeraWalletConnect({
  chainId: 416002, // TestNet — change to 416001 for MainNet
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const isConnectedRef = useRef(false);
  const { user } = useAuth();

  // Save wallet address to profile when connected & authenticated
  useEffect(() => {
    if (accountAddress && user) {
      supabase
        .from("profiles")
        .update({ wallet_address: accountAddress } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("Failed to save wallet address:", error);
        });
    }
  }, [accountAddress, user]);

  const handleDisconnect = useCallback(() => {
    peraWallet.disconnect();
    setAccountAddress(null);
    isConnectedRef.current = false;
  }, []);

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
      .catch(() => {});
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
    <WalletContext.Provider value={{ accountAddress, isConnecting, connectWallet, disconnectWallet, peraWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
