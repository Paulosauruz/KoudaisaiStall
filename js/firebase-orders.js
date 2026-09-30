import { collection, addDoc } from
    "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";


export async function sendOrder(order) {

    try {
        const docRef = await addDoc(
            collection(db, "orders"),
            order
        );

        console.log("Order sent:", docRef.id);

        return docRef.id;

    } catch (error) {
        console.error("Error sending order:", error);
    }
}