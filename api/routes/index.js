const start = (application) => {
  application.get('/api', (req, res) => {
    res.json({ description: 'It\'s a API for a test! JWT Token is not needed in this case.' });
  });
};

module.exports = { start };
