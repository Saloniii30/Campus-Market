import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface WalletContextType {
  accountAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signTransaction: (tx: MockTransaction) => Promise<MockTxResult>;
}

export interface MockTransaction {
  sender: string;
  receiver: string;
  amount: number; // in ALGO
  note?: string;
}

export interface MockTxResult {
  txId: string;
  confirmed: boolean;
}

const WalletContext = createContext<WalletContextType>({
  accountAddress: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signTransaction: async () => ({ txId: "", confirmed: false }),
});

// Generate a realistic-looking Algorand address
const generateMockAddress = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let addr = "";
  for (let i = 0; i < 58; i++) addr += chars[Math.floor(Math.random() * chars.length)];
  return addr;
};

// Generate a mock transaction ID
const generateMockTxId = () => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "";
  for (let i = 0; i < 52; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  const connectWallet = useCallback(async () => {
    if (accountAddress) return;
    setIsConnecting(true);
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1200));
    const addr = generateMockAddress();
    setAccountAddress(addr);
    setIsConnecting(false);

    // Save to profile if authenticated
    if (user) {
      supabase
        .from("profiles")
        .update({ wallet_address: addr } as any)
        .eq("id", user.id)
        .then(({ error }) => {
          if (error) console.error("Failed to save wallet address:", error);
        });
    }
  }, [accountAddress, user]);

  const disconnectWallet = useCallback(() => {
    setAccountAddress(null);
  }, []);

  const signTransaction = useCallback(async (tx: MockTransaction): Promise<MockTxResult> => {
    // Simulate signing + network delay
    await new Promise((r) => setTimeout(r, 2000));
    return { txId: generateMockTxId(), confirmed: true };
  }, []);

  return (
    <WalletContext.Provider value={{ accountAddress, isConnecting, connectWallet, disconnectWallet, signTransaction }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
