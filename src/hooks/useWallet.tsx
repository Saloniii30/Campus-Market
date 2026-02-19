import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import algosdk from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

interface AsaOptions {
  assetIndex: number;
  usdcAmount: number;
}

interface WalletContextType {
  accountAddress: string | null;
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  signAndSendPayment: (receiverAddress: string, amountAlgo: number, note?: string, asaOptions?: AsaOptions) => Promise<{ txId: string }>;
}

const WalletContext = createContext<WalletContextType>({
  accountAddress: null,
  isConnecting: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  signAndSendPayment: async () => ({ txId: "" }),
});

const ALGORAND_TESTNET = "https://testnet-api.4160.nodely.dev";
const algodClient = new algosdk.Algodv2("", ALGORAND_TESTNET, "");

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [accountAddress, setAccountAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user } = useAuth();
  const peraWalletRef = useRef<PeraWalletConnect | null>(null);

  // Initialize Pera Wallet instance
  useEffect(() => {
    peraWalletRef.current = new PeraWalletConnect({
      chainId: 416002, // TestNet
    });

    // Try to reconnect on mount
    peraWalletRef.current
      .reconnectSession()
      .then((accounts) => {
        if (accounts.length > 0) {
          setAccountAddress(accounts[0]);
          peraWalletRef.current?.connector?.on("disconnect", handleDisconnect);
        }
      })
      .catch(() => {
        // No previous session
      });

    return () => {
      peraWalletRef.current?.connector?.off("disconnect");
    };
  }, []);

  const handleDisconnect = useCallback(() => {
    setAccountAddress(null);
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

  const isInIframe = useCallback((): boolean => {
    try {
      return window.self !== window.top;
    } catch (e) {
      return true;
    }
  }, []);

  const connectWallet = useCallback(async () => {
    if (accountAddress) return;

    setIsConnecting(true);
    try {
      // Create a fresh instance for each connection attempt to avoid stale state
      peraWalletRef.current = new PeraWalletConnect({
        chainId: 416002,
        shouldShowSignTxnToast: true,
      });

      const accounts = await peraWalletRef.current.connect();
      if (accounts.length > 0) {
        setAccountAddress(accounts[0]);
        peraWalletRef.current.connector?.on("disconnect", handleDisconnect);
      }
    } catch (err: any) {
      if (err?.data?.type !== "CONNECT_MODAL_CLOSED") {
        console.error("Failed to connect wallet:", err);
      }
    } finally {
      setIsConnecting(false);
    }
  }, [accountAddress, handleDisconnect, isInIframe]);

  const disconnectWallet = useCallback(() => {
    peraWalletRef.current?.disconnect();
    setAccountAddress(null);
  }, []);

  const signAndSendPayment = useCallback(async (
    receiverAddress: string,
    amountAlgo: number,
    note?: string,
    asaOptions?: AsaOptions,
  ): Promise<{ txId: string }> => {
    if (!accountAddress || !peraWalletRef.current) {
      throw new Error("Wallet not connected");
    }

    const suggestedParams = await algodClient.getTransactionParams().do();

    let txn;
    if (asaOptions) {
      txn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: accountAddress,
        receiver: receiverAddress,
        amount: asaOptions.usdcAmount,
        assetIndex: asaOptions.assetIndex,
        note: note ? new TextEncoder().encode(note) : undefined,
        suggestedParams,
      });
    } else {
      const microAlgos = Math.round(amountAlgo * 1_000_000);
      txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: accountAddress,
        receiver: receiverAddress,
        amount: microAlgos,
        note: note ? new TextEncoder().encode(note) : undefined,
        suggestedParams,
      });
    }

    // Sign via Pera Wallet
    const singleTxnGroup = [{ txn, signers: [accountAddress] }];
    const signedTxns = await peraWalletRef.current.signTransaction([singleTxnGroup]);
    const { txid } = await algodClient.sendRawTransaction(signedTxns[0]).do();

    return { txId: txid as string };
  }, [accountAddress]);

  return (
    <WalletContext.Provider value={{ accountAddress, isConnecting, connectWallet, disconnectWallet, signAndSendPayment }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
