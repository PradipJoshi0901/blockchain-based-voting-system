import { voter_database } from '../Database_API/connect_db.js';

export const updateVoted = async (req, res) => {
  try {
    const { citizenshipNo } = req.body;

    if (!citizenshipNo) {
      return res.status(400).json({ error: 'Citizenship number is required' });
    }

    const [rows] = await voter_database.execute(
      `SELECT has_voted FROM voters WHERE citizenship_number = ?`,
      [citizenshipNo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Voter not found' });
    }

    if (rows[0].has_voted === 'Yes') {
      return res.status(409).json({ error: 'Voter has already voted' });
    }

    await voter_database.execute(
      `UPDATE voters SET has_voted = 'Yes' WHERE citizenship_number = ?`,
      [citizenshipNo]
    );

    res.json({ success: true, message: 'Vote status updated to Yes' });

  } catch (err) {
    console.error('Error updating vote status:', err);
    res.status(500).json({ error: 'Failed to update vote status' });
  }
};