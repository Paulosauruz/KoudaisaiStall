import {
    collection,
    getDocs,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

import { menu } from "./menu-data.js";

const ordersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
);

onSnapshot(ordersQuery, (snapshot) => {

    let totalEarned = 0;
    
    const historyTable = document.getElementById("order-history");

    historyTable.innerHTML = "";

    for (const doc of snapshot.docs) {

        const order = doc.data();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.orderId}</td>
            <td style="width: 50%;">${displayItems(order.items)}</td>
            <td>¥${order.total}</td>
            <td>
                <span class="status ${order.status}">
                    <span class="status-dot"></span>
                    ${order.status}
                </span>
            </td>
            <td>${order.createdAt.toDate().toLocaleString("en-GB")}</td>
        `;

        historyTable.appendChild(row);

        // calculating total earned
        if (order.status != "cancelled") {
            totalEarned += order.total;
        }
    }

    // putting in total earned
    const totalEarnedDisplay = document.getElementById("total-earned");
    totalEarnedDisplay.textContent = `Total Earned: ¥${totalEarned}`;

});

function displayItems(items) {
    
    let text = "";

    for (const item of items) {

        text += `<div class="kitchen-page-item">`;
        
        text += menu.find(menuItem => menuItem.id === item.id).name;

        if (item.size) {
            text += ` (${item.size})`;
        }

        if ("addons" in item) {
            text += ` (${item.addons.join(`, `)})`;
        }

        if (item.quantity) {
            text += ` x ${item.quantity}, `;
        }

        // separating each items into each line
        text += `</div>`;
    }

    return text;
}