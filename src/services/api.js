// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_URL,
});

export const githubService = {
  async getCommits() {
    try {
      const { data } = await apiClient.get('/github/commits');
      return data.filter(commit => !commit.commit.message.toLowerCase().startsWith('merge'));
    } catch (error) {
      console.error('Error fetching commits:', error);
      return [];
    }
  },

  async getLastCommits() {
    try {
      const { data } = await apiClient.get('/github/last-commits');
      return data;
    } catch (error) {
      console.error('Error fetching last commits:', error);
      return [];
    }
  }
};

export const jiraService = {
  async getCompletedTasks() {
    try {
      const { data } = await apiClient.get('/jira/tasks');
      return data;
    } catch (error) {
      console.error('Error fetching Jira tasks:', error);
      return [];
    }
  }
};