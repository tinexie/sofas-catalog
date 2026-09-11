const products = [
    {
        id: 1,
        title: "Диван Black",
        description: "Современный мягкий диван для гостиной.",
        image: "images/sofa1.jpg",
        price: 45000
    },
    {
        id: 2,
        title: "Диван Loft",
        description: "Стильный диван в современном дизайне.",
        image: "images/sofa2.jpg",
        price: 52000
    },
    {
        id: 3,
        title: "Диван Comfort",
        description: "Удобный мягкий диван для дома и отдыха.",
        image: "images/sofa3.jpg",
        price: 48000
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products");
const cartModal = document.getElementById("cart-modal");
const openCartButton = document.getElementById("open-cart");
const closeCartButton = document.getElementById("close-cart");
const cartList = document.getElementById("cart-list");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");


function renderProducts() {
    productsContainer.innerHTML = "";

    products.forEach(product => {
        const cartItem = cart.find(item => item.id === product.id);

        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.image}" alt="${product.title}">

            <h2>${product.title}</h2>

            <p>${product.description}</p>

            <strong>
                ${product.price.toLocaleString("ru-RU")} ₽
            </strong>

            <div class="product-actions" data-id="${product.id}">
                ${
                    cartItem
                        ? `
                            <div class="quantity-control">
                                <button class="minus-button">−</button>

                                <span>${cartItem.quantity}</span>

                                <button class="plus-button">+</button>
                            </div>

                            <div class="in-cart-text">
                                В корзине
                            </div>
                        `
                        : `
                            <button class="add-button">
                                Добавить в корзину
                            </button>
                        `
                }
            </div>
        `;

        productsContainer.appendChild(card);
    });

    addProductEvents();
}


function addProductEvents() {
    const addButtons = document.querySelectorAll(".add-button");

    addButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(
                button.closest(".product-actions").dataset.id
            );

            addToCart(id);
        });
    });


    const plusButtons = document.querySelectorAll(".plus-button");

    plusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(
                button.closest(".product-actions").dataset.id
            );

            increaseQuantity(id);
        });
    });


    const minusButtons = document.querySelectorAll(".minus-button");

    minusButtons.forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(
                button.closest(".product-actions").dataset.id
            );

            decreaseQuantity(id);
        });
    });
}


function addToCart(id) {
    const product = products.find(product => product.id === id);

    if (!product) return;

    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    updateCart();
}


function increaseQuantity(id) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity++;

    updateCart();
}


function decreaseQuantity(id) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(product => product.id !== id);
    }

    updateCart();
}


function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);

    updateCart();
}


function updateCart() {
    saveCart();
    renderProducts();
    renderCart();
}


function renderCart() {
    cartList.innerHTML = "";

    if (cart.length === 0) {
        cartList.innerHTML = `
            <p class="empty-cart">
                Корзина пока пустая
            </p>
        `;
    }

    cart.forEach(product => {
        const item = document.createElement("div");

        item.classList.add("cart-item");

        item.innerHTML = `
            <div class="cart-item-info">

                <img
                    src="${product.image}"
                    alt="${product.title}"
                >

                <div>
                    <h3>${product.title}</h3>

                    <p>
                        ${product.price.toLocaleString("ru-RU")} ₽
                    </p>

                    <div
                        class="cart-quantity"
                        data-id="${product.id}"
                    >
                        <button class="cart-minus">−</button>

                        <span>${product.quantity}</span>

                        <button class="cart-plus">+</button>
                    </div>
                </div>

            </div>

            <button
                class="remove-button"
                data-id="${product.id}"
            >
                Удалить
            </button>
        `;

        cartList.appendChild(item);
    });


    document.querySelectorAll(".cart-plus").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(
                button.closest(".cart-quantity").dataset.id
            );

            increaseQuantity(id);
        });
    });


    document.querySelectorAll(".cart-minus").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(
                button.closest(".cart-quantity").dataset.id
            );

            decreaseQuantity(id);
        });
    });


    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);

            removeFromCart(id);
        });
    });


    const totalQuantity = cart.reduce((sum, item) => {
        return sum + item.quantity;
    }, 0);

    cartCount.textContent = totalQuantity;


    const totalPrice = cart.reduce((sum, item) => {
        return sum + item.price * item.quantity;
    }, 0);

    cartTotal.textContent = totalPrice.toLocaleString("ru-RU");
}


function saveCart() {
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


openCartButton.addEventListener("click", () => {
    cartModal.classList.add("active");
    document.body.style.overflow = "hidden";
});


closeCartButton.addEventListener("click", closeCart);


cartModal.addEventListener("click", event => {
    if (event.target === cartModal) {
        closeCart();
    }
});


document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeCart();
    }
});


function closeCart() {
    cartModal.classList.remove("active");
    document.body.style.overflow = "";
}


renderProducts();
renderCart();