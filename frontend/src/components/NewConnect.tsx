"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3FromSource,
} from "@polkadot/extension-dapp";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { WalletCards } from "lucide-react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginParams {
  signature: string;
  message: string;
  account: InjectedAccountWithMeta;
}

export default function Connect() {
  const [showModal, setShowModal] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);
  const [polkadotAccounts, setPolkadotAccounts] = useState<
    InjectedAccountWithMeta[]
  >([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [connectedAccount, setConnectedAccount] =
    useState<InjectedAccountWithMeta | null>(() => {
      const savedAccount = localStorage.getItem("connectedAccount");
      return savedAccount ? JSON.parse(savedAccount) : null;
    });

  const router = useRouter();

  const handleConnectPolkadot = async () => {
    const extensions = await web3Enable("openAI");
    if (extensions.length === 0) {
      alert("Please install the Polkadot{.js} extension.");
      return;
    }

    const accounts = await web3Accounts();
    if (accounts.length === 0) {
      alert(
        "No accounts found. Please create an account in the Polkadot{.js} extension."
      );
      return;
    }

    setPolkadotAccounts(accounts);
    setShowModal(false);
    setShowAccountsModal(true);
  };

  const connectAccount = async () => {
    if (!selectedAccount) return;

    localStorage.setItem("connectedAccount", JSON.stringify(selectedAccount));
    setConnectedAccount(selectedAccount);
    setShowAccountsModal(false);
    setSelectedAccount(null);

    try {
      const injector = await web3FromSource(selectedAccount.meta.source);
      const signRaw = injector?.signer?.signRaw;

      if (signRaw) {
        const message = {
          statement:
            "Sign in with polkadot extension to the example tokengated example dApp",
          uri: window.location.origin,
          nonce: await getCsrfToken(),
          version: "1",
        };

        const messageObject = JSON.stringify(message);

        const { signature } = await signRaw({
          address: selectedAccount.address,
          data: JSON.stringify(message),
          type: "bytes",
        });

        await handleLogin({
          signature,
          message: messageObject,
          account: selectedAccount,
        });
      } else {
        console.error("Signer function unavailable.");
      }
    } catch (error) {
      console.error("Error during signing process: ", error);
    }
  };

  const handleLogin = async ({ signature, message, account }: LoginParams) => {
    const result = await signIn("polkadot", {
      redirect: false,
      signature: signature,
      message: message,
      address: account,
    });

    console.log(result);

    if (result?.url) {
      router.push(result.url); // Redirect to a protected page or dashboard
    } else {
      console.error("Login failed:", result?.error);
    }
  };

  const toggleModal = () => {
    if (connectedAccount) {
      // If an account is connected, open the accounts modal directly
      handleConnectPolkadot(); // This ensures accounts are loaded and modal is shown
    } else {
      // No account connected, show initial modal to connect
      setShowModal(true);
    }
  };

  const displayAddress = (address: string) =>
    address ? `${address.substring(0, 8)}...` : "No Address";

  return (
    <div>
      {connectedAccount ? (
        <Button
          onClick={toggleModal}
          className="h-15 relative inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-orange-500 bg-white px-4 py-2 shadow-custom-orange active:top-1 active:shadow-custom-orange-clicked dark:bg-light-dark"
        >
          <div className="text-start flex items-center gap-2 text-orange-500">
            <div>
              <WalletCards size={20} />
            </div>
            <div>
              <p className="font-bold text-orange-400 text-sm">
                {connectedAccount.meta.name}
              </p>
              <p className="text-xs text-orange-500">
                {displayAddress(connectedAccount.address)}
              </p>
            </div>
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => setShowModal(true)}
          className="border-2 text-orange-500 border-orange-500 px-4 py-2 shadow-custom-orange active:top-1 active:shadow-custom-orange-clicked bg-light-dark"
        >
          Connect Wallet
        </Button>
      )}

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="bg-white text-black dark:bg-[#131B2A] dark:text-white">
          <DialogTitle className="text-xl font-bold">
            Connect Wallet
          </DialogTitle>
          <div className="space-y-4 p-4">
            <Button
              onClick={handleConnectPolkadot}
              className="w-full bg-orange-500 text-white p-2 rounded-lg"
            >
              Login with Polkadot
            </Button>
            <Button className="w-full bg-gray-700 text-white p-2 rounded-lg">
              Login with MetaMask
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showAccountsModal} onOpenChange={setShowAccountsModal}>
        <DialogContent className="bg-white text-black dark:bg-[#131B2A] dark:text-white">
          <DialogTitle className="flex gap-2 items-center mb-6 font-bold text-2xl">
            <Image
              src="/img/polkadot.png"
              alt="Polkadot"
              width={32}
              height={32}
            />
            Select Wallet
          </DialogTitle>
          <div className="space-y-4">
            {polkadotAccounts.map((account, index) => (
              <div
                key={index}
                // onClick={() => handleSelectAccount(account)}
                className={`p-3 cursor-pointer border-2 rounded-lg ${
                  selectedAccount?.address === account.address
                    ? "border-green-500"
                    : "border-black dark:border-white"
                }`}
                onClick={() => setSelectedAccount(account)}
              >
                <p className="font-bold text-lg">{account.meta.name}</p>
                <p className="text-lg">{account.address}</p>
              </div>
            ))}
            <Button
              onClick={connectAccount}
              className="w-full bg-transparent border-2 border-yellow-500 h-16 font-bold text-lg text-orange-500"
              disabled={!selectedAccount}
            >
              Connect Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
