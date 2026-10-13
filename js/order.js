import { sendOrder } from "./firebase-orders.js";

import {
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { menu } from "./menu-data.js";

const orderPage = document.getElementById("order-page");

const orderPageHome = `
    <button type="button" id="new-order" class="order-button">Create New Order</button>
    <button type="button" id="cancel-order" class="order-button">Cancel Existing Order</button>
`;

const returnButton = `
    <button 
        type="button" 
        id="order-return" 
        class="order-button order-action-button">
        Back
    </button>
`;

const verifyOrderButton = `
    <button 
        type="button" 
        id="order-verify" 
        class="order-button order-action-button">
        Verify Order
    </button>
`;

const modifyOrderButton = `
    <button 
        type="button" 
        id="order-modify" 
        class="order-button">
        Modify Order
    </button>
`;

const submitButton = `
    <button 
        type="button" 
        id="order-submit" 
        class="order-button">
        Submit Order
    </button>
`;

const currentOrder = [];
let currentOrderWithAddons = [];

let modifyOrderPage = ``;

orderPage.addEventListener('click', async (event) => {

    if (event.target.id === "new-order") {
        orderPage.innerHTML = `<h1>Create New Order</h1>`
            + displayMenu()
            + `<div class="order-action-bar">`
            + verifyOrderButton
            + returnButton
            + `</div>`;
    }

    if (event.target.id === "cancel-order") {
        window.location.href = "kitchen.html";
    }

    if (event.target.id === "order-return") {
        orderPage.innerHTML = orderPageHome;
        currentOrder.length = 0;
    }

    if (event.target.classList.contains("plus")) {
        changeQuantity(event.target, 1);
    }

    if (event.target.classList.contains("minus")) {
        changeQuantity(event.target, -1);
    }

    if (event.target.id === "order-verify") {
        currentOrderWithAddons = getOrderVerifyPage(currentOrder);
        modifyOrderPage = orderPage.innerHTML;
        orderPage.innerHTML = `<h1>Verify Order</h1>`
            + displayOrder(currentOrderWithAddons).html
            + modifyOrderButton;

        // empty order cant be submitted
        if (!orderPage.innerHTML.includes(`There are no item in the order.`)){
            orderPage.innerHTML += submitButton;
        }
    }

    if (event.target.id === "order-modify") {
        orderPage.innerHTML = modifyOrderPage;
    }

    if (event.target.id === "order-submit") {
        const nextOrderId = await getNextOrderId();
        const order = {
            orderId: nextOrderId,
            items: currentOrderWithAddons,
            total: displayOrder(currentOrderWithAddons).totalPrice,
            status: "ongoing",
            createdAt: serverTimestamp()
        };
        
        await sendOrder(order); // send order to firestore

        orderPage.innerHTML = `<h1>Verify Order</h1>`
            + displayOrder(currentOrderWithAddons).html
            + `<h2>Order has been submitted!</h2>`
            + `<h2>OrderID: ${order.orderId}<h2>`
            + `<strong style="font-size: smaller">Write this number and give it to customer for the kitchen to call.</strong>`
            + returnButton;

        console.log(`Order Submitted! ${order.orderId} ${order.items} ${order.total} ${order.status} ${order.createdAt}`);
        currentOrder.length = 0;
    }

});

 
function displayMenu() {
    const categories = {};

    // put menu items in categories{} in groups
    for (const item of menu) {
        if (!categories[item.category]) {
            categories[item.category] = [];
        }
        categories[item.category].push(item);
    }

    let html = "";

    html += `
        <div class="order-nav">
            <a href="#order-Drinks">Drinks</a>
            <a href="#order-Candies">Candies</a>
            <a href="#order-Games">Games</a>
        </div>
    `;

    // generating html by categories
    for (const category in categories) {
        
        html += `<hr><h2 id="order-${category}">${category}</h2>`;
        html += `<div class="order-grid">`;
        
        for (const item of categories[category]) {

            html += `<div class="order-card" id="${item.id}"><h3>${item.name} ${"emoji" in item ? item.emoji : ""}</h3>`;

            if (item.sizes) {

                for (const size in item.sizes) {
                    html += `
                        <div class="order-option">
                            <div class="order-price">
                                <span>${size}</span> 
                                <strong>¥${item.sizes[size]}</strong>
                            </div>

                            <div class="quantity-control">
                                <button
                                    class="minus"
                                    data-id="${item.id}"
                                    data-size="${size}">
                                    -
                                </button>

                                <span id="${item.id}-${size}-quantity">0</span>

                                <button
                                    class="plus"
                                    data-id="${item.id}"
                                    data-size="${size}">
                                    +
                                </button>
                            </div>
                        </div>
                    `;
                }

            } else {

                html += `
                    <div class="order-option">
                        <div class="order-price">
                            <strong>¥${item.price}</strong>
                        </div>

                        <div class="quantity-control">
                            <button
                                class="minus"
                                data-id="${item.id}">
                                -
                            </button>

                            <span id="${item.id}-quantity">0</span>

                            <button
                                class="plus"
                                data-id="${item.id}">
                                +
                            </button>
                        </div>
                    </div>
                `;
            }
            html += `</div>`;
        }

        html += `</div>`;
    }

    return html;
}

function changeQuantity(button, amount) {

    const id = button.dataset.id;
    const size = button.dataset.size;

    let orderItem = currentOrder.find(item =>
        item.id === id && item.size === size
    );

    if (!orderItem) {
        orderItem = {
            id: id,
            quantity: 0
        };

        if (size) {
            orderItem.size = size;
        }

        currentOrder.push(orderItem);
    }

    orderItem.quantity += amount;

    if (orderItem.quantity < 0) {
        orderItem.quantity = 0;
    }

    let quantityElement;

    if (size) {
        quantityElement = document.getElementById(`${id}-${size}-quantity`);
    } else {
        quantityElement = document.getElementById(`${id}-quantity`);
    }

    let quantity = Number(quantityElement.textContent);
    quantity += amount;

    if (quantity < 0) {
        quantity = 0;
    }

    quantityElement.textContent = quantity;
}

function getOrderVerifyPage(order){
    const newOrder = [];
    for (const orderItem of order) {
        const menuItem = menu.find(item => item.id === orderItem.id);
        if (menuItem.category === "Drinks") {
            for (let i = 0; i < orderItem.quantity; i++) {
                console.log("loop");
                let newItem = {
                    id: orderItem.id
                };
                if ("size" in orderItem) {
                    newItem.size = orderItem.size;
                }
                newOrder.push(newItem);
            }
        } else {
            newOrder.push(orderItem);
        }
    }
    
    return newOrder;
}

function displayOrder(order) {
    let totalPrice = 0;
    let html = "<h2>Current Order</h2>";

    for (const [index, orderItem] of order.entries()) {

        // find item in menu
        const menuItem = menu.find(item => item.id === orderItem.id);

        html += `<div class="verify-order-items">`;

        html += `${menuItem.name}`;

        if (orderItem.size) {
            html += ` (${orderItem.size})`;
        }

        if ("quantity" in orderItem) {
            html += ` x${orderItem.quantity}`;
        }

        if ("addons" in orderItem) {
            html += ` (${orderItem.addons.join(', ')})`;
        }

        // find price
        let price;

        if (orderItem.size) {
            price = "quantity" in orderItem 
                ? menuItem.sizes[orderItem.size] * orderItem.quantity 
                : menuItem.sizes[orderItem.size];
        } else {
            price = "quantity" in orderItem
                ? menuItem.price * orderItem.quantity
                : menuItem.price;
        }

        if ("addons" in orderItem) {
            price += orderItem.addons.length * 50;
        }

        html += ` - ¥${price}`;

        totalPrice += price;

        // adding the button
        if (!("quantity" in orderItem)) {
            html += `  <button class="addons-button" data-index="${index}">addons`;
        }

        html += `</div>`;
    }

    if (html === "<h2>Current Order</h2>") {
        html += `<div>There are no item in the order.</div>`;
        return {html:html, totalPrice: NaN};
    }

    html += `
        <div>
            <h3>Total Price : ¥${totalPrice}</h3>
        </div>
    `;

    return {
        html: html,
        totalPrice: totalPrice
    };
}

async function getNextOrderId() {
    const q = query(
        collection(db, "orders"),
        orderBy("orderId", "desc"),
        limit(1)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
        return 1;
    }

    return snapshot.docs[0].data().orderId + 1;
}


/* add-ons button */

const addonsPopup = document.getElementById("addons-popup");

let selectedDrinkIndex = null;

// Open popup when an Add-ons button is clicked
orderPage.addEventListener("click", (event) => {
    const button = event.target.closest(".addons-button");

    if (!button) return;

    selectedDrinkIndex = Number(button.dataset.index);

    const drink = currentOrderWithAddons[selectedDrinkIndex];

    // Reset checkbox selections
    addonsPopup.querySelectorAll('input[type="checkbox"]')
        .forEach(checkbox => {
            checkbox.checked = false;
        });

    // Restore any add-ons already saved for this drink
    for (const addon of drink.addons ?? []) {
        const checkbox = addonsPopup.querySelector(
            `input[value="${addon}"]`
        );

        if (checkbox) checkbox.checked = true;
    }

    addonsPopup.style.display = "flex";
});

// Cancel: close without saving
document.getElementById("addons-cancel").addEventListener("click", () => {
    addonsPopup.style.display = "none";
});

// Save selected add-ons
document.getElementById("addons-save").addEventListener("click", () => {
    const drink = currentOrderWithAddons[selectedDrinkIndex];

    drink.addons = [
        ...addonsPopup.querySelectorAll('input[type="checkbox"]:checked')
    ].map(checkbox => checkbox.value);

    addonsPopup.style.display = "none";

    console.log("Selected drink:", drink);
    console.log(currentOrderWithAddons);

    /* simulating veryfyOrder being clicked */
    orderPage.innerHTML = `<h1>Verify Order</h1>`
        + displayOrder(currentOrderWithAddons).html
        + modifyOrderButton;
    
    // empty order cant be submitted
    if (!orderPage.innerHTML.includes(`There are no item in the order.`)){
        orderPage.innerHTML += submitButton;
    }
});

// Close if the dark background is clicked
addonsPopup.addEventListener("click", (event) => {
    if (event.target === addonsPopup) {
        addonsPopup.style.display = "none";
    }
});


