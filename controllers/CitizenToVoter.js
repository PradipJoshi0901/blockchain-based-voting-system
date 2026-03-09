import { citizen_database, voter_database } from '../Database_API/connect_db.js';

function generateVoterId() {
  const min = 1000000000;
  const max = 9999999999;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const registervoter = async (req, res) => {
  try {
    const requiredFields = ['First_Name', 'Last_Name', 'Date_of_Birth', 'citizenship_number', 'NID_number'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    const { First_Name, Last_Name, Date_of_Birth, citizenship_number, NID_number } = req.body;

    const [CitizenRows] = await citizen_database.execute(
      'SELECT * FROM citizen WHERE First_Name = ? AND Last_Name = ? AND date_of_birth = ? AND citizenship_number = ? AND NID_number = ?',
      [First_Name, Last_Name, Date_of_Birth, citizenship_number, NID_number]
    );

    if (CitizenRows.length === 0) {
      return res.status(404).json({ error: 'Citizen not found' });
    }

    const citizen = CitizenRows[0];

    if (citizen.is_registered === 'yes') {
      return res.status(409).json({ error: 'Citizen is already registered as a voter' });
    }

    const [voterRows] = await voter_database.execute(
      `SELECT * FROM voters WHERE NID_number = ?`,
      [NID_number]
    );

    if (voterRows.length > 0) {
      return res.status(409).json({ error: 'Voter is already registered' });
    }

    const voter_id = generateVoterId();

    await voter_database.execute(
      `INSERT INTO voters (voter_id, First_Name, Last_Name, date_of_birth, citizenship_number, NID_number) VALUES (?, ?, ?, ?, ?, ?)`,
      [voter_id, First_Name, Last_Name, Date_of_Birth, citizenship_number, NID_number]
    );

    await citizen_database.execute(
      'UPDATE citizen SET is_registered = ? WHERE citizenship_number = ? AND NID_number = ?',
      ['yes', citizenship_number, NID_number]
    );

    res.status(201).json({ message: 'Voter registered successfully', voter_id });
  } catch (error) {
    console.error('Error registering voter:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
