import express from 'express';

// Match YOUR screenshot filenames EXACTLY
import {
  registerCandidates,
  listCandidates,
  removeCandidate
} from '../controllers/CandidateControl.js';  // CandidateControl.js
import { registervoter } from '../controllers/CitizenToVoter.js';  // Fixed .js.js → .js
import {
  findCitizenByCitizenship,
  updateCitizen
} from '../controllers/CitizenControl.js';  // CitizenControl.js

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

// Auth (biometric + web3)
router.post('/startlogin', (req, res) => res.json({ test: 'biometric ready' }));
router.post('/verifysignature', (req, res) => res.json({ test: 'signature verified' }));

// Test
router.get('/test', (req, res) => res.json({ 
  status: '✅ FYP API LIVE',
  controllers: ['CandidateControl.js', 'CitizenToVoter.js', 'CitizenControl.js']
}));

export default router;
