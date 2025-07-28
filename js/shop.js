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
        <div class="col-12 col-md-3 text-center">
            <img src="${item.image}" class="img-fluid mt-3" style="max-width: 100%; max-height: 100px;" alt="Product Image">
        </div>
        <div class="col-12 col-md-5 mt-3  mx-auto text-center text-md-start">
            <strong>قیمت: ${new Intl.NumberFormat('fa-IR', { style: 'decimal' }).format(item.price)} تومان<br>${item.name}</strong>
        </div>
        <div class="col-12 col-md-4 mt-3 mt-md-0 d-flex flex-column flex-md-row justify-content-center justify-content-md-end align-items-center">
          <label class="text-center mb-2 mb-md-0" for="tedad">تعداد:</label>
          <div class="d-flex justify-content-center">
            <button class="btn btn-danger m-2 btn-sm me-2" onclick="decreaseQuantity(${index})">-</button>  
            <input class="form-control m-2 text-center" onchange="updateQuantity(${index}, this.value)" name="tedad" style="width: 60px;" value="${item.quantity}">
            <button class="btn btn-success m-2 btn-sm ms-2" onclick="increaseQuantity(${index})">+</button>
          </div>
        </div>
        <hr >`;
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