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
      <div class="h-56 flex flex-col items-center justify-center text-center p-4">
        <div class="w-16 h-16 bg-white/[0.02] border border-white/5 rounded-full flex items-center justify-center mb-3">
          <i class="ph ph-shopping-cart text-2xl text-gray-600"></i>
        </div>
        <p class="text-sm font-medium text-gray-400">El carrito está vacío</p>
        <p class="text-xs text-gray-600 mt-1">Agrega productos desde el catálogo para comenzar.</p>
      </div>`;
    document.getElementById('cart-total').innerText = formatearPrecio(0);
    return;
  }

  let totalAcumulado = 0;
  
  carrito.forEach(item => {
    totalAcumulado += item.precioOferta * item.cantidad;
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center gap-3 bg-white/[0.01] border border-white/[0.06] p-3 rounded-xl relative hover:border-brand-accent/20 transition-colors';
    itemElement.innerHTML = `
      <div class="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-white/10">
        <img src="${item.imagen}" class="w-full h-full object-cover" />
      </div>
      <div class="flex-grow min-w-0">
        <h4 class="text-white text-xs font-semibold truncate">${item.nombre}</h4>
        <p class="text-brand-accent text-xs font-bold mt-0.5">${formatearPrecio(item.precioOferta)} <span class="text-gray-500 font-normal ml-1">x${item.cantidad}</span></p>
      </div>
      <button onclick="eliminarDelCarrito('${item.id}')" class="text-gray-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all">
        <i class="ph ph-trash text-base"></i>
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
  document.getElementById('modal-carrito').classList.remove('hidden');
  document.getElementById('modal-carrito').classList.add('flex');
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
         <span class="text-sm sm:text-base font-extrabold text-white">${formatearPrecio(producto.precioOferta)}</span>`
      : `<span class="text-sm sm:text-base font-extrabold text-white">${formatearPrecio(producto.precioOferta)}</span>`;

    const tagHTML = producto.tag 
      ? `<div class="absolute top-2.5 right-2.5 bg-brand-accent text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg z-10 tracking-wider backdrop-blur-md bg-opacity-90">
          ${producto.tag}
         </div>`
      : '';

    const tarjeta = document.createElement('div');
    tarjeta.className = 'product-card bg-brand-card border border-brand-border rounded-xl overflow-hidden relative flex flex-col h-full group animate-fade-in-up';
    tarjeta.style.animationDelay = `${index * 60}ms`;

    tarjeta.innerHTML = `
      ${tagHTML}
      <div class="h-28 sm:h-36 overflow-hidden relative">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-80" />
        <div class="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/30 to-transparent"></div>
      </div>
      
      <div class="p-3 sm:p-4 flex flex-col flex-grow">
        <span class="text-brand-accent text-[10px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1">
          <i class="${producto.icono} text-xs"></i> ${producto.categoria}
        </span>
        <h3 class="text-xs sm:text-sm font-bold text-white mb-3 line-clamp-2 group-hover:text-brand-accent transition-colors">${producto.nombre}</h3>
        
        <div class="mt-auto flex items-center justify-between pt-2 border-t border-white/[0.04]">
          <div class="flex flex-col sm:flex-row sm:items-center">${precioHTML}</div>
          <button onclick="agregarAlCarrito('${producto.id}')" class="btn-quick-add bg-white/[0.03] hover:bg-brand-accent border border-white/10 hover:border-brand-accent text-white p-2 rounded-lg transition-all">
            <i class="ph ph-shopping-cart-simple text-base sm:text-lg"></i>
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(tarjeta);
  });

  // Manejo del Modal del Carrito
  const modal = document.getElementById('modal-carrito');
  document.getElementById('btn-carrito').addEventListener('click', () => {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
  });
  document.getElementById('close-cart').addEventListener('click', () => {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  });
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }
  });

  // Lógica de Modales Legales Auxiliares (Términos y Privacidad)
  const setupModalLegal = (btnId, modalId, closeId) => {
    const btn = document.getElementById(btnId);
    const mdl = document.getElementById(modalId);
    const cls = document.getElementById(closeId);
    
    if(btn && mdl && cls) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        mdl.classList.remove('hidden');
        mdl.classList.add('flex');
      });
      cls.addEventListener('click', () => {
        mdl.classList.add('hidden');
        mdl.classList.remove('flex');
      });
      mdl.addEventListener('click', (e) => {
        if(e.target === mdl) {
          mdl.classList.add('hidden');
          mdl.classList.remove('flex');
        }
      });
    }
  };

  setupModalLegal('btn-terminos', 'modal-terminos', 'close-terminos');
  setupModalLegal('btn-privacidad', 'modal-privacidad', 'close-privacidad');

  // Lógica de Compra y Enrutamiento Exacto a API de WhatsApp
  document.getElementById('btn-checkout').addEventListener('click', () => {
    const playerID = document.getElementById('player-id').value.trim();
    if (carrito.length === 0) return alert('Tu carrito está vacío.');
    if (!playerID) return alert('Por favor, ingresa tu ID de jugador para procesar el pedido.');

    let numeroSoporte = "584220016488"; // Configurado con el número indicado
    let mensaje = `⚡ *NUEVO PEDIDO - ODDYSEUM STORE* ⚡\n\n`;
    mensaje += `👤 *ID de Cuenta/Jugador:* ${playerID}\n`;
    mensaje += `───────────────\n`;

    let total = 0;
    carrito.forEach(item => {
      mensaje += `📦 *${item.nombre}*\n`;
      mensaje += `    Cantidad: ${item.cantidad}x  |  Subtotal: ${formatearPrecio(item.precioOferta * item.cantidad)}\n`;
      total += item.precioOferta * item.cantidad;
    });

    mensaje += `───────────────\n`;
    mensaje += `💰 *Total Bruto a Pagar:* ${formatearPrecio(total)}\n\n`;
    mensaje += `📌 *Nota:* Aguardo las instrucciones de transferencia y coordenadas de pago móvil.`;

    const url = `https://wa.me/${numeroSoporte}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  });

  // Inicializar Interfaz
  actualizarCarritoInterfaz();
});
