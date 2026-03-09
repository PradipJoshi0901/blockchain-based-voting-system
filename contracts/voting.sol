// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Voting {

    struct Candidate {
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;      // id => Candidate
    mapping(string => uint) private candidateIds;      // name => id
    mapping(address => bool) public hasVoted;          // track voters
    uint public countCandidates;

    // Vote for a candidate by name
    function vote(string memory name) public {
        require(!hasVoted[msg.sender], "Already voted");
        hasVoted[msg.sender] = true;

        uint candidateID = candidateIds[name];

        if (candidateID == 0) {
            // Candidate not on blockchain yet
            countCandidates++;
            candidateID = countCandidates;
            candidates[candidateID] = Candidate(candidateID, name, 1);
            candidateIds[name] = candidateID;  // store id for future votes
        } else {
            // Candidate already exists, increment vote
            candidates[candidateID].voteCount++;
        }
    }

    // Get a candidate by ID
    function getCandidate(uint candidateID) public view returns (uint, string memory, uint) {
        Candidate storage c = candidates[candidateID];
        return (c.id, c.name, c.voteCount);
    }

    // Get total candidates registered on-chain
    function getCountCandidates() public view returns (uint) {
        return countCandidates;
    }

    // Check if an address has voted
    function checkVote(address voter) public view returns (bool) {
        return hasVoted[voter];
    }

    // Get all candidates stored on blockchain with their vote counts
    function getAllCandidates() public view returns (uint[] memory, string[] memory, uint[] memory) {
        uint[] memory ids = new uint[](countCandidates);
        string[] memory names = new string[](countCandidates);
        uint[] memory votes = new uint[](countCandidates);

        for (uint i = 1; i <= countCandidates; i++) {
            Candidate storage c = candidates[i];
            ids[i-1] = c.id;
            names[i-1] = c.name;
            votes[i-1] = c.voteCount;
        }

        return (ids, names, votes);
    }
}