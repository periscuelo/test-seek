const query = (application, res, sql, params, mapField) => {
  if (typeof res !== 'undefined') {
    const appData = {};
    application.utils.db.connection.getConnection((err, connection) => {
      if (err) {
        appData.error = 1;
        appData.body = 'Internal Server Error';
        res.status(500).json(appData);
      } else {
        connection.query(sql, [params], (err2, rows) => {
          if (err2) {
            appData.error = 2;
            appData.body = 'Internal Server Error';
            res.status(500).json(appData);
          } else if (rows.length > 0) {
            const mData = (mapField) ? rows.map(data => (data[mapField])) : rows;
            appData.error = 0;
            appData.body = mData;
            res.status(200).json(appData);
          } else {
            res.status(204);
          }
        });
        connection.release();
      }
    });
  }
};

module.exports = { query };
