import { productArray } from "./data.js";

const discountModal = document.getElementById("discount-modal");
const paymentModal = document.getElementById("payment-modal");
const rateModal = document.getElementById("rate-modal");
const messageSection = document.getElementById("section-message");
const productSection = document.getElementById("product-section");
const purchaseSection = document.getElementById("purchase-section");
let productsCart = [];
let total = 0;
let calculatedTotal = 0;
let discount = 0;

function initialize() {
  productsCart = [];
  total = 0;
}

function getProducts(products) {
  let productsHTML = "";
  products.forEach(function (product) {
    let ingredientsHTML = "";
    product.ingredients.forEach(function (ingredients) {
      ingredientsHTML += `<li>${ingredients}</li>`;
    });

    productsHTML += `
      <div class="product-container">
        <img src="${product.image}" alt="" class="product-img" />
        <div class="product-content">
          <div class="product-description">
            <p class="product-title">${product.name}</p>
            <ul class="product-ingredients">
              ${ingredientsHTML}
            </ul>
          </div>
          <p class="product-price">${product.price}$</p>
        </div>
        <button class="btn-round btn-round-product id="btn-add-product" data-id="${product.id}" >
            <i class="fa fa-plus" aria-hidden="true" id="icon-plus"  ></i>
        </button>
      </div>`;
  });
  return productsHTML;
}

function renderProducts() {
  productSection.innerHTML = getProducts(productArray);
}

renderProducts();

function updateCart(dataId) {
  let infoProduct = "";
  productArray.forEach(function (product) {
    if (dataId === product.id.toString()) {
      infoProduct = {
        name: product.name,
        price: product.price,
        id: product.id.toString(),
        quantity: 1,
      };
    }
  });

  if (infoProduct) {
    const existingProductIndex = productsCart.findIndex(function (product) {
      return infoProduct.id === product.id;
    });

    if (existingProductIndex !== -1) {
      productsCart[existingProductIndex].quantity++;
      total = total + productsCart[existingProductIndex].price;
    } else {
      productsCart.push(infoProduct);
      total = total + infoProduct.price;
    }
  }
}

function purchaseHTML() {
  let purchaseHTML = "";
  productsCart.forEach(function (product) {
    purchaseHTML += `
      <div class="purchase-items" data-id="${product.id}">
        <div class="items-info">
          <p>${product.quantity}</p>
          <p>${product.name}</p>
          <button class="btn-round btn-round-remove" id="btn-remove" data-id="${product.id}">
            <i class="fa fa-remove" aria-hidden="true" id="icon-remove"></i>
          </button>
        </div>
        <p>${product.price}$</p>
      </div>`;
  });
  purchaseHTML += ` <div>
                          <p>Free Shipping</p>
                    </div>
                    <div class="purchase-summarize-container purchase-summarize-column ">
                      <div class="purchase-summarize-content">
                        <p class="summarize-title">Subtotal </p>
                        <p>${calculatedTotal}$</p>
                      </div>
                    
                      <div class="purchase-summarize-content">
                          <p class="summarize-title">Discount </p>
                          <p>${discount}$</p>
                      </div>
                    </div>
                   <div class="purchase-summarize-container ">
                        <p class="summarize-title">Total price</p>
                        <p>${total}$</p>
                    </div>`;
  return purchaseHTML;
}

function renderPurchase() {
  document.getElementById("purchase-container").innerHTML = purchaseHTML();
}

function eliminateProduct(dataId) {
  const updatedProductsCart = productsCart.filter(function (product) {
    if (product.id === dataId) {
      total = total - product.price * product.quantity;
    }
    return product.id !== dataId;
  });

  if (productsCart.length > updatedProductsCart.length) {
    productsCart = updatedProductsCart;
  }
}

function applyDiscount() {
  total = calculateTotal();
  if (total > 50) {
    discount = (total * 0.15).toFixed(2);
    total = total - discount;
  }
}

function calculateTotal() {
  calculatedTotal = 0;
  productsCart.forEach(function (product) {
    calculatedTotal += product.price * product.quantity;
  });
  return calculatedTotal;
}

function initializeRate() {
  for (let index = 1; index <= 5; index++) {
    const rateBtn = document.getElementById(`btn-rate-${index}`);
    rateBtn.classList.remove("rate");
  }
}

function rate(e) {
  const rateId = parseInt(e.target.id.slice(-1));
  for (let index = 1; index <= 5; index++) {
    const rateBtn = document.getElementById(`btn-rate-${index}`);
    if (index <= rateId) {
      rateBtn.classList.add("rate");
    } else {
      rateBtn.classList.remove("rate");
    }
  }
}

function cancelRate() {
  for (let index = 1; index <= 5; index++) {
    const rateBtn = document.getElementById(`btn-rate-${index}`);
    rateBtn.classList.remove("rate");
  }
  delayModayClose("Thank you for your order! Your purchase is on its way");
}

function submitRate() {
  let isRate = false;
  for (let index = 1; index <= 5; index++) {
    const rateBtn = document.getElementById(`btn-rate-${index}`);
    if (rateBtn.classList.contains("rate")) {
      isRate = true;
      break;
    }
  }
  if (isRate) {
    delayModayClose("Thank you for rating us! Your Order is on its way");
  }
}

function delayModayClose(message) {
  setTimeout(function () {
    rateModal.style.display = "none";
    displayMessage(message);
  }, 400);
}

function displayMessage(message) {
  messageSection.innerHTML = "";
  purchaseSection.style.display = "none";
  messageSection.style.display = "block";

  const messagePurchase = document.createElement("p");
  messagePurchase.innerHTML = message;
  messagePurchase.classList.add("message-paragraph");
  messageSection.appendChild(messagePurchase);
}

function initializeFieldPayments() {
  const nameInput = document.getElementById("name-info");
  const cvvInput = document.getElementById("cvv");
  const cardNumberInput = document.getElementById("card-number");
  nameInput.value = "";
  cvvInput.value = "";
  cardNumberInput.value = "";
}

document.addEventListener("click", function (e) {
  let targetWithDataId = e.target.closest("[data-id]");

  if (e.target.id === "btn-discount") {
    discountModal.style.display = "none";
  }
  if (e.target.id === "btn-close" || e.target.id === "icon-close") {
    discountModal.style.display = "none";
  }
  if (targetWithDataId) {
    productSection.classList.remove("product-section");
    messageSection.style.display = "none";
    purchaseSection.style.display = "block";
    let dataId = targetWithDataId.getAttribute("data-id");
    updateCart(dataId);
    applyDiscount();
    renderPurchase();
  }
  if (e.target.id === "btn-remove" || e.target.id === "icon-remove") {
    let dataId = e.target.closest("[data-id]").getAttribute("data-id");
    eliminateProduct(dataId);
    applyDiscount();
    renderPurchase();
  }
  if (e.target.id === "btn-purchase" && total > 0) {
    paymentModal.style.display = "flex";
  }
  if (
    e.target.id === "btn-payment-close" ||
    e.target.id === "icon-payment-close"
  ) {
    paymentModal.style.display = "none";
    initializeFieldPayments();
  }

  if (e.target.id === "btn-pay") {
    const formPayment = document.getElementById("payment-form");
    if (formPayment.checkValidity()) {
      e.preventDefault();
      setTimeout(function () {
        discountModal.style.display = "none";
        paymentModal.style.display = "none";
        initializeRate();
        rateModal.style.display = "flex";
        initializeFieldPayments();
      }, 400);
    }
  }
  if (e.target.id === "btn-close-rate" || e.target.id === "icon-close-rate") {
    rateModal.style.display = "none";
    displayMessage("Thank you for your order! Your purchase is on its way");
    initialize();
  }

  if (
    e.target.matches("#btn-rate-1, #icon-rate-1") ||
    e.target.matches("#btn-rate-2, #icon-rate-2") ||
    e.target.matches("#btn-rate-3, #icon-rate-3") ||
    e.target.matches("#btn-rate-4, #icon-rate-4") ||
    e.target.matches("#btn-rate-5, #icon-rate-5")
  ) {
    rate(e);
  }

  if (e.target.id === "btn-rate-submit") {
    submitRate();
    initialize();
  }
  if (e.target.id === "btn-rate-cancel") {
    cancelRate();
    initialize();
  }
});

document.addEventListener("input", function (e) {
  if (e.target.id === "card-number") {
    const cardNumberInput = e.target;
    const cardNumber = cardNumberInput.value;
    const formattedCardNumber = validateCardNumber(cardNumber);
    cardNumberInput.value = formattedCardNumber;
  }

  if (e.target.id === "cvv") {
    const cvvInput = e.target;
    const cvvNumber = cvvInput.value;
    const formattedCvv = validateCvv(cvvNumber);
    cvvInput.value = formattedCvv;
  }

  if (e.target.id === "name-info") {
    const nameInput = e.target;
    const nameValue = nameInput.value;
    const formattedName = validateName(nameValue);
    nameInput.value = formattedName;
  }
});

function validateCardNumber(cardNumber) {
  const formattedNumber = cardNumber.replace(/\D/g, "");

  const regexPattern = /^(\d{4})(\d{4})(\d{4})(\d{4})$/;
  return formattedNumber.replace(regexPattern, "$1 $2 $3 $4");
}

function validateCvv(cvv) {
  const formattedNumber = cvv.replace(/\D/g, "");
  return formattedNumber;
}

function validateName(input) {
  const validatedName = input.replace(/[^a-zA-Z\s]/g, "");
  return validatedName;
}
