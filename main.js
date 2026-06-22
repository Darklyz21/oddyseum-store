// Base de datos de productos oficiales
const productos = [
  { 
    id: 'ff-520',
    nombre: 'Free Fire - 520 Diamantes', 
    categoria: 'Recarga por ID',
    icono: 'ph-gem',
    precioNormal: 5.99,
    precioOferta: 4.99,
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop',
    tag: '-15% DTO'
  },
  { 
    id: 'codm-880',
    nombre: 'Call of Duty Mobile - 880 CP', 
    categoria: 'Recarga por ID',
    icono: 'ph-crosshair',
    precioNormal: null,
    precioOferta: 9.99,
    imagen: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop',
    tag: 'TENDENCIA'
  },
  { 
    id: 'blood-1000',
    nombre: 'Blood Strike - 1000 Oro', 
    categoria: 'Recarga por ID',
    icono: 'ph-crosshair',
    precioNormal: 12.00,
    precioOferta: 9.99,
    imagen: 'https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=600&auto=format&fit=crop',
    tag: null
  },
  { 
    id: 'mc-minecoins',
    nombre: 'Minecraft - 1720 Minecoins', 
    categoria: 'Código Digital Global',
    icono: 'ph-cube',
    precioNormal: null,
    precioOferta: 9.99,
    imagen: 'https://images.unsplash.com/photo-1614680376408-11e05a30571f?q=80&w=600&auto=format&fit=crop',
    tag: 'ENTREGA INMEDIATA'
  }
];

// Estado del Carrito en Memoria Local
let carrito = JSON.parse(localStorage.getItem('oddyseum_cart')) || [];

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(precio);
};

// Guardar cambios en LocalStorage y refrescar interfaz
const actualizarCarritoInterfaz = () => {
  localStorage.setItem('oddyseum_cart', JSON.stringify(carrito));
  
  // Actualizar contador del header
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('cart-count').innerText = totalItems;

  // Renderizar items dentro del modal
  const listaContenedor = document.getElementById('lista-carrito');
  listaContenedor.innerHTML = '';

  if (carrito.length === 0) {
    listaContenedor.innerHTML = `
      <div class="h-48 flex flex-col items-center justify-center text-center text-gray-500">
        <i class="ph ph-shopping-cart text-4xl mb-2 text-white/10"></i>
        <p class="text-sm">El carrito está vacío</p>
      </div>`;
    document.getElementById('cart-total').innerText = formatearPrecio(0);
    return;
  }

  let totalAcumulado = 0;
  
  carrito.forEach(item => {
    totalAcumulado += item.precioOferta * item.cantidad;
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center gap-3 bg-white/[0.02] border border-white/5 p-3 rounded-xl relative';
    itemElement.innerHTML = `
      <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0">
        <img src="${item.imagen}" class="w-full h-full object-cover" />
      </div>
      <div class="flex-grow min-w-0">
        <h4 class="text-white text-xs font-semibold truncate">${item.nombre}</h4>
        <p class="text-brand-accent text-xs font-bold mt-0.5">${formatearPrecio(item.precioOferta)} <span class="text-gray-500 font-normal">x${item.cantidad}</span></p>
      </div>
      <button onclick="eliminarDelCarrito('${item.id}')" class="text-gray-500 hover:text-red-400 p-1 rounded-md transition-colors">
        <i class="ph ph-trash text-lg"></i>
      </button>
    `;
    listaContenedor.appendChild(itemElement);
  });

  document.getElementById('cart-total').innerText = formatearPrecio(totalAcumulado);
};

// Funciones globales de manipulación de artículos
window.agregarAlCarrito = (id) => {
  const productoSeleccionado = productos.find(p => p.id === id);
  const itemExistente = carrito.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...productoSeleccionado, cantidad: 1 });
  }
  
  actualizarCarritoInterfaz();
  // Feedback visual de apertura automática opcional
  document.getElementById('modal-carrito').classList.remove('hidden');
};

window.eliminarDelCarrito = (id) => {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarritoInterfaz();
};

// Generación Dinámica del Escaparate de Productos
document.addEventListener('DOMContentLoaded', () => {
  const contenedor = document.getElementById('grid-productos');

  productos.forEach((producto, index) => {
    const precioHTML = producto.precioNormal 
      ? `<span class="text-xs text-gray-500 line-through mr-1.5">${formatearPrecio(producto.precioNormal)}</span>
         <span class="text-base font-extrabold text-white">${formatearPrecio(producto.precioOferta)}</span>`
      : `<span class="text-base font-extrabold text-white">${formatearPrecio(producto.precioOferta)}</span>`;

    const tagHTML = producto.tag 
      ? `<div class="absolute top-3 right-3 bg-brand-accent text-white text-[10px] font-extrabold px-2.5 py-1 rounded-md shadow-md z-10 backdrop-blur-sm bg-opacity-95">
          ${producto.tag}
         </div>`
      : '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-card bg-brand-card border border-brand-border rounded-2xl overflow-hidden relative flex flex-col h-full group';
    tarjeta.style.animationDelay = `${index * 50}ms`;

    tarjeta.innerHTML = `
      ${tagHTML}
      <div class="h-40 overflow-hidden relative">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover transition duration-500 group-hover:scale-105 opacity-70 group-hover:opacity-90" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent"></div>
      </div>
      
      <div class="p-5 flex flex-col flex-grow">
        <span class="text-brand-accent text-[11px] font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
          <i class="ph-fill ${producto.icono}"></i> ${producto.categoria}
        </span>
        <h3 class="text-sm font-bold text-white mb-4 line-clamp-2">${producto.nombre}</h3>
        
        <div class="mt-auto flex items-center justify-between pt-2 border-t border-white/[0.03]">
          <div>${precioHTML}</div>
          <button onclick="agregarAlCarrito('${producto.id}')" class="bg-white/5 hover:bg-brand-accent border border-white/10 hover:border-brand-accent text-white p-2.5 rounded-xl transition-all duration-300">
            <i class="ph ph-shopping-cart-simple text-lg"></i>
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });

  // Manejo de Ventanas del Modal
  const modal = document.getElementById('modal-carrito');
  document.getElementById('btn-carrito').addEventListener('click', () => modal.classList.remove('hidden'));
  document.getElementById('close-cart').addEventListener('click', () => modal.classList.add('hidden'));
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
  });

  // Lógica de Compra y Generación de Enlace API de WhatsApp
  document.getElementById('btn-checkout').addEventListener('click', () => {
    const playerID = document.getElementById('player-id').value.trim();
    if (carrito.length === 0) return alert('Tu carrito está vacío.');
    if (!playerID) return alert('Por favor, ingresa tu ID de jugador para procesar el pedido.');

    let numeroSoporte = "584120000000"; // Reemplaza con tu número internacional completo (sin el signo +)
    let mensaje = `⚡ *NUEVO PEDIDO - ODDYSEUM STORE* ⚡\n\n`;
    mensaje += `👤 *ID de Cuenta/Jugador:* ${playerID}\n`;
    mensaje += `───────────────\n`;

    let total = 0;
    carrito.forEach(item => {
      mensaje += `📦 *${item.nombre}* (x${item.cantidad})\n`;
      total += item.precioOferta * item.cantidad;
    });

    mensaje += `───────────────\n`;
    mensaje += `💰 *Total
