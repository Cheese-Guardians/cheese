const exportService = require('../services/exportService');
const jwt = require('jsonwebtoken');
const secret = require('../config/secret');
const axios = require('axios');

exports.postSummary = async function (req, res) {
    try {
        const user_id = 'test';

        
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to summarize diary.');
    }
}