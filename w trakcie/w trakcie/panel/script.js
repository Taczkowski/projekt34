document.addEventListener('DOMContentLoaded', function() {
    const draggables = document.querySelectorAll('.draggable');
    const columns = document.querySelectorAll('.column');
    const timeInput = document.querySelector('.time');
    
    // Konfiguracja
    const COOK_TIME_PER_PIZZA = 5;
    const COOKS = 2;
    const BASE_TIME = 15;

    function calculateWaitingTime() {
        const activeOrders = document.querySelectorAll('#przyjete .draggable, #w-trakcie .draggable');
        let totalPizzas = 0;

        activeOrders.forEach(order => {
            const pizzaHeader = Array.from(order.querySelectorAll('strong')).find(el => 
                el.textContent.includes('Zamówione pizze')
            );
            
            if (pizzaHeader) {
                const countMatch = pizzaHeader.nextSibling.textContent.match(/(\d+)/);
                if (countMatch) totalPizzas += parseInt(countMatch[1]);
            }
        });

        if (totalPizzas === 0) {
            timeInput.value = "Brak aktywnych zamówień";
            return;
        }

        // Obliczenia
        const totalCookTime = (totalPizzas * COOK_TIME_PER_PIZZA) / COOKS;
        const totalTime = totalCookTime + BASE_TIME;
        
        // Formatowanie
        const hours = Math.floor(totalTime / 60);
        const minutes = Math.round(totalTime % 60);
        timeInput.value = hours > 0 
            ? `${hours}h ${minutes}min` 
            : `${minutes}min`;
    }

    // Poprawiona obsługa przeciągania
    draggables.forEach(draggable => {
        draggable.addEventListener('dragstart', () => {
            draggable.classList.add('dragging');
        });

        draggable.addEventListener('dragend', () => {
            draggable.classList.remove('dragging');
            calculateWaitingTime(); // Natychmiastowa aktualizacja
        });
    });

    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const draggable = document.querySelector('.dragging');
            afterElement ? column.insertBefore(draggable, afterElement) : column.appendChild(draggable);
        });
    });

    // Automatyczna aktualizacja co 10 sekund
    setInterval(calculateWaitingTime, 10000);
    calculateWaitingTime();

    function getDragAfterElement(column, y) {
        const draggableElements = [...column.querySelectorAll('.draggable:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            return (offset < 0 && offset > closest.offset) ? 
                { offset: offset, element: child } : 
                closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
});
    // Obsługa statusu otwarcia
    const openBtn = document.getElementById('openBtn');
    const closeBtn = document.getElementById('closeBtn');
    const deliveryToggleBtn = document.getElementById('deliveryToggleBtn');

    openBtn.addEventListener('click', () => {
        openBtn.style.display = 'none';
        closeBtn.style.display = 'inline-block';
        deliveryToggleBtn.style.display = 'inline-block';
    });

    closeBtn.addEventListener('click', () => {
        openBtn.style.display = 'inline-block';
        closeBtn.style.display = 'none';
        deliveryToggleBtn.style.display = 'none';
        deliveryToggleBtn.textContent = 'Wstrzymanie dostaw';
        deliveryToggleBtn.classList.remove('wznow');
    });

    deliveryToggleBtn.addEventListener('click', () => {
        if(deliveryToggleBtn.textContent === 'Wstrzymanie dostaw') {
            deliveryToggleBtn.textContent = 'Wznów dostawy';
            deliveryToggleBtn.classList.add('wznow');
        } else {
            deliveryToggleBtn.textContent = 'Wstrzymanie dostaw';
            deliveryToggleBtn.classList.remove('wznow');
        }
    });