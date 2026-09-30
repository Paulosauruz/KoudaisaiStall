import { sendOrder } from "./firebase-orders.js";

import {
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

const orderPage = document.getElementById("order-page");

const orderPageHome = `
    <button type="button" id="new-order" class="order-button">Create New Order</button>
    <button type="button" id="cancel-order" class="order-button">Cancel Existing Order</button>
`;

const returnButton = `
    <button 
        type="button" 
        id="order-return" 
        class="order-button">
        Back
    </button>
`;

const verifyOrderButton = `
    <button 
        type="button" 
        id="order-verify" 
        class="order-button">
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

let modifyOrderPage = ``;

orderPage.addEventListener('click', async (event) => {

    if (event.target.id === "new-order") {
        orderPage.innerHTML = `<h1>Create New Order</h1>`
            + displayMenu()
            + verifyOrderButton
            + returnButton;
    }

    if (event.target.id === "cancel-order") {
        orderPage.innerHTML = `
            <h1>Cancel Existing Order</h1>
            <button 
                type="button" 
                id="order-return" 
                class="order-button">
                back
            </button>
        `;
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
        modifyOrderPage = orderPage.innerHTML;
        orderPage.innerHTML = `<h1>Verify Order</h1>`
            + displayOrder().html
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
        const order = {
            orderId: crypto.randomUUID(),
            items: currentOrder,
            total: displayOrder().totalPrice,
            status: "ongoing",
            createdAt: serverTimestamp()
        };
        
        await sendOrder(order); // send order to firestore

        orderPage.innerHTML = `<h1>Verify Order</h1>`
            + displayOrder().html
            + `<h2>Order has been submitted!</h2>`
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

    // generating html by categories
    for (const category in categories) {
        
        html += `<h2>${category}</h2>`;
        
        for (const item of categories[category]) {

            html += `<h3>${item.name}</h3>`;

            if (item.sizes) {

                for (const size in item.sizes) {
                    html += `
                        <div>
                            ${size} ¥${item.sizes[size]}

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
                    `;
                }

            } else {

                html += `
                    <div>
                        ¥${item.price}

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
                `;
            }
        }
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

function displayOrder() {
    let totalPrice = 0;
    let html = "<h2>Current Order</h2>";

    for (const orderItem of currentOrder) {

        // don't display items with quantity 0
        if (orderItem.quantity === 0) {
            continue;
        }

        // find item in menu
        const menuItem = menu.find(item => item.id === orderItem.id);

        html += `<div>`;

        html += `${menuItem.name}`;

        if (orderItem.size) {
            html += ` (${orderItem.size})`;
        }

        html += ` x ${orderItem.quantity}`;

        // find price
        let price;

        if (orderItem.size) {
            price = menuItem.sizes[orderItem.size];
        } else {
            price = menuItem.price;
        }

        html += ` - ¥${price * orderItem.quantity}`;

        totalPrice += price * orderItem.quantity;

        html += `</div>`;
    }

    if (html === "<h2>Current Order</h2>") {
        html += `<div>There are no item in the order.</div>`;
        return {html:html, totalPRice: NaN};
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

