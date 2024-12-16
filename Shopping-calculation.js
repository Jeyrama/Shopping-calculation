/*
This challenge is about shopping calculation. 
There are products, product's prices, customers and customer's total money.

This challenge takes an input as List of string, 
and this list contains statements which give information about product name, 
product price, customer name and customer budget.

These statements can have 3 basic form like; (is, has, buys)
  "Apple is $5."
  "Alice has $26."
  "Alice buys 2 apples."

Your task is to write a function that calculates the result which is [(string,string,string)] 
and holds [(Customer Name, Customer Total Money, Bought Products)]

"is" statement gives info about product name and its price.
"has" statement gives info about customer name and his/her money.
"buys" statement gives info about customer name, bought product name and bought product count.

You need to split bought products by comma and space(", ") like "2 apples, 5 oranges, 1 grape"

For Example:
  input => [ "Apple is $5.",
             "Banana is $7.",
             "Orange is $2.",
             "Alice has $26.",
             "John has $41.",
             "Alice buys 2 apples.",
             "John buys 1 banana.",
             "Alice buys 5 oranges." ]

Alice has $26 and buys 2 apples, 5 oranges for $20 (2 * 5 + 5 * 2), she keeps $6.
John has $41 and buys 1 banana for $7 (1 * 7), he keeps $34.
So output => [ ("Alice", "$6", "2 apples, 5 oranges"),
               ("John", "$34", "1 banana") ]

The order of statements is not guaranteed. As an example: 
you could receive a buy statement before knowing the cost of the product.

For Example:
  input => [ "John has $41.",
             "Apple is $5.",
             "Alice buys 2 apples.",
             "Alice has $26.",
             "John buys 1 banana.",
             "Alice buys 5 oranges.",
             "Banana is $7.",
             "Orange is $2." ]

Notes:
  Currency is always preceded by the $ symbol.
  Output must be ordered by the placement of customers in the input list.
  Products must be ordered by the order in which they were bought by that customer.
  All input statements will be valid. No need to check for invalid statements.
  Customers will always have enough money for their purchases. No need to validate for negative balances.
  Inputs guarantee that the same customer will not perform multiple purchases for the same product.
  Just use -s as plural suffix.
*/


//Solution

const removeLast = str => str.slice(0, str.length - 1);

const parse = (line) => {
  const input = removeLast(line);
  const [product, price] = input.split(" is $");
  if (price !== undefined) {
    return { product: product.toLowerCase(), price };
  }
  
  const [person, budget] = input.split(" has $");
  if (budget !== undefined) {
    return {person, budget };
  }
  
  const [name, purchase] = input.split(" buys ");
  if (purchase !== undefined) {
    return {person: name, purchase};
  }
}

function shoppingCalculation(input) {
  const productsMap = new Map();
  const personMap = new Map();
  
  input.forEach(line => {
    const res = parse(line);
    if (res.product) {
      productsMap.set(res.product, res.price);
    } else if (res.person) {
      if (!personMap.has(res.person)) {
        personMap.set(res.person, {has: 0, purchases: []});
      }
      const person = personMap.get(res.person);
      if (res.budget !== undefined) {
        personMap.set(res.person, {...person, has: res.budget });
      } else if (res.purchase) {
        const [amount, thing] = res.purchase.split(' ');
        person.purchases.push({amount, thing: amount === '1' ? thing : removeLast(thing)});
      }
    }
  });
  
  return [...personMap].map(
    ([person, {has, purchases}]) => {
         const moneyLeft = purchases.reduce(
           (acc, cur) => acc - productsMap.get(cur.thing) * cur.amount,
           has
         ); 
      return [person, 
              '$' + moneyLeft,
              purchases
              .map(({thing, amount}) => 
                   `${amount} ${thing}${amount > 1 ? 's' : ''}`
              ).join(', ')
             ];
    }  
  )
}

// or