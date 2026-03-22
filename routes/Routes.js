import express from 'express';

import {
  registerCandidates,
  listCandidates,
  removeCandidate
} from '../controllers/CandidateControl.js';
import { registervoter } from '../controllers/CitizenToVoter.js';
import {
  findCitizenByCitizenship,
  updateCitizen
} from '../controllers/CitizenControl.js';
import { registerFace, verifyFace } from '../controllers/FaceControl.js'; 

const router = express.Router();

// Voter Registration
router.post('/registervoter', registervoter);

// Candidate CRUD
router.post('/registercandidate', registerCandidates);
router.get('/listcandidates', listCandidates);
router.delete('/removecandidate', removeCandidate);

// Citizen Management
router.get('/citizen', findCitizenByCitizenship);
router.put('/updatecitizen', updateCitizen);

// Face Biometric                       
router.post('/register-face', registerFace);
router.post('/verify-face', verifyFace);

// Session — check if logged in
router.get('/session', (req, res) => {
  if (req.session.voter && req.session.voter.isVerified) {
    return res.json({ loggedIn: true, voter: req.session.voter });
  }
  return res.json({ loggedIn: false });
});

// Session — logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Logout failed' });
    res.json({ success: true });
  });
});

export default router;