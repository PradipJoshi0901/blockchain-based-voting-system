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
import { registerFace, verifyFace } from '../controllers/faceController.js'; 

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



export default router;