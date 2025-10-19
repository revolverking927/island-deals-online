// // js/consumer_dashboard.js
// import { SearchBar } from './helpers/search-bar.js';

// const resultBox = document.getElementById('discountList');
// const inputBox = document.getElementById('searchBar');
// const parishSelect = document.getElementById('parishFilter');
// const useLocationBtn = document.getElementById('useLocation');

// let CURRENT_SELECTED_PARISH = parishSelect.value || 'Kingston';
// let search = null;

// async function fetchDiscounts(parish = '', keyword = '') {
//     const query = new URLSearchParams();
//     if (parish) query.append('parish', parish);
//     if (keyword) query.append('search', keyword);

//     const res = await fetch(`/api/discounts?${query.toString()}`);
//     const data = await res.json();
//     return data;
// }

// async function initDashboard() {
//     const discounts = await fetchDiscounts(CURRENT_SELECTED_PARISH);

//     const templateString = `
//         <li class="product-li">
//             <div class="post-title">
//                 <b>{{title}}</b> - {{parish}}
//             </div>
//             <em>{{reason}}</em><br/>
//             <p>{{product}}'s Original Price - {{original_price}},
//             <span class="highlight-red">Discounted Price - {{discounted_price}}</span></p>
//             Valid until: {{valid_until}}
//             <button class="btn-1 save-product">Save Product</button>
//         </li>
//     `;

//     search = new SearchBar(resultBox, inputBox, discounts, templateString);

//     search.updateKeywords.addEventListener('update-keywords', async () => {
//         const keyword = inputBox.value.trim();
//         const parish = CURRENT_SELECTED_PARISH;
//         const data = await fetchDiscounts(parish, keyword);
//         search.keywords = data;
//         search.display(data);
//     });
// }

// // Parish dropdown
// parishSelect.addEventListener('change', async () => {
//     CURRENT_SELECTED_PARISH = parishSelect.value;
//     const data = await fetchDiscounts(CURRENT_SELECTED_PARISH, inputBox.value.trim());
//     search.keywords = data;
//     search.display(data);
// });

// // Use browser geolocation
// useLocationBtn.addEventListener('click', () => {
//     if (!navigator.geolocation) {
//         alert("Geolocation not supported by your browser");
//         return;
//     }

//     navigator.geolocation.getCurrentPosition(async (position) => {
//         const { latitude, longitude } = position.coords;
//         // Backend endpoint should resolve parish from lat/lon
//         const res = await fetch(`/api/parish-from-coords?lat=${latitude}&lon=${longitude}`);
//         const data = await res.json();
//         if (data.parish) {
//             CURRENT_SELECTED_PARISH = data.parish;
//             parishSelect.value = data.parish;
//             const discounts = await fetchDiscounts(CURRENT_SELECTED_PARISH, inputBox.value.trim());
//             search.keywords = discounts;
//             search.display(discounts);
//         } else {
//             alert("Could not determine your parish from location");
//         }
//     }, (err) => {
//         alert("Unable to retrieve your location: " + err.message);
//     });
// });

// window.addEventListener('DOMContentLoaded', initDashboard);

// js/consumer_dashboard.js
import { SearchBar } from './helpers/search-bar.js';

// Mock stand-in discounts
const discounts = [
    {
        discount_id: 1,
        parish: 'Kingston',
        title: '50% Off Apples',
        reason: 'Seasonal Sale',
        valid_until: '2025-11-01',
        original_price: 200,
        discounted_price: 100,
        product: 'Apples',
        manufacturer_id: 1
    },
    {
        discount_id: 2,
        parish: 'St. Andrew',
        title: 'Buy 1 Get 1 Free Milk',
        reason: 'Promotion',
        valid_until: '2025-10-25',
        original_price: 150,
        discounted_price: 75,
        product: 'Milk',
        manufacturer_id: 2
    },
    {
        discount_id: 3,
        parish: 'St. Catherine',
        title: '20% Off Bread',
        reason: 'Weekly Discount',
        valid_until: '2025-10-30',
        original_price: 100,
        discounted_price: 80,
        product: 'Bread',
        manufacturer_id: 3
    },
    {
        discount_id: 4,
        parish: 'Clarendon',
        title: '30% Off Eggs',
        reason: 'Clearance',
        valid_until: '2025-11-05',
        original_price: 300,
        discounted_price: 210,
        product: 'Eggs',
        manufacturer_id: 1
    },
    {
        discount_id: 5,
        parish: 'Manchester',
        title: 'Discounted Cheese',
        reason: 'Promotion',
        valid_until: '2025-11-10',
        original_price: 500,
        discounted_price: 400,
        product: 'Cheese',
        manufacturer_id: 2
    }
];

const resultBox = document.getElementById('discountList');
const inputBox = document.getElementById('searchBar');

const templateString = `
    <li class="product-li">
        <div class="post-title">
            <b>{{title}}</b> - {{parish}}
        </div>
        <em>{{reason}}</em><br/>
        <p>{{product}}'s Original Price - {{original_price}},
        <span class="highlight-red">Discounted Price - {{discounted_price}}</span></p>
        Valid until: {{valid_until}}
        <button class="btn-1 save-product">Save Product</button>
    </li>
`;

let search = new SearchBar(resultBox, inputBox, discounts, templateString);

// Initial render
search.display(discounts);

// Filter by search input only
inputBox.addEventListener('input', () => {
    const keyword = inputBox.value.trim().toLowerCase();
    const filtered = discounts.filter(d =>
        d.product.toLowerCase().includes(keyword)
    );
    search.keywords = filtered;
    search.display(filtered);
});
