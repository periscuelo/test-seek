const start = (application) => {
  application.get('/api', (req, res) => {
    res.json({ description: 'It\'s a API for a test! JWT Token is not needed in this case.' });
  });

  application.post('/api/discounts', (req, res) => {
    application.controllers.calcs.discounts(res, req.body);
  });

  application.post('/api/remove-discount', (req, res) => {
    application.controllers.calcs.removeDiscounts(res, req.body);
  });
};

module.exports = { start };
