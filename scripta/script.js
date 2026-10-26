const productsBySection = {
  bestsellers: [
    { id: 'noir', name: 'Élan Noir', collection: 'Escrita diária', price: 48, image: 'assets/pen-noir.svg', tone: '#c9c3b9', tag: 'Mais amada' },
    { id: 'ivory', name: 'Ligne Ivoire', collection: 'Escrita diária', price: 42, image: 'assets/pen-ivory.svg', tone: '#e2d9ca', tag: 'Curadoria' },
    { id: 'merlot', name: 'Círculo Merlot', collection: 'Edição de cor', price: 56, image: 'assets/pen-merlot.svg', tone: '#b48683' },
    { id: 'sage', name: 'Clair Sage', collection: 'Escrita diária', price: 46, image: 'assets/pen-sage.svg', tone: '#b6bcae', tag: 'Novo' }
  ],
  new: [
    { id: 'cobalt', name: 'Atelier Cobalto', collection: 'Edição de cor', price: 64, image: 'assets/pen-cobalt.svg', tone: '#a9bdce', tag: 'Novo' },
    { id: 'apricot', name: 'Papier Apricot', collection: 'Edição de cor', price: 51, image: 'assets/pen-apricot.svg', tone: '#d7aa80', tag: 'Novo' },
    { id: 'mist', name: 'Aero Mist', collection: 'Lançamentos', price: 59, image: 'assets/pen-mist.svg', tone: '#c6ced0' },
    { id: 'lilac', name: 'Orbe Lilás', collection: 'Lançamentos', price: 54, image: 'assets/pen-lilac.svg', tone: '#b8a9bc', tag: 'Novo' }
  ],
  premium: [
    { id: 'brass', name: 'Mottainai Brass', collection: 'Coleção atelier', price: 180, image: 'assets/pen-brass.svg', tone: '#cdb485', tag: 'Edição limitada' },
    { id: 'rosewood', name: 'Grove Rosewood', collection: 'Coleção atelier', price: 220, image: 'assets/pen-rosewood.svg', tone: '#aa7967' },
    { id: 'midnight', name: 'Maison Midnight', collection: 'Coleção atelier', price: 195, image: 'assets/pen-midnight.svg', tone: '#777d93', tag: 'Numerada' },
    { id: 'pearl', name: 'Vesper Pearl', collection: 'Coleção atelier', price: 208, image: 'assets/pen-pearl.svg', tone: '#d9d3c9' }
  ],
  offers: [
    { id: 'coral', name: 'Círculo Coral', collection: 'Edição de cor', price: 37, oldPrice: 52, image: 'assets/pen-coral.svg', tone: '#d99988', tag: '− 28%', sale: true },
    { id: 'forest', name: 'Pausa Forest', collection: 'Últimas peças', price: 39, oldPrice: 55, image: 'assets/pen-forest.svg', tone: '#82978a', tag: '− 29%', sale: true },
    { id: 'sand', name: 'Ligne Sable', collection: 'Últimas peças', price: 33, oldPrice: 47, image: 'assets/pen-sand.svg', tone: '#d6c9ad', tag: '− 30%', sale: true },
    { id: 'plum', name: 'Aster Plum', collection: 'Edição de cor', price: 41, oldPrice: 58, image: 'assets/pen-plum.svg', tone: '#987385', tag: '− 29%', sale: true }
  ]
};

const allProducts = Object.values(productsBySection).flat();
let cart = [];
let toastTimer;

const formatPrice = (value) => `U$ ${value.toLocaleString('en-US', { minimumFractionDigits: 0 })}`;
const heartIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 8.7c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10a4.3 4.3 0 0 1 7.4-3 4.3 4.3 0 0 1 7.4 3Z"/></svg>';

function productCard(product) {
  const tag = product.tag ? `<span class="product-tag ${product.sale ? 'sale' : ''}">${product.tag}</span>` : '';
  const original = product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : '';
  return `
    <article class="product-card" data-product="${product.id}">
      <div class="product-media" style="--tone: ${product.tone}">
        ${tag}
        <button type="button" class="wishlist" aria-label="Adicionar ${product.name} aos favoritos">${heartIcon}</button>
        <img src="${product.image}" alt="Caneta ${product.name}" loading="lazy" />
      </div>
      <div class="product-info">
        <p class="product-collection">${product.collection}</p>
        <h3 class="product-name">${product.name}</h3>
        <div class="product-bottom">
          <div class="price-block"><span class="price">${formatPrice(product.price)}</span>${original}</div>
          <button type="button" class="add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} à sacola">+</button>
        </div>
      </div>
    </article>`;
}

function renderProducts() {
  Object.entries(productsBySection).forEach(([section, products]) => {
    const track = document.getElementById(`${section}Track`);
    if (track) track.innerHTML = products.map(productCard).join('');
  });
}

function showToast(message) {
  const toast = document.getElementById('toast');
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 2700);
}

function renderCart() {
  const cartItems = document.getElementById('cartItems');
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.quantity * item.product.price, 0);

  document.getElementById('cartCount').textContent = count;
  document.getElementById('drawerCount').textContent = `(${count})`;
  document.querySelector('.bag-trigger').setAttribute('aria-label', `Abrir sacola, ${count} ${count === 1 ? 'item' : 'itens'}`);
  document.getElementById('cartTotal').textContent = formatPrice(subtotal);

  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-cart"><span>✦</span><p>Sua sacola ainda está em branco.</p><button class="text-link cart-continue" type="button">Continuar explorando <span>→</span></button></div>';
    return;
  }

  cartItems.innerHTML = cart.map(({ product, quantity }) => `
    <article class="cart-line">
      <div class="cart-image" style="--cart-tone: ${product.tone}"><img src="${product.image}" alt="" /></div>
      <div><h3>${product.name}</h3><p>${formatPrice(product.price)}</p></div>
      <div class="line-actions"><button type="button" class="remove-item" data-remove="${product.id}" aria-label="Remover ${product.name}">remover</button><p class="quantity">${quantity} ${quantity === 1 ? 'unidade' : 'unidades'}</p></div>
    </article>`).join('');
}

function addToCart(id) {
  const product = allProducts.find((item) => item.id === id);
  const existing = cart.find((item) => item.product.id === id);
  if (existing) existing.quantity += 1;
  else cart.push({ product, quantity: 1 });
  renderCart();
  showToast(`${product.name} foi adicionada à sua sacola.`);
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.product.id !== id);
  renderCart();
  showToast('Item removido da sua sacola.');
}

function openCart() {
  document.getElementById('cartDrawer').classList.add('is-open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
  document.getElementById('drawerBackdrop').classList.add('is-visible');
  document.body.classList.add('drawer-open');
  document.getElementById('closeCart').focus();
}

function closeCart() {
  document.getElementById('cartDrawer').classList.remove('is-open');
  document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
  document.getElementById('drawerBackdrop').classList.remove('is-visible');
  document.body.classList.remove('drawer-open');
}

function setupCarousels() {
  document.querySelectorAll('[data-carousel]').forEach((carousel) => {
    let pointerStart = 0;
    let scrollStart = 0;
    let dragging = false;

    carousel.addEventListener('pointerdown', (event) => {
      if (event.target.closest('button')) return;
      dragging = true;
      pointerStart = event.clientX;
      scrollStart = carousel.scrollLeft;
      carousel.classList.add('dragging');
      carousel.setPointerCapture(event.pointerId);
    });

    carousel.addEventListener('pointermove', (event) => {
      if (!dragging) return;
      const distance = event.clientX - pointerStart;
      carousel.scrollLeft = scrollStart - distance;
    });

    const stopDrag = (event) => {
      if (!dragging) return;
      dragging = false;
      carousel.classList.remove('dragging');
      if (carousel.hasPointerCapture(event.pointerId)) carousel.releasePointerCapture(event.pointerId);
    };

    carousel.addEventListener('pointerup', stopDrag);
    carousel.addEventListener('pointercancel', stopDrag);
    carousel.addEventListener('pointerleave', (event) => { if (dragging && event.pointerType === 'mouse') stopDrag(event); });
  });
}

function setupEvents() {
  document.querySelectorAll('.carousel-arrow').forEach((button) => {
    button.addEventListener('click', () => {
      const track = document.getElementById(button.dataset.target);
      const carousel = track.closest('.product-carousel');
      const amount = Math.min(carousel.clientWidth * .82, 370);
      carousel.scrollBy({ left: button.dataset.direction === 'next' ? amount : -amount, behavior: 'smooth' });
    });
  });

  document.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add]');
    const removeButton = event.target.closest('[data-remove]');
    const favorite = event.target.closest('.wishlist');
    const keepBrowsing = event.target.closest('.cart-continue');

    if (addButton) addToCart(addButton.dataset.add);
    if (removeButton) removeFromCart(removeButton.dataset.remove);
    if (favorite) {
      favorite.classList.toggle('active');
      const productName = favorite.closest('.product-card').querySelector('.product-name').textContent;
      showToast(favorite.classList.contains('active') ? `${productName} foi salva nos favoritos.` : `${productName} saiu dos favoritos.`);
    }
    if (keepBrowsing) closeCart();
  });

  document.querySelector('.bag-trigger').addEventListener('click', openCart);
  document.getElementById('closeCart').addEventListener('click', closeCart);
  document.getElementById('drawerBackdrop').addEventListener('click', closeCart);
  document.querySelector('.checkout-button').addEventListener('click', () => showToast('Esta é uma demonstração: nenhuma cobrança será feita.'));

  const loginModal = document.getElementById('loginModal');
  document.querySelectorAll('.login-trigger').forEach((trigger) => trigger.addEventListener('click', () => loginModal.showModal()));
  document.querySelector('.modal-close').addEventListener('click', () => loginModal.close());
  loginModal.addEventListener('click', (event) => { if (event.target === loginModal) loginModal.close(); });

  document.getElementById('loginForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('loginEmail');
    const password = document.getElementById('loginPassword');
    const message = document.getElementById('loginMessage');
    if (!email.validity.valid || password.value.length < 4) {
      message.textContent = 'Preencha um e-mail válido e uma senha com ao menos 4 caracteres.';
      if (!email.validity.valid) email.focus(); else password.focus();
      return;
    }
    message.textContent = 'Acesso demonstrativo confirmado. Bem-vinda à Scripta.';
    event.currentTarget.reset();
    window.setTimeout(() => loginModal.close(), 1350);
  });

  document.getElementById('newsletterForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.getElementById('newsletterEmail');
    if (email.validity.valid) {
      showToast('Sua correspondência Scripta foi reservada.');
      event.currentTarget.reset();
    }
  });

  document.getElementById('brandHome').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.querySelectorAll('.mobile-nav a').forEach((link) => link.addEventListener('click', () => closeMobileMenu()));
  document.querySelector('.login-register').addEventListener('click', (event) => { event.preventDefault(); showToast('Criação de conta disponível em breve.'); });

  const menuButton = document.getElementById('menuToggle');
  menuButton.addEventListener('click', () => {
    const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
    if (isExpanded) closeMobileMenu(); else openMobileMenu();
  });

  window.addEventListener('scroll', () => document.querySelector('.site-header').classList.toggle('is-scrolled', window.scrollY > 10), { passive: true });
}

function openMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('menuToggle');
  menu.hidden = false;
  button.setAttribute('aria-expanded', 'true');
  button.setAttribute('aria-label', 'Fechar menu');
}

function closeMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  const button = document.getElementById('menuToggle');
  menu.hidden = true;
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'Abrir menu');
}

renderProducts();
renderCart();
setupCarousels();
setupEvents();
document.getElementById('currentYear').textContent = new Date().getFullYear();
