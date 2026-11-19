/**
 * ETHNIC COLLECTION HUB - Unified Database & State Store
 * Implements persistent Firestore collections in LocalStorage with reactive updates.
 * Covers users, products, categories, orders, carts, wishlists, addresses, payments,
 * returns, reviews, coupons, notifications, and admin_settings.
 */

import { CATEGORIES, INITIAL_PRODUCTS } from '../data/mockCatalog';

const DB_PREFIX = 'ech_db_';

function getCollection(name, defaultData = []) {
  try {
    const raw = localStorage.getItem(DB_PREFIX + name);
    if (!raw) {
      localStorage.setItem(DB_PREFIX + name, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading collection ${name}:`, e);
    return defaultData;
  }
}

function saveCollection(name, data) {
  try {
    localStorage.setItem(DB_PREFIX + name, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('ech_db_change', { detail: { collection: name, data } }));
  } catch (e) {
    console.error(`Error saving collection ${name}:`, e);
  }
}

// Initial Admin Settings
const INITIAL_SETTINGS = {
  wholesaleMinSets: 12, // Strict mandatory business rule
  retailerMinSets: 2,
  damageReturnWindowDays: 5, // Strict 5-day policy
  acceptedPayments: ['ONLINE_UPI', 'UPI_ON_DELIVERY'], // No COD allowed
  merchantUpiVpa: 'pay.ethniccollectionhub@okhdfcbank',
  merchantName: 'ETHNIC COLLECTION HUB PVT LTD',
  supportEmail: 'care@ethniccollectionhub.com',
  supportPhone: '+91 11 4982 7700',
  headquarters: 'Heritage Couture Plaza, Connaught Place, New Delhi 110001, India',
};

// Initial Seed Users (Wholesaler, Retailer, Buyer, Admin)
const INITIAL_USERS = [
  {
    id: 'user_wholesaler_01',
    email: 'wholesaler@ethniccollectionhub.com',
    name: 'Rajesh Singhania',
    accountType: 'Wholesaler',
    businessName: 'Singhania Silk & Sarees Syndicate',
    gstin: '07AAAAA0000A1Z5',
    phone: '+91 98110 23456',
    address: 'Bale Depot 4, Chandni Chowk, Delhi 110006',
    aadhaarVerificationStatus: 'Verified',
    aadhaarMasked: 'XXXX-XXXX-8921',
    verifiedAt: '2026-10-15T10:00:00Z',
    createdAt: '2026-09-01T09:30:00Z'
  },
  {
    id: 'user_retailer_01',
    email: 'retailer@ethniccollectionhub.com',
    name: 'Ananya Deshmukh',
    accountType: 'Retailer',
    businessName: 'Ananya Bridal & Couture Boutique',
    gstin: '27BBBBB1111B1Z9',
    phone: '+91 98220 87654',
    address: 'Shop 12, Phoenix Marketcity, Kurla, Mumbai 400070',
    aadhaarVerificationStatus: 'Verified',
    aadhaarMasked: 'XXXX-XXXX-4512',
    verifiedAt: '2026-10-20T11:00:00Z',
    createdAt: '2026-09-10T14:15:00Z'
  },
  {
    id: 'user_buyer_01',
    email: 'buyer@ethniccollectionhub.com',
    name: 'Priya Sharma',
    accountType: 'Buyer',
    phone: '+91 98765 43210',
    address: 'B-402, Godrej Woods, Sector 43, Noida 201301',
    aadhaarVerificationStatus: 'Verified',
    aadhaarMasked: 'XXXX-XXXX-1984',
    verifiedAt: '2026-10-25T16:20:00Z',
    createdAt: '2026-10-01T12:00:00Z'
  },
  {
    id: 'user_admin_01',
    email: 'admin@ethniccollectionhub.com',
    name: 'Chief Administrator',
    accountType: 'Admin',
    phone: '+91 11 4982 7701',
    role: 'SUPER_ADMIN',
    createdAt: '2026-01-01T00:00:00Z'
  }
];

// Initial Coupons
const INITIAL_COUPONS = [
  { code: 'ROYAL10', discountPercent: 10, minOrder: 2999, description: '10% off on all buyer orders above ₹2,999' },
  { code: 'BULK5', discountPercent: 5, minOrder: 50000, description: 'Extra 5% off on bulk wholesaler orders' },
  { code: 'RETAIL15', discountPercent: 15, minOrder: 15000, description: '15% trade festival discount for retailers' },
];

// Initial Seed Orders for realistic tracking and history
const INITIAL_ORDERS = [
  {
    id: 'ECH-ORD-88219',
    userId: 'user_buyer_01',
    userEmail: 'buyer@ethniccollectionhub.com',
    userName: 'Priya Sharma',
    accountType: 'Buyer',
    orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago (eligible for return if delivered)
    deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Delivered 1 day ago (within 5-day window!)
    status: 'Delivered',
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'Paid',
    upiTransactionId: 'UPI-RAZOR-9081234567',
    subtotal: 8999,
    discount: 899.9,
    deliveryFee: 0,
    totalAmount: 8099.1,
    shippingAddress: {
      fullName: 'Priya Sharma',
      phone: '+91 98765 43210',
      addressLine1: 'B-402, Godrej Woods, Sector 43',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Varanasi Royal Kadhwa Brocade Silk Saree',
        sku: 'ECH-SAR-001',
        quantity: 1,
        color: 'Imperial Red',
        size: 'Free Size',
        unitPrice: 8999,
        totalPrice: 8999,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      }
    ],
    tracking: {
      courier: 'BlueDart Express',
      trackingNumber: 'BD-DEL-7782193',
      currentStage: 'Delivered',
      estimatedDelivery: 'Yesterday',
      timeline: [
        { title: 'Order Placed & Payment Confirmed', time: '3 days ago', done: true },
        { title: 'Quality Inspection & Silk Mark Tagged', time: '2 days ago', done: true },
        { title: 'Dispatched via BlueDart Hub Delhi', time: '2 days ago', done: true },
        { title: 'Out for Delivery', time: '1 day ago', done: true },
        { title: 'Delivered to Customer Doorstep', time: 'Yesterday 14:32', done: true },
      ]
    }
  },
  {
    id: 'ECH-ORD-77104',
    userId: 'user_wholesaler_01',
    userEmail: 'wholesaler@ethniccollectionhub.com',
    userName: 'Rajesh Singhania',
    accountType: 'Wholesaler',
    orderDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: null,
    status: 'In Transit',
    paymentMethod: 'UPI_ON_DELIVERY',
    paymentStatus: 'Awaiting UPI on Delivery',
    subtotal: 248400, // 12 sets of Kadhwa Saree
    discount: 12420,
    deliveryFee: 1500,
    totalAmount: 237480,
    shippingAddress: {
      fullName: 'Singhania Silk & Sarees Syndicate',
      phone: '+91 98110 23456',
      addressLine1: 'Bale Depot 4, Gali Paranthe Wali',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110006',
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Varanasi Royal Kadhwa Brocade Silk Saree (Set of 6)',
        sku: 'ECH-SAR-001',
        quantitySets: 12, // Meets 12 sets minimum
        piecesPerSet: 6,
        totalPieces: 72,
        unitPricePerSet: 20700,
        totalPrice: 248400,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      }
    ],
    tracking: {
      courier: 'V-Trans Logistics Heavy Freight',
      trackingNumber: 'VT-CON-902188',
      currentStage: 'In Transit',
      estimatedDelivery: 'Tomorrow afternoon',
      timeline: [
        { title: 'Bulk Order Created & Minimum 12 Sets Validated', time: '4 days ago', done: true },
        { title: 'Bale Packing & Master Carton Strapping', time: '3 days ago', done: true },
        { title: 'Loaded onto Commercial Freight Carrier', time: '2 days ago', done: true },
        { title: 'In Transit to Regional Logistics Hub', time: 'Today', done: true },
        { title: 'Out for Bulk Commercial Delivery & Dynamic UPI QR Collection', time: 'Tomorrow', done: false },
      ]
    }
  },
  {
    id: 'ECH-ORD-66512',
    userId: 'user_retailer_01',
    userEmail: 'retailer@ethniccollectionhub.com',
    userName: 'Ananya Deshmukh',
    accountType: 'Retailer',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: null,
    status: 'Dispatched',
    paymentMethod: 'ONLINE_UPI',
    paymentStatus: 'Paid',
    upiTransactionId: 'UPI-PHONEPE-7711209341',
    subtotal: 35994,
    discount: 5399.1,
    deliveryFee: 450,
    totalAmount: 31044.9,
    shippingAddress: {
      fullName: 'Ananya Bridal & Couture Boutique',
      phone: '+91 98220 87654',
      addressLine1: 'Shop 12, Ground Floor, Phoenix Marketcity',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400070',
    },
    items: [
      {
        productId: 'prod-001',
        name: 'Varanasi Royal Kadhwa Brocade Silk Saree',
        sku: 'ECH-SAR-001',
        quantity: 6,
        unitPrice: 5999,
        totalPrice: 35994,
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      }
    ],
    tracking: {
      courier: 'Delhivery Express B2B',
      trackingNumber: 'DLV-B2B-440192',
      currentStage: 'Dispatched',
      estimatedDelivery: 'In 2 Days',
      timeline: [
        { title: 'Order Verified & GST Invoice Generated', time: '2 days ago', done: true },
        { title: 'Box Tagged & Security Hologram Applied', time: '1 day ago', done: true },
        { title: 'Dispatched from Central Warehouse', time: 'Today 08:00', done: true },
        { title: 'Out for Delivery to Retail Store', time: 'Pending', done: false },
      ]
    }
  }
];

// Initialize Collections
export const StoreService = {
  getProducts: () => getCollection('products', INITIAL_PRODUCTS),
  setProducts: (data) => saveCollection('products', data),

  getCategories: () => getCollection('categories', CATEGORIES),
  setCategories: (data) => saveCollection('categories', data),

  getUsers: () => getCollection('users', INITIAL_USERS),
  setUsers: (data) => saveCollection('users', data),

  getOrders: () => getCollection('orders', INITIAL_ORDERS),
  setOrders: (data) => saveCollection('orders', data),

  getReturns: () => getCollection('returns', [
    {
      id: 'RET-001',
      orderId: 'ECH-ORD-88219',
      userId: 'user_buyer_01',
      userEmail: 'buyer@ethniccollectionhub.com',
      accountType: 'Buyer',
      productName: 'Varanasi Royal Kadhwa Brocade Silk Saree',
      damageType: 'Torn Weft along Saree Border',
      damageDescription: 'Upon unboxing the sealed package, noticed a 4-inch tear across the gold zari border near the pallu join.',
      photos: [
        'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80'
      ],
      reportDate: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      daysSinceDelivery: 1, // Within 5 days!
      status: 'Under Review', // Under Review | Approved | Rejected | Refunded
      adminRemarks: 'Assigned to Senior Quality Inspector. Photographic evidence verified.',
    }
  ]),
  setReturns: (data) => saveCollection('returns', data),

  getReviews: () => getCollection('reviews', [
    {
      id: 'REV-001',
      productId: 'prod-001',
      userId: 'user_buyer_01',
      userName: 'Priya Sharma',
      rating: 5,
      comment: 'Exquisite silk and authentic Banarasi kadhwa weave. The zari luster is royal!',
      createdAt: '2026-11-10T14:00:00Z',
      verifiedPurchase: true
    }
  ]),
  setReviews: (data) => saveCollection('reviews', data),

  getCoupons: () => getCollection('coupons', INITIAL_COUPONS),

  getAdminSettings: () => getCollection('admin_settings', INITIAL_SETTINGS),
  setAdminSettings: (data) => saveCollection('admin_settings', data),

  // Cart operations per user role
  getCart: (role = 'Buyer') => {
    return getCollection(`cart_${role.toLowerCase()}`, []);
  },
  saveCart: (role = 'Buyer', cartItems) => {
    saveCollection(`cart_${role.toLowerCase()}`, cartItems);
  },

  // Wishlist
  getWishlist: (userId = 'current') => {
    return getCollection(`wishlist_${userId}`, ['prod-001', 'prod-002']);
  },
  saveWishlist: (userId = 'current', items) => {
    saveCollection(`wishlist_${userId}`, items);
  },

  // Addresses
  getAddresses: (userId = 'current') => {
    return getCollection(`addresses_${userId}`, [
      {
        id: 'addr-01',
        fullName: 'Primary Address',
        phone: '+91 98765 43210',
        addressLine1: 'B-402, Godrej Woods, Sector 43',
        addressLine2: 'Near Golf Course Metro',
        city: 'Noida',
        state: 'Uttar Pradesh',
        pincode: '201301',
        isDefault: true,
        type: 'Home'
      },
      {
        id: 'addr-02',
        fullName: 'Corporate Office / Store',
        phone: '+91 98110 23456',
        addressLine1: 'Level 3, Connaught Plaza, Barakhamba Road',
        addressLine2: 'Opposite Metro Gate 2',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110001',
        isDefault: false,
        type: 'Commercial'
      }
    ]);
  },
  saveAddresses: (userId = 'current', addrs) => {
    saveCollection(`addresses_${userId}`, addrs);
  },

  // Notifications
  getNotifications: (userId = 'current') => {
    return getCollection(`notifs_${userId}`, [
      {
        id: 'notif-1',
        title: 'Order ECH-ORD-88219 Delivered',
        message: 'Your Varanasi Royal Kadhwa Brocade Saree has arrived. You have 5 days to report any transit damage.',
        time: 'Yesterday',
        read: false,
        link: '/buyer/orders'
      },
      {
        id: 'notif-2',
        title: 'Festive Season Wholesaler Matrix Active',
        message: 'Order 24+ sets to unlock 5% bulk rebate, and 36+ sets for 10% volume incentive.',
        time: '3 days ago',
        read: true,
        link: '/wholesaler/bulk-pricing'
      }
    ]);
  },
  saveNotifications: (userId = 'current', notifs) => {
    saveCollection(`notifs_${userId}`, notifs);
  }
};
