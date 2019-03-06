const start = (application) => {
  application.get('/api/products', (req, res) => {
    application.models.products.list(application, res);
  });

  application.get('/api/products/discounts/:productId', (req, res) => {
    const { productId } = req.params;
    application.models.products.discounts(application, res, productId);
  });
};

module.exports = { start };
