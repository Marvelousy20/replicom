"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { WalletCards } from "lucide-react";
import { signIn, getCsrfToken } from "next-auth/react";
import { useRouter } from "next/navigation";
import { stringToHex } from "@polkadot/util";
interface LoginParams {
  signature: string;
  message: string;
  account: InjectedAccountWithMeta;
}
import { signOut } from "next-auth/react";
import axios from "axios";

interface ConnectWalletProps {
  signInWithCrypto: () => Promise<void>;
}

interface MetaProps {
  walletAddress: string | undefined;
  AvatarUrl: string;
}

export default function Connect({ signInWithCrypto }: ConnectWalletProps) {
  const [showModal, setShowModal] = useState(false);
  const [showAccountsModal, setShowAccountsModal] = useState(false);

  const [polkadotAccounts, setPolkadotAccounts] = useState<
    InjectedAccountWithMeta[]
  >([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);

  const [connectedAccount, setConnectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);

  // const [messageModalOpen, setMessageModalOpen] = useState(false);
  // const [modalMessage, setModalMessage] = useState("");

  // Handles Metamask
  const [userData, setUserData] = useState<MetaProps | null>(null);

  // HandlesMetamask modal
  const [showMetamaskModal, setShowMetamaskModal] = useState(false);

  useEffect(() => {
    const connectedAccount = localStorage.getItem(
      "connectedAccount"
    ) as InjectedAccountWithMeta | null;
    // if (connectedAccount) {
    //   setConnectedAccount(connectedAccount);
    // }

    const userDataLocal = localStorage.getItem("userData");
    if (userDataLocal) setUserData(JSON.parse(userDataLocal));
  }, []);

  const router = useRouter();

  const handleConnectPolkadot = async () => {
    const { web3Enable, web3Accounts, web3FromSource } = await import(
      "@polkadot/extension-dapp"
    );
    const extensions = await web3Enable("openAI");
    if (extensions.length === 0) {
      alert("Please install the Polkadot{.js} extension.");
      return;
    }

    const accounts = await web3Accounts();
    if (accounts.length === 0) {
      const userChoice = confirm(
        "The Polkadot{.js} extension is required to continue. Click OK to install it."
      );
      if (userChoice) {
        window.open("https://polkadot.js.org/extension/", "_blank"); // Change this URL to the Polkadot{.js} extension’s download page
      }
      return;
    }
    setPolkadotAccounts(accounts);
    setShowModal(false);
    setShowAccountsModal(true);
  };

  const connectAccount = async () => {
    const { web3FromSource, isWeb3Injected } = await import(
      "@polkadot/extension-dapp"
    );

    if (!selectedAccount) return;

    console.log("IS WEB3 INJECTED", isWeb3Injected);

    localStorage.setItem("connectedAccount", JSON.stringify(selectedAccount));

    // setConnectedAccount(selectedAccount);
    setShowAccountsModal(false);
    setSelectedAccount(null);

    try {
      const injector: InjectedExtension = await web3FromSource(
        selectedAccount.meta.source
      );
      let signature = "";
      const message = {
        statement: "Sign in with polkadot extension",
        uri: window.location.origin,
        version: "1",
        nonce: await getCsrfToken(),
      };

      const signRaw = injector?.signer?.signRaw;

      const hexMessage = stringToHex(JSON.stringify(message));

      if (!!signRaw && !!selectedAccount) {
        const data = await signRaw({
          address: selectedAccount.address,
          data: hexMessage,
          type: "bytes",
        });

        const response = await axios.get(
          `/api/user?walletAddress=${selectedAccount.address}`
        );
        const currentUser = {
          walletAddress: response.data.walletAddress,
          AvatarUrl: response.data.profile_img,
        };

        console.log(currentUser);

        // await cryptoWaitReady();
        await handleLogin({
          signature: data.signature,
          message: hexMessage,
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
      callbackUrl: "/",
      signature: signature,
      name: account?.meta?.name,
      message: message,
      address: account?.address,
    });

    console.log("RESULT URL", result?.url);

    if (result?.url) {
      router.push(result.url);
      setSelectedAccount(account);
      setConnectedAccount(account);
    } else {
      alert(result?.error);
      console.error("Login failed:", result?.error);
    }
  };

  const toggleModal = () => {
    if (connectedAccount) {
      // If an account is connected, open the accounts modal directly
      handleConnectPolkadot();
    } else if (userData) {
      setShowMetamaskModal(true);
    } else {
      // No account connected, show initial modal to connect
      setShowModal(true);
    }
  };

  const displayAddress = (address?: string) =>
    address ? `${address.substring(0, 8)}...` : "No Address";

  useEffect(() => {
    const savedAccount = localStorage.getItem("connectedAccount");
    if (savedAccount) {
      setConnectedAccount(JSON.parse(savedAccount));
    }
  }, []);

  const disconnectPolkadot = () => {
    localStorage.removeItem("connectedAccount");
    setConnectedAccount(null);
    setShowAccountsModal(false);
    signOut();
  };

  const disconnectMetamask = () => {
    localStorage.removeItem("userData");
    setShowMetamaskModal(false);
    signOut();
  };

  return (
    <div>
      {connectedAccount || userData ? (
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
                {connectedAccount
                  ? connectedAccount.meta.name
                  : "MetaMask User"}
              </p>
              <p className="text-xs text-orange-500">
                {connectedAccount
                  ? displayAddress(connectedAccount?.address)
                  : displayAddress(userData?.walletAddress)}
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
            <Button
              onClick={signInWithCrypto}
              className="w-full bg-gray-700 text-white p-2 rounded-lg"
            >
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

            {connectedAccount && (
              <Button
                className="w-full h-14 dark:bg-white dark:bg-opacity-90"
                onClick={disconnectPolkadot}
              >
                Disconnect
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showMetamaskModal} onOpenChange={setShowMetamaskModal}>
        <DialogContent className="bg-white text-black dark:bg-[#131B2A] dark:text-white">
          <DialogTitle className="flex gap-2 items-center mb-6 font-bold text-2xl">
            MetaMask Wallet Connected
          </DialogTitle>
          <div className="space-y-4">
            <div
              className={`p-3 cursor-pointer border-2 rounded-lg border-green-500`}
            >
              <p className="text-lg">{userData?.walletAddress}</p>
            </div>

            <Button
              className="w-full h-14 dark:bg-white dark:bg-opacity-90"
              onClick={disconnectMetamask}
            >
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
