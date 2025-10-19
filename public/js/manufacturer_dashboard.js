// import checkUser from './helpers/user-log.js';

// const discountForm = document.getElementById("discountForm");
// const postBtn = document.querySelector(".post-btn");
// const container = document.querySelector(".container");
// const productList = document.querySelector(".product-list");
// const searchBar = document.getElementById('searchBar');

// let currentUser = null;

// // On page load: confirm logged-in manufacturer
// window.onload = async () => {
//     currentUser = await checkUser();
//     if (!currentUser || currentUser.role !== "manufacturer") {
//         location.href = "/login_register.html";
//         return;
//     }
//     loadManufacturerDiscounts();
// };

// // toggle form
// postBtn.addEventListener("click", () => {
//     container.style.display = container.style.display === "none" ? "block" : "none";
// });

// async function loadManufacturerDiscounts() {
//     const res = await fetch(`/api/manufacturer/discounts?manufacturer_id=${currentUser.manufacturer_id}`);
//     const discounts = await res.json();

//     productList.innerHTML = ""; // clear

//     discounts.forEach(d => {
//         const li = document.createElement("li");
//         li.className = "product-li";
//         li.innerHTML = `
//             <div class="post-title">
//                 <strong>${d.title}</strong> - ${d.parish}
//                 <button class="btn-4 delete-btn">Delete</button>
//             </div>
//             <em>${d.reason}</em><br/>
//             <p>${d.product}'s Original Price - ${d.original_price}, 
//                 <span class="highlight-red">Discounted Price - ${d.discounted_price}</span>
//             </p>
//             Valid until: ${d.valid_until}
            
//         `;//<button class="btn-1 save-product">Save Product</button>
//         console.log(d);
//         //  the delete handler must be inside the loop
//         li.querySelector(".delete-btn").addEventListener("click", async () => {
//             const discountId = d.discount_id; // confirm this is in your DB return

//             if (!confirm("Are you sure you want to delete this discount?")) return;

//             const delRes = await fetch(`/api/discount/${discountId}`, {
//                 method: "DELETE",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ manufacturer_id: currentUser.manufacturer_id })
//             });

//             const data = await delRes.json();
//             if (delRes.ok) {
//                 alert(data.message || "Deleted");
//                 loadManufacturerDiscounts(); // refresh
//             } else {
//                 alert(data.error || "Delete failed");
//             }
//         });

//         productList.appendChild(li);
//     });
// }


// // handle add-discount submission
// discountForm.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const formData = new FormData(discountForm);

//     const res = await fetch("/api/add-discount", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//             manufacturer_id: currentUser.manufacturer_id,
//             parish: formData.get("parish"),
//             title: formData.get("title"),
//             reason: formData.get("reason"),
//             valid_until: formData.get("valid_until"),
//             product: formData.get("product"),
//             original_price: formData.get("original_price"),
//             discounted_price: formData.get("discounted_price"),
//         })
//     });

//     const data = await res.json();
//     if (data.message) {
//         alert("Discount added!");
//         discountForm.reset();
//         container.style.display = "none";
//         loadManufacturerDiscounts();
//     }
// });

// js/manufacturer_dashboard.js
const discountForm = document.getElementById("discountForm");
const postBtn = document.querySelector(".post-btn");
const container = document.querySelector(".container");
const productList = document.querySelector(".product-list");
const searchBar = document.getElementById('searchBar');

// Mock current logged-in manufacturer
const currentUser = {
    manufacturer_id: 1,
    name: "John Doe",
    role: "manufacturer"
};

// Mock discounts data
let discounts = [
    {
        discount_id: 1,
        parish: "Kingston",
        title: "50% Off Apples",
        reason: "Seasonal Sale",
        valid_until: "2025-11-01",
        original_price: 200,
        discounted_price: 100,
        product: "Apples"
    },
    {
        discount_id: 2,
        parish: "St. Andrew",
        title: "Buy 1 Get 1 Free Milk",
        reason: "Promotion",
        valid_until: "2025-10-25",
        original_price: 150,
        discounted_price: 75,
        product: "Milk"
    }
];

// Toggle form
postBtn.addEventListener("click", () => {
    container.style.display = container.style.display === "none" ? "block" : "none";
});

// Load manufacturer discounts (front-end only)
function loadManufacturerDiscounts() {
    productList.innerHTML = ""; // clear

    discounts.forEach(d => {
        const li = document.createElement("li");
        li.className = "product-li";
        li.innerHTML = `
            <div class="post-title">
                <strong>${d.title}</strong> - ${d.parish}
                <button class="btn-4 delete-btn">Delete</button>
            </div>
            <em>${d.reason}</em><br/>
            <p>${d.product}'s Original Price - ${d.original_price}, 
                <span class="highlight-red">Discounted Price - ${d.discounted_price}</span>
            </p>
            Valid until: ${d.valid_until}
        `;

        // Delete discount
        li.querySelector(".delete-btn").addEventListener("click", () => {
            if (!confirm("Are you sure you want to delete this discount?")) return;
            discounts = discounts.filter(discount => discount.discount_id !== d.discount_id);
            loadManufacturerDiscounts();
        });

        productList.appendChild(li);
    });
}

// Handle add-discount form
discountForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(discountForm);

    const newDiscount = {
        discount_id: Date.now(), // simple unique ID
        manufacturer_id: currentUser.manufacturer_id,
        parish: formData.get("parish"),
        title: formData.get("title"),
        reason: formData.get("reason"),
        valid_until: formData.get("valid_until"),
        product: formData.get("product"),
        original_price: formData.get("original_price"),
        discounted_price: formData.get("discounted_price")
    };

    discounts.push(newDiscount);

    alert("Discount added!");
    discountForm.reset();
    container.style.display = "none";
    loadManufacturerDiscounts();
});

// Search products
searchBar.addEventListener("input", () => {
    const keyword = searchBar.value.trim().toLowerCase();
    const filtered = discounts.filter(d =>
        d.product.toLowerCase().includes(keyword) ||
        d.title.toLowerCase().includes(keyword)
    );
    productList.innerHTML = ""; // clear
    filtered.forEach(d => {
        const li = document.createElement("li");
        li.className = "product-li";
        li.innerHTML = `
            <div class="post-title">
                <strong>${d.title}</strong> - ${d.parish}
                <button class="btn-4 delete-btn">Delete</button>
            </div>
            <em>${d.reason}</em><br/>
            <p>${d.product}'s Original Price - ${d.original_price}, 
                <span class="highlight-red">Discounted Price - ${d.discounted_price}</span>
            </p>
            Valid until: ${d.valid_until}
        `;

        li.querySelector(".delete-btn").addEventListener("click", () => {
            discounts = discounts.filter(discount => discount.discount_id !== d.discount_id);
            loadManufacturerDiscounts();
        });

        productList.appendChild(li);
    });
});

// Initial load
loadManufacturerDiscounts();
