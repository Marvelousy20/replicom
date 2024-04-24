"use client";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { IoReorderThreeOutline } from "react-icons/io5";
import { ethers } from "ethers";
import { User } from "next-auth";
import { UserContext } from "@/components/UseContext";
import UserMenuDetail from "./userMenuDetail";
import axios from "axios";
import { useContext, useEffect } from "react";
import Connect from "../NewConnect";

type userContextType = {
  walletAddress: string | null;
  AvatarUrl: string | null;
  balance: string | null;
  prediction_time: string | null;
};

let userContextDefault: userContextType = {
  walletAddress: null,
  AvatarUrl: null,
  balance: null,
  prediction_time: null,
};

declare global {
  interface Window {
    ethereum?: any;
  }
}

const UserMenu = () => {
  const { status } = useSession();
  const { user, setUser } = useContext(UserContext);

  async function onSignInWithCrypto() {
    try {
      if (!window.ethereum) {
        window.open(
          "https://chromewebstore.google.com/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
        );
        return;
      }

      // Get the wallet provider, the signer and address
      //  see: https://docs.ethers.org/v6/getting-started/#starting-signing
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const walletAddress = await signer.getAddress();
      const response = await axios.get(
        `/api/user?walletAddress=${walletAddress}`
      );
      const currentuser = {
        walletAddress: response.data.walletAddress,
        AvatarUrl: response.data.profile_img,
      };
      // setUser(currentuser);

      localStorage.setItem("userData", JSON.stringify(currentuser));
      // Sign the received nonce
      const signedNonce = await signer.signMessage(
        "Welcome to sign in Repliate.com!"
      );

      // Use NextAuth to sign in with our address and the nonce
      await signIn("crypto", {
        walletAddress,
        signedNonce,
        callbackUrl: "/",
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    console.log("component reupdates");
  }, []);

  return (
    <>
      <div className="flex items-center">
        <Connect signInWithCrypto={onSignInWithCrypto} />
        <div>{status === "authenticated" ? <UserMenuDetail /> : null}</div>
      </div>
    </>
  );
};

export default UserMenu;
