"use client";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  web3Accounts,
  web3Enable,
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

interface Account {
  address: string;
  meta: {
    name: string;
  };
}

interface ConnectWalletProps {
  signInWithCrypto: () => Promise<void>; // This matches the signature of onSignInWithCrypto
}

export default function ConnectPolkadot({
  signInWithCrypto,
}: ConnectWalletProps) {
  const [api, setApi] = useState<ApiPromise | null>(null);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [accountLoaded, setAccountLoaded] = useState<boolean>(false);
  const [opened, setIsOpened] = useState<boolean>(false);
  const [selectedAccount, setSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [tempSelectedAccount, setTempSelectedAccount] =
    useState<InjectedAccountWithMeta | null>(null);
  const [showConnectOptions, setShowConnectOptions] = useState<boolean>(false);

  useEffect(() => {
    const connectApi = async () => {
      const provider = new WsProvider("wss://rpc.polkadot.io");
      const api = await ApiPromise.create({ provider });
      setApi(api);
    };
    connectApi();
    loadAccounts();
  }, []);

  const loadAccounts = () => {
    const storedAccounts = localStorage.getItem("polkadotAccounts");
    if (storedAccounts) {
      const parsedAccounts: InjectedAccountWithMeta[] =
        JSON.parse(storedAccounts);
      setAccounts(parsedAccounts);
      setAccountLoaded(true);
    }
    const storedSelectedAccount = localStorage.getItem(
      "selectedPolkadotAccount"
    );
    if (storedSelectedAccount) {
      setSelectedAccount(JSON.parse(storedSelectedAccount));
    }
  };

  const connectWallet = async () => {
    const extensions = await web3Enable("openAI");
    if (extensions.length === 0) {
      return alert(
        "No extension found. Please install the polkadot{.js} extension."
      );
    }
    const allAccounts = (await web3Accounts()) as InjectedAccountWithMeta[];
    setAccounts(allAccounts);
    localStorage.setItem("polkadotAccounts", JSON.stringify(allAccounts));
    setAccountLoaded(true);
    if (allAccounts.length > 0 && !selectedAccount) {
      setSelectedAccount(allAccounts[0]);
      localStorage.setItem(
        "selectedPolkadotAccount",
        JSON.stringify(allAccounts[0])
      );
    }
  };

  const displayAddress = (address: string) =>
    address ? `${address.substring(0, 8)}...` : "No Address";

  const handleShowModal = () => setIsOpened(true);

  const handleTempSelectedAccount = (account: InjectedAccountWithMeta) => {
    setTempSelectedAccount(account);
  };

  const handleSelectedAccount = () => {
    setSelectedAccount(tempSelectedAccount);
    localStorage.setItem(
      "selectedPolkadotAccount",
      JSON.stringify(tempSelectedAccount)
    );
    setIsOpened(false);
  };

  return (
    <div>
      {/* {selectedAccount ? (
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
      )} */}

      <Button
        onClick={() => setShowConnectOptions(true)}
        className="border-2 text-orange-500 border-orange-500 px-4 py-2 shadow-custom-orange active:top-1 active:shadow-custom-orange-clicked bg-light-dark"
      >
        Connect Wallet
      </Button>

      {/* Handles anything polkadot */}
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
                onClick={() => handleTempSelectedAccount(account)}
                className={`p-3 cursor-pointer border-2 rounded-lg ${
                  tempSelectedAccount?.address === account.address
                    ? "border-green-500"
                    : "border-black dark:border-white"
                }`}
              >
                <p className="font-bold text-lg">{account.meta.name}</p>
                <p className="text-lg">{account.address}</p>
              </div>
            ))}
            <Button
              onClick={handleSelectedAccount}
              className="w-full bg-transparent border-2 border-yellow-500 h-16 font-bold text-lg text-orange-500"
            >
              Connect Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Handles Connect Options */}

      <Dialog open={showConnectOptions} onOpenChange={setShowConnectOptions}>
        <DialogContent className="bg-white text-black dark:bg-[#131B2A] dark:text-white">
          <DialogTitle className="text-xl font-bold">
            Connect Wallet
          </DialogTitle>
          <div className="space-y-4 p-4">
            <Button
              onClick={handleShowModal}
              // onClick={connectWallet}
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
    </div>
  );
}
