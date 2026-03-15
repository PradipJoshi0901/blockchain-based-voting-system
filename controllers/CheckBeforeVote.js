export const verifyFace = async (req, res) => {
  try {
    const { citizenshipNo, descriptor } = req.body;

    const [rows] = await voter_database.execute(
      `SELECT biometric_hash, First_name, Last_name 
       FROM voters WHERE citizenship_number = ?`,
      [citizenshipNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Voter not found. Please register first." });
    }

    if (!rows[0].biometric_hash) {
      return res.status(400).json({ error: "No face data found for this voter." });
    }

    const storedDescriptor = JSON.parse(rows[0].biometric_hash);

    const distance = Math.sqrt(
      storedDescriptor.reduce((sum, val, i) =>
        sum + (val - descriptor[i]) ** 2, 0)
    );

    console.log('Face distance:', distance);

    if (distance > 0.55) {
      return res.status(401).json({ error: "Face does not match. Access denied." });
    }

    return res.json({
      success: true,
      message: "Face verified successfully",
      name: `${rows[0].First_name} ${rows[0].Last_name}`
    });

  } catch (err) {
    console.error("Error verifying face:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};