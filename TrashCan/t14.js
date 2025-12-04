//задача 1 подтверждение перехода по ссылке
document.getElementById('contents').addEventListener('click', function(event) {
    let target = event.target;
    
    //находим ближайшую ссылку (включая вложенные элементы)
    while (target != this) {
        if (target.tagName == 'A') {
            //если нашли ссылку, спрашиваем подтверждение
            if (!confirm('Вы действительно хотите покинуть страницу?')) {
                event.preventDefault();
            }
            return;
        }
        target = target.parentNode;
    }
});
//задача 3 выделение элементов списка
const fileList = document.getElementById('fileList');

fileList.addEventListener('click', function(event) {
    //предотвращаем выделение текста
    event.preventDefault();
    
    const target = event.target;
    
    //проверяем, что кликнули на элемент списка
    if (target.tagName === 'LI') {
        //если нажат Ctrl
        if (event.ctrlKey) {
            //gереключаем выделение только для этого элемента
            target.classList.toggle('selected');
        } else {
            //cнимаем выделение со всех элементов
            const items = fileList.querySelectorAll('li');
            items.forEach(item => item.classList.remove('selected'));
            
            //выделяем текущий элемент
            target.classList.add('selected');
        }
    }
});

//задача 4 слайдер
const slider = document.getElementById('slider');
const sliderDot = document.getElementById('sliderDot');
const sliderValue = document.getElementById('sliderValue');

let isDragging = false;

//функция для обновления позиции ползунка
function updateSliderPosition(clientX) {
    const sliderRect = slider.getBoundingClientRect();
    let newLeft = clientX - sliderRect.left;
    
    //ограничиваем положение ползунка в пределах слайдера
    newLeft = Math.max(0, Math.min(newLeft, sliderRect.width)-10);
    
    //устанавливаем новую позицию
    sliderDot.style.left = `${newLeft}px`;
    
    //вычисляем значение
    const value = Math.round((newLeft / sliderRect.width) * 10);
    sliderValue.textContent = value;
}

//cобытие начала перетаскивания
sliderDot.addEventListener('mousedown', function(event) {
    isDragging = true;
    event.preventDefault();//предотвращаем выделение текста
});

//cобытие движения мыши
document.addEventListener('mousemove', function(event) {
    if (isDragging) {
        updateSliderPosition(event.clientX);
    }
});

//cобытие окончания перетаскивания
document.addEventListener('mouseup', function() {
    isDragging = false;
});

// Обработка клика по слайдеру для перемещения ползунка
slider.addEventListener('click', function(event) {
    updateSliderPosition(event.clientX);
});

// Задача 6: Анимации
const startBtn = document.getElementById('startAnimation');
const stopBtn = document.getElementById('stopAnimation');
const animatedElements = document.querySelectorAll('.animated-element');

startBtn.addEventListener('click', function() {
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'running';
    });
});

stopBtn.addEventListener('click', function() {
    animatedElements.forEach(el => {
        el.style.animationPlayState = 'paused';
    });
});