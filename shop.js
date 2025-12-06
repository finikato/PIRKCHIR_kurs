//исходный массив товаров
const products = [
    { id: 1, name: "Бокс", price: 300},
    { id: 2, name: "Андеркат", price: 550},
    { id: 3, name: "Британка", price: 400},
    { id: 4, name: "Каскад", price: 150},
    { id: 5, name: "Фэйд", price: 650},
    { id: 6, name: "Пикси", price: 320},
    { id: 7, name: "Милитари", price: 440},
    { id: 8, name: "Шторы", price: 460},
    { id: 9, name: "Кроп", price: 470},
    { id: 10, name: "Каре", price: 450},
    { id: 11, name: "Паж", price: 2100},
    { id: 12, name: "Хлопер", price: 1500}
];

//массив товаров в корзине
let cart = [];

//получение DOM-элементов
const catalogProducts = document.getElementById('catalog-products');
const cartItems = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const replaceItemBtn = document.getElementById('replace-item');
const clearCartBtn = document.getElementById('clear-cart');
const applyFilterBtn = document.getElementById('apply-filter');
const sortAscBtn = document.getElementById('sort-asc');
const sortDescBtn = document.getElementById('sort-desc');
const resetCatalogBtn = document.getElementById('reset-catalog');
const notification = document.getElementById('notification');

//текущий отображаемый список товаров (для фильтрации и сортировки)
let currentProducts = products.slice();//создаем копию исходного массива

//инициализация приложения
function init() {
    renderCatalogProducts();//отображаем товары в каталоге
    renderCart();//отображаем корзину
    
   //назначаем обработчики событий на кнопки
    replaceItemBtn.addEventListener('click', replaceRandomItem);
    clearCartBtn.addEventListener('click', clearCart);
    applyFilterBtn.addEventListener('click', applyFilter);
    sortAscBtn.addEventListener('click', () => sortProducts('asc'));
    sortDescBtn.addEventListener('click', () => sortProducts('desc'));
    resetCatalogBtn.addEventListener('click', resetCatalog);
    
    //инициализируем обработчики для уведомлений (делегирование событий)
    setupNotificationCloseHandlers();
}

//отображение товаров в каталоге
function renderCatalogProducts() {
    catalogProducts.innerHTML = '';//очищаем контейнер
    
   //проверяем, есть ли товары для отображения
    if (currentProducts.length === 0) {
        catalogProducts.innerHTML = '<div class="empty-cart">Услуги не найдены</div>';
        return;
    }
    
   //для каждого товара создаем карточку
    currentProducts.forEach(product => {
        const productCard = document.createElement('div');//создаем div элемент
        productCard.className = 'product-card';//присваиваем класс для стилизации
        productCard.innerHTML = `
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${product.price} руб.</p>
                <button class="add-to-cart" data-id="${product.id}">Добавить в корзину</button>
            </div>
        `;
        catalogProducts.appendChild(productCard);//добавляем карточку в контейнер
    });
    
   //добавляем обработчики для кнопок "Добавить в корзину"
    document.querySelectorAll('#catalog-products .add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));//получаем ID товара
            addToCart(productId);//добавляем товар в корзину
        });
    });
    //добавляем возможность перетаскивания к новым карточкам товаров
    document.querySelectorAll('#catalog-products .product-card').forEach(card => {
        card.draggable = true;
        card.style.cursor = 'grab';
        card.style.transition = 'opacity 0.2s ease';
    });
}

//отображение товаров в корзине
function renderCart() {
    cartItems.innerHTML = '';//очищаем контейнер корзины
    
   //проверяем, пуста ли корзина
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        cartTotal.textContent = 'Итого: 0 руб.';
        return;
    }
    
   //для каждого товара в корзине создаем элемент
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="item-info">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>${item.price} руб. за шт.</p>
                </div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-btn" data-id="${item.id}">🗑️</button>
            </div>
        `;
        cartItems.appendChild(cartItem);//добавляем элемент в корзину
    });
    
   //добавляем обработчики для кнопок изменения количества и удаления
    document.querySelectorAll('.quantity-btn.decrease').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, -1);//уменьшаем количество на 1
        });
    });
    
    document.querySelectorAll('.quantity-btn.increase').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateQuantity(productId, 1);//увеличиваем количество на 1
        });
    });
    
    document.querySelectorAll('.remove-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.getAttribute('data-id'));
            removeFromCart(productId);//удаляем товар из корзины
        });
    });
    
   //обновляем итоговую стоимость
    updateTotal();
}

//добавление товара в корзину
function addToCart(productId) {
    const product = products.find(p => p.id === productId);//находим товар по ID
    if (!product) return;//если товар не найден, выходим
    
    const existingItem = cart.find(item => item.id === productId);//проверяем, есть ли товар уже в корзине
    
    if (existingItem) {
        existingItem.quantity += 1;//увеличиваем количество, если товар уже в корзине
    } else {
        cart.push({
            ...product,//копируем все свойства товара (spread operator)
            quantity: 1//устанавливаем начальное количество
        });
    }
    
    renderCart();//перерисовываем корзину
    showNotification(`Услуга "${product.name}" добавлена в корзину!`);//показываем уведомление
}

//удаление товара из корзины
function removeFromCart(productId) {
    const productIndex = cart.findIndex(item => item.id === productId);//находим индекс товара
    if (productIndex !== -1) {
        const productName = cart[productIndex].name;//сохраняем имя товара для уведомления
        cart.splice(productIndex, 1);//удаляем товар из массива
        renderCart();//перерисовываем корзину
        showNotification(`Услуга "${productName}" удалена из корзины!`, true);//показываем уведомление об ошибке
    }
}

//обновление количества товара
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);//находим товар в корзине
    if (!item) return;//если товар не найден, выходим
    
    item.quantity += change;//изменяем количество на указанное значение
    
    if (item.quantity <= 0) {
        removeFromCart(productId);//если количество <= 0, удаляем товар
    } else {
        renderCart();//иначе перерисовываем корзину
    }
}

//обновление итоговой стоимости
function updateTotal() {
   //вычисляем общую стоимость: сумма (цена * количество) для каждого товара
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `Итого: ${total} руб.`;//обновляем текст
}

//замена случайного товара в корзине
function replaceRandomItem() {
    if (cart.length === 0) {
        showNotification('Корзина пуста!', true);//если корзина пуста, показываем ошибку
        return;
    }
    
   //находим случайный товар в корзине
    const randomIndex = Math.floor(Math.random() * cart.length);
    const replacedItem = cart[randomIndex];//товар, который будет заменен
    
   //находим товары, которых нет в корзине
    const availableProducts = products.filter(p => !cart.some(item => item.id === p.id));
    
    if (availableProducts.length === 0) {
        showNotification('Все услуги уже в корзине!', true);//если все товары в корзине
        return;
    }
    
   //выбираем случайный товар из доступных
    const newProduct = availableProducts[Math.floor(Math.random() * availableProducts.length)];
    
   //заменяем товар в корзине
    cart[randomIndex] = {
        ...newProduct,//копируем свойства нового товара
        quantity: replacedItem.quantity//сохраняем исходное количество
    };
    
    renderCart();//перерисовываем корзину
    showNotification(`Услуга "${replacedItem.name}" заменена на "${newProduct.name}"!`);
}

//очистка корзины
function clearCart() {
    if (cart.length === 0) {
        showNotification('Корзина уже пуста!', true);//если корзина уже пуста
        return;
    }
    
    cart = [];//очищаем массив корзины
    renderCart();//перерисовываем корзину
    showNotification('Корзина очищена!', true);//показываем уведомление
}

//функция фильтрации товаров по цене
function filterProducts(minPrice, maxPrice) {
    return products.filter(product => 
        product.price >= minPrice && product.price <= maxPrice//фильтруем товары по диапазону цен
    );
}

//применение фильтра
function applyFilter() {
   //получаем значения минимальной и максимальной цены из input'ов
    const minPrice = parseInt(document.getElementById('min-price').value) || 0;
    const maxPrice = parseInt(document.getElementById('max-price').value) || Number.MAX_SAFE_INTEGER;
    
   //проверяем корректность диапазона цен
    if (minPrice > maxPrice) {
        showNotification('Минимальная цена не может быть больше максимальной!', true);
        return;
    }
    
    currentProducts = filterProducts(minPrice, maxPrice);//применяем фильтр
    renderCatalogProducts();//перерисовываем каталог
}

//сортировка товаров
function sortProducts(order) {
    const sorted = [...currentProducts];//создаем копию текущего массива 
    
   //сортируем в зависимости от порядка
    if (order === 'asc') {
        sorted.sort((a, b) => a.price - b.price);//по возрастанию цены
    } else {
        sorted.sort((a, b) => b.price - a.price);//по убыванию цены
    }
    
    currentProducts = sorted;//обновляем текущий массив
    renderCatalogProducts();//перерисовываем каталог
}

//сброс каталога к исходному состоянию
function resetCatalog() {
    currentProducts = [...products];//восстанавливаем исходный массив товаров
    document.getElementById('min-price').value = '';//очищаем поле минимальной цены
    document.getElementById('max-price').value = '';//очищаем поле максимальной цены
    renderCatalogProducts();//перерисовываем каталог
    showNotification('Фильтры и сортировка сброшены!');//показываем уведомление
}

//показать уведомление
function showNotification(message, isError = false) {
    // Создаем уведомление с кнопкой закрытия
    const notification = document.createElement('div');
    notification.className = 'notification show';
    
    if (isError) {
        notification.classList.add('error');
    }
    
    notification.innerHTML = `
        <span class="notification-text">${message}</span>
        <button class="notification-close" aria-label="Закрыть уведомление">×</button>
    `;
    
    // Добавляем уведомление в тело документа
    document.body.appendChild(notification);
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotification(notification);
        }
    }, 3000);
}

//настройка делегирования событий для кнопок закрытия уведомлений
function setupNotificationCloseHandlers() {
    //один обработчик на body для всех кнопок закрытия уведомлений
    document.body.addEventListener('click', function(e) {
        //проверяем, была ли нажата кнопка закрытия (элемент с классом notification-close)
        if (e.target.classList.contains('notification-close')) {
            //находим родительское уведомление и закрываем его
            const notification = e.target.closest('.notification');
            if (notification) {
                closeNotification(notification);
            }
        }
    });
}

//функция закрытия уведомления
function closeNotification(notificationElement) {
    notificationElement.classList.remove('show');
    setTimeout(() => {
        if (notificationElement.parentNode) {
            notificationElement.parentNode.removeChild(notificationElement);
        }
    }, 300);
}

//инициализация новых функций
function initNewFunctions() {
}

//инициализация Drag and Drop
function initDragAndDrop() {
    setupProductDrag();//настройка перетаскивания товаров
    setupCartDrop();//настройка области сброса в корзину
}

//настройка перетаскивания товаров
function setupProductDrag() {
    //делегирование событий для карточек товаров
    catalogProducts.addEventListener('dragstart', function(e) {
        //проверяем, что перетаскивается карточка товара или ее дочерний элемент
        if (e.target.classList.contains('product-card') || e.target.closest('.product-card')) {
            //находим карточку товара: если кликнули прямо на карточку - берем ее, иначе ищем родительскую карточку
            const productCard = e.target.classList.contains('product-card') ? e.target : e.target.closest('.product-card');
            //находим кнопку "Добавить в корзину" внутри карточки
            const addToCartBtn = productCard.querySelector('.add-to-cart');
            //получаем ID товара из data-атрибута кнопки и преобразуем в число
            const productId = parseInt(addToCartBtn.getAttribute('data-id'));
            
            //сохраняем ID товара в объект dataTransfer для передачи при сбросе
            e.dataTransfer.setData('text/plain', productId.toString());
            //устанавливаем полупрозрачность карточке для визуального эффекта перетаскивания
            productCard.style.opacity = '0.6';
            //меняем курсор на "захватывающий" для визуальной обратной связи
            productCard.style.cursor = 'grabbing';
        }
    });
    
    //обработчик события завершения перетаскивания
    catalogProducts.addEventListener('dragend', function(e) {
        //проверяем, что завершается перетаскивание карточки товара или ее дочернего элемента
        if (e.target.classList.contains('product-card') || e.target.closest('.product-card')) {
            //находим карточку товара: если перетаскивали саму карточку - берем ее, иначе ищем родительскую карточку
            const productCard = e.target.classList.contains('product-card') ? e.target : e.target.closest('.product-card');
            //восстанавливаем полную непрозрачность карточки
            productCard.style.opacity = '1';
            //возвращаем курсор "для захвата" в нормальное состояние
            productCard.style.cursor = 'grab';
        }
    });
}

//настройка области сброса в корзину
function setupCartDrop() {
    //получаем DOM-элемент корзины для настройки событий перетаскивания
    const cartElement = cartItems;
    
    //обработчик события перемещения над областью корзины
    cartElement.addEventListener('dragover', function(e) {
        e.preventDefault();//предотвращаем действие по умолчанию
        
        if (e.dataTransfer.types.includes('text/plain')) {//проверяем, что перетаскиваемые данные содержат текст(Id)
            this.style.backgroundColor = 'rgba(106, 17, 203, 0.2)';//устанавливаем фоновый цвет
            this.style.border = '2px dashed #2575fc';//меняем границу
        }
    });
    
    //закончили перетаскивать
    cartElement.addEventListener('dragleave', function(e) {
        
        e.preventDefault();//предотвращаем действие по умолчанию
        
        this.style.backgroundColor = '';//убираем фоновый цвет,возвращаем прозрачный фон
        this.style.border = '1px dashed rgba(255, 255, 255, 0.2)';//возвращаем исходную границу корзины
    });
    
    //обработчик события сброса элемента в корзину
    cartElement.addEventListener('drop', function(e) {
        e.preventDefault();//предотвращаем действие по умолчанию
        this.style.backgroundColor = '';//убираем фоновый цвет подсветки
        this.style.border = '1px dashed rgba(255, 255, 255, 0.2)';//возвращаем исходную границу корзины
        
        const productId = parseInt(e.dataTransfer.getData('text/plain'));//получаем ID товара из переданных данных и преобразуем в число
        
        if (!isNaN(productId)) {//проверяем, что полученный ID является корректным числом
            addToCart(productId);//вызываем функцию добавления товара в корзину с полученным ID
        }
    });
}

//общая инициализация
document.addEventListener('DOMContentLoaded', function() {
    init();//сначала существующий код
    initNewFunctions();//потом новые функции
    initDragAndDrop();//инициализация перетаскивания
});