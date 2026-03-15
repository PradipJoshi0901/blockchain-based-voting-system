// controllers/faceController.js
import { citizen_database } from '../Database_API/connect_db.js';

// REGISTER face — saves real descriptor to citizen table
export const registerFace = async (req, res) => {
  try {
    const { citizenshipNo, descriptor } = req.body;

    if (!descriptor || !Array.isArray(descriptor)) {
      return res.status(400).json({ error: "Invalid descriptor" });
    }

    const [rows] = await citizen_database.execute(
      `SELECT citizenship_number FROM citizen WHERE citizenship_number = ?`,
      [citizenshipNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Citizen not found" });
    }

    await citizen_database.execute(
      `UPDATE citizen SET biometric_hash = ? WHERE citizenship_number = ?`,
      [JSON.stringify(descriptor), citizenshipNo]
    );

    return res.json({ success: true, message: "Face registered successfully" });
  } catch (err) {
    console.error("Error registering face:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// VERIFY face — compares live descriptor with stored one
export const verifyFace = async (req, res) => {
  try {
    const { citizenshipNo, descriptor } = req.body;

    const [rows] = await citizen_database.execute(
      `SELECT biometric_hash FROM citizen WHERE citizenship_number = ?`,
      [citizenshipNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Citizen not found" });
    }

    if (!rows[0].biometric_hash) {
      return res.status(400).json({ error: "No face registered for this citizen" });
    }

    const storedDescriptor = JSON.parse(rows[0].biometric_hash);

    // Euclidean distance comparison
    const distance = Math.sqrt(
      storedDescriptor.reduce((sum, val, i) =>
        sum + (val - descriptor[i]) ** 2, 0)
    );

    console.log('Face distance:', distance);

    if (distance > 0.55) {
      return res.status(401).json({ error: "Face does not match" });
    }

    return res.json({ success: true, message: "Face verified successfully" });
  } catch (err) {
    console.error("Error verifying face:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};