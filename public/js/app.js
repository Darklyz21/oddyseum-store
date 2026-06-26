const productos = [
  {
    id: 'mc-vip',
    nombre: 'Rango VIP Permanente',
    categoria: 'Minecraft',
    precioOferta: 9.99,
    imagen: 'https://images.unsplash.com/photo-1614680376408-11e05a30571f',
    descripcion: 'Acceso VIP completo.'
  },
  {
    id: 'mc-mvp',
    nombre: 'Rango MVP Permanente',
    categoria: 'Minecraft',
    precioOferta: 19.99,
    imagen: 'https://images.unsplash.com/photo-1628126235206-5260b9ea6441',
    descripcion: 'Beneficios premium avanzados.'
  }
];

let carrito = JSON.parse(localStorage.getItem('cart')) || [];

const $ = (id) => document.getElementById(id);

function format(n){
  return `$${n.toFixed(2)}`;
}

/* RENDER PRODUCTS */
function render(productosList){
  const grid = $("grid-productos");
  grid.innerHTML = "";

  productosList.forEach(p => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <img src="${p.imagen}" />
      <div class="card-body">
        <h3>${p.nombre}</h3>
        <p>${p.descripcion}</p>
        <p class="price">${format(p.precioOferta)}</p>
        <button onclick="add('${p.id}')">Agregar</button>
      </div>
    `;

    grid.appendChild(div);
  });
}

/* ADD CART */
window.add = (id) => {
  const p = productos.find(x => x.id === id);
  const item = carrito.find(x => x.id === id);

  if(item) item.qty++;
  else carrito.push({...p, qty:1});

  save();
  updateCart();
};

function save(){
  localStorage.setItem("cart", JSON.stringify(carrito));
}

/* CART */
function updateCart(){
  $("cart-count").textContent = carrito.reduce((a,b)=>a+b.qty,0);
  renderCart();
}

function renderCart(){
  const list = $("lista-carrito");
  list.innerHTML = "";

  let total = 0;

  carrito.forEach((i,idx)=>{
    total += i.precioOferta * i.qty;

    const div = document.createElement("div");
    div.innerHTML = `
      <p>${i.nombre} x${i.qty}</p>
      <button onclick="remove(${idx})">x</button>
    `;
    list.appendChild(div);
  });

  $("cart-total").textContent = format(total);
}

/* REMOVE */
window.remove = (i) => {
  carrito.splice(i,1);
  save();
  updateCart();
};

/* CHECKOUT */
$("btn-checkout").onclick = () => {
  const id = $("player-id").value;

  if(!carrito.length) return alert("Carrito vacío");
  if(!id) return alert("Ingresa ID");

  let msg = `Pedido Lyz Market\n\nID: ${id}\n`;

  let total = 0;

  carrito.forEach(i=>{
    total += i.precioOferta*i.qty;
    msg += `- ${i.nombre} x${i.qty}\n`;
  });

  msg += `\nTotal: ${format(total)}`;

  const phone = "584220016488";
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
};

/* UI EVENTS */
$("btn-carrito").onclick = () => $("cart-drawer").classList.remove("hidden");
$("close-cart").onclick = () => $("cart-drawer").classList.add("hidden");

$("search-input").oninput = (e) => {
  const v = e.target.value.toLowerCase();
  render(productos.filter(p => p.nombre.toLowerCase().includes(v)));
};

/* INIT */
render(productos);
updateCart();