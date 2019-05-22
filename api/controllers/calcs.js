const discounts = (res, {
  discProducts,
  discCustomers,
  item,
  itemIndex,
  items,
  newQuantity,
  quantity,
  discountsPrice
}) => {
  const appData = {};
  appData.error = 0;

  const [discFounds] = discProducts.filter(disc => {
    return discCustomers.find(value => (value === disc.id));
  });

  // Have a discount
  if (discFounds !== undefined) {
    // for for deal
    if (discFounds.amount && discFounds.decrease) {
      if (itemIndex >= 0) {
        const myQty = (items[itemIndex].qty + newQuantity);
        if (myQty < discFounds.amount) {
          newQuantity = myQty;
        } else {
          newQuantity = (
            myQty - (Math.floor(myQty / discFounds.amount) * discFounds.decrease)
          );
        }
        items[itemIndex].subtotal = 0;
      } else if (quantity >= discFounds.amount) {
        newQuantity -= (
          Math.floor(quantity / discFounds.amount) * discFounds.decrease
        );
      }
    // new price per amount
    } else if (discFounds.amount && discFounds.new_price) {
      if (itemIndex >= 0) {
        const myQty = (items[itemIndex].qty + newQuantity);
        if (myQty >= discFounds.amount) {
          discountsPrice = (item.price - discFounds.new_price);
          item.price = discFounds.new_price;
          items[itemIndex].price = item.price;
          items[itemIndex].subtotal = (item.price * items[itemIndex].qty);
        }
      } else if (newQuantity >= discFounds.amount) {
        discountsPrice = (item.price - discFounds.new_price);
        item.price = discFounds.new_price;
      }
    // new price
    } else {
      item.price = discFounds.new_price;
    }
  }

  // cart calculation
  const itemSubtotal = (item.price * newQuantity);

  if (itemIndex >= 0) {
    items[itemIndex].qty += quantity;
    items[itemIndex].subtotal += itemSubtotal;
    items[itemIndex].discount = (
      Math.abs(items[itemIndex].subtotal
              - (items[itemIndex].qty * items[itemIndex].price))
    );
  } else {
    item.qty = quantity;
    item.subtotal = itemSubtotal;
    item.discount = Math.abs(item.subtotal - (item.qty * item.price));
    items.push(item);
  }

  const total = items.reduce((prev, curr) => (prev + curr.subtotal), 0);
  const retDiscounts = (
    items.reduce((prev, curr) => (prev + curr.discount), 0) + discountsPrice
  );

  appData.body = {
    item,
    items,
    newQuantity,
    discountsPrice,
    total,
    discounts: retDiscounts
  }

  res.status(200).json(appData);
}

module.exports = { discounts };
