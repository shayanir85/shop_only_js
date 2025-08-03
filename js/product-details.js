        function getQueryParam(param) {
            const url = new URLSearchParams(window.location.search);
            return url.get(param);
        }

        const productId = getQueryParam('id');
        if (productId) {
            fetch('js/product.json')
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const product = data.products[productId];
                    const productDetails = document.getElementById('product-details');

                    if (product) {
                        const specsHTML = product.specs ? joinspecs(product.specs) : '';
                        const featuresHTML = product.features ? joinfeatures(product.features) : '';
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
                                    <button class="btn btn-success add-to-cart" data-index="${productId}">
                                        افزودن به سبد خرید
                                        <span class="material-symbols-outlined" style="vertical-align: middle;">add_shopping_cart</span>
                                    </button>
                                </div>
                            </div>
                        `;

                        // Add event listener to the button
                        const button = productDetails.querySelector('.add-to-cart');
                        button.addEventListener('click', () => {
                            addToCart(product);
                            alert('محصول به سبد خرید اضافه شد!');
                        });
                    } else {
                        productDetails.innerHTML = '<p class="text-center">محصول یافت نشد.</p>';
                    }
                })
                .catch(error => {
                    console.error('Failed to fetch data:', error);
                    document.getElementById('product-details').innerHTML = '<p class="text-center">خطا در بارگذاری اطلاعات محصول.</p>';
                });
        } else {
            document.getElementById('product-details').innerHTML = '<p class="text-center">محصول یافت نشد.</p>';
        }

        function joinfeatures(features) {
            return Object.entries(features).map(([key, value]) => `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `).join('');
        }

        function joinspecs(specs) {
            return Object.entries(specs).map(([key, value]) => `
                <tr>
                    <td>${key}</td>
                    <td>${value}</td>
                </tr>
            `).join('');
        }

        function addToCart(product) {
            let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const existingItem = cartItems.find(item => item.model === product.model);

            if (existingItem) {
                existingItem.quantity += 1; // Increase quantity if item already exists
            } else {
                product.quantity = 1; // Add quantity property to new items
                cartItems.push(product);
            }
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
        }