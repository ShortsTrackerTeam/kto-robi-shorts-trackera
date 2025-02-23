const jwt = require('jsonwebtoken');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const GITHUB_API_URL = 'https://api.github.com';

function generateJWT() {
  // Wczytujemy klucz z pliku .pem
  const privateKeyPath = path.join(__dirname, '..', '..', 'private-key.pem');
  const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
  
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iat: now - 60,
    exp: now + (10 * 60),
    iss: process.env.GITHUB_APP_ID
  };
  
  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
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

exports.handler = async function(event) {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    };
  }

  try {
    let data;
    if (event.path.endsWith('/commits')) {
      data = await getGithubData('/commits?per_page=100');
    } else if (event.path.endsWith('/last-commits')) {
      data = await getGithubData('/commits?per_page=30');
    } else {
      return {
        statusCode: 404,
        body: 'Not Found'
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch data from GitHub' })
    };
  }
};