import { menu } from "./menu-data.js";

import {
    updateDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { db } from "./firebase-config.js";

displayUnavailableTable();

function displayUnavailableTable() {
    const unavailableTable = document.getElementById("unavailable-table-body");
    unavailableTable.innerHTML = "";

    // sort the menu so that drinks display before candies and then games
    const categoryOrder = ["Drinks", "Candies", "Games"];

    for (const item of [...menu].sort((a, b) => {
    return categoryOrder.indexOf(a.category) -
           categoryOrder.indexOf(b.category);
    })) {
        const row = document.createElement("tr");
        
        if (item.availability) {
            row.innerHTML = `
                <td>${item.name}</td>
                <td id="text-available">available</td>
                <td>
                    <button class="mark-as-unavailable-button" data-id="${item.id}">
                        Mark as unavailable
                    </button>
                </td>
            `;
        } else {
            row.innerHTML = `
                <td>${item.name}</td>
                <td id="text-unavailable">unavailable</td>
                <td>
                    <button class="mark-as-available-button" data-id="${item.id}">
                        Mark as available
                    </button>
                </td>
            `;
        }
        
        unavailableTable.appendChild(row);
    }
}

const unavailablePage = document.getElementById("unavailable-page");

unavailablePage.addEventListener('click', async (event) => {
    if (event.target.classList.contains("mark-as-unavailable-button")) {
        const itemId = event.target.dataset.id;
        const menuItem = menu.find(item => item.id === itemId);

        const confirmed = confirm(`Mark [${menuItem.name}] as unavailable?`);

        if (!confirmed) {
            return;
        }

        await updateDoc(
            doc(db, "menu", itemId),
            {
                availability: false
            }
        );

        displayUnavailableTable();
    }

    if (event.target.classList.contains("mark-as-available-button")) {
        const itemId = event.target.dataset.id;
        const menuItem = menu.find(item => item.id === itemId);

        const confirmed = confirm(`Mark [${menuItem.name}] as available?`);

        if (!confirmed) {
            return;
        }

        await updateDoc(
            doc(db, "menu", itemId),
            {
                availability: true
            }
        );

        displayUnavailableTable();   
    }
})