// Array to store the cart items
let cart = [];
let totalPrice = 0;

// Function to add an item to the cart
function addToCart(product) {
  cart.push(product);
  updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
  const cartItemsList = document.getElementById('cart-items');
  cartItemsList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    cartItemsList.appendChild(li);
  });
  calculateTotal();
}

// Function to calculate the total price
function calculateTotal() {
  // Example pricing for products
  const prices = {
    'Product 1': 10.00,
    'Product 2': 15.00
  };
  
  totalPrice = cart.reduce((total, item) => total + prices[item], 0);
  document.getElementById('total-price').textContent = totalPrice.toFixed(2);
} 
function shareProduct(platform) {
  alert(`Shared on ${platform}`);
}
 
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
  } else {
    alert(`Checking out with ${cart.length} item(s). Total: $${totalPrice.toFixed(2)}`);
    cart = [];  
    updateCartDisplay();  
  }
}
