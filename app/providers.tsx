"use client";

import React, { ReactNode, useEffect } from "react";
import { Buffer } from "buffer";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";

import "@solana/wallet-adapter-react-ui/styles.css";

// Next.js no define Buffer por defecto
if (typeof window !== "undefined") {
  (window as any).Buffer = Buffer;
}

const endpoint = "https://api.devnet.solana.com";
const wallets = [new PhantomWalletAdapter()];

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}