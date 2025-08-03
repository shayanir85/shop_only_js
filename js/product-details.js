// Toast notification setup
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000
});

// Helper function to get URL parameters
function getQueryParam(param) {
    const url = new URLSearchParams(window.location.search);
    return url.get(param);
}

// Helper functions to generate HTML for specs and features
function joinFeatures(features) {
    return Object.entries(features).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>
        </tr>
    `).join('');
}

function joinSpecs(specs) {
    return Object.entries(specs).map(([key, value]) => `
        <tr>
            <td>${key}</td>
            <td>${typeof value === 'object' ? JSON.stringify(value) : value}</td>
        </tr>
    `).join('');
}

// Cart management functions
function updateCartDisplay(quantityDisplay, btnGroup, addButton, quantity) {
    quantityDisplay.value = quantity;
    if (quantity > 0) {
        btnGroup.style.display = 'flex';
        addButton.style.display = 'none';
    } else {
        btnGroup.style.display = 'none';
        addButton.style.display = 'block';
    }
}

function addToCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItem = cartItems.find(item => item.model === product.model);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    return cartItems.find(item => item.model === product.model).quantity;
}

function decreaseFromCart(product) {
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const existingItemIndex = cartItems.findIndex(item => item.model === product.model);

    if (existingItemIndex !== -1) {
        cartItems[existingItemIndex].quantity -= 1;
        
        if (cartItems[existingItemIndex].quantity <= 0) {
            cartItems.splice(existingItemIndex, 1);
        }
        
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
    
    return cartItems[existingItemIndex]?.quantity || 0;
}

// Main function to load and display product
function loadProductDetails() {
    const productId = getQueryParam('id');
    const productDetails = document.getElementById('product-details');

    if (!productId) {
        productDetails.innerHTML = '<p class="text-center">محصول یافت نشد.</p>';
        return;
    }

    fetch('js/product.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const product = data.products[productId];
            
            if (!product) {
                productDetails.innerHTML = '<p class="text-center">محصول یافت نشد.</p>';
                return;
            }

            const specsHTML = product.specs ? joinSpecs(product.specs) : '';
            const featuresHTML = product.features ? joinFeatures(product.features) : '';
            
            productDetails.innerHTML = `
                <div class="row align-items-center">
                    <div class="col-md-6">
                        <img src="${product.image}" class="img-fluid product-image" alt="${product.name}">
                    </div>
                    <div class="col-md-6 product-info">
                        <h1>${product.name}</h1>
                        <h5>${product.model}</h5>
                        <div class="table-responsive">
                            <table class="table">
                                <tr>
                                    <td>قیمت</td>
                                    <td>${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(product.price)} تومان</td>
                                </tr>
                                ${product.connection ? `<tr>
                                    <td>اتصال</td>
                                    <td>${product.connection}</td>
                                </tr>` : ''}
                                ${product.type ? `<tr>
                                    <td>نوع اتصال</td>
                                    <td>${product.type}</td>
                                </tr>` : ''}
                                ${product.graphics ? `<tr>
                                    <td>گرافیک</td>
                                    <td>${product.graphics}</td>
                                </tr>` : ''}
                                ${specsHTML}
                                ${featuresHTML}
                            </table>
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-success add-to-cart" data-index="${productId}">
                                افزودن به سبد خرید
                                <span class="material-symbols-outlined" style="vertical-align: middle;">add_shopping_cart</span>
                            </button>
                            <div class="btn-group quantity-control ">
                                <button class="btn btn-success btn-sm me-2 quantity-increase" data-index="${productId}">+</button>
                                <input type="text" class="form-control text-center quantity-display" value="1" readonly>
                                <button class="btn btn-danger btn-sm me-2 quantity-decrease" data-index="${productId}">-</button>                        
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Initialize quantity controls
            const addButton = productDetails.querySelector('.add-to-cart');
            const quantityControl = productDetails.querySelector('.quantity-control');
            const quantityDisplay = productDetails.querySelector('.quantity-display');
            const increaseBtn = productDetails.querySelector('.quantity-increase');
            const decreaseBtn = productDetails.querySelector('.quantity-decrease');

            // Check if product is already in cart
            const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const cartItem = cartItems.find(item => item.model === product.model);
            
            if (cartItem) {
                updateCartDisplay(quantityDisplay, quantityControl, addButton, cartItem.quantity);
            }

            // Event listeners
            addButton.addEventListener('click', () => {
                const newQuantity = addToCart(product);
                updateCartDisplay(quantityDisplay, quantityControl, addButton, newQuantity);
                
                Toast.fire({
                    icon: 'success',
                    title: 'محصول مورد نظر اضافه شد'
                });
            });

            increaseBtn.addEventListener('click', () => {
                const newQuantity = addToCart(product);
                updateCartDisplay(quantityDisplay, quantityControl, addButton, newQuantity);
            });

            decreaseBtn.addEventListener('click', () => {
                const newQuantity = decreaseFromCart(product);
                updateCartDisplay(quantityDisplay, quantityControl, addButton, newQuantity);
            });
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
            productDetails.innerHTML = `
                <div class="alert alert-danger">
                    خطا در بارگذاری اطلاعات محصول. لطفا دوباره تلاش کنید.
                </div>
            `;
        });
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', loadProductDetails);