import { candidate } from '../Database_API/connect_db.js';


// Register new candidate
export const registerCandidates = async (req, res) => {
  try {
    const requiredFields = ['Candidate_Name', 'Age', 'Gender', 'Party_Name'];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }
    const { citizenship_number, NID_number, Candidate_Name, Age, Gender, Party_Name } = req.body;

    const [Existing] = await candidate.execute(
      `SELECT * FROM candidate_list WHERE citizenship_number = ? AND NID_number = ? AND Age = ? AND Gender = ? AND Party_Name = ?`,
      [citizenship_number, NID_number, Age, Gender, Party_Name]
    );
    if (Existing.length > 0) {
      return res.status(409).json({ error: 'Candidate is already registered' });
    }

    await candidate.execute(
      `INSERT INTO candidate_list (citizenship_number, NID_number, Candidate_Name, Age, Gender, Party_Name) VALUES (?, ?, ?, ?, ?, ?)`,
      [citizenship_number, NID_number, Candidate_Name, Age, Gender, Party_Name]
    );
    res.status(201).json({ message: 'Candidate registered successfully' });
  } catch (error) {
    console.error('Error registering candidate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// List all candidates
export const listCandidates = async (req, res) => {
  try {
    const [Existing] = await candidate.execute(`SELECT * FROM candidate_list`);
    res.status(200).json(Existing);
  } catch (error) {
    console.error('Error listing candidates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a candidate
export const removeCandidate = async (req, res) => {
  try {
    const { citizenship_number } = req.body;
    if (!citizenship_number) {
      return res.status(400).json({ error: 'citizenship_number is required' });
    }

    const [existing] = await candidate.execute(
      'SELECT * FROM candidate_list WHERE citizenship_number = ?',
      [citizenship_number]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }

    await candidate.execute(
      'DELETE FROM candidate_list WHERE citizenship_number = ?',
      [citizenship_number]
    );

    return res.status(200).json({ message: 'Candidate removed successfully' });
  } catch (error) {
    console.error('Error removing candidate:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
