import { citizen_database } from '../Database_API/connect_db.js';

export const findCitizenByCitizenship = async (req, res) => {
  try {
    const { citizenship_number, NID_number } = req.query;
    if (!citizenship_number || !NID_number) {
      return res.status(400).json({ error: 'citizenship_number and NID_number required' });
    }

    const [rows] = await citizen_database.execute(
      'SELECT * FROM citizen WHERE citizenship_number = ? AND NID_number = ?',
      [citizenship_number, NID_number]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Citizen search error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateCitizen = async (req, res) => {
  try {
    const { citizenship_number, NID_number, ...updates } = req.body;
    if (!citizenship_number || !NID_number) {
      return res.status(400).json({ error: 'citizenship_number and NID_number required' });
    }

    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(updates), citizenship_number, NID_number];

    const [result] = await citizen_database.execute(
      `UPDATE citizen SET ${setClause} WHERE citizenship_number = ? AND NID_number = ?`,
      values
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No citizen updated' });
    }

    res.json({ success: true, message: 'Citizen updated' });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
