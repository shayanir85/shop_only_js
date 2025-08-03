document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('p-num').style.display = 'none';
    fetch('/js/product.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            const productsContainer = document.getElementById('products-cart');
            const s_input = document.getElementById('s-input');

            // Function to generate product HTML
            function createProductCard(product, index) {
                const card = document.createElement('div');
                card.className = 'col-12 col-sm-6 col-md-4 col-lg-3 text-center';
                card.innerHTML = `
                <div class="card m-2 overflow-hidden" style="width: 100%;">
                    <img id="image${index}" src="${product.image}" alt="${product.name}" class="img-fluid">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.model}</p>
                        <p>${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(product.price)} تومان</p>
                        <div class="btn-group">
                            <button class="btn rounded btn-success add-to-cart" data-index="${index}">+</button>
                            <a href="product-details.html?id=${index}" class="rounded btn btn-primary">مشخصات</a>
                            <button class="btn rounded btn-danger remove-from-cart" data-index="${index}">-</button>                        
                        </div>
                        <button class="btn btn-warning add-to-shop-list" data-index="${index}">
                            <img style="height: 30px;" src="icon/add.png" alt="Add to Cart">
                        </button>
                    </div>
                </div>`;
                return card;
            }

            // Function to display products
            function displayProducts(products) {
                productsContainer.innerHTML = ''; // Clear the container
                products.forEach((product, index) => {
                    const productCard = createProductCard(product, index);
                    productsContainer.appendChild(productCard);
                });
                addEventListeners(); // Add event listeners after rendering
                updateButtonVisibility(); // Update button visibility
            }

            // Function to check if a product is in the cart
            function isProductInCart(product) {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                return cartItems.some(item => item.model === product.model);
            }

            // Function to update button visibility
            function updateButtonVisibility() {
                const addToShopListButtons = document.querySelectorAll('.add-to-shop-list');
                const btnGroups = document.querySelectorAll('.btn-group');

                addToShopListButtons.forEach((button, index) => {
                    const product = data.products[index];
                    const btnGroup = button.previousElementSibling;

                    if (isProductInCart(product)) {
                        button.style.display = 'none'; // Hide "Add to Shop List" button
                        btnGroup.style.display = 'inline-block'; // Show + and - buttons
                    } else {
                        button.style.display = 'inline-block'; // Show "Add to Shop List" button
                        btnGroup.style.display = 'none'; // Hide + and - buttons
                    }
                });
            }

            // Function to add a product to the cart
            function addToCart(product) {
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const existingItem = cartItems.find(item => item.model === product.model);

                if (existingItem) {
                    existingItem.quantity += 1; // Increase quantity
                } else {
                    product.quantity = 1; // Add quantity property
                    cartItems.push(product);
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartCount();
                updateButtonVisibility();
            }

            // Function to remove a product from the cart
            function removeFromCart(product) {
                let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const existingItem = cartItems.find(item => item.model === product.model);

                if (existingItem) {
                    if (existingItem.quantity > 1) {
                        existingItem.quantity -= 1; // Decrease quantity
                    } else {
                        cartItems = cartItems.filter(item => item.model !== product.model); // Remove item
                    }
                }

                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                updateCartCount();
                updateButtonVisibility();
            }

            // Function to update the cart count
            function updateCartCount() {
                const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
                const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

                if (cartCount > 0) {
                    document.getElementById('p-num').style.display = 'block';
                    document.getElementById('p-num').innerHTML = cartCount;
                } else {
                    document.getElementById('p-num').style.display = 'none';
                }
            }

            // Function to add event listeners
            function addEventListeners() {
                // Add to cart buttons
                document.querySelectorAll('.add-to-cart').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.getAttribute('data-index');
                        addToCart(data.products[index]);
                    });
                });

                // Remove from cart buttons
                document.querySelectorAll('.remove-from-cart').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.getAttribute('data-index');
                        removeFromCart(data.products[index]);
                    });
                });
                // Add event listeners to dropdown items
                document.querySelectorAll('.dropdown-item').forEach(item => {
                    item.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent default link behavior
                        const classification = item.id; // Get the classification from the id
                        filterProductsByClassification(classification); // Filter products
                    });
                });

                // Function to filter products by classification
                function filterProductsByClassification(classification) {
                    const filteredProducts = data.products.filter(product => product.classification === classification);
                    displayProducts(filteredProducts); // Display filtered products
                }
                // Add to shop list buttons
                document.querySelectorAll('.add-to-shop-list').forEach(button => {
                    button.addEventListener('click', () => {
                        const index = button.getAttribute('data-index');
                        addToCart(data.products[index]);
                        button.style.display = 'none'; // Hide the button
                        button.previousElementSibling.style.display = 'inline-block'; // Show + and - buttons
                    });
                });
            }

            // Initial display of products
            displayProducts(data.products);
            updateCartCount();

            // Search functionality
            s_input.addEventListener('input', () => {
                const query = s_input.value.toLowerCase();
                const filteredProducts = data.products.filter(product =>
                    product.name.toLowerCase().includes(query) ||
                    product.model.toLowerCase().includes(query)
                );
                displayProducts(filteredProducts);
            });
        })
        .catch(error => {
            console.error('Failed to fetch data:', error);
            alert('خطا در دریافت اطلاعات محصولات. لطفاً دوباره تلاش کنید.');
        });
});