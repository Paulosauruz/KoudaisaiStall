import {
    collection,
    getDocs,
    onSnapshot,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

const ordersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc")
);

onSnapshot(ordersQuery, (snapshot) => {

    const historyTable = document.getElementById("order-history");

    historyTable.innerHTML = "";

    for (const doc of snapshot.docs) {

        const order = doc.data();

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${order.orderId}</td>
            <td>${displayItems(order.items)}</td>
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
    }
});

function displayItems(items) {

    let text = "";

    for (const item of items) {

        text += menu.find(menuItem => menuItem.id === item.id).name;

        if (item.size) {
            text += ` (${item.size})`;
        }

        text += ` x ${item.quantity}, `;
    }

    return text;
}