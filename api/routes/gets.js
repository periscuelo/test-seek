const start = (application) => {
  application.get('/api', (req, res) => {
    res.json({ description: 'It\'s a API for a test! JWT Token is not needed in this case.' });
  });

  application.get('/api/customers', (req, res) => {
    application.models.customers.list(application, res);
  });

  application.get('/api/customers/discounts/:customerId', (req, res) => {
    const { customerId } = req.params;
    application.models.customers.discounts(application, res, customerId);
  });

  application.get('/api/products', (req, res) => {
    application.models.products.list(application, res);
  });

  application.get('/api/products/discounts/:productId', (req, res) => {
    const { productId } = req.params;
    application.models.products.discounts(application, res, productId);
  });
};

module.exports = { start };
