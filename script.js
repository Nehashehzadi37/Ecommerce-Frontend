/* ============================================================
   SHOPZONE — Complete JavaScript
   All functions | Cart | Wishlist | Slider | Search |
   Quick View | Filters | Language | Toast | Responsive
   ============================================================ */

'use strict';

/* ============================================================
   1. STATE MANAGEMENT
   ============================================================ */
const ShopZone = {
  cart: [],
  wishlist: [],
  currentSlide: 0,
  totalSlides: 3,
  sliderTimer: null,
  currentLang: 'EN',
  currentFilter: 'all',

  // Product data (matches your HTML cards)
  products: [
    {
      id: 1, name: 'Smart Watch Pro X200', brand: 'TechBrand',
      price: 89.99, oldPrice: 129.99, rating: 5, reviews: 128,
      image: '8.png', category: 'electronics', badge: 'HOT',
      description: 'Advanced smartwatch with health tracking, GPS, and 7-day battery life. Water resistant up to 50m.',
      colors: ['#1a1a2e', '#FF6B35', '#silver'],
      sizes: null
    },
    {
      id: 2, name: 'Wireless Earbuds Elite', brand: 'SoundMax',
      price: 49.99, oldPrice: 79.99, rating: 4, reviews: 84,
      image: 'image 29.png', category: 'electronics', badge: 'NEW',
      description: 'Premium wireless earbuds with active noise cancellation and 30-hour total battery life.',
      colors: ['#fff', '#1a1a2e'],
      sizes: null
    },
    {
      id: 3, name: 'Premium Casual Jacket', brand: 'FashionHub',
      price: 59.99, oldPrice: 99.99, rating: 5, reviews: 256,
      image: '2 1.png', category: 'fashion', badge: null,
      description: 'Premium quality casual jacket made from sustainable materials. Perfect for all seasons.',
      colors: ['#4a4a6a', '#8B4513', '#1a1a2e'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL']
    },
    {
      id: 4, name: 'Coat for Men', brand: 'StyleCo',
      price: 34.99, oldPrice: 59.99, rating: 4, reviews: 192,
      image: 'image 30.png', category: 'fashion', badge: 'SALE',
      description: 'Classic men\'s coat with modern cut. Warm inner lining for winter comfort.',
      colors: ['#1a1a2e', '#4a4a6a', '#8B4513'],
      sizes: ['S', 'M', 'L', 'XL']
    },
    {
      id: 5, name: 'Nordic Table Lamp', brand: 'HomeDecor',
      price: 44.99, oldPrice: 69.99, rating: 5, reviews: 67,
      image: '6.png', category: 'interior', badge: null,
      description: 'Minimalist Nordic design table lamp with warm LED light. Perfect for bedrooms and offices.',
      colors: ['#F5F5DC', '#1a1a2e', '#8B4513'],
      sizes: null
    },
    {
      id: 6, name: 'Digital Camera 4K UHD', brand: 'SnapPro',
      price: 199.99, oldPrice: 299.99, rating: 5, reviews: 311,
      image: 'camera.png', category: 'electronics', badge: 'HOT',
      description: 'Professional 4K UHD digital camera with 24MP sensor, optical zoom, and image stabilization.',
      colors: ['#1a1a2e', '#4a4a6a'],
      sizes: null
    },
    {
      id: 7, name: 'Ceramic Decorative Vase', brand: 'ArtHaus',
      price: 24.99, oldPrice: 39.99, rating: 4, reviews: 43,
      image: 'image 89.png', category: 'interior', badge: null,
      description: 'Handcrafted ceramic vase with unique glaze finish. Each piece is one of a kind.',
      colors: ['#D2B48C', '#8B4513', '#4a4a6a'],
      sizes: null
    },
    {
      id: 8, name: 'Sport Wear Shirt', brand: 'ActiveWear',
      price: 39.99, oldPrice: 64.99, rating: 5, reviews: 175,
      image: 'Bitmap.png', category: 'fashion', badge: 'NEW',
      description: 'High-performance sportswear shirt with moisture-wicking fabric and ergonomic fit.',
      colors: ['#FF6B35', '#1a1a2e', '#fff'],
      sizes: ['XS', 'S', 'M', 'L', 'XL']
    }
  ]
};

/* ============================================================
   2. DOM READY — INIT ALL MODULES
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadFromStorage();
  initSlider();
  initCartUI();
  initWishlistUI();
  initSearchInput();
  initDropdowns();
  initScrollEffects();
  initLazyImages();
  updateCartCount();
  updateWishlistCount();
  console.log('✅ ShopZone JS initialized');
});

/* ============================================================
   3. LOCAL STORAGE — PERSIST CART & WISHLIST
   ============================================================ */
function loadFromStorage() {
  try {
    const savedCart = localStorage.getItem('shopzone_cart');
    const savedWishlist = localStorage.getItem('shopzone_wishlist');
    if (savedCart) ShopZone.cart = JSON.parse(savedCart);
    if (savedWishlist) ShopZone.wishlist = JSON.parse(savedWishlist);
  } catch (e) {
    console.warn('Storage load failed:', e);
  }
}

function saveToStorage() {
  try {
    localStorage.setItem('shopzone_cart', JSON.stringify(ShopZone.cart));
    localStorage.setItem('shopzone_wishlist', JSON.stringify(ShopZone.wishlist));
  } catch (e) {
    console.warn('Storage save failed:', e);
  }
}

/* ============================================================
   4. CART FUNCTIONS
   ============================================================ */
function addToCart(id, name, price, qty = 1) {
  const existing = ShopZone.cart.find(item => item.id === id);

  if (existing) {
    existing.qty += qty;
    showToast(`✅ ${name} quantity updated (${existing.qty})`);
  } else {
    const product = ShopZone.products.find(p => p.id === id);
    ShopZone.cart.push({
      id,
      name,
      price,
      qty,
      image: product ? product.image : '',
      brand: product ? product.brand : ''
    });
    showToast(`🛒 ${name} added to cart!`);
  }

  saveToStorage();
  updateCartCount();
  renderCartItems();
  animateCartBtn();
}

function removeFromCart(id) {
  const item = ShopZone.cart.find(i => i.id === id);
  ShopZone.cart = ShopZone.cart.filter(i => i.id !== id);
  saveToStorage();
  updateCartCount();
  renderCartItems();
  if (item) showToast(`🗑️ ${item.name} removed`);
}

function updateCartQty(id, delta) {
  const item = ShopZone.cart.find(i => i.id === id);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    removeFromCart(id);
    return;
  }

  saveToStorage();
  updateCartCount();
  renderCartItems();
}

function clearCart() {
  ShopZone.cart = [];
  saveToStorage();
  updateCartCount();
  renderCartItems();
  showToast('🗑️ Cart cleared');
}

function updateCartCount() {
  const total = ShopZone.cart.reduce((sum, i) => sum + i.qty, 0);
  const el = document.getElementById('cartCount');
  const el2 = document.getElementById('cartItemCount');
  if (el) el.textContent = total;
  if (el2) el2.textContent = `(${total} item${total !== 1 ? 's' : ''})`;
}

function getCartTotal() {
  return ShopZone.cart.reduce((sum, i) => sum + i.price * i.qty, 0);
}

function renderCartItems() {
  const body = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!body) return;

  if (ShopZone.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <a href="product.html" class="btn btn-primary" onclick="closeCart()">Start Shopping</a>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = ShopZone.cart.map(item => `
    <div class="cart-item" id="cart-item-${item.id}" style="
      display:flex; gap:12px; padding:14px 0;
      border-bottom:1px solid var(--border);
      animation: fadeInUp 0.3s ease;
    ">
      <div style="
        width:72px; height:72px; border-radius:10px;
        background:var(--bg-light); overflow:hidden; flex-shrink:0;
      ">
        <img src="${item.image}" alt="${item.name}"
          style="width:100%;height:100%;object-fit:cover;"
          onerror="this.style.background='var(--bg-light)';this.src=''">
      </div>
      <div style="flex:1; min-width:0;">
        <p style="font-size:11px;color:var(--text-light);margin-bottom:2px;">${item.brand || ''}</p>
        <p style="font-size:14px;font-weight:600;color:var(--text-dark);
          white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
          margin-bottom:6px;">${item.name}</p>
        <p style="font-size:15px;font-weight:700;color:var(--primary);">
          $${(item.price * item.qty).toFixed(2)}
        </p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:8px;">
          <button onclick="updateCartQty(${item.id}, -1)" style="
            width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);
            background:var(--bg-light);font-size:16px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            transition:all 0.2s;
          " onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'"
             onmouseout="this.style.borderColor='var(--border)';this.style.color='inherit'">−</button>
          <span style="font-weight:600;font-size:14px;min-width:24px;text-align:center;">${item.qty}</span>
          <button onclick="updateCartQty(${item.id}, 1)" style="
            width:28px;height:28px;border-radius:50%;border:1.5px solid var(--border);
            background:var(--bg-light);font-size:16px;cursor:pointer;
            display:flex;align-items:center;justify-content:center;
            transition:all 0.2s;
          " onmouseover="this.style.borderColor='var(--primary)';this.style.color='var(--primary)'"
             onmouseout="this.style.borderColor='var(--border)';this.style.color='inherit'">+</button>
          <button onclick="removeFromCart(${item.id})" style="
            margin-left:auto;background:none;border:none;cursor:pointer;
            color:var(--text-light);font-size:13px;transition:color 0.2s;
          " onmouseover="this.style.color='#e53935'"
             onmouseout="this.style.color='var(--text-light)'">✕ Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  // Clear cart button
  body.innerHTML += `
    <button onclick="clearCart()" style="
      margin-top:16px;width:100%;padding:10px;
      background:none;border:1.5px solid #fee2e2;
      border-radius:8px;color:#e53935;font-size:13px;
      font-weight:600;cursor:pointer;transition:all 0.2s;
    " onmouseover="this.style.background='#fee2e2'"
       onmouseout="this.style.background='none'">
      🗑️ Clear All Items
    </button>`;

  if (footer) {
    footer.style.display = 'block';
    if (totalEl) {
      totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
    }
  }
}

function initCartUI() {
  renderCartItems();
}

function animateCartBtn() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  btn.style.transform = 'scale(1.15)';
  setTimeout(() => { btn.style.transform = ''; }, 300);
}

/* ============================================================
   5. CART SIDEBAR OPEN / CLOSE
   ============================================================ */
function openCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  renderCartItems();
  if (sidebar) sidebar.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  const sidebar = document.getElementById('cartSidebar');
  const overlay = document.getElementById('cartOverlay');
  if (sidebar) sidebar.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

// Close cart on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeCart();
    closeQuickView();
  }
});

/* ============================================================
   6. CHECKOUT
   ============================================================ */
function checkout() {
  if (ShopZone.cart.length === 0) {
    showToast('⚠️ Your cart is empty!');
    return;
  }

  const total = getCartTotal().toFixed(2);
  const count = ShopZone.cart.reduce((s, i) => s + i.qty, 0);

  // Show checkout modal
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const content = document.getElementById('quickViewContent');

  if (!modal || !content) {
    showToast(`✅ Order placed! Total: $${total}`);
    clearCart();
    closeCart();
    return;
  }

  content.innerHTML = `
    <div style="text-align:center;padding:20px 0;">
      <div style="font-size:56px;margin-bottom:16px;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:26px;margin-bottom:8px;color:var(--text-dark);">Order Confirmed!</h2>
      <p style="color:var(--text-mid);font-size:15px;margin-bottom:24px;">
        ${count} item${count !== 1 ? 's' : ''} · Total: <strong style="color:var(--primary);">$${total}</strong>
      </p>
      <div style="background:var(--bg-light);border-radius:12px;padding:20px;margin-bottom:24px;text-align:left;">
        ${ShopZone.cart.map(i => `
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:14px;">
            <span>${i.name} × ${i.qty}</span>
            <span style="font-weight:600;color:var(--primary);">$${(i.price * i.qty).toFixed(2)}</span>
          </div>
        `).join('')}
        <div style="display:flex;justify-content:space-between;padding:12px 0 0;font-weight:700;font-size:16px;">
          <span>Total</span>
          <span style="color:var(--primary);">$${total}</span>
        </div>
      </div>
      <p style="color:var(--text-light);font-size:13px;margin-bottom:20px;">
        📧 Confirmation sent to your email<br>
        🚚 Estimated delivery: 3–7 business days
      </p>
      <button onclick="clearCart();closeCart();closeQuickView();" class="btn btn-primary" style="padding:12px 36px;">
        Continue Shopping
      </button>
    </div>`;

  modal.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

/* ============================================================
   7. WISHLIST FUNCTIONS
   ============================================================ */
function addToWishlist(id) {
  const product = ShopZone.products.find(p => p.id === id);
  if (!product) return;

  const inWishlist = ShopZone.wishlist.find(i => i.id === id);

  if (inWishlist) {
    ShopZone.wishlist = ShopZone.wishlist.filter(i => i.id !== id);
    showToast(`💔 ${product.name} removed from wishlist`);
    updateHeartIcon(id, false);
  } else {
    ShopZone.wishlist.push({ id, name: product.name, price: product.price, image: product.image });
    showToast(`❤️ ${product.name} added to wishlist!`);
    updateHeartIcon(id, true);
  }

  saveToStorage();
  updateWishlistCount();
}

function updateHeartIcon(id, active) {
  // Find overlay buttons for this product card
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    const btn = card.querySelector('[onclick*="addToWishlist(' + id + ')"]');
    if (btn) {
      btn.style.color = active ? '#e53935' : '';
      btn.style.background = active ? '#fee2e2' : '';
    }
  });
}

function updateWishlistCount() {
  const count = ShopZone.wishlist.length;
  const wishlistBtns = document.querySelectorAll('[onclick="goToWishlist()"]');
  wishlistBtns.forEach(btn => {
    // Add or update badge
    let badge = btn.querySelector('.wishlist-badge');
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'wishlist-badge';
        badge.style.cssText = `
          position:absolute;top:-4px;right:-4px;
          background:var(--primary);color:#fff;
          font-size:10px;font-weight:700;
          width:18px;height:18px;border-radius:50%;
          display:flex;align-items:center;justify-content:center;
        `;
        btn.style.position = 'relative';
        btn.appendChild(badge);
      }
      badge.textContent = count;
    } else if (badge) {
      badge.remove();
    }
  });
}

function goToWishlist() {
  if (ShopZone.wishlist.length === 0) {
    showToast('💔 Your wishlist is empty. Add some items!');
    return;
  }

  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const content = document.getElementById('quickViewContent');

  if (!modal || !content) return;

  content.innerHTML = `
    <h2 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:20px;color:var(--text-dark);">
      ❤️ My Wishlist (${ShopZone.wishlist.length})
    </h2>
    <div style="display:grid;gap:14px;">
      ${ShopZone.wishlist.map(item => `
        <div style="
          display:flex;gap:14px;align-items:center;
          padding:14px;border-radius:12px;
          border:1.5px solid var(--border);
          background:var(--bg-light);
        ">
          <img src="${item.image}" alt="${item.name}"
            style="width:64px;height:64px;object-fit:cover;border-radius:8px;"
            onerror="this.style.background='#eee';this.src=''">
          <div style="flex:1;">
            <p style="font-weight:600;font-size:14px;color:var(--text-dark);margin-bottom:4px;">${item.name}</p>
            <p style="font-size:15px;font-weight:700;color:var(--primary);">$${item.price.toFixed(2)}</p>
          </div>
          <div style="display:flex;gap:8px;flex-direction:column;">
            <button onclick="addToCart(${item.id},'${item.name}',${item.price})" class="btn btn-primary"
              style="padding:8px 14px;font-size:12px;">Add to Cart</button>
            <button onclick="addToWishlist(${item.id});goToWishlist();"
              style="padding:7px 14px;font-size:12px;border:1.5px solid #fee2e2;
              border-radius:20px;background:none;color:#e53935;cursor:pointer;">Remove</button>
          </div>
        </div>
      `).join('')}
    </div>`;

  modal.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initWishlistUI() {
  // Restore heart states on load
  ShopZone.wishlist.forEach(item => updateHeartIcon(item.id, true));
}

/* ============================================================
   8. HERO SLIDER
   ============================================================ */
function initSlider() {
  startSliderAuto();
  const slider = document.getElementById('heroSlider');
  if (!slider) return;

  // Touch / swipe support
  let startX = 0;
  slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  slider.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) changeSlide(diff > 0 ? 1 : -1);
  });

  // Pause on hover
  slider.addEventListener('mouseenter', stopSliderAuto);
  slider.addEventListener('mouseleave', startSliderAuto);
}

function changeSlide(direction) {
  ShopZone.currentSlide = (ShopZone.currentSlide + direction + ShopZone.totalSlides) % ShopZone.totalSlides;
  applySlide();
}

function goToSlide(index) {
  ShopZone.currentSlide = index;
  applySlide();
}

function applySlide() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.dot');

  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === ShopZone.currentSlide);
  });
  dots.forEach((dot, i) => {
    dot.classList.toggle('active', i === ShopZone.currentSlide);
  });
}

function startSliderAuto() {
  stopSliderAuto();
  ShopZone.sliderTimer = setInterval(() => changeSlide(1), 4500);
}

function stopSliderAuto() {
  if (ShopZone.sliderTimer) clearInterval(ShopZone.sliderTimer);
}

/* ============================================================
   9. SEARCH FUNCTION
   ============================================================ */
function handleSearch() {
  const input = document.getElementById('searchInput');
  const category = document.getElementById('searchCategory');
  if (!input) return;

  const query = input.value.trim().toLowerCase();
  const cat = category ? category.value : 'All Categories';

  if (!query) {
    showToast('⚠️ Please enter a search term');
    input.focus();
    return;
  }

  // Filter products
  const results = ShopZone.products.filter(p => {
    const matchQuery = p.name.toLowerCase().includes(query) ||
                       p.brand.toLowerCase().includes(query) ||
                       p.description.toLowerCase().includes(query);
    const matchCat = cat === 'All Categories' ||
                     p.category === cat.toLowerCase() ||
                     cat.toLowerCase().includes(p.category);
    return matchQuery && matchCat;
  });

  showSearchResults(query, results);
}

function showSearchResults(query, results) {
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;

  if (results.length === 0) {
    content.innerHTML = `
      <div style="text-align:center;padding:40px 20px;">
        <div style="font-size:48px;margin-bottom:16px;">🔍</div>
        <h3 style="font-size:20px;margin-bottom:8px;color:var(--text-dark);">No results for "${query}"</h3>
        <p style="color:var(--text-mid);margin-bottom:20px;">Try different keywords or browse our categories.</p>
        <button onclick="closeQuickView()" class="btn btn-primary">Browse All Products</button>
      </div>`;
  } else {
    content.innerHTML = `
      <h2 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:6px;color:var(--text-dark);">
        Search Results
      </h2>
      <p style="color:var(--text-light);font-size:14px;margin-bottom:20px;">
        ${results.length} result${results.length !== 1 ? 's' : ''} for "<strong>${query}</strong>"
      </p>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;">
        ${results.map(p => `
          <div style="
            border:1.5px solid var(--border);border-radius:12px;
            overflow:hidden;transition:transform 0.3s;cursor:pointer;
          " onmouseover="this.style.transform='translateY(-4px)';this.style.borderColor='var(--primary)'"
             onmouseout="this.style.transform='';this.style.borderColor='var(--border)'">
            <div style="background:var(--bg-light);aspect-ratio:1;overflow:hidden;">
              <img src="${p.image}" alt="${p.name}"
                style="width:100%;height:100%;object-fit:cover;"
                onerror="this.src=''">
            </div>
            <div style="padding:12px;">
              <p style="font-size:11px;color:var(--text-light);margin-bottom:2px;">${p.brand}</p>
              <p style="font-size:13px;font-weight:600;color:var(--text-dark);margin-bottom:6px;line-height:1.3;">${p.name}</p>
              <p style="font-size:15px;font-weight:700;color:var(--primary);margin-bottom:10px;">$${p.price.toFixed(2)}</p>
              <button onclick="addToCart(${p.id},'${p.name}',${p.price});closeQuickView();"
                style="width:100%;padding:8px;background:var(--text-dark);color:#fff;
                border:none;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;
                transition:background 0.2s;"
                onmouseover="this.style.background='var(--primary)'"
                onmouseout="this.style.background='var(--text-dark)'">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>`;
  }

  modal.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function initSearchInput() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  // Search on Enter
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleSearch();
  });

  // Live search suggestions (debounced)
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const val = input.value.trim().toLowerCase();
      if (val.length >= 2) showSuggestions(val);
      else hideSuggestions();
    }, 300);
  });

  // Hide suggestions on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar')) hideSuggestions();
  });
}

function showSuggestions(query) {
  hideSuggestions();
  const searchBar = document.querySelector('.search-bar');
  if (!searchBar) return;

  const matches = ShopZone.products
    .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
    .slice(0, 5);

  if (matches.length === 0) return;

  const box = document.createElement('div');
  box.id = 'searchSuggestions';
  box.style.cssText = `
    position:absolute;top:100%;left:0;right:0;
    background:#fff;border:1.5px solid var(--border);
    border-radius:12px;box-shadow:0 12px 32px rgba(0,0,0,0.12);
    z-index:500;overflow:hidden;margin-top:4px;
  `;

  box.innerHTML = matches.map(p => `
    <div onclick="document.getElementById('searchInput').value='${p.name}';handleSearch();"
      style="
        display:flex;align-items:center;gap:12px;
        padding:10px 16px;cursor:pointer;
        transition:background 0.15s;
      "
      onmouseover="this.style.background='var(--bg-light)'"
      onmouseout="this.style.background=''">
      <img src="${p.image}" alt="${p.name}"
        style="width:38px;height:38px;object-fit:cover;border-radius:6px;background:var(--bg-light);"
        onerror="this.src=''">
      <div>
        <p style="font-size:14px;font-weight:500;color:var(--text-dark);margin:0;">${p.name}</p>
        <p style="font-size:12px;color:var(--text-light);margin:0;">$${p.price.toFixed(2)}</p>
      </div>
    </div>
  `).join('');

  searchBar.style.position = 'relative';
  searchBar.appendChild(box);
}

function hideSuggestions() {
  const box = document.getElementById('searchSuggestions');
  if (box) box.remove();
}

/* ============================================================
   10. PRODUCT FILTER TABS
   ============================================================ */
function filterProducts(category, btn) {
  ShopZone.currentFilter = category;

  // Update active tab
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Filter cards with animation
  const cards = document.querySelectorAll('.product-card');
  cards.forEach((card, i) => {
    const cat = card.dataset.cat;
    const show = category === 'all' || cat === category;

    card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

    if (show) {
      card.style.display = '';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 50);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => { card.style.display = 'none'; }, 300);
    }
  });
}

/* ============================================================
   11. QUICK VIEW MODAL
   ============================================================ */
function quickView(id) {
  const product = ShopZone.products.find(p => p.id === id);
  if (!product) return;

  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  const content = document.getElementById('quickViewContent');
  if (!modal || !content) return;

  const discount = Math.round((1 - product.price / product.oldPrice) * 100);
  const stars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
  const inWishlist = ShopZone.wishlist.find(i => i.id === id);

  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:28px;">

      <!-- Product Image -->
      <div style="
        background:var(--bg-light);border-radius:16px;
        display:flex;align-items:center;justify-content:center;
        min-height:300px;overflow:hidden;position:relative;
      ">
        ${product.badge ? `
          <span style="
            position:absolute;top:14px;left:14px;
            font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px;
            background:${product.badge === 'HOT' ? '#ff3b30' : product.badge === 'NEW' ? '#34c759' : 'var(--primary)'};
            color:#fff;letter-spacing:0.5px;
          ">${product.badge}</span>
        ` : ''}
        <img src="${product.image}" alt="${product.name}"
          style="width:100%;height:100%;object-fit:contain;padding:20px;transition:transform 0.4s;"
          onmouseover="this.style.transform='scale(1.06)'"
          onmouseout="this.style.transform=''"
          onerror="this.src=''">
      </div>

      <!-- Product Details -->
      <div style="display:flex;flex-direction:column;gap:14px;">
        <div>
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;
            letter-spacing:1.5px;color:var(--text-light);margin-bottom:6px;">${product.brand}</p>
          <h2 style="font-family:'Playfair Display',serif;font-size:22px;
            font-weight:700;color:var(--text-dark);line-height:1.3;margin-bottom:10px;">${product.name}</h2>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="color:#f59e0b;font-size:15px;letter-spacing:2px;">${stars}</span>
            <span style="font-size:13px;color:var(--text-light);">(${product.reviews} reviews)</span>
          </div>
        </div>

        <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;">
          <span style="font-size:26px;font-weight:700;color:var(--primary);">$${product.price.toFixed(2)}</span>
          <span style="font-size:16px;color:var(--text-light);text-decoration:line-through;">$${product.oldPrice.toFixed(2)}</span>
          <span style="font-size:13px;font-weight:700;background:var(--primary-light);
            color:var(--primary);padding:3px 10px;border-radius:20px;">${discount}% OFF</span>
        </div>

        <p style="font-size:14px;color:var(--text-mid);line-height:1.7;">${product.description}</p>

        ${product.colors ? `
          <div>
            <p style="font-size:13px;font-weight:600;color:var(--text-dark);margin-bottom:8px;">Color</p>
            <div style="display:flex;gap:8px;">
              ${product.colors.map((c, i) => `
                <button onclick="selectColor(this,'${c}')" style="
                  width:28px;height:28px;border-radius:50%;
                  background:${c};cursor:pointer;
                  border:${i === 0 ? '3px solid var(--primary)' : '2px solid var(--border)'};
                  transition:transform 0.2s;
                " onmouseover="this.style.transform='scale(1.2)'"
                   onmouseout="this.style.transform=''"></button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        ${product.sizes ? `
          <div>
            <p style="font-size:13px;font-weight:600;color:var(--text-dark);margin-bottom:8px;">Size</p>
            <div style="display:flex;gap:8px;flex-wrap:wrap;" id="sizeOptions-${id}">
              ${product.sizes.map((s, i) => `
                <button onclick="selectSize(this,'${s}',${id})" style="
                  padding:7px 14px;border-radius:8px;font-size:13px;font-weight:500;
                  border:${i === 0 ? '2px solid var(--primary)' : '1.5px solid var(--border)'};
                  background:${i === 0 ? 'var(--primary-light)' : 'var(--bg-white)'};
                  color:${i === 0 ? 'var(--primary)' : 'var(--text-mid)'};
                  cursor:pointer;transition:all 0.2s;
                ">${s}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Quantity + Cart -->
        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
          <div style="
            display:flex;align-items:center;border:1.5px solid var(--border);
            border-radius:10px;overflow:hidden;
          ">
            <button id="qv-qty-dec" onclick="changeQVQty(-1)" style="
              width:38px;height:42px;background:var(--bg-light);
              border:none;font-size:18px;cursor:pointer;
              transition:background 0.15s;
            " onmouseover="this.style.background='var(--border)'"
               onmouseout="this.style.background='var(--bg-light)'">−</button>
            <span id="qv-qty" style="min-width:40px;text-align:center;font-weight:600;font-size:15px;">1</span>
            <button id="qv-qty-inc" onclick="changeQVQty(1)" style="
              width:38px;height:42px;background:var(--bg-light);
              border:none;font-size:18px;cursor:pointer;
              transition:background 0.15s;
            " onmouseover="this.style.background='var(--border)'"
               onmouseout="this.style.background='var(--bg-light)'">+</button>
          </div>
          <button onclick="addToCartFromQV(${id},'${product.name}',${product.price})" class="btn btn-primary"
            style="flex:1;padding:12px;min-width:150px;">
            🛒 Add to Cart
          </button>
        </div>

        <!-- Wishlist -->
        <button onclick="addToWishlist(${id})" style="
          display:flex;align-items:center;gap:8px;justify-content:center;
          padding:10px;border-radius:10px;
          border:1.5px solid ${inWishlist ? '#fee2e2' : 'var(--border)'};
          background:${inWishlist ? '#fff5f5' : 'var(--bg-white)'};
          color:${inWishlist ? '#e53935' : 'var(--text-mid)'};
          font-size:14px;font-weight:500;cursor:pointer;
          transition:all 0.2s;
        " onmouseover="this.style.borderColor='#fca5a5';this.style.color='#e53935'"
           onmouseout="this.style.borderColor='${inWishlist ? '#fee2e2' : 'var(--border)'}';this.style.color='${inWishlist ? '#e53935' : 'var(--text-mid)'}'">
          ${inWishlist ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
        </button>

        <!-- Trust badges -->
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:4px;">
          ${[['🚚','Free Shipping'],['🔄','30-day Return'],['🔒','Secure Pay']].map(([icon, label]) => `
            <div style="text-align:center;padding:10px 6px;border-radius:8px;
              background:var(--bg-light);font-size:12px;color:var(--text-mid);">
              <div style="font-size:18px;margin-bottom:4px;">${icon}</div>
              ${label}
            </div>
          `).join('')}
        </div>
      </div>
    </div>

    <!-- Mobile stacked layout for narrow screens -->
    <style>
      @media (max-width: 600px) {
        #quickViewContent > div { grid-template-columns: 1fr !important; }
      }
    </style>`;

  // Reset QV quantity
  window._qvQty = 1;

  modal.classList.add('active');
  if (overlay) overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function changeQVQty(delta) {
  window._qvQty = Math.max(1, (window._qvQty || 1) + delta);
  const el = document.getElementById('qv-qty');
  if (el) el.textContent = window._qvQty;
}

function addToCartFromQV(id, name, price) {
  const qty = window._qvQty || 1;
  addToCart(id, name, price, qty);
  closeQuickView();
}

function selectColor(btn, color) {
  btn.closest('div').querySelectorAll('button').forEach(b => {
    b.style.border = '2px solid var(--border)';
  });
  btn.style.border = '3px solid var(--primary)';
}

function selectSize(btn, size, id) {
  const container = document.getElementById('sizeOptions-' + id);
  if (!container) return;
  container.querySelectorAll('button').forEach(b => {
    b.style.border = '1.5px solid var(--border)';
    b.style.background = 'var(--bg-white)';
    b.style.color = 'var(--text-mid)';
  });
  btn.style.border = '2px solid var(--primary)';
  btn.style.background = 'var(--primary-light)';
  btn.style.color = 'var(--primary)';
}

function closeQuickView() {
  const modal = document.getElementById('quickViewModal');
  const overlay = document.getElementById('quickViewOverlay');
  if (modal) modal.classList.remove('active');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   12. TOAST NOTIFICATION
   ============================================================ */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================
   13. LANGUAGE SELECTOR
   ============================================================ */
function changeLang(code, flagFile) {
  ShopZone.currentLang = code;

  const langBtn = document.querySelector('.lang-btn');
  if (langBtn) {
    const img = langBtn.querySelector('img');
    const span = langBtn.querySelector('span');
    if (img) img.src = flagFile + '.png';
    if (span) span.textContent = code;
  }

  showToast(`🌍 Language changed to ${code}`);

  // Close dropdown
  document.querySelectorAll('.dropdown-menu').forEach(m => {
    m.style.opacity = '0';
    m.style.visibility = 'hidden';
  });
}

/* ============================================================
   14. MOBILE MENU TOGGLE
   ============================================================ */
function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.querySelector('.mobile-menu-btn');
  if (!nav) return;

  const isOpen = nav.classList.toggle('open');

  if (btn) {
    const spans = btn.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.transform = 'rotate(45deg) translateY(7px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translateY(-7px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  // Add mobile nav styles dynamically
  if (isOpen) {
    nav.style.cssText = `
      display:block;padding:12px 0;
      border-top:1px solid var(--border);
    `;
    const ul = nav.querySelector('.nav-list');
    if (ul) ul.style.cssText = 'flex-direction:column;gap:0;';
  } else {
    nav.style.cssText = '';
    const ul = nav.querySelector('.nav-list');
    if (ul) ul.style.cssText = '';
  }
}

/* ============================================================
   15. DROPDOWN CLOSE ON OUTSIDE CLICK
   ============================================================ */
function initDropdowns() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.style.opacity = '';
        menu.style.visibility = '';
        menu.style.transform = '';
      });
    }
  });
}

/* ============================================================
   16. NEWSLETTER SUBSCRIPTION
   ============================================================ */
function subscribeNewsletter() {
  const input = document.getElementById('newsletterEmail');
  if (!input) return;

  const email = input.value.trim();

  if (!email) {
    showToast('⚠️ Please enter your email address');
    input.focus();
    return;
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showToast('⚠️ Please enter a valid email address');
    input.focus();
    return;
  }

  // Save to storage
  try {
    const subscribers = JSON.parse(localStorage.getItem('shopzone_subscribers') || '[]');
    if (subscribers.includes(email)) {
      showToast('ℹ️ You are already subscribed!');
      return;
    }
    subscribers.push(email);
    localStorage.setItem('shopzone_subscribers', JSON.stringify(subscribers));
  } catch (e) {}

  input.value = '';
  showToast(`🎉 Subscribed! 10% discount code: SAVE10`);

  // Show success state
  const btn = input.nextElementSibling;
  if (btn) {
    const original = btn.textContent;
    btn.textContent = '✅ Subscribed!';
    btn.style.background = '#34c759';
    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
    }, 3000);
  }
}

/* ============================================================
   17. SCROLL EFFECTS — STICKY HEADER + SCROLL TO TOP
   ============================================================ */
function initScrollEffects() {
  const header = document.querySelector('.header');
  let lastScroll = 0;

  // Scroll-to-top button
  const scrollBtn = createScrollTopBtn();

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow on scroll
    if (header) {
      if (scrollY > 50) {
        header.style.boxShadow = '0 4px 30px rgba(0,0,0,0.15)';
      } else {
        header.style.boxShadow = '';
      }
    }

    // Show/hide scroll-to-top
    if (scrollY > 400) {
      scrollBtn.style.opacity = '1';
      scrollBtn.style.transform = 'translateY(0)';
    } else {
      scrollBtn.style.opacity = '0';
      scrollBtn.style.transform = 'translateY(20px)';
    }

    // Animate elements into view
    animateOnScroll();
    lastScroll = scrollY;
  }, { passive: true });
}

function createScrollTopBtn() {
  const btn = document.createElement('button');
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  btn.style.cssText = `
    position:fixed;bottom:80px;right:28px;
    width:44px;height:44px;border-radius:50%;
    background:var(--primary);color:#fff;
    border:none;font-size:20px;font-weight:700;
    cursor:pointer;z-index:900;
    box-shadow:0 6px 20px rgba(255,107,53,0.40);
    opacity:0;transform:translateY(20px);
    transition:opacity 0.3s,transform 0.3s,background 0.2s;
  `;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  btn.addEventListener('mouseenter', () => { btn.style.background = 'var(--primary-dark)'; });
  btn.addEventListener('mouseleave', () => { btn.style.background = 'var(--primary)'; });
  document.body.appendChild(btn);
  return btn;
}

/* ============================================================
   18. ANIMATE ON SCROLL (Intersection Observer)
   ============================================================ */
function animateOnScroll() {
  // Only runs if IntersectionObserver not available
}

function initLazyImages() {
  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        // Fade in elements
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        requestAnimationFrame(() => {
          el.style.opacity = '1';
          el.style.transform = '';
        });
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.15 });

  // Observe product cards, stat items, promo banners
  document.querySelectorAll('.product-card, .stat-item, .promo-banner, .category-card').forEach(el => {
    observer.observe(el);
  });
}

/* ============================================================
   19. UTILITY FUNCTIONS
   ============================================================ */

// Format currency
function formatPrice(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Debounce helper
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// Responsive check
function isMobile() {
  return window.innerWidth <= 768;
}

/* ============================================================
   20. WINDOW RESIZE HANDLER
   ============================================================ */
window.addEventListener('resize', debounce(() => {
  // Close mobile menu on resize to desktop
  if (!isMobile()) {
    const nav = document.getElementById('mainNav');
    if (nav && nav.classList.contains('open')) toggleMobileMenu();
  }

  // Adjust cart sidebar
  const cart = document.getElementById('cartSidebar');
  if (cart && cart.classList.contains('active')) {
    cart.style.width = isMobile() ? '100%' : '380px';
  }
}, 200));

/* ============================================================
   21. EXPOSE GLOBALS (called from HTML onclick attributes)
   ============================================================ */
window.addToCart       = addToCart;
window.removeFromCart  = removeFromCart;
window.updateCartQty   = updateCartQty;
window.clearCart       = clearCart;
window.openCart        = openCart;
window.closeCart       = closeCart;
window.checkout        = checkout;
window.addToWishlist   = addToWishlist;
window.goToWishlist    = goToWishlist;
window.quickView       = quickView;
window.closeQuickView  = closeQuickView;
window.changeQVQty     = changeQVQty;
window.addToCartFromQV = addToCartFromQV;
window.selectColor     = selectColor;
window.selectSize      = selectSize;
window.handleSearch    = handleSearch;
window.filterProducts  = filterProducts;
window.changeSlide     = changeSlide;
window.goToSlide       = goToSlide;
window.changeLang      = changeLang;
window.toggleMobileMenu = toggleMobileMenu;
window.subscribeNewsletter = subscribeNewsletter;
window.showToast       = showToast;