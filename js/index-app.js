// Function to update the cart badge on all pages
function updateCartBadge() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const badgeElement = document.getElementById('p-num');

    if (badgeElement) {
        if (totalItems > 0) {
            badgeElement.innerText = totalItems.toLocaleString('fa-IR');
            badgeElement.style.display = 'block';
        } else {
            badgeElement.style.display = 'none';
        }
    }
}

// Function to generate and display product cards
function displayProducts(products) {
    const productListContainer = document.getElementById('products-cart');
    if (!productListContainer) {
        console.error('Product list container not found!');
        return;
    }

    productListContainer.innerHTML = ''; // Clear placeholders

    if (Object.keys(products).length === 0) {
        productListContainer.innerHTML = '<p class="text-center text-muted">محصولی برای نمایش وجود ندارد.</p>';
        return;
    }

    for (const productId in products) {
        const product = products[productId];
        console.log(productId)
        const cardHTML = `
            <div class="col">
                <div class="card card-product">
                    <img src="${product.image}" class="card-img-top card-product-image" alt="${product.name}">
                    <div class="card-body card-product-body d-flex flex-column">
                        <a href="product-details.html?id=${productId}" class="card-product-title">${product.name}</a>
                        <p class="card-product-price mt-auto">${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(product.price)} تومان</p>
                        <button class="btn btn-primary card-product-btn add-to-cart-btn" data-id="${productId}">
                            افزودن به سبد خرید
                            <span class="material-symbols-outlined">add_shopping_cart</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        productListContainer.insertAdjacentHTML('beforeend', cardHTML);
    }

    // Add event listeners for "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.currentTarget.dataset.id;
            const product = products[productId];

            if (product) {
                addToCart(product);
                updateCartBadge();
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: 'محصول به سبد خرید اضافه شد',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        });
    });
}

// Cart management function (reused from product-details.js logic)
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
}

// Main function to fetch products and initialize the page
function initializeHomePage() {
    fetch('js/product.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data && data.products) {
                displayProducts(data.products);
            }
        })
        .catch(error => {
            console.error('Failed to fetch product data:', error);
            const productListContainer = document.getElementById('product-list');
            if (productListContainer) {
                productListContainer.innerHTML = `
                    <div class="col-12">
                        <div class="alert alert-danger text-center">
                            خطا در بارگذاری محصولات. لطفا بعدا دوباره تلاش کنید.
                        </div>
                    </div>
                `;
            }
        });

    updateCartBadge(); // Update the badge on page load
}

document.addEventListener('DOMContentLoaded', initializeHomePage);