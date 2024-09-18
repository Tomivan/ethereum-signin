import jwt from "jsonwebtoken";
import { ethers } from "ethers";

export default async function handler(req, res) {
  const { address, signature } = req.body;

  if (!address || !signature) {
    return res.status(400).json({ message: "Missing address or signature" });
  }

  try {
    const message = `Sign in with Ethereum to your app: ${address}`;
    const recoveredAddress = ethers.utils.verifyMessage(message, signature);

    if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
      // Generate a JWT token (secret key should be in environment variables)
      const token = jwt.sign({ address }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return res.status(200).json({ token });
    } else {
      return res.status(401).json({ message: "Signature verification failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error verifying signature" });
  }
}
