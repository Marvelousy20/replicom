import { AuthOptions, RequestInternal } from "next-auth";
import { ethers } from "ethers";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import {
  decodeAddress,
  signatureVerify,
  cryptoWaitReady,
} from "@polkadot/util-crypto";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { hexToString } from "@polkadot/util";

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
  await cryptoWaitReady();

  if (!credentials) {
    return null;
  }

  const provider = new WsProvider("wss://kusama-rpc.polkadot.io/");
  const api = await ApiPromise.create({ provider });

  try {
    const messageHex = credentials.message;
    const messageString = hexToString(messageHex);
    const messaageJSON = JSON.parse(messageString);

    // Verify the message is from the same URI
    if (messaageJSON.uri !== process.env.NEXT_PUBLIC_NEXTAUTH_URL) {
      return Promise.reject(new Error("🚫 You shall not pass! - URI mismatch"));
    }

    // Verify the message was not compromised
    if (messaageJSON.nonce !== credentials.csrfToken) {
      console.log("CSRF", credentials.csrfToken);

      return Promise.reject(
        new Error("🚫 You shall not pass! - CSRF token mismatch")
      );
    }

    // const messageToString = JSON.stringify(message);
    const publickKey = credentials.address;

    const { isValid } = signatureVerify(
      messageHex,
      credentials.signature,
      publickKey
    );

    console.log(
      "MESSAGE:",
      messageHex,
      "SIGNATURE",
      credentials.signature,
      "PUBLIC ADDRESS",
      credentials.address
    );

    if (!isValid) {
      return Promise.reject(new Error("🚫 Invalid Signature"));
    }

    // If all checks pass, return the user object
    return {
      id: credentials.address,
      name: "Polkadot User",
      address: credentials.address,
    };
  } catch (e) {
    console.error("Failed to parse message:", e);
    return null;
  }
}

// async function authorizePolkadots(credentials) {
//   return { id: "dummy-id", name: "Dummy User", email: "dummy@example.com" };
// }

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
        name: {
          label: "Name",
          type: "text",
          placeholder: "name",
        },
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
  // secret: process.env.NEXTAUTH_SECRET,
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
};
