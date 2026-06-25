/* ============================================================
   SHOPZONE — product.js
   Complete JS for Products Listing Page
   Filters | Search | Sort | View | Cart | Wishlist |
   Quick View | Sidebar | Auth | Profile | Scroll
   ============================================================ */

'use strict';

/* ============================================================
   1. STATE
   ============================================================ */
const State = {
  cart: [],
  wishlist: [],
  currentUser: null,
  currentView: 'grid',
  searchQuery: '',

  products: [
    { id:1,  name:'Smart Watch Pro X200',      brand:'TechBrand',   price:89.99,  oldPrice:129.99, rating:5, reviews:128, image:'assets/Image/tech/image 23.png',                    category:'electronics', badge:'HOT',  desc:'Track health and fitness with heart rate monitoring, GPS, 7-day battery, water resistance up to 50m.' },
    { id:2,  name:'Wireless Earbuds Elite',     brand:'SoundMax',    price:49.99,  oldPrice:79.99,  rating:4, reviews:84,  image:'assets/Image/tech/image 29.png',                    category:'electronics', badge:'NEW',  desc:'Active noise cancellation, 30hrs total playback, quick charge, IPX5 sweat-proof rating.' },
    { id:3,  name:'Premium Casual Jacket',      brand:'FashionHub',  price:59.99,  oldPrice:99.99,  rating:5, reviews:256, image:'assets/Layout/alibaba/Image/cloth/image 24.png',    category:'fashion',     badge:null,  desc:'Versatile all-season jacket, slim fit, concealed pockets. Available in 6 colors.',           sizes:['XS','S','M','L','XL','XXL'] },
    { id:4,  name:'Summer Floral Dress',        brand:'StyleCo',     price:34.99,  oldPrice:59.99,  rating:4, reviews:192, image:'assets/Layout/alibaba/Image/cloth/image 26.png',    category:'fashion',     badge:'SALE',desc:'Light and breezy floral dress. Breathable fabric, A-line silhouette.',                       sizes:['XS','S','M','L','XL'] },
    { id:5,  name:'Nordic Table Lamp',          brand:'HomeDecor',   price:44.99,  oldPrice:69.99,  rating:5, reviews:67,  image:'assets/Image/interior/1.png',                       category:'interior',    badge:null,  desc:'Minimalist Scandinavian design, warm 3000K LED bulb. Height-adjustable with 360° head.' },
    { id:6,  name:'Digital Camera 4K UHD',      brand:'SnapPro',     price:199.99, oldPrice:299.99, rating:5, reviews:311, image:'assets/Image/tech/image 34.png',                    category:'electronics', badge:'HOT', desc:'4K video, 24MP stills, built-in stabilization, 30x optical zoom, Wi-Fi.' },
    { id:7,  name:'Ceramic Decorative Vase',    brand:'ArtHaus',     price:24.99,  oldPrice:39.99,  rating:4, reviews:43,  image:'assets/Image/interior/3.png',                       category:'interior',    badge:null,  desc:'Hand-crafted ceramic with matte glaze finish. Perfect for modern interiors.' },
    { id:8,  name:'Pro Sports Set',             brand:'ActiveWear',  price:39.99,  oldPrice:64.99,  rating:5, reviews:175, image:'assets/Layout/alibaba/Image/cloth/image 30.png',    category:'sports',      badge:'NEW', desc:'Moisture-wicking performance fabric. Ergonomic seaming for full range of motion.',            sizes:['XS','S','M','L','XL'] },
    { id:9,  name:'Bluetooth Speaker 360°',     brand:'SoundMax',    price:129.99, oldPrice:179.99, rating:4, reviews:98,  image:'assets/Image/tech/image 32.png',                    category:'electronics', badge:null,  desc:'360° surround sound, 24hr battery, waterproof IPX7. Pair 2 for stereo.' },
    { id:10, name:'Abstract Wall Art Set',      brand:'ArtHaus',     price:89.99,  oldPrice:119.99, rating:5, reviews:52,  image:'assets/Image/interior/6.png',                       category:'interior',    badge:null,  desc:'Set of 3 premium canvas prints. Ready-to-hang. Elevate any living room or office.' },
    { id:11, name:'Tablet Pro 10.5"',           brand:'TechBrand',   price:299.99, oldPrice:399.99, rating:5, reviews:204, image:'assets/Image/tech/8.png',                           category:'electronics', badge:'HOT', desc:'10.5" AMOLED display, Octa-core, 8GB RAM, 128GB storage.' },
    { id:12, name:'Classic Leather Handbag',    brand:'StyleCo',     price:79.99,  oldPrice:99.99,  rating:4, reviews:88,  image:'assets/Layout/alibaba/Image/cloth/Bitmap.png',      category:'fashion',     badge:null,  desc:'Genuine leather, gold-tone hardware, spacious interior with multiple pockets.' }
  ]
};

/* ============================================================
   2. INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  loadStorage();
  updateCartCount();
  updateWishlistBadge();
  loadUserSession();
  initSearchInput();
  initDropdowns();
  initScrollEffects();
  initIntersectionObserver();
  createScrollTopBtn();
  createSidebarOverlay();
  restoreWishlistHearts();
  console.log('✅ ShopZone product.js ready');
});

/* ============================================================
   3. STORAGE
   ============================================================ */
function loadStorage() {
  try {
    State.cart      = JSON.parse(localStorage.getItem('shopzone_cart') || '[]');
    State.wishlist  = JSON.parse(localStorage.getItem('shopzone_wishlist') || '[]');
    State.currentUser = JSON.parse(localStorage.getItem('shopzone_user') || 'null');
  } catch(e) {}
}

function saveStorage() {
  try {
    localStorage.setItem('shopzone_cart', JSON.stringify(State.cart));
    localStorage.setItem('shopzone_wishlist', JSON.stringify(State.wishlist));
  } catch(e) {}
}

/* ============================================================
   4. AUTH — USER SESSION
   ============================================================ */
function loadUserSession() {
  const accountDropdown = document.querySelector('.dropdown .dropdown-menu');
  if (!accountDropdown) return;

  if (State.currentUser) {
    const initial = (State.currentUser.name || 'U')[0].toUpperCase();
    // Add profile header to dropdown
    const header = document.createElement('div');
    header.className = 'profile-dropdown-header';
    header.innerHTML = `
      <div class="profile-dropdown-avatar">${initial}</div>
      <div class="profile-dropdown-info">
        <p>${State.currentUser.name || 'User'}</p>
        <span>${State.currentUser.email || ''}</span>
      </div>`;
    accountDropdown.prepend(header);

    // Update sign out link
    const signOut = accountDropdown.querySelector('.text-red');
    if (signOut) {
      signOut.textContent = 'Sign Out';
      signOut.onclick = (e) => { e.preventDefault(); signOut(); };
    }

    // My Profile link
    const profileLink = accountDropdown.querySelector('a');
    if (profileLink && profileLink.textContent.trim() === 'My Profile') {
      profileLink.href = 'profile.html';
    }
  }
}

function signOut() {
  localStorage.removeItem('shopzone_user');
  State.currentUser = null;
  showToast('👋 Signed out successfully');
  setTimeout(() => { window.location.href = 'signin.html'; }, 1200);
}

/* ============================================================
   5. CART
   ============================================================ */
function addToCart(id, name, price, qty = 1) {
  const existing = State.cart.find(i => i.id === id);
  if (existing) {
    existing.qty += qty;
    showToast(`✅ ${name} quantity updated (${existing.qty})`);
  } else {
    const p = State.products.find(p => p.id === id);
    State.cart.push({ id, name, price, qty, image: p ? p.image : '', brand: p ? p.brand : '' });
    showToast(`🛒 ${name} added to cart!`);
  }
  saveStorage();
  updateCartCount();
  renderCartItems();
  animateCartBtn();
}

function removeFromCart(id) {
  const item = State.cart.find(i => i.id === id);
  State.cart = State.cart.filter(i => i.id !== id);
  saveStorage(); updateCartCount(); renderCartItems();
  if (item) showToast(`🗑️ ${item.name} removed`);
}

function updateCartQty(id, delta) {
  const item = State.cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) { removeFromCart(id); return; }
  saveStorage(); updateCartCount(); renderCartItems();
}

function clearCart() {
  State.cart = [];
  saveStorage(); updateCartCount(); renderCartItems();
  showToast('🗑️ Cart cleared');
}

function updateCartCount() {
  const total = State.cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  const el2 = document.getElementById('cartItemCount');
  if (el) el.textContent = total;
  if (el2) el2.textContent = `(${total} item${total !== 1 ? 's' : ''})`;
}

function getCartTotal() {
  return State.cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function animateCartBtn() {
  const btn = document.querySelector('.cart-btn');
  if (!btn) return;
  btn.style.transform = 'scale(1.15)';
  setTimeout(() => { btn.style.transform = ''; }, 300);
}

function renderCartItems() {
  const body   = document.getElementById('cartBody');
  const footer = document.getElementById('cartFooter');
  const totalEl = document.getElementById('cartTotal');
  if (!body) return;

  if (State.cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#ccc" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <path d="M16 10a4 4 0 0 1-8 0"/>
        </svg>
        <p>Your cart is empty</p>
        <button class="btn btn-primary" onclick="closeCart()" style="margin-top:4px;">Continue Shopping</button>
      </div>`;
    if (footer) footer.style.display = 'none';
    return;
  }

  body.innerHTML = State.cart.map(item => `
    <div style="display:flex;gap:12px;padding:14px 0;border-bottom:1px solid var(--border);animation:fadeInUp .3s ease;">
      <div style="width:68px;height:68px;border-radius:10px;background:var(--bg-light);overflow:hidden;flex-shrink:0;">
        <img src="${item.image}" alt="${item.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src=''">
      </div>
      <div style="flex:1;min-width:0;">
        <p style="font-size:11px;color:var(--text-light);">${item.brand}</p>
        <p style="font-size:13px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${item.name}</p>
        <p style="font-size:15px;font-weight:700;color:var(--primary);margin:4px 0;">$${(item.price * item.qty).toFixed(2)}</p>
        <div style="display:flex;align-items:center;gap:8px;margin-top:6px;">
          <button onclick="updateCartQty(${item.id},-1)" style="width:26px;height:26px;border-radius:50%;border:1.5px solid var(--border);background:var(--bg-light);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">−</button>
          <span style="font-weight:600;font-size:13px;min-width:20px;text-align:center;">${item.qty}</span>
          <button onclick="updateCartQty(${item.id},1)"  style="width:26px;height:26px;border-radius:50%;border:1.5px solid var(--border);background:var(--bg-light);font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--border)'">+</button>
          <button onclick="removeFromCart(${item.id})" style="margin-left:auto;color:var(--text-light);font-size:12px;background:none;border:none;cursor:pointer;transition:color .2s;" onmouseover="this.style.color='#e53935'" onmouseout="this.style.color='var(--text-light)'">✕ Remove</button>
        </div>
      </div>
    </div>`).join('') + `
    <button onclick="clearCart()" style="margin-top:14px;width:100%;padding:9px;background:none;border:1.5px solid #fee2e2;border-radius:8px;color:#e53935;font-size:12px;font-weight:600;cursor:pointer;transition:background .2s;" onmouseover="this.style.background='#fee2e2'" onmouseout="this.style.background='none'">🗑️ Clear All</button>`;

  if (footer) {
    footer.style.display = 'block';
    if (totalEl) totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
  }
}

/* ============================================================
   6. CART OPEN / CLOSE
   ============================================================ */
function openCart() {
  renderCartItems();
  document.getElementById('cartSidebar')?.classList.add('active');
  document.getElementById('cartOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCart() {
  document.getElementById('cartSidebar')?.classList.remove('active');
  document.getElementById('cartOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

function checkout() {
  if (State.cart.length === 0) { showToast('⚠️ Cart is empty!'); return; }
  const total = getCartTotal().toFixed(2);
  const count = State.cart.reduce((s, i) => s + i.qty, 0);
  const content = document.getElementById('quickViewContent');
  if (!content) return;
  content.innerHTML = `
    <div style="text-align:center;padding:20px 0;">
      <div style="font-size:52px;margin-bottom:14px;">🎉</div>
      <h2 style="font-family:'Playfair Display',serif;font-size:24px;margin-bottom:8px;">Order Confirmed!</h2>
      <p style="color:var(--text-mid);margin-bottom:22px;">${count} item${count>1?'s':''} · Total: <strong style="color:var(--primary);">$${total}</strong></p>
      <div style="background:var(--bg-light);border-radius:12px;padding:18px;margin-bottom:20px;text-align:left;">
        ${State.cart.map(i=>`
          <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid var(--border);font-size:13px;">
            <span>${i.name} × ${i.qty}</span>
            <span style="font-weight:600;color:var(--primary);">$${(i.price*i.qty).toFixed(2)}</span>
          </div>`).join('')}
        <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-weight:700;font-size:15px;">
          <span>Total</span><span style="color:var(--primary);">$${total}</span>
        </div>
      </div>
      <p style="color:var(--text-light);font-size:13px;margin-bottom:20px;">📧 Confirmation sent · 🚚 Delivery: 3–7 days</p>
      <button onclick="clearCart();closeCart();closeQuickView();" class="btn btn-primary" style="padding:12px 32px;">Continue Shopping</button>
    </div>`;
  openModal();
}

/* ============================================================
   7. WISHLIST
   ============================================================ */
function addToWishlist(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;
  const inList = State.wishlist.find(i => i.id === id);
  if (inList) {
    State.wishlist = State.wishlist.filter(i => i.id !== id);
    showToast(`💔 Removed from wishlist`);
    setHeartState(id, false);
  } else {
    State.wishlist.push({ id, name: p.name, price: p.price, image: p.image });
    showToast(`❤️ ${p.name} added to wishlist!`);
    setHeartState(id, true);
  }
  saveStorage();
  updateWishlistBadge();
}

function setHeartState(id, active) {
  document.querySelectorAll(`[onclick="addToWishlist(${id})"]`).forEach(btn => {
    btn.style.background = active ? '#fee2e2' : '';
    btn.style.color      = active ? '#e53935' : '';
  });
}

function restoreWishlistHearts() {
  State.wishlist.forEach(item => setHeartState(item.id, true));
}

function updateWishlistBadge() {
  const count = State.wishlist.length;
  document.querySelectorAll('[onclick="goToWishlist()"]').forEach(btn => {
    let badge = btn.querySelector('.wl-badge');
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'wl-badge';
        badge.style.cssText = 'position:absolute;top:-4px;right:-4px;background:var(--primary);color:#fff;font-size:10px;font-weight:700;width:17px;height:17px;border-radius:50%;display:flex;align-items:center;justify-content:center;';
        btn.style.position = 'relative';
        btn.appendChild(badge);
      }
      badge.textContent = count;
    } else if (badge) badge.remove();
  });
}

function goToWishlist() {
  if (State.wishlist.length === 0) { showToast('💔 Wishlist is empty!'); return; }
  const content = document.getElementById('quickViewContent');
  if (!content) return;
  content.innerHTML = `
    <h2 style="font-family:'Playfair Display',serif;font-size:22px;margin-bottom:18px;">❤️ My Wishlist (${State.wishlist.length})</h2>
    <div style="display:grid;gap:12px;">
      ${State.wishlist.map(item => `
        <div style="display:flex;gap:14px;align-items:center;padding:14px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg-light);">
          <img src="${item.image}" alt="${item.name}" style="width:60px;height:60px;object-fit:cover;border-radius:8px;" onerror="this.src=''">
          <div style="flex:1;">
            <p style="font-weight:600;font-size:14px;margin-bottom:4px;">${item.name}</p>
            <p style="font-weight:700;color:var(--primary);">$${item.price.toFixed(2)}</p>
          </div>
          <div style="display:flex;gap:8px;flex-direction:column;">
            <button onclick="addToCart(${item.id},'${item.name.replace(/'/g,"\\'")}',${item.price});goToWishlist();" class="btn btn-primary" style="padding:7px 12px;font-size:12px;">Add to Cart</button>
            <button onclick="addToWishlist(${item.id});goToWishlist();" style="padding:6px 12px;font-size:12px;border:1.5px solid #fee2e2;border-radius:20px;background:none;color:#e53935;cursor:pointer;">Remove</button>
          </div>
        </div>`).join('')}
    </div>`;
  openModal();
}

/* ============================================================
   8. FILTERS
   ============================================================ */
function applyFilters() {
  const cards    = document.querySelectorAll('.pl-card');
  const cat      = document.querySelector('input[name="cat"]:checked')?.value || 'all';
  const minPrice = parseFloat(document.getElementById('priceMin')?.value || 0);
  const maxPrice = parseFloat(document.getElementById('priceMax')?.value || 9999);
  const minRating= parseFloat(document.querySelector('input[name="rating"]:checked')?.value || 0);
  const sortBy   = document.getElementById('sortSelect')?.value || 'featured';
  const discountChecks = [...document.querySelectorAll('.filter-body input[type="checkbox"][value]')].filter(c => c.checked);
  const minDiscount = discountChecks.length ? Math.max(...discountChecks.map(c => +c.value)) : 0;
  const query = State.searchQuery.toLowerCase();

  let visible = [];

  cards.forEach(card => {
    const cardCat      = card.dataset.cat;
    const cardPrice    = parseFloat(card.dataset.price);
    const cardRating   = parseFloat(card.dataset.rating);
    const cardDiscount = parseFloat(card.dataset.discount);
    const cardName     = card.querySelector('.product-name')?.textContent.toLowerCase() || '';
    const cardBrand    = card.querySelector('.product-brand')?.textContent.toLowerCase() || '';
    const cardDesc     = card.querySelector('.pl-desc')?.textContent.toLowerCase() || '';

    const matchCat      = cat === 'all' || cardCat === cat;
    const matchPrice    = cardPrice >= minPrice && cardPrice <= maxPrice;
    const matchRating   = cardRating >= minRating;
    const matchDiscount = minDiscount === 0 || cardDiscount >= minDiscount;
    const matchSearch   = !query || cardName.includes(query) || cardBrand.includes(query) || cardDesc.includes(query);

    const show = matchCat && matchPrice && matchRating && matchDiscount && matchSearch;

    if (show) {
      visible.push(card);
      card.style.display = '';
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => { card.style.display = 'none'; }, 250);
    }
  });

  // Sort
  const grid = document.getElementById('productListGrid');
  if (grid && visible.length > 1) {
    visible.sort((a, b) => {
      const pa = parseFloat(a.dataset.price);
      const pb = parseFloat(b.dataset.price);
      const ra = parseFloat(a.dataset.rating);
      const rb = parseFloat(b.dataset.rating);
      const da = parseFloat(a.dataset.discount);
      const db = parseFloat(b.dataset.discount);
      if (sortBy === 'price-asc')  return pa - pb;
      if (sortBy === 'price-desc') return pb - pa;
      if (sortBy === 'rating')     return rb - ra;
      if (sortBy === 'discount')   return db - da;
      return 0;
    });
    visible.forEach((card, i) => {
      card.style.order = i;
      card.style.opacity = '0';
      card.style.transform = 'translateY(16px)';
      card.style.transition = 'opacity .3s ease, transform .3s ease';
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = '';
      }, i * 40);
    });
  }

  // No results
  const noResults = document.getElementById('noResults');
  const pagination = document.getElementById('pagination');
  if (noResults) noResults.style.display = visible.length === 0 ? 'flex' : 'none';
  if (pagination) pagination.style.display = visible.length === 0 ? 'none' : '';

  // Update count
  const countEl = document.getElementById('resultsCount');
  if (countEl) countEl.textContent = `Showing ${visible.length} product${visible.length !== 1 ? 's' : ''}`;

  updateActiveFilterTags(cat, minPrice, maxPrice, minRating, minDiscount, query);
}

function updateActiveFilterTags(cat, minPrice, maxPrice, minRating, minDiscount, query) {
  const container = document.getElementById('activeFilters');
  if (!container) return;
  container.innerHTML = '';

  const addTag = (label, onRemove) => {
    const tag = document.createElement('span');
    tag.className = 'filter-tag';
    tag.innerHTML = `${label}<button onclick="(${onRemove.toString()})()">×</button>`;
    container.appendChild(tag);
  };

  if (cat !== 'all')    addTag(cat.charAt(0).toUpperCase()+cat.slice(1), () => { document.querySelector('input[name="cat"][value="all"]').checked = true; applyFilters(); });
  if (maxPrice < 500)   addTag(`Max $${maxPrice}`, () => { document.getElementById('priceMax').value = 500; document.getElementById('priceSlider').value = 500; document.getElementById('priceSliderVal').textContent = '$500'; applyFilters(); });
  if (minRating > 0)    addTag(`${minRating}★+`, () => { document.querySelector('input[name="rating"][value="0"]').checked = true; applyFilters(); });
  if (minDiscount > 0)  addTag(`${minDiscount}%+ off`, () => { document.querySelectorAll('.filter-body input[type="checkbox"][value]').forEach(c => c.checked = false); applyFilters(); });
  if (query)            addTag(`"${query}"`, () => { State.searchQuery = ''; const inp = document.getElementById('searchInput'); if (inp) inp.value = ''; applyFilters(); });
}

function clearAllFilters() {
  const catAll = document.querySelector('input[name="cat"][value="all"]');
  if (catAll) catAll.checked = true;
  const ratingAll = document.querySelector('input[name="rating"][value="0"]');
  if (ratingAll) ratingAll.checked = true;
  const priceMin = document.getElementById('priceMin');
  const priceMax = document.getElementById('priceMax');
  const slider   = document.getElementById('priceSlider');
  const sliderVal= document.getElementById('priceSliderVal');
  if (priceMin) priceMin.value = 0;
  if (priceMax) priceMax.value = 500;
  if (slider)   slider.value = 500;
  if (sliderVal) sliderVal.textContent = '$500';
  document.querySelectorAll('.filter-body input[type="checkbox"]').forEach(c => c.checked = false);
  State.searchQuery = '';
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  showToast('🔄 All filters cleared');
  applyFilters();
}

/* ============================================================
   9. PRICE SLIDER
   ============================================================ */
function updatePriceSlider(val) {
  const priceMax  = document.getElementById('priceMax');
  const sliderVal = document.getElementById('priceSliderVal');
  if (priceMax) priceMax.value = val;
  if (sliderVal) sliderVal.textContent = `$${val}`;
  applyFilters();
}

/* ============================================================
   10. FILTER ACCORDION TOGGLE
   ============================================================ */
function toggleFilter(titleEl) {
  const body = titleEl.nextElementSibling;
  if (!body) return;
  const collapsed = body.classList.toggle('collapsed');
  titleEl.classList.toggle('collapsed', collapsed);
}

/* ============================================================
   11. SEARCH
   ============================================================ */
function handleSearch() {
  const input = document.getElementById('searchInput');
  if (!input) return;
  const q = input.value.trim();
  if (!q) { showToast('⚠️ Please enter a search term'); input.focus(); return; }
  State.searchQuery = q;
  hideSuggestions();
  applyFilters();
  const countEl = document.getElementById('breadcrumbCat');
  if (countEl) countEl.textContent = `Search: "${q}"`;
}

function initSearchInput() {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('keydown', e => { if (e.key === 'Enter') handleSearch(); });

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const val = input.value.trim().toLowerCase();
      if (val.length >= 2) showSuggestions(val);
      else hideSuggestions();
    }, 280);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.search-bar')) hideSuggestions();
  });
}

function showSuggestions(query) {
  hideSuggestions();
  const searchBar = document.querySelector('.search-bar');
  if (!searchBar) return;

  const matches = State.products
    .filter(p => p.name.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query))
    .slice(0, 5);

  if (!matches.length) return;

  const box = document.createElement('div');
  box.id = 'searchSuggestions';
  box.innerHTML = matches.map(p => `
    <div onclick="document.getElementById('searchInput').value='${p.name.replace(/'/g,"\\'")}';handleSearch();"
      style="display:flex;align-items:center;gap:12px;padding:10px 16px;cursor:pointer;transition:background .15s;"
      onmouseover="this.style.background='var(--bg-light)'" onmouseout="this.style.background=''">
      <img src="${p.image}" alt="${p.name}" style="width:36px;height:36px;object-fit:cover;border-radius:6px;background:var(--bg-light);" onerror="this.src=''">
      <div>
        <p style="font-size:13px;font-weight:500;margin:0;">${p.name}</p>
        <p style="font-size:11px;color:var(--text-light);margin:0;">$${p.price.toFixed(2)} · ${p.brand}</p>
      </div>
    </div>`).join('');

  searchBar.style.position = 'relative';
  searchBar.appendChild(box);
}

function hideSuggestions() {
  document.getElementById('searchSuggestions')?.remove();
}

/* ============================================================
   12. VIEW TOGGLE (Grid / List)
   ============================================================ */
function setView(type, btn) {
  State.currentView = type;
  const grid = document.getElementById('productListGrid');
  if (!grid) return;

  grid.classList.remove('grid-view', 'list-view');
  grid.classList.add(type + '-view');

  document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  // Show/hide description in list view
  document.querySelectorAll('.pl-desc').forEach(d => {
    d.style.display = type === 'list' ? '-webkit-box' : 'none';
  });

  showToast(type === 'list' ? '☰ List view' : '⊞ Grid view');
}

/* ============================================================
   13. SIDEBAR TOGGLE (mobile)
   ============================================================ */
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  if (!sidebar) return;

  const isOpen = sidebar.classList.toggle('open');
  if (overlay) overlay.classList.toggle('active', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function createSidebarOverlay() {
  if (document.getElementById('sidebarOverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'sidebarOverlay';
  overlay.className = 'sidebar-overlay';
  overlay.onclick = toggleSidebar;
  document.body.appendChild(overlay);
}

/* ============================================================
   14. QUICK VIEW MODAL
   ============================================================ */
function quickView(id) {
  const p = State.products.find(p => p.id === id);
  if (!p) return;

  const discount = Math.round((1 - p.price / p.oldPrice) * 100);
  const stars = '★'.repeat(p.rating) + '☆'.repeat(5 - p.rating);
  const inWL  = !!State.wishlist.find(i => i.id === id);

  const content = document.getElementById('quickViewContent');
  if (!content) return;

  content.innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div style="background:var(--bg-light);border-radius:14px;display:flex;align-items:center;justify-content:center;min-height:280px;overflow:hidden;position:relative;">
        ${p.badge ? `<span style="position:absolute;top:12px;left:12px;font-size:10px;font-weight:700;padding:4px 10px;border-radius:20px;background:${p.badge==='HOT'?'#ff3b30':p.badge==='NEW'?'#34c759':'var(--primary)'};color:#fff;">${p.badge}</span>` : ''}
        <img src="${p.image}" alt="${p.name}" style="width:100%;height:100%;object-fit:contain;padding:20px;transition:transform .4s;" onmouseover="this.style.transform='scale(1.06)'" onmouseout="this.style.transform=''" onerror="this.src=''">
      </div>
      <div style="display:flex;flex-direction:column;gap:12px;">
        <p style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--text-light);">${p.brand}</p>
        <h2 style="font-family:'Playfair Display',serif;font-size:20px;font-weight:700;line-height:1.3;">${p.name}</h2>
        <div style="display:flex;align-items:center;gap:8px;">
          <span style="color:#f59e0b;font-size:14px;">${stars}</span>
          <span style="font-size:12px;color:var(--text-light);">(${p.reviews} reviews)</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:10px;flex-wrap:wrap;">
          <span style="font-size:24px;font-weight:700;color:var(--primary);">$${p.price.toFixed(2)}</span>
          <span style="font-size:14px;color:var(--text-light);text-decoration:line-through;">$${p.oldPrice.toFixed(2)}</span>
          <span style="font-size:12px;font-weight:700;background:var(--primary-light);color:var(--primary);padding:3px 10px;border-radius:20px;">${discount}% OFF</span>
        </div>
        <p style="font-size:13px;color:var(--text-mid);line-height:1.7;">${p.desc}</p>
        ${p.sizes ? `
          <div>
            <p style="font-size:12px;font-weight:700;color:var(--text-dark);margin-bottom:8px;">SIZE</p>
            <div id="sizeOpts" style="display:flex;gap:7px;flex-wrap:wrap;">
              ${p.sizes.map((s,i) => `<button onclick="selectQVSize(this)" style="padding:6px 13px;border-radius:8px;font-size:12px;font-weight:500;border:${i===0?'2px solid var(--primary)':'1.5px solid var(--border)'};background:${i===0?'var(--primary-light)':'#fff'};color:${i===0?'var(--primary)':'var(--text-mid)'};cursor:pointer;transition:all .2s;">${s}</button>`).join('')}
            </div>
          </div>` : ''}
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;border:1.5px solid var(--border);border-radius:10px;overflow:hidden;">
            <button onclick="changeQVQty(-1)" style="width:36px;height:40px;background:var(--bg-light);border:none;font-size:17px;cursor:pointer;">−</button>
            <span id="qvQty" style="min-width:36px;text-align:center;font-weight:600;font-size:14px;">1</span>
            <button onclick="changeQVQty(1)"  style="width:36px;height:40px;background:var(--bg-light);border:none;font-size:17px;cursor:pointer;">+</button>
          </div>
          <button onclick="addToCartFromQV(${id},'${p.name.replace(/'/g,"\\'")}',${p.price})" class="btn btn-primary" style="flex:1;min-width:140px;">🛒 Add to Cart</button>
        </div>
        <button onclick="addToWishlist(${id})" style="display:flex;align-items:center;justify-content:center;gap:8px;padding:10px;border-radius:10px;border:1.5px solid ${inWL?'#fee2e2':'var(--border)'};background:${inWL?'#fff5f5':'#fff'};color:${inWL?'#e53935':'var(--text-mid)'};font-size:13px;font-weight:500;cursor:pointer;transition:all .2s;">
          ${inWL ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
        </button>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:7px;margin-top:4px;">
          ${[['🚚','Free Shipping'],['🔄','30-day Return'],['🔒','Secure Pay']].map(([ic,lb])=>`
            <div style="text-align:center;padding:9px 4px;border-radius:8px;background:var(--bg-light);font-size:11px;color:var(--text-mid);">
              <div style="font-size:16px;margin-bottom:3px;">${ic}</div>${lb}
            </div>`).join('')}
        </div>
      </div>
    </div>
    <style>@media(max-width:560px){#quickViewContent>div{grid-template-columns:1fr!important}}</style>`;

  window._qvQty = 1;
  openModal();
}

function changeQVQty(delta) {
  window._qvQty = Math.max(1, (window._qvQty || 1) + delta);
  const el = document.getElementById('qvQty');
  if (el) el.textContent = window._qvQty;
}

function addToCartFromQV(id, name, price) {
  addToCart(id, name, price, window._qvQty || 1);
  closeQuickView();
}

function selectQVSize(btn) {
  document.querySelectorAll('#sizeOpts button').forEach(b => {
    b.style.border = '1.5px solid var(--border)';
    b.style.background = '#fff';
    b.style.color = 'var(--text-mid)';
  });
  btn.style.border = '2px solid var(--primary)';
  btn.style.background = 'var(--primary-light)';
  btn.style.color = 'var(--primary)';
}

function openModal() {
  document.getElementById('quickViewModal')?.classList.add('active');
  document.getElementById('quickViewOverlay')?.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickView() {
  document.getElementById('quickViewModal')?.classList.remove('active');
  document.getElementById('quickViewOverlay')?.classList.remove('active');
  document.body.style.overflow = '';
}

/* ============================================================
   15. TOAST
   ============================================================ */
function showToast(msg, duration = 3000) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   16. LANGUAGE
   ============================================================ */
function changeLang(code, flagFile) {
  const btn = document.querySelector('.lang-btn');
  if (btn) {
    const img  = btn.querySelector('img');
    const span = btn.querySelector('span');
    if (img)  img.src = `assets/Layout1/Image/flags/${flagFile}.png`;
    if (span) span.textContent = code;
  }
  showToast(`🌍 Language: ${code}`);
}

/* ============================================================
   17. MOBILE MENU
   ============================================================ */
function toggleMobileMenu() {
  const nav = document.getElementById('mainNav');
  const btn = document.querySelector('.mobile-menu-btn');
  if (!nav) return;

  const open = nav.classList.toggle('open');
  nav.style.cssText = open ? 'display:block;padding:12px 0;border-top:1px solid var(--border);' : '';

  const ul = nav.querySelector('.nav-list');
  if (ul) ul.style.cssText = open ? 'flex-direction:column;gap:0;' : '';

  if (btn) {
    const spans = btn.querySelectorAll('span');
    spans[0].style.transform = open ? 'rotate(45deg) translateY(7px)' : '';
    spans[1].style.opacity   = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translateY(-7px)' : '';
  }
}

/* ============================================================
   18. DROPDOWNS — OUTSIDE CLICK
   ============================================================ */
function initDropdowns() {
  document.addEventListener('click', e => {
    if (!e.target.closest('.dropdown')) {
      document.querySelectorAll('.dropdown-menu').forEach(m => {
        m.style.opacity = ''; m.style.visibility = ''; m.style.transform = '';
      });
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeCart(); closeQuickView(); }
  });
}

/* ============================================================
   19. SCROLL EFFECTS
   ============================================================ */
function initScrollEffects() {
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (header) header.style.boxShadow = y > 50 ? '0 4px 30px rgba(0,0,0,0.15)' : '';
    const btn = document.getElementById('scrollTopBtn');
    if (btn) btn.classList.toggle('visible', y > 400);
  }, { passive: true });

  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 900) {
      const sidebar = document.getElementById('sidebar');
      const overlay = document.getElementById('sidebarOverlay');
      if (sidebar?.classList.contains('open')) {
        sidebar.classList.remove('open');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }, 200));
}

function createScrollTopBtn() {
  if (document.getElementById('scrollTopBtn')) return;
  const btn = document.createElement('button');
  btn.id = 'scrollTopBtn';
  btn.innerHTML = '↑';
  btn.title = 'Back to top';
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  document.body.appendChild(btn);
}

/* ============================================================
   20. INTERSECTION OBSERVER — ANIMATE ON SCROLL
   ============================================================ */
function initIntersectionObserver() {
  if (!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity .4s ease ${i*0.04}s, transform .4s ease ${i*0.04}s`;
        requestAnimationFrame(() => { el.style.opacity = '1'; el.style.transform = ''; });
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.pl-card').forEach(el => obs.observe(el));
}

/* ============================================================
   21. PAGINATION
   ============================================================ */
function goToPage(page) {
  document.querySelectorAll('.page-btn').forEach(btn => btn.classList.remove('active'));
  showToast(`📄 Loading page ${page}...`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ============================================================
   22. UTILITY
   ============================================================ */
function debounce(fn, delay) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), delay); };
}

/* ============================================================
   23. GLOBAL EXPORTS
   ============================================================ */
window.addToCart        = addToCart;
window.removeFromCart   = removeFromCart;
window.updateCartQty    = updateCartQty;
window.clearCart        = clearCart;
window.openCart         = openCart;
window.closeCart        = closeCart;
window.checkout         = checkout;
window.addToWishlist    = addToWishlist;
window.goToWishlist     = goToWishlist;
window.quickView        = quickView;
window.closeQuickView   = closeQuickView;
window.changeQVQty      = changeQVQty;
window.addToCartFromQV  = addToCartFromQV;
window.selectQVSize     = selectQVSize;
window.handleSearch     = handleSearch;
window.applyFilters     = applyFilters;
window.clearAllFilters  = clearAllFilters;
window.updatePriceSlider= updatePriceSlider;
window.toggleFilter     = toggleFilter;
window.setView          = setView;
window.toggleSidebar    = toggleSidebar;
window.changeLang       = changeLang;
window.toggleMobileMenu = toggleMobileMenu;
window.showToast        = showToast;
window.goToPage         = goToPage;
window.signOut          = signOut;