document.querySelector('.burger-checkbox').addEventListener('change', function() {
    document.body.style.overflow = this.checked ? 'hidden' : '';
});

//конфигурация эффектов
const CONFIG = {
    fadeInOffset: 100,//расстояние до элемента для появления
    scrollThrottle: 16//оптимизация производительности
};

let ticking = false;

//инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    //показываем элементы, которые уже в области видимости
    checkVisibility();
    //добавляем обработчик прокрутки
    window.addEventListener('scroll', handleScroll, { passive: true });
    //инициализируем прогресс-бар
    updateProgressBar();
});

//основной обработчик прокрутки
function handleScroll() {
    if (!ticking) {
        requestAnimationFrame(function() {
            updateProgressBar();
            checkVisibility();
            ticking = false;
        });
        ticking = true;
    }
}

//обновление прогресс-бара
function updateProgressBar() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrollTop = window.pageYOffset;
        const scrollPercent = (scrollTop / documentHeight) * 103; 
        progressBar.style.width = Math.min(scrollPercent, 100) + '%'; 
    }
}

//проверка видимости элементов для анимации
function checkVisibility() {
    //перебираем каждый элемент с анимацией появления
    const fadeElements = document.querySelectorAll('.fade-in');
    const windowHeight = window.innerHeight;
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - CONFIG.fadeInOffset) {
            element.classList.add('visible');
        }
    });
}