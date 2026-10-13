const menuDefault = [
    {
        id: "butter-fly-pea",
        name: "Butterfly Pea Tea",
        emoji: "🦋",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "hales-blue-boy",
        name: "Hale's Blue Boy",
        emoji: "🍒",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "lemon",
        name: "Lemon Syrup",
        emoji: "🍋",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "sea-buckthorn",
        name: "Sea Buckthorn",
        emoji: "🍊",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "rooh-afza",
        name: "Rooh Afza",
        emoji: "🌹",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "vimto",
        name: "Vimto",
        emoji: "🫐",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "nelli",
        name: "Nelli",
        emoji: "🟢",
        category: "Drinks",
        sizes: {
            medium: 300,
            large: 400
        },
        addons: {
            soda: 50,
            honey: 50
        },
        availability: true
    },

    {
        id: "kopiko",
        name: "Kopiko",
        category: "Candies",
        price: 20,
        availability: true
    },

    {
        id: "milady",
        name: "Milady",
        category: "Candies",
        price: 20,
        availability: true
    },

    {
        id: "candy-pack",
        name: "Candy Pack",
        category: "Candies",
        price: 50,
        availability: true
    },

    {
        id: "plinko",
        name: "Plinko",
        category: "Games",
        price: 100,
        availability: true
    }
];

import {
    collection,
    doc,
    setDoc,
    getDocs,
    deleteDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

export async function uploadMenu() {

    // get existing menu documents
    const snapshot = await getDocs(collection(db, "menu"));

    // delete menu
    for (const menuDoc of snapshot.docs) {
        await deleteDoc(doc(db, "menu", menuDoc.id));
    }
    
    // upload new menu
    for (const item of menuDefault) {

        await setDoc(
            doc(db, "menu", item.id),
            item
        );

    }

    console.log("Menu uploaded successfully!");
}

window.uploadMenu = uploadMenu;

// dragging menu down from firestore
export const menu = [];

// make sure the menu variable got updated at least once when running the code
const snapshot = await getDocs(collection(db, "menu"));
for (const doc of snapshot.docs) {
        menu.push(doc.data());
}

onSnapshot(collection(db, "menu"), (snapshot) => {
    menu.length = 0;

    for (const doc of snapshot.docs) {
        menu.push(doc.data());
    }
});