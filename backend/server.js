// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const axios = require('axios');

const app = express();
app.use(cors());

const GITHUB_API_URL = 'https://api.github.com';
const PRIVATE_KEY = fs.readFileSync('./private-key.pem', 'utf8');

function generateJWT() {
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + (10 * 60),
    iss: process.env.GITHUB_APP_ID
  };
  
  return jwt.sign(payload, PRIVATE_KEY, { algorithm: 'RS256' });
}

async function getGithubData(endpoint) {
  const token = generateJWT();
  try {
    const response = await axios.get(
      `${GITHUB_API_URL}/repos/${process.env.GITHUB_OWNER}/${process.env.GITHUB_REPO}${endpoint}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github.v3+json',
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('GitHub API error:', error.message);
    throw error;
  }
}

// Konfiguracja klienta Jira
const jiraClient = axios.create({
  baseURL: `https://${process.env.JIRA_DOMAIN}/rest/api/3`,
  auth: {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN,
  },
});

app.get('/api/github/commits', async (req, res) => {
  try {
    const data = await getGithubData('/commits?per_page=100');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch commits' });
  }
});

app.get('/api/github/last-commits', async (req, res) => {
  try {
    const data = await getGithubData('/commits?per_page=30');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch last commits' });
  }
});

app.get('/api/jira/tasks', async (req, res) => {
  try {
    const { data } = await jiraClient.get('/search', {
      params: {
        jql: 'status = Done',
        fields: ['assignee', 'status', 'updated'],
      },
    });
    res.json(data.issues);
  } catch (error) {
    console.error('Jira API error:', error.message);
    res.status(500).json({ error: 'Failed to fetch Jira tasks' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});