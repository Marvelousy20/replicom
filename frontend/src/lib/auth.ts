import { AuthOptions, RequestInternal } from "next-auth";
import { ethers } from "ethers";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

async function authorizeCrypto(
  credentials: Record<"walletAddress" | "signedNonce", string> | undefined,
  req: Pick<RequestInternal, "body" | "headers" | "method" | "query">
) {
  if (!credentials) return null;

  const { walletAddress, signedNonce } = credentials;


  // Get user from database with their generated nonce
  const user = await axios.get(`http://65.108.226.61:8000/api/registeruser/?walletAddress=${walletAddress}`);
  // console.log(user, "user")

  if (!user.data[0]?.walletAddress) return null;

  const verifyNonce = "Welcome to sign in Repliate.com!";
  // Compute the signer address from the saved nonce and the received signature
  const signerAddress = ethers.verifyMessage(
    verifyNonce,
    signedNonce
  );

  // Check that the signer address matches the public address
  //  that is trying to sign in
  if (signerAddress !== walletAddress) return null;

  return {
    id: user.data[0]?.id,
    walletAddress: user.data[0]?.walletAddress,
  };
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
  ],
  pages: {
    signIn: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
