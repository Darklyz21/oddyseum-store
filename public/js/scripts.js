// 1. Temporizador Vivo (Loot Relámpago)
function startCountdown() {
    // Para no usar un conteo plano que se pausa al minimizar la ventana,
    // calculamos la fecha objetivo (Ejemplo: 3 días a partir del inicio)
    const targetDate = Date.now() + (3 * 24 * 60 * 60 * 1000);
    const display = document.getElementById('countdown');
    
    if(!display) return; // Validación por si estás en otra página que no tiene el contador

    setInterval(() => {
        const now = Date.now();
        const difference = targetDate - now;

        if (difference <= 0) {
            display.innerText = "¡OFERTA EXPIRADA!";
            return;
        }

        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        display.innerText = `${d}D ${h.toString().padStart(2, '0')}H ${m.toString().padStart(2, '0')}M ${s.toString().padStart(2, '0')}S`;
    }, 1000);
}

// 2. Animación Cíclica del Panel 24/7
function startStepsAnimation() {
    const steps = [
        { id: 'step-1', iconColor: 'bg-brand-green/20 border-brand-green text-brand-green shadow-[0_0_10px_rgba(0,242,142,0.4)]', textColor: 'text-brand-green' },
        { id: 'step-2', iconColor: 'bg-brand-yellow/20 border-brand-yellow text-brand-yellow shadow-[0_0_10px_rgba(255,193,7,0.4)]', iconClass: 'animate-spin', textColor: 'text-brand-yellow' },
        { id: 'step-3', iconColor: 'bg-brand-cyan/20 border-brand-cyan text-brand-cyan shadow-[0_0_15px_rgba(0,180,216,0.6)]', textColor: 'text-brand-cyan' }
    ];

    // Verificamos si los pasos existen en el DOM actual
    if(!document.getElementById(steps[0].id)) return;

    let current = 0;

    setInterval(() => {
        // Resetear todos los pasos a su estado inactivo
        steps.forEach(step => {
            const el = document.getElementById(step.id);
            if(!el) return;
            const icon = el.querySelector('.step-icon');
            const text = el.querySelector('.step-text');
            
            icon.className = `step-icon w-7 h-7 rounded-full bg-base-300 border border-base-400 flex items-center justify-center flex-shrink-0 text-gray-500 transition-all duration-500`;
            icon.innerHTML = icon.innerHTML.replace('animate-spin', ''); 
            text.classList.add('opacity-50');
            text.querySelector('h4').className = 'text-white font-bold text-sm transition-colors duration-500';
        });

        // Activar el paso actual
        const activeEl = document.getElementById(steps[current].id);
        const activeIcon = activeEl.querySelector('.step-icon');
        const activeText = activeEl.querySelector('.step-text');

        activeIcon.className = `step-icon w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${steps[current].iconColor}`;
        if(steps[current].iconClass) activeIcon.querySelector('i').classList.add(steps[current].iconClass);
        
        activeText.classList.remove('opacity-50');
        activeText.querySelector('h4').className = `${steps[current].textColor} font-bold text-sm transition-colors duration-500`;

        // Avanzar al siguiente paso (ciclo infinito)
        current = (current + 1) % steps.length;
    }, 2000); 
}

// 3. Sistema Universal de Drag to Scroll para PC
function initDragScroll() {
    // Ahora selecciona todos los contenedores que tengan la clase .drag-scroll
    const sliders = document.querySelectorAll('.drag-scroll');
    
    sliders.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('cursor-grabbing');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('cursor-grabbing');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('cursor-grabbing');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Multiplicador de velocidad de arrastre
            slider.scrollLeft = scrollLeft - walk;
        });
    });
}

// 4. Motor de aparición progresiva en Scroll (Reveal)
function initScrollReveal() {
    const observerOptions = { threshold: 0.15 };
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => scrollObserver.observe(el));
}

// 5. Motor de Paginación para el Slider (Las pelotitas)
function initSliderDots() {
    const slider = document.getElementById('features-slider');
    const dotsContainer = document.getElementById('slider-dots');
    
    if(!slider || !dotsContainer) return;

    const cards = slider.querySelectorAll('.slider-card');
    
    // Crear los puntitos dinámicamente según la cantidad de tarjetas
    dotsContainer.innerHTML = '';
    cards.forEach((card, index) => {
        const dot = document.createElement('div');
        // El primer punto arranca activo
        const isActive = index === 0;
        dot.className = `dot-indicator transition-all duration-300 rounded-full cursor-pointer ${isActive ? 'w-6 h-2 bg-brand-green shadow-[0_0_10px_rgba(0,242,142,0.5)]' : 'w-2 h-2 bg-base-400'}`;
        dot.dataset.index = index;
        
        // Al tocar un puntito, el slider se mueve a esa tarjeta
        dot.addEventListener('click', () => {
            const cardLeft = card.offsetLeft;
            slider.scrollTo({ left: cardLeft - slider.offsetLeft - 16, behavior: 'smooth' });
        });
        
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot-indicator');

    // Usar IntersectionObserver para detectar qué tarjeta se está viendo
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeIndex = entry.target.dataset.index;
                
                // Actualizar estilos de los puntitos
                dots.forEach(d => {
                    d.className = 'dot-indicator transition-all duration-300 rounded-full cursor-pointer w-2 h-2 bg-base-400 hover:bg-base-300';
                });
                dots[activeIndex].className = 'dot-indicator transition-all duration-300 rounded-full cursor-pointer w-6 h-2 bg-brand-green shadow-[0_0_10px_rgba(0,242,142,0.5)]';
            }
        });
    }, {
        root: slider,
        threshold: 0.6 // La tarjeta debe verse al menos al 60% para activar el puntito
    });

    cards.forEach((card, index) => {
        card.dataset.index = index;
        observer.observe(card);
    });
}

// Iniciar todos los módulos cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {
    startCountdown();
    startStepsAnimation();
    initDragScroll();
    initScrollReveal();
});
