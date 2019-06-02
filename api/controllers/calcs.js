const discounts = (res, {
  discFounds,
  item,
  itemIndex,
  items,
  newQuantity,
  quantity,
  discountsPrice
}) => {
  const appData = {};
  appData.error = 0;
  const [myItem] = item;
  const [myDiscFounds] = (discFounds !== undefined) ? discFounds : [];

  // Have a discount
  if (myDiscFounds !== undefined) {
    // for for deal
    if (myDiscFounds.amount && myDiscFounds.decrease) {
      if (itemIndex >= 0) {
        const myQty = (items[itemIndex].qty + newQuantity);
        if (myQty < myDiscFounds.amount) {
          newQuantity = myQty;
        } else {
          newQuantity = (
            myQty - (Math.floor(myQty / myDiscFounds.amount) * myDiscFounds.decrease)
          );
        }
        items[itemIndex].subtotal = 0;
      } else if (quantity >= myDiscFounds.amount) {
        newQuantity -= (
          Math.floor(quantity / myDiscFounds.amount) * myDiscFounds.decrease
        );
      }
    // new price per amount
    } else if (myDiscFounds.amount && myDiscFounds.new_price) {
      if (itemIndex >= 0) {
        const myQty = (items[itemIndex].qty + newQuantity);
        if (myQty >= myDiscFounds.amount) {
          discountsPrice = (myItem.price - myDiscFounds.new_price);
          myItem.price = myDiscFounds.new_price;
          items[itemIndex].price = myItem.price;
          items[itemIndex].subtotal = (myItem.price * items[itemIndex].qty);
        }
      } else if (newQuantity >= myDiscFounds.amount) {
        discountsPrice = (myItem.price - myDiscFounds.new_price);
        myItem.price = myDiscFounds.new_price;
      }
    // new price
    } else {
      myItem.price = myDiscFounds.new_price;
    }
  }

  // cart calculation
  const itemSubtotal = (myItem.price * newQuantity);

  if (itemIndex >= 0) {
    items[itemIndex].qty += quantity;
    items[itemIndex].subtotal += itemSubtotal;
    items[itemIndex].discount = (
      Math.abs(items[itemIndex].subtotal
              - (items[itemIndex].qty * items[itemIndex].price))
    );
  } else {
    myItem.qty = quantity;
    myItem.subtotal = itemSubtotal;
    myItem.discount = Math.abs(myItem.subtotal - (myItem.qty * myItem.price));
    items.push(myItem);
  }

  const total = items.reduce((prev, curr) => (prev + curr.subtotal), 0);
  const retDiscounts = (
    items.reduce((prev, curr) => (prev + curr.discount), 0) + discountsPrice
  );

  appData.body = {
    items,
    newQuantity,
    discountsPrice,
    total,
    discounts: retDiscounts
  }

  res.status(200).json(appData);
}

const removeDiscounts = (res, {
  total,
  index,
  items,
  discountsPrice
}) => {
  const appData = {};
  appData.error = 0;

  total -= items[index].subtotal;
  discountsPrice = (items[index].discount === 0) ? 0 : discountsPrice;
  items.splice(index, 1);
  const discounts = (
    items.reduce((prev, curr) => (prev + curr.discount), 0) + discountsPrice
  );

  appData.body = {
    total,
    items,
    discountsPrice,
    discounts
  }

  res.status(200).json(appData);
}

module.exports = { discounts, removeDiscounts };
