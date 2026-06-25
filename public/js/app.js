/**
 * ==========================================================================
 * Lógica Comercial y Arquitectura de Compra - Oddyseum Store (2026)
 * ==========================================================================
 */

// Catálogo Centralizado (Simulación de Base de Datos)
const productos = [
  { 
    id: 'ff-520', nombre: 'Rango Kratos (Permanente)', juego: 'Minecraft', categoria: 'Rangos', icono: 'ph-crown',
    precioNormal: 25.00, precioOferta: 19.99, tag: '-20% DTO',
    imagen: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441?q=80&w=600&auto=format&fit=crop'
  },
  { 
    id: 'mc-minecoins', nombre: '1720 OddyCoins', juego: 'Minecraft', categoria: 'Economía Global', icono: 'ph-coins',
    precioNormal: null, precioOferta: 9.99, tag: 'TENDENCIA',
    imagen: 'https://images.unsplash.com/photo-1614680376408-11e05a30571f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    id: 'codm-880', nombre: 'Rango Hermes (30 Días)', juego: 'Minecraft', categoria: 'Rangos', icono: 'ph-lightning',
    precioNormal: null, precioOferta: 5.99, tag: null,
    imagen: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop'
  },
  { 
    id: 'blood-1000', nombre: 'Llave Caja Mítica x5', juego: 'Minecraft', categoria: 'Cosméticos', icono: 'ph-key',
    precioNormal: 15.00, precioOferta: 11.99, tag: 'ENTREGA INMEDIATA',
    imagen: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=600&auto=format&fit=crop'
  }
];

// Estado Global
let carrito = JSON.parse(localStorage.getItem('oddyseum_cart')) || [];

const formatearPrecio = (precio) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(precio);
};

// ==========================================================================
// RENDERIZADO Y CONTROL DEL CARRITO
// ==========================================================================

const actualizarCarritoInterfaz = () => {
  localStorage.setItem('oddyseum_cart', JSON.stringify(carrito));
  
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById('cart-count').innerText = totalItems;

  const listaContenedor = document.getElementById('lista-carrito');
  listaContenedor.innerHTML = '';

  if (carrito.length === 0) {
    listaContenedor.innerHTML = `
      <div class="h-64 flex flex-col items-center justify-center text-center p-6">
        <div class="w-16 h-16 bg-brand-void border border-brand-border rounded-2xl flex items-center justify-center mb-4 text-zinc-600 shadow-inner">
          <i class="ph ph-shopping-cart-simple text-3xl"></i>
        </div>
        <p class="text-sm font-bold text-gray-300">Tu carrito está vacío</p>
        <p class="text-xs text-zinc-500 mt-2 max-w-[200px]">Agrega productos del catálogo para apoyar al servidor.</p>
      </div>`;
    document.getElementById('cart-total').innerText = formatearPrecio(0);
    return;
  }

  let totalAcumulado = 0;
  
  carrito.forEach(item => {
    totalAcumulado += item.precioOferta * item.cantidad;
    const itemElement = document.createElement('div');
    itemElement.className = 'flex items-center gap-4 bg-brand-surface/60 border border-brand-border p-3.5 rounded-xl transition-all hover:border-brand-neonCyan/30';
    itemElement.innerHTML = `
      <div class="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-brand-border">
        <img src="${item.imagen}" class="w-full h-full object-cover" alt="${item.nombre}" />
      </div>
      <div class="flex-grow min-w-0">
        <span class="text-[9px] font-black tracking-widest text-brand-neonCyan uppercase">${item.categoria}</span>
        <h4 class="text-white text-xs font-bold truncate mt-0.5">${item.nombre}</h4>
        <p class="text-zinc-400 text-xs font-bold mt-1">${formatearPrecio(item.precioOferta)} <span class="text-brand-void font-extrabold ml-1 bg-brand-neonCyan px-1.5 py-0.5 rounded text-[10px]">x${item.cantidad}</span></p>
      </div>
      <button onclick="eliminarDelCarrito('${item.id}')" class="text-zinc-500 hover:text-red-400 p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300">
        <i class="ph-bold ph-trash text-lg"></i>
      </button>
    `;
    listaContenedor.appendChild(itemElement);
  });

  document.getElementById('cart-total').innerText = formatearPrecio(totalAcumulado);
};

window.agregarAlCarrito = (id) => {
  const productoSeleccionado = productos.find(p => p.id === id);
  const itemExistente = carrito.find(item => item.id === id);

  if (itemExistente) {
    itemExistente.cantidad += 1;
  } else {
    carrito.push({ ...productoSeleccionado, cantidad: 1 });
  }
  
  actualizarCarritoInterfaz();
  
  const modalCart = document.getElementById('modal-carrito');
  modalCart.classList.remove('hidden');
  modalCart.classList.add('flex');
};

window.eliminarDelCarrito = (id) => {
  carrito = carrito.filter(item => item.id !== id);
  actualizarCarritoInterfaz();
};

// ==========================================================================
// UTILIDADES DEL SERVIDOR (IP y Conteo)
// ==========================================================================

window.copyIP = () => {
    navigator.clipboard.writeText('play.oddyseum.net').then(() => {
        const toast = document.getElementById('toast-notification');
        toast.classList.remove('translate-y-24', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
        
        if (navigator.vibrate) navigator.vibrate(50);

        setTimeout(() => {
            toast.classList.remove('translate-y-0', 'opacity-100');
            toast.classList.add('translate-y-24', 'opacity-0');
        }, 4000);
    });
};

const fetchPlayerCount = async () => {
    const serverIP = 'play.oddyseum.net'; 
    const playerElement = document.getElementById('player-count');
    
    try {
        const response = await fetch(`https://api.mcsrvstat.us/3/${serverIP}`);
        const data = await response.json();
        
        if (data.online) {
            playerElement.innerHTML = `${data.players.online} <span class="text-sm text-zinc-500 font-medium">Jugadores</span>`;
        } else {
            playerElement.innerHTML = `<span class="text-sm text-red-400">Mantenimiento</span>`;
        }
    } catch (error) {
        playerElement.innerHTML = `<span class="text-sm text-zinc-500">IP: ${serverIP}</span>`;
    }
};

// ==========================================================================
// INICIALIZACIÓN DOM READY
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Iniciar conteo de jugadores
  fetchPlayerCount();

  // 2. Renderizar Catálogo de Productos
  const contenedor = document.getElementById('grid-productos');
  if(contenedor) {
      productos.forEach((producto, index) => {
        const precioHTML = producto.precioNormal 
          ? `<span class="text-[11px] text-zinc-500 line-through mr-2 font-medium">${formatearPrecio(producto.precioNormal)}</span>
             <span class="text-base sm:text-lg font-black text-white">${formatearPrecio(producto.precioOferta)}</span>`
          : `<span class="text-base sm:text-lg font-black text-white">${formatearPrecio(producto.precioOferta)}</span>`;

        const tagHTML = producto.tag 
          ? `<div class="absolute top-3 left-3 bg-brand-void/90 border border-brand-neonCyan/30 text-brand-neonCyan text-[9px] font-black px-2.5 py-1 rounded-lg shadow-md z-10 tracking-widest uppercase backdrop-blur-md">
              ${producto.tag}
             </div>`
          : '';

        const tarjeta = document.createElement('div');
        tarjeta.className = 'premium-card rounded-2xl overflow-hidden relative flex flex-col h-full group animate-fade-in-up';
        tarjeta.style.animationDelay = `${index * 80}ms`;

        tarjeta.innerHTML = `
          ${tagHTML}
          <div class="h-40 sm:h-48 overflow-hidden relative">
            <img src="${producto.imagen}" alt="${producto.nombre}" class="w-full h-full object-cover transition duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100" />
            <div class="absolute inset-0 bg-gradient-to-t from-brand-card via-brand-card/20 to-transparent"></div>
          </div>
          
          <div class="p-5 flex flex-col flex-grow relative z-10">
            <span class="text-brand-neonCyan text-[9px] font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <i class="${producto.icono} text-sm"></i> ${producto.categoria}
            </span>
            <h3 class="text-sm sm:text-base font-extrabold text-white mb-4 line-clamp-2">${producto.nombre}</h3>
            
            <div class="mt-auto flex items-center justify-between pt-4 border-t border-brand-border">
              <div class="flex items-center">${precioHTML}</div>
              <button onclick="agregarAlCarrito('${producto.id}')" class="bg-brand-surface border border-brand-border hover:bg-brand-neonCyan text-white hover:text-brand-void p-3 rounded-xl transition-all duration-300 shadow-inner group-hover:border-brand-neonCyan">
                <i class="ph-bold ph-plus text-base"></i>
              </button>
            </div>
          </div>
        `;
        contenedor.appendChild(tarjeta);
      });
  }

  // 3. Control del Modal del Carrito
  const modalCart = document.getElementById('modal-carrito');
  const btnCarrito = document.getElementById('btn-carrito');
  const closeCart = document.getElementById('close-cart');

  if(btnCarrito && modalCart && closeCart) {
      btnCarrito.addEventListener('click', () => {
        modalCart.classList.remove('hidden');
        modalCart.classList.add('flex');
      });
      closeCart.addEventListener('click', () => {
        modalCart.classList.add('hidden');
        modalCart.classList.remove('flex');
      });
      modalCart.addEventListener('click', (e) => {
        if (e.target === modalCart) {
          modalCart.classList.add('hidden');
          modalCart.classList.remove('flex');
        }
      });
  }

  // 4. Checkout a WhatsApp corporativo
  const btnCheckout = document.getElementById('btn-checkout');
  if(btnCheckout) {
      btnCheckout.addEventListener('click', () => {
        const playerID = document.getElementById('player-id').value.trim();
        if (carrito.length === 0) return alert('Tu carrito está vacío.');
        if (!playerID) return alert('Por favor, ingresa tu ID o Nickname de jugador.');

        let numeroSoporte = "584220016488";
        let mensaje = `⚡ *NUEVO PEDIDO - ODDYSEUM STORE* ⚡\n\n`;
        mensaje += `👤 *Nickname:* ${playerID}\n`;
        mensaje += `───────────────\n`;

        let total = 0;
        carrito.forEach(item => {
          mensaje += `📦 *${item.nombre}*\n`;
          mensaje += `    Cantidad: ${item.cantidad}x  |  Subtotal: ${formatearPrecio(item.precioOferta * item.cantidad)}\n`;
          total += item.precioOferta * item.cantidad;
        });

        mensaje += `───────────────\n`;
        mensaje += `💰 *Total a Liquidar:* ${formatearPrecio(total)}\n\n`;
        mensaje += `📌 *Nota:* Aguardo los métodos de pago.`;

        const url = `https://wa.me/${numeroSoporte}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
      });
  }

  // 5. Carga inicial
  actualizarCarritoInterfaz();
});
