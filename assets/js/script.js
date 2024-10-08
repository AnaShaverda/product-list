let totalPrice = 0;
let cartItems = {}; // Object to store items in cart with quantity

async function getData() {
  const dataFile = "data.json";
  try {
    const response = await fetch(dataFile);
    const data = await response.json();
    console.log(data);
    displayProducts(data);
  } catch (error) {
    console.error(error);
  }
}

getData();

const displayProducts = (products) => {
  const productList = document.querySelector(".productList");
  for (const productData of products) {
    const productDiv = document.createElement("div");

    productDiv.innerHTML = `
      <img src=${productData.image.desktop} alt=${productData.name} class="image"/> </br>
      <span class="product-name">${productData.category}</span> </br>
      <span class="product-name">${productData.name}</span> </br>
      <span class="product-name">${productData.price}</span> </br>
      <button class="productBtn">Add to Cart</button>
    `;

    productList.appendChild(productDiv);
    const itemBtn = productDiv.querySelector(".productBtn");
    itemBtn.addEventListener("click", () => {
      addToCart(productData);
    });
  }
};

const addToCart = (productData) => {
  const cartList = document.querySelector(".cartList");

  // Check if the product is already in the cart
  if (cartItems[productData.name]) {
    cartItems[productData.name].quantity += 1; // Increment the quantity
    cartItems[productData.name].element.querySelector(
      ".item-quantity"
    ).innerText = `Quantity: ${cartItems[productData.name].quantity}`;
  } else {
    // Create a new cart item
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    cartItem.innerHTML = `
      <span class="product-name">${productData.category}</span> </br>
      <span class="product-name">${productData.name}</span> </br>
      <span class="product-price">${productData.price}</span> </br>
      <span class="item-quantity">Quantity: 1</span> </br>
      <button class="removeBtn">Remove</button>
    `;

    cartList.appendChild(cartItem);

    // Add product to cartItems with quantity and element reference
    cartItems[productData.name] = {
      quantity: 1,
      price: parseFloat(productData.price),
      element: cartItem,
    };

    // Add event listener to remove the item
    const removeBtn = cartItem.querySelector(".removeBtn");
    removeBtn.addEventListener("click", () => {
      if (cartItems[productData.name].quantity > 1) {
        // Decrease the quantity and update the total price
        cartItems[productData.name].quantity -= 1;
        totalPrice -= cartItems[productData.name].price;

        // Update the displayed quantity
        cartItem.querySelector(".item-quantity").innerText = `Quantity: ${
          cartItems[productData.name].quantity
        }`;
      } else {
        // If quantity is 1, remove the item completely
        totalPrice -= cartItems[productData.name].price;
        cartItem.remove();
        delete cartItems[productData.name]; // Remove the item from cartItems
      }

      // Update the total price display
      updateTotal();
    });
  }

  totalPrice += parseFloat(productData.price);
  updateTotal();
};

const updateTotal = () => {
  const totalElement = document.querySelector(".total");
  totalElement.innerHTML = `Total price: ${totalPrice.toFixed(2)} $`;
};
