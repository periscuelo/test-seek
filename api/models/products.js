const list = (application, res) => {
  const sql = /* sql */`
    SELECT * FROM products`;
  application.utils.common.query(application, res, sql);
};

const discounts = (application, res, productId) => {
  const sql = /* sql */`
    SELECT id,
            amount,
            decrease,
            new_price
    FROM products_discounts
    WHERE product_id = ?`;
  application.utils.common.query(application, res, sql, productId);
};

module.exports = { list, discounts };
