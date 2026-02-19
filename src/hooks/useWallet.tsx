import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import algosdk from "algosdk";

interface WalletContextType {
  accountAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signAndSendPayment: (receiverAddress: string, amountAlgo: number, note?: string) => Promise<{ txId: string }>;
}

const WalletContext = createContext<WalletContextType>({
  accountAddress: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signAndSendPayment: async () => ({ txId: "" }),
});

const WALLET_STORAGE_KEY = "campusmarket_algo_wallet";
const ALGORAND_TESTNET = "https://testnet-api.4160.nodely.dev";
const algodClient = new algosdk.Algodv2("", ALGORAND_TESTNET, "");

// Store/retrieve wallet from localStorage
const saveWallet = (addr: string, sk: Uint8Array) => {
  localStorage.setItem(WALLET_STORAGE_KEY, JSON.stringify({
    address: addr,
    secretKey: Array.from(sk),
  }));
};

const loadWallet = (): { address: string; secretKey: Uint8Array } | null => {
  try {
    const raw = localStorage.getItem(WALLET_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      address: parsed.address,
      secretKey: new Uint8Array(parsed.secretKey),
    };
  } catch {
    return null;
  }
};

const clearWallet = () => {
  localStorage.removeItem(WALLET_STORAGE_KEY);
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<Uint8Array | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();

  // Restore wallet on mount
  useEffect(() => {
    const stored = loadWallet();
    if (stored) {
      setAccountAddress(stored.address);
      setSecretKey(stored.secretKey);
    }
  }, []);

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

  const connectWallet = useCallback(async () => {
    if (accountAddress) return;
    setIsConnecting(true);
    try {
      // Generate a new Algorand account in-browser
      const account = algosdk.generateAccount();
      const addr = account.addr.toString();
      setAccountAddress(addr);
      setSecretKey(account.sk);
      saveWallet(addr, account.sk);
    } catch (err) {
      console.error("Failed to create wallet:", err);
    } finally {
      setIsConnecting(false);
    }
  }, [accountAddress]);

  const disconnectWallet = useCallback(() => {
    setAccountAddress(null);
    setSecretKey(null);
    clearWallet();
  }, []);

  const signAndSendPayment = useCallback(async (
    receiverAddress: string,
    amountAlgo: number,
    note?: string,
  ): Promise<{ txId: string }> => {
    if (!accountAddress || !secretKey) {
      throw new Error("Wallet not connected");
    }

    // Get suggested params
    const suggestedParams = await algodClient.getTransactionParams().do();
    const microAlgos = Math.round(amountAlgo * 1_000_000);

    // Create payment transaction
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      sender: accountAddress,
      receiver: receiverAddress,
      amount: microAlgos,
      note: note ? new TextEncoder().encode(note) : undefined,
      suggestedParams,
    });

    // Sign locally with the stored secret key
    const signedTxn = txn.signTxn(secretKey);

    // Submit to Algorand TestNet
    const { txid } = await algodClient.sendRawTransaction(signedTxn).do();

    return { txId: txid as string };
  }, [accountAddress, secretKey]);

  return (
    <WalletContext.Provider value={{ accountAddress, isConnecting, connectWallet, disconnectWallet, signAndSendPayment }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
