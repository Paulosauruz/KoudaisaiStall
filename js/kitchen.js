import {
    collection,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

import { menu } from "./menu-data.js";

const ordersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt")
);

onSnapshot(ordersQuery, (snapshot) => {

    const kitchenTable = document.getElementById("kitchen-order");

    kitchenTable.innerHTML = "";

    for (const doc of snapshot.docs) {

        const order = doc.data();

        if (order.status === "ongoing") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${order.orderId}</td>
                <td style="width: 50%;">${displayItems(order.items)}</td>
                <td>¥${order.total}</td>
                <td>${order.createdAt.toDate().toLocaleString("en-GB")}</td>
                <td>
                    <button class="done-button" data-id="${doc.id}">
                    </button>
                </td>
                <td>
                    <button class="cancel-button" data-id="${doc.id}">
                    ❌
                    </button>
                </td>
            `;
            kitchenTable.appendChild(row);
        }
    }
});

function displayItems(items) { 
    const sizeDict = {
        medium: `M`,
        large: `L`
    }

    let text = "";

    for (const item of items) {

        text += `<div class="kitchen-page-item">`;

        const menuItem = menu.find(menuItem => menuItem.id === item.id);
        console.log("Looking for:", item.id);
        console.log("Found:", menuItem);
        text += menuItem.name;

        if (item.size) {
            text += ` (${sizeDict[item.size]})`;
        }

        if ("addons" in item) {
            text += ` (${item.addons.join(`, `)})`
        }

        if ("quantity" in item) {
            text += ` x ${item.quantity}, `;
        }
        
        // separating each items into each line
        text += `</div>`;
    }

    return text;
}

const kitchenPage = document.getElementById("kitchen-page");
const completeOrderPopup = document.getElementById("complete-order-popup");
const popupOrderDetails = document.getElementById("popup-order-details");
let selectedOrderId = null;

kitchenPage.addEventListener('click', async (event) => {
    if (!event.target.classList.contains("done-button")) {
        return;
    }

    const docId = event.target.dataset.id;

    try {
        const orderDoc = await getDoc(
            doc(db, "orders", docId)
        );

        if (!orderDoc.exists()) {
            alert("Order not found.");
            return;
        }

        const order = orderDoc.data();

        selectedOrderId = docId;

        popupOrderDetails.innerHTML = `
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Items:</strong> ${displayItems(order.items)}</p>
            <p><strong>Total:</strong> ¥${order.total}</p>
            <p><strong>Date:</strong> ${
                order.createdAt?.toDate().toLocaleString("en-GB") ?? "N/A"
            }</p>
        `;

        completeOrderPopup.classList.add("active");

    } catch (error) {
        console.error("Failed to load order:", error);
    }
});

// Complete order
document.getElementById("popup-confirm").addEventListener("click", async () => {
    if (!selectedOrderId) return;

    const docId = selectedOrderId;

    try {
        await updateDoc(
            doc(db, "orders", docId),
            { status: "completed" }
        );

        console.log("Order completed:", docId);

        closeCompleteOrderPopup();

    } catch (error) {
        console.error("Failed to complete order:", error);
        alert("Failed to complete the order. Please try again.");
    }
});



// Cancel popup
document.getElementById("popup-cancel").addEventListener("click", closeCompleteOrderPopup);
document.getElementById("popup-close").addEventListener("click", closeCompleteOrderPopup);

// Close when clicking the dark background
completeOrderPopup.addEventListener("click", (event) => {
    if (event.target === completeOrderPopup) {
        closeCompleteOrderPopup();
    }
});

function closeCompleteOrderPopup() {
    completeOrderPopup.classList.remove("active");
    selectedOrderId = null;
}

const cancelOrderPopup = document.getElementById("cancel-order-popup");
const cancelOrderDetails = document.getElementById("cancel-order-details");

let selectedCancelOrderId = null;

// Open popup when clicking ❌
kitchenPage.addEventListener("click", async (event) => {
    if (!event.target.closest(".cancel-button")) {
        return;
    }

    const docId = event.target.closest(".cancel-button").dataset.id;

    try {
        const orderDoc = await getDoc(
            doc(db, "orders", docId)
        );

        if (!orderDoc.exists()) {
            alert("Order not found.");
            return;
        }

        const order = orderDoc.data();

        selectedCancelOrderId = docId;

        cancelOrderDetails.innerHTML = `
            <p><strong>Order ID:</strong> ${order.orderId}</p>
            <p><strong>Items:</strong> ${displayItems(order.items)}</p>
            <p><strong>Total:</strong> ¥${order.total}</p>
            <p><strong>Date:</strong> ${
                order.createdAt?.toDate().toLocaleString("en-GB") ?? "N/A"
            }</p>
            <p>Are you sure you want to cancel this order?</p>
        `;

        cancelOrderPopup.classList.add("active");

    } catch (error) {
        console.error("Failed to load order:", error);
    }
});

// Confirm cancellation
document.getElementById("cancel-popup-confirm").addEventListener("click", async () => {
    if (!selectedCancelOrderId) return;

    const docId = selectedCancelOrderId;

    try {
        await updateDoc(
            doc(db, "orders", docId),
            { status: "cancelled" }
        );

        console.log("Order cancelled:", docId);

        closeCancelOrderPopup();

    } catch (error) {
        console.error("Failed to cancel order:", error);
        alert("Failed to cancel the order. Please try again.");
    }
});

// Close popup buttons
document.getElementById("cancel-popup-back")
    .addEventListener("click", closeCancelOrderPopup);

document.getElementById("cancel-popup-close")
    .addEventListener("click", closeCancelOrderPopup);

// Close when clicking outside the popup
cancelOrderPopup.addEventListener("click", (event) => {
    if (event.target === cancelOrderPopup) {
        closeCancelOrderPopup();
    }
});

function closeCancelOrderPopup() {
    cancelOrderPopup.classList.remove("active");
    selectedCancelOrderId = null;
}