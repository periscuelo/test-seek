const list = (application, res) => {
  const sql = /* sql */`
    SELECT * FROM customers`;
  application.utils.common.query(application, res, sql);
};

const discounts = (application, res, customerId) => {
  const sql = /* sql */`
    SELECT discount_id
    FROM customers_discounts
    WHERE customer_id = ?`;
  application.utils.common.query(application, res, sql, customerId, 'discount_id');
};

module.exports = { list, discounts };
