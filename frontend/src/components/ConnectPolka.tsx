"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  web3Accounts,
  web3Enable,
  web3FromAddress,
  web3FromSource,
} from "@polkadot/extension-dapp";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { WalletCards } from "lucide-react";
import {
  InjectedAccountWithMeta,
  InjectedExtension,
} from "@polkadot/extension-inject/types";
import { signIn, useSession, getCsrfToken } from "next-auth/react";
import { stringToHex } from "@polkadot/util";

interface Account {
  address: string;
  meta: {
    name: string;
  };
}

interface ConnectWalletProps {
  signInWithCrypto: () => Promise<void>; // This matches the signature of onSignInWithCrypto
}

export default function ConnectWallet({
  signInWithCrypto,
}: ConnectWalletProps) {
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [showConnectOptions, setShowConnectOptions] = useState<boolean>(false);
  const [opened, setIsOpened] = useState<boolean>(false);

  useEffect(() => {
    const loadStoredAccount = () => {
      const storedAccount = localStorage.getItem("selectedPolkadotAccount");
      if (storedAccount) {
        setSelectedAccount(JSON.parse(storedAccount));
      }
    };
    loadStoredAccount();
  }, []);

  const handleConnectPolkadot = async () => {
    const extensions = await web3Enable("openAI");
    if (extensions.length === 0) {
      alert("Please install the Polkadot.js extension.");
      return;
    }
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setIsOpened(true); // open modal to select accounts
  };

  const displayAddress = (address: string) =>
    address ? `${address.substring(0, 8)}...` : "No Address";

  const handleShowModal = () => {
    if (!selectedAccount) {
      alert("No account selected. Please connect and select an account first.");
      return;
    }
    // Open modal to change account only if an account is already selected
    setIsOpened(true);
  };

  const handleSelectAccount = (account: InjectedAccountWithMeta) => {
    setSelectedAccount(account);
    localStorage.setItem("selectedPolkadotAccount", JSON.stringify(account));
    setIsOpened(false); // Close the dialog after selection

    // Proceed to sign message and authenticate
    signInWithPolkadot(account);
  };

  const signInWithPolkadot = async (account: InjectedAccountWithMeta) => {
    const injector = await web3FromAddress(account.address);
    const signer = injector.signer;
    const message = "Sign this message to log in.";
    const messageHex = stringToHex(message);

    try {
      const signature = await signer?.signRaw?.({
        address: account.address,
        data: messageHex,
        type: "bytes",
      });

      await signIn("credentials", {
        redirect: false,
        address: account.address,
        signature: signature?.signature,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Signing error:", error);
    }
  };

  console.log("SELECTED ACCOUNT", selectedAccount);
  console.log("ACCOUNTS", accounts);

  return (
    <div>
      {selectedAccount !== null ? (
        <Button
          className="h-15 relative inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-orange-500 bg-white px-4 py-2 shadow-custom-orange active:top-1 active:shadow-custom-orange-clicked dark:bg-light-dark"
          onClick={handleShowModal}
        >
          <div className="text-start flex items-center gap-2 text-orange-500">
            <div>
              <WalletCards size={20} />
            </div>
            <div>
              <p className="font-bold text-orange-400 text-sm">
                {selectedAccount.meta.name}
              </p>
              <p className="text-xs text-orange-500">
                {displayAddress(selectedAccount.address)}
              </p>
            </div>
          </div>
        </Button>
      ) : (
        <Button
          onClick={() => setShowConnectOptions(true)}
          className="border-2 text-orange-500 border-orange-500 px-4 py-2 shadow-custom-orange active:top-1 active:shadow-custom-orange-clicked bg-light-dark"
        >
          Connect Wallet
        </Button>
      )}

      <Dialog open={showConnectOptions} onOpenChange={setShowConnectOptions}>
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
              onClick={() => {
                setShowConnectOptions(false);
                signInWithCrypto();
              }}
              className="w-full bg-gray-700 text-white p-2 rounded-lg"
            >
              Login with MetaMask
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={opened} onOpenChange={setIsOpened}>
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
            {accounts.map((account, index) => (
              <div
                key={index}
                onClick={() => handleSelectAccount(account)}
                className={`p-3 cursor-pointer border-2 rounded-lg ${
                  selectedAccount?.address === account.address
                    ? "border-green-500"
                    : "border-black dark:border-white"
                }`}
              >
                <p className="font-bold text-lg">{account.meta.name}</p>
                <p className="text-lg">{account.address}</p>
              </div>
            ))}
            {/* <Button
              onClick={handleSelectedAccount}
              className="w-full bg-transparent border-2 border-yellow-500 h-16 font-bold text-lg text-orange-500"
            >
              Connect Now
            </Button> */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Uncaught (in promise)) Error: web3Accounts need to be caled before web3Acocounts
