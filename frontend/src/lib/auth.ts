import { AuthOptions, RequestInternal } from "next-auth";
import { ethers } from "ethers";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { web3Accounts } from "@polkadot/extension-dapp";
import { signatureVerify } from "@polkadot/util-crypto";

async function authorizeCrypto(
  credentials: Record<"walletAddress" | "signedNonce", string> | undefined,
  req: Pick<RequestInternal, "body" | "headers" | "method" | "query">
) {
  if (!credentials) return null;

  const { walletAddress, signedNonce } = credentials;

  // Get user from database with their generated nonce
  const user = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/registeruser/?walletAddress=${walletAddress}`
  );
  // console.log(user, "user")
  if (!user.data[0]?.walletAddress) return null;

  const verifyNonce = "Welcome to sign in Repliate.com!";
  // Compute the signer address from the saved nonce and the received signature
  const signerAddress = ethers.verifyMessage(verifyNonce, signedNonce);

  // Check that the signer address matches the public address
  //  that is trying to sign in
  if (signerAddress !== walletAddress) return null;

  return {
    id: user.data[0]?.id,
    walletAddress: user.data[0]?.walletAddress,
  };
}

async function authorizePolkadot(
  credentials:
    | Record<"message" | "signature" | "address" | "csrfToken", string>
    | undefined
) {
  if (!credentials) {
    return null;
  }

  try {
    const message = JSON.parse(credentials.message);

    // Verify the message is from the same URI
    if (message.uri !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) {
      return Promise.reject(new Error("🚫 You shall not pass! - URI mismatch"));
    }

    // Verify the message was not compromised
    if (message.nonce !== credentials.csrfToken) {
      console.log("CSRF", credentials.csrfToken);

      return Promise.reject(
        new Error("🚫 You shall not pass! - CSRF token mismatch")
      );
    }

    // Verify signature of the message
    const { isValid } = signatureVerify(
      credentials.message,
      credentials.signature,
      credentials.address
    );

    if (!isValid) {
      return Promise.reject(new Error("🚫 Invalid Signature"));
    }

    // If all checks pass, return the user object
    return {
      id: credentials.address,
      name: "Polkadot User", // Since you might not have a name, you can set a default or modify as needed
      address: credentials.address,
    };
  } catch (e) {
    console.error("Failed to parse message:", e);
    return null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      id: "crypto",
      name: "Crypto Wallet Auth",
      credentials: {
        walletAddress: { label: "Public Address", type: "text" },
        signedNonce: { label: "Signed Nonce", type: "text" },
      },
      authorize: authorizeCrypto,
    }),

    CredentialsProvider({
      id: "polkadot",
      name: "Crypto Wallet Auth (Polkadot)",
      credentials: {
        message: { label: "Message", type: "text" },
        signature: { label: "Signature", type: "text" },
        address: { label: "Polkadot Address", type: "text" },
        csrfToken: { label: "CSRF Token", type: "text" }, // Added CSRF Token to credentials
      },
      authorize: authorizePolkadot,
    }),
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
