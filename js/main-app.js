document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart counter
    const cartCounter = document.getElementById('p-num');
    cartCounter.style.display = 'none';

    fetch('/js/product.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const productsContainer = document.getElementById('products-cart');
            const searchInput = document.getElementById('s-input');
            let allProducts = data.products; // Store all products for filtering

            // Initialize product quantity from cart
            function initializeProductQuantities() {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                allProducts.forEach(product => {
                    const cartItem = cartItems.find(item => item.model === product.model);
                    product.quantity = cartItem ? cartItem.quantity : 0;
                });
            }

            function filterProductsByClassification(classification) {
                const filteredProducts = allProducts.filter(product =>
                    product.classification === classification
                );
                displayProducts(filteredProducts);
            }

            // Create product card HTML
            function createProductCard(product, index) {
                return `
                    <div class="col-12 col-sm-6 col-md-4 col-lg-3 text-center">
                        <div class="col">
                            <div class="card card-product">
                                <img src="${product.image}" class="card-img-top card-product-image" alt="${product.name}">
                                <div class="card-body card-product-body d-flex flex-column">
                                    <a href="product-details.html?id=${index}" class="card-product-title">${product.name}</a>
                                    <p class="card-product-price mt-auto">${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(product.price)} تومان</p>
                                    <div class="btn-group quantity-control" style="display: none;" data-product-index="${index}">
                                        <button class="btn btn-sm btn-outline-secondary remove-from-cart">-</button>
                                        <input type="text" disabled class="form-control quantity-input" value="${product.quantity}">
                                        <button class="btn btn-sm btn-outline-secondary add-to-cart">+</button>
                                    </div>
                                    <button class="btn btn-success card-product-btn add-to-shop-list" data-product-index="${index}">
                                        افزودن به سبد خرید
                                        <span class="material-symbols-outlined">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>`;
            }

            // Display products
            function displayProducts(products) {
                productsContainer.innerHTML = products.map((product, index) =>
                    createProductCard(product, index)
                ).join('');

                addEventListeners();
                updateButtonVisibility();
                updateQuantityDisplays();
            }

            // Check if product is in cart
            function isProductInCart(product) {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                return cartItems.some(item => item.model === product.model);
            }

            // Update button visibility
            function updateButtonVisibility() {
                document.querySelectorAll('.add-to-shop-list').forEach(button => {
                    const index = button.getAttribute('data-product-index');
                    const product = allProducts[index];
                    const quantityControl = button.previousElementSibling;

                    if (isProductInCart(product)) {
                        button.style.display = 'none';
                        quantityControl.style.display = 'flex';
                    } else {
                        button.style.display = 'inline-block';
                        quantityControl.style.display = 'none';
                    }
                });
            }

            // Add to cart
            function addToCart(index) {
                const product = allProducts[index];
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const existingItem = cartItems.find(item => item.model === product.model);

                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    const productCopy = { ...product, quantity: 1 };
                    cartItems.push(productCopy);
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartCount();
                updateQuantityDisplays();
                updateButtonVisibility();
            }

            // Remove from cart
            function removeFromCart(index) {
                const product = allProducts[index];
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const existingItem = cartItems.find(item => item.model === product.model);

                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        existingItem.quantity -= 1;
                    } else {
                        cartItems = cartItems.filter(item => item.model !== product.model);
                    }
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartCount();
                updateQuantityDisplays();
                updateButtonVisibility();
            }

            // Update cart counter
            function updateCartCount() {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);

                if (count > 0) {
                    cartCounter.style.display = 'block';
                    cartCounter.textContent = count;
                } else {
                    cartCounter.style.display = 'none';
                }
            }

            // Update all quantity displays
            function updateQuantityDisplays() {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

                document.querySelectorAll('.quantity-control').forEach(control => {
                    const index = control.getAttribute('data-product-index');
                    const product = allProducts[index];
                    const cartItem = cartItems.find(item => item.model === product.model);
                    const input = control.querySelector('.quantity-input');

                    if (input) {
                        input.value = cartItem ? cartItem.quantity : 0;
                        product.quantity = cartItem ? cartItem.quantity : 0;
                    }
                });
            }

            // Add event listeners
            function addEventListeners() {
                // Add to cart buttons
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.closest('.quantity-control').getAttribute('data-product-index');
                        addToCart(index);
                    });
                });

                // Add event listeners to dropdown items
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', (event) => {
                        event.preventDefault();
                        const classification = item.id;
                        filterProductsByClassification(classification);
                    });
                });

                // Remove from cart buttons
                document.querySelectorAll('.remove-from-cart').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.closest('.quantity-control').getAttribute('data-product-index');
                        removeFromCart(index);
                    });
                });

                // Add to shop list buttons
                document.querySelectorAll('.add-to-shop-list').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const index = e.target.getAttribute('data-product-index');
                        addToCart(index);
                    });
                });
            }

            // Search functionality
            function setupSearch() {
                searchInput.addEventListener('input', () => {
                    const query = searchInput.value.toLowerCase();
                    const filtered = allProducts.filter(product =>
                        product.name.toLowerCase().includes(query) ||
                        product.model.toLowerCase().includes(query)
                    );
                    displayProducts(filtered);
                });
            }

            // Initialize everything
            initializeProductQuantities();
            displayProducts(allProducts);
            setupSearch();
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
            alert('خطا در دریافت اطلاعات محصولات. لطفاً دوباره تلاش کنید.');
        });
});