/*
document.addEventListener('DOMContentLoaded', () => {
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const cartContainer = document.getElementById('show-product-shop');
  const TotalPriceContainer = document.getElementById('TotalPrice');
  const cargo = document.getElementById('sending-fee');
  const tax_html = document.getElementById('tax');

  function displayCartItems() {
    cartContainer.innerHTML = ''; 
    let cartHTML = '';
    let TotalPrice = 0;
    let TotalShippingFee = 0;

    if (cartItems.length === 0) {
      cartContainer.innerHTML = '<p class="mt-5 alert alert-info mx-auto col col-3 text-center">سبد خرید شما خالی است.</p>';
      TotalPriceContainer.innerHTML = `
        <strong>مجموع کل: ۰ تومان</strong>`;
      cargo.innerHTML = ''; // Clear shipping fee
      tax_html.innerHTML = '';
      return;
    }

    cartItems.forEach((item, index) => {
      const itemTotalPrice = item.price * item.quantity; 
      TotalPrice += itemTotalPrice; 

      // Calculate shipping fee for each item
      if (item.price < 100000) {
        TotalShippingFee += 5000 * item.quantity;
      }

      cartHTML += `
                     <div class="card p-3 rounded-4 card-product-shop">
                        <div class="row align-items-center g-3">
                            <div class="col-md-2 text-center">
                                <img src="${product.image}" class="img-fluid cart-item-img" alt="${product.name}">
                            </div>
                            <div class="col-md-4">
                                <h5 class="cart-item-title mb-1">${product.name}</h5>
                                <small class="text-muted">${product.model}</small>
                            </div>
                            <div class="col-md-2 text-center">
                                <p class="mb-0 fw-bold">${product.price.toLocaleString('fa-IR')} تومان</p>
                            </div>
                            <div class="col-md-2 text-center">
                                <div class="input-group">
                                    <button class="btn btn-sm btn-success quantity-increase" data-model="${product.model}">+</button>
                                    <input type="text" class="form-control text-center" value="${cartItem.quantity.toLocaleString('fa-IR')}" readonly>
                                    <button class="btn btn-sm btn-danger quantity-decrease" data-model="${product.model}">-</button>
                                </div>
                            </div>
                            <div class="col-md-2 text-center d-flex justify-content-between align-items-center">
                                <p class="mb-0 fw-bold text-primary flex-grow-1">${itemTotal.toLocaleString('fa-IR')} تومان</p>
                                <button class="btn btn-sm btn-outline-danger ms-2 remove-from-cart" data-model="${product.model}">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
      `;
    });

    // Calculate tax (10% of total price + shipping fee)
    const tax = (TotalPrice + TotalShippingFee) * 0.1;

    // Calculate grand total
    const grandTotal = TotalPrice + TotalShippingFee + tax;

    // Display shipping fee
    if(TotalPrice > 100000){
      TotalShippingFee = 0;
    }
    cargo.innerHTML = (TotalShippingFee > 0)? `<p class="text-center"><img src="icon/cargo.png" alt="send"><br>هزینه ارسال: ${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(TotalShippingFee)} تومان</p>` : '';
    //Display tax 
    tax_html.innerHTML = tax > 0 ?  `<p class="text-center"><img src="icon/tax.png" alt="send"><br>مالیات (10%): ${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(tax)} تومان</p>`:'';
    // Display total price
    TotalPriceContainer.innerHTML = ` 
      <strong>مجموع کل: ${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(grandTotal)} تومان</p>`;

    cartContainer.innerHTML = cartHTML; 
  }

  window.updateQuantity = function (index, newQuantity) {
    const parsedQuantity = parseInt(newQuantity, 10); 
    if (!isNaN(parsedQuantity)){ 
      if (parsedQuantity > 0) {
        cartItems[index].quantity = parsedQuantity; 
      } else {
        cartItems.splice(index, 1); 
      }
      localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
      displayCartItems(); 
    }
  };

  window.decreaseQuantity = function (index) {
    if (cartItems[index].quantity > 1) {
      cartItems[index].quantity -= 1; 
    } else {
      cartItems.splice(index, 1); 
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
    displayCartItems(); 
  };

  window.increaseQuantity = function (index) {
    cartItems[index].quantity += 1; 
    localStorage.setItem('cartItems', JSON.stringify(cartItems)); 
    displayCartItems(); 
  };

  displayCartItems();
});

*/


// Function to update the cart badge on all pages
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElements = document.querySelectorAll('#p-num');

    badgeElements.forEach(badgeElement => {
        if (badgeElement) {
            if (totalItems > 0) {
                badgeElement.innerText = totalItems.toLocaleString('fa-IR');
                badgeElement.style.display = 'block';
            } else {
                badgeElement.style.display = 'none';
            }
        }
    });
}

// Function to get product data
async function getProducts() {
    try {
        const response = await fetch('js/product.json');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return null;
    }
}

// Function to render cart items
async function renderCart() {
    const cartItemsContainer = document.getElementById('show-product-shop');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const productsData = await getProducts();

    if (!productsData) {
        cartItemsContainer.innerHTML = '<div class="alert alert-danger">خطا در بارگذاری محصولات.</div>';
        return;
    }

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    cartItemsContainer.innerHTML = '';

    if (cartItems.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        cartItems.forEach(cartItem => {
            const product = Object.values(productsData).find(p => p.model === cartItem.model);
            if (product) {
                const itemTotal = product.price * cartItem.quantity;
                const cartItemHTML = `
                    <div class="card p-3 rounded-4 card-product-shop">
                        <div class="row align-items-center g-3">
                            <div class="col-md-2 text-center">
                                <img src="${product.image}" class="img-fluid cart-item-img" alt="${product.name}">
                            </div>
                            <div class="col-md-4">
                                <h5 class="cart-item-title mb-1">${product.name}</h5>
                                <small class="text-muted">${product.model}</small>
                            </div>
                            <div class="col-md-2 text-center">
                                <p class="mb-0 fw-bold">${product.price.toLocaleString('fa-IR')} تومان</p>
                            </div>
                            <div class="col-md-2 text-center">
                                <div class="input-group">
                                    <button class="btn btn-sm btn-success quantity-increase" data-model="${product.model}">+</button>
                                    <input type="text" class="form-control text-center" value="${cartItem.quantity.toLocaleString('fa-IR')}" readonly>
                                    <button class="btn btn-sm btn-danger quantity-decrease" data-model="${product.model}">-</button>
                                </div>
                            </div>
                            <div class="col-md-2 text-center d-flex justify-content-between align-items-center">
                                <p class="mb-0 fw-bold text-primary flex-grow-1">${itemTotal.toLocaleString('fa-IR')} تومان</p>
                                <button class="btn btn-sm btn-outline-danger ms-2 remove-from-cart" data-model="${product.model}">
                                    <span class="material-symbols-outlined">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                cartItemsContainer.insertAdjacentHTML('beforeend', cartItemHTML);
            }
        });

        // Add event listeners for quantity buttons
        cartItemsContainer.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', (e) => {
                const model = e.currentTarget.dataset.model;
                addToCartByModel(model);
                renderCart();
            });
        });

        cartItemsContainer.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', (e) => {
                const model = e.currentTarget.dataset.model;
                decreaseFromCartByModel(model);
                renderCart();
            });
        });
        
        // ---- New event listener for the remove button ----
        cartItemsContainer.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const model = e.currentTarget.dataset.model;
                removeFromCartByModel(model);
                renderCart();
            });
        });
        // ---------------------------------------------------
    }

    updateSummary();
    updateCartBadge();
}

// Function to add a product to the cart
function addToCartByModel(model) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.model === model);

    if (existingItem) {
        existingItem.quantity += 1;
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

// Function to decrease quantity of a product from cart
function decreaseFromCartByModel(model) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(item => item.model === model);

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity -= 1;
        if (cartItems[existingItemIndex].quantity <= 0) {
            cartItems.splice(existingItemIndex, 1);
        }
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
}

// ---- New function to remove an item completely from cart ----
function removeFromCartByModel(model) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const updatedCartItems = cartItems.filter(item => item.model !== model);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
}
// -------------------------------------------------------------

// Function to update the summary card
async function updateSummary() {
    const productsData = await getProducts();
    if (!productsData) return;

    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    let subTotal = 0;
    
    cartItems.forEach(cartItem => {
        const product = Object.values(productsData).find(p => p.model === cartItem.model);
        if (product) {
            subTotal += product.price * cartItem.quantity;
        }
    });

    const taxRate = 0.09; // 9% tax
    const taxAmount = subTotal * taxRate;
    const shippingFee = subTotal > 0 ? 35000 : 0; // Fixed shipping fee
    const totalPrice = subTotal + taxAmount + shippingFee;

    document.getElementById('sub-total').textContent = subTotal.toLocaleString('fa-IR') + ' تومان';
    document.getElementById('tax-amount').textContent = Math.round(taxAmount).toLocaleString('fa-IR') + ' تومان';
    document.getElementById('shipping-fee').textContent = shippingFee.toLocaleString('fa-IR') + ' تومان';
    document.getElementById('total-price').textContent = totalPrice.toLocaleString('fa-IR') + ' تومان';
    document.getElementById('tax-rate').textContent = (taxRate * 100) + '%';


    // Show/hide empty cart message and summary card
    const shopSummaryCard = document.querySelector('.shop-summary-card');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    if (subTotal === 0) {
        shopSummaryCard.style.display = 'none';
        emptyCartMessage.style.display = 'block';
    } else {
        shopSummaryCard.style.display = 'block';
        emptyCartMessage.style.display = 'none';
    }
}

// Initialize the page on DOM content load
document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    updateCartBadge();
});