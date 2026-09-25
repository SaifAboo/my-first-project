const products = [
  {
    id: 1,
    name: "حذاء Street Runner",
    price: 45,
    category: "shoes",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    name: "هودي Urban Black",
    price: 35,
    category: "clothes",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "ساعة Classic",
    price: 28,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "حقيبة Daily Bag",
    price: 32,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80"
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const orderButton = document.getElementById("orderButton");

function displayProducts() {
  const search = searchInput.value.toLowerCase();
  const category = categoryFilter.value;

  const filtered = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search);
    const matchesCategory =
      category === "all" || product.category === category;

    return matchesSearch && matchesCategory;
  });

  productsContainer.innerHTML = filtered.map(product => `
    <article class="product">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-info">
        <h3>${product.name}</h3>
        <p class="price">${product.price} $</p>
        <button class="add-button" onclick="addToCart(${product.id})">
          أضف إلى السلة
        </button>
      </div>
    </article>
  `).join("");
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart();
  updateCart();
  openCart();
}

function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCart();
}

function updateCart() {
  cartItems.innerHTML = cart.length
    ? cart.map(item => `
      <div class="cart-row">
        <strong>${item.name}</strong>
        <p>
          ${item.quantity} × ${item.price} $
          <button onclick="removeFromCart(${item.id})">حذف</button>
        </p>
      </div>
    `).join("")
    : "<p>السلة فارغة</p>";

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  cartTotal.textContent = total;
  cartCount.textContent = count;
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function openCart() {
  cartPanel.classList.add("open");
  overlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  overlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
overlay.addEventListener("click", closeCartPanel);

searchInput.addEventListener("input", displayProducts);
categoryFilter.addEventListener("change", displayProducts);

orderButton.addEventListener("click", () => {
  if (!cart.length) {
    alert("السلة فارغة");
    return;
  }

  const phone = "212600000000"; 
  let message = "مرحبًا، أريد طلب:%0A%0A";

  cart.forEach(item => {
    message += `- ${item.name} × ${item.quantity} = ${item.price * item.quantity} $%0A`;
  });

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  message += `%0Aالمجموع: ${total} $`;
  window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
});

displayProducts();
updateCart();
