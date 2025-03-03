// Array to store the cart items
let cart = [];

// Get references to the cart display elements
const cartItemsElement = document.getElementById("cart-items");
const totalPriceElement = document.getElementById("total-price");

// Add event listeners to each "Add to Cart" button
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", function() {
        const productName = this.getAttribute("data-product");
        const productPrice = parseFloat(this.getAttribute("data-price"));
        
        // Add the product to the cart
        addToCart(productName, productPrice);
        
        // Update the cart UI
        updateCart();
    });
});

// Function to add a product to the cart
function addToCart(productName, productPrice) {
    // Check if the product is already in the cart
    const existingProduct = cart.find(item => item.name === productName);
    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({ name: productName, price: productPrice, quantity: 1 });
    }
}

// Function to update the cart UI
function updateCart() {
    // Clear the current cart display
    cartItemsElement.innerHTML = '';

    // Add items from the cart to the display
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
        cartItemsElement.appendChild(li);
    });

    // Calculate and display the total price
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceElement.textContent = total.toFixed(2);
}

// Checkout button functionality
document.getElementById("checkout").addEventListener("click", function() {
    if (cart.length > 0) {
        alert("Checkout successful! Your order is on its way.");
        cart = []; // Empty the cart after checkout
        updateCart();
    } else {
        alert("Your cart is empty.");
    }
});
