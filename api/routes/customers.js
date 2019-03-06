const start = (application) => {
  application.get('/api/customers', (req, res) => {
    application.models.customers.list(application, res);
  });

  application.get('/api/customers/discounts/:customerId', (req, res) => {
    const { customerId } = req.params;
    application.models.customers.discounts(application, res, customerId);
  });
};

module.exports = { start };
