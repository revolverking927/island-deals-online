// standinData.js

export const consumers = [
  { consumer_id: 1, email: 'john.doe@example.com', password: 'password123', parish: 'Kingston', name: 'John Doe' },
  { consumer_id: 2, email: 'jane.smith@example.com', password: 'mypassword', parish: 'St. Andrew', name: 'Jane Smith' },
  { consumer_id: 3, email: 'alex.brown@example.com', password: 'abc123', parish: 'St. Catherine', name: 'Alex Brown' },
  { consumer_id: 4, email: 'maria.johnson@example.com', password: 'securepass', parish: 'Clarendon', name: 'Maria Johnson' },
  { consumer_id: 5, email: 'michael.williams@example.com', password: 'pass456', parish: 'Manchester', name: 'Michael Williams' }
];

// standinDiscounts.js

export const discounts = [
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
