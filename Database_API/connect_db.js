import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();  // Loads .env

// Citizen pool
const citizen_pool = mysql.createPool({
    host: process.env.citizen_database_HOST,
    user: process.env.citizen_database_USER,
    password: process.env.citizen_database_PASSWORD,
    database: process.env.citizen_database_NAME,
    port: process.env.citizen_database_PORT,
    connectionLimit: 10,
});
export const citizen_database = citizen_pool;

// Voter pool
const voter_pool = mysql.createPool({
    host: process.env.voting_database_HOST,
    user: process.env.voting_database_USER,
    password: process.env.voting_database_PASSWORD,
    database: process.env.voting_database_NAME,
    port: process.env.voting_database_PORT,
    connectionLimit: 10,
});
export const voter_database = voter_pool;

// Candidate pool  
const candidate_pool = mysql.createPool({
    host: process.env.candidate_database_HOST,
    user: process.env.candidate_database_USER,
    password: process.env.candidate_database_PASSWORD,
    database: process.env.candidate_database_NAME,
    port: process.env.candidate_database_PORT,
    connectionLimit: 10,
});
export const candidate = candidate_pool;
