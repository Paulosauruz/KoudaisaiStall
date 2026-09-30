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
                <td>${displayItems(order.items)}</td>
                <td>¥${order.total}</td>
                <td>${order.createdAt.toDate().toLocaleString("en-GB")}</td>
                <td>
                    <button class="done-button" data-id="${doc.id}">
                        Complete
                    </button>
                </td>
            `;
            kitchenTable.appendChild(row);
        }
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

const kitchenPage = document.getElementById("kitchen-page");

kitchenPage.addEventListener('click', async (event) => {
    if (event.target.classList.contains("done-button")) {
        const docId = event.target.dataset.id;

        const orderDoc = await getDoc(
            doc(db, "orders", docId)
        );

        const order = orderDoc.data();

        const confirmed = confirm(
            `
            Are you sure you want to mark this order as completed?

            OrderID: ${order.orderId}
            Items: ${displayItems(order.items)}
            Total: ¥${order.total}
            Date: ${order.createdAt.toDate().toLocaleString("en-GB")}
            `
        );

        if (!confirmed) {
            return;
        }

        try {

            await updateDoc(
                doc(db, "orders", docId),
                {
                    status: "completed"
                }
            );

            console.log("Order completed:", orderId);

        } catch (error) {
            console.error("Failed to complete order:", error);
        }
    }

});