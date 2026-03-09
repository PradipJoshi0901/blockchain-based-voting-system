import Web3 from 'web3';

// 1) Start login: biometric verified → create nonce
export const startLogin = async (req, res) => {
  try {
    const { biometricData } = req.body;
    const { voterId } = req.body;

    const [rows] = await voter_database.execute(
      `SELECT voter_id, eth_address FROM voters WHERE voter_id = ?`,
      [voterId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Voter not found" });
    }
    const voter = rows[0];
    if (!voter.eth_address) {
      return res.status(400).json({ error: "No Ethereum address registered for this voter" });
    }

    const nonce = generateNonce(voter.voter_id, voter.eth_address);

    return res.json({
      voterId: voter.voter_id,
      nonce,
      registeredAddress: voter.eth_address,
    });
  } catch (err) {
    console.error("Error in startLogin:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2) Verify signed nonce from MetaMask (web3.js)
export const verifySignature = async (req, res) => {
  try {
    const { voterId, message, signature, connectedAddress } = req.body;

    const session = getSession(voterId);
    if (!session || session.used) {
      return res.status(400).json({ error: "Nonce invalid or used" });
    }

    // web3.js personal recovery
    const recoveredAddress = Web3.utils.verifyMessage(message, signature);

    if (!message.includes(session.nonce)) {
      return res.status(400).json({ error: "Nonce mismatch" });
    }

    const expected = session.address;
    if (
      recoveredAddress.toLowerCase() !== expected.toLowerCase() ||
      connectedAddress.toLowerCase() !== expected.toLowerCase()
    ) {
      return res.status(401).json({ error: "Address mismatch" });
    }

    markUsed(voterId);

    return res.json({ success: true, voterId, address: recoveredAddress });
  } catch (err) {
    console.error("Error in verifySignature:", err);
    res.status(500).json({ error: "Verification failed" });
  }
};
