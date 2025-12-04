document.addEventListener('DOMContentLoaded', function() {
const mainImage = document.getElementById('main-image');
const imageInfo = document.getElementById('image-info');
const thumbnails = document.querySelectorAll('.thumbnail');

function changeMainImage(event) {
    const thumbnail = event.currentTarget;
    const newImageSrc = thumbnail.getAttribute('data-image');
    const newImageTitle = thumbnail.getAttribute('data-title');
    
    mainImage.src = newImageSrc;
    mainImage.alt = newImageTitle;
    
    imageInfo.textContent = newImageTitle;
    
    thumbnails.forEach(thumb => {
        thumb.classList.remove('active');
    });
    
    thumbnail.classList.add('active');
}

thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener('click', changeMainImage);
});
});











document.addEventListener('DOMContentLoaded', function() {//ожидаем полной загрузки DOM 
    //получаем ссылки на элементы DOM
    const imageContainer = document.getElementById('imageContainer');
    const imageWrapper = document.getElementById('imageWrapper');
    const centeredImage = document.getElementById('centeredImage');
    const smallBtn = document.getElementById('smallBtn');
    const mediumBtn = document.getElementById('mediumBtn');
    const largeBtn = document.getElementById('largeBtn');
    const clickInfo = document.getElementById('clickInfo');

    function centerImage() {//функция для центрирования изображения в контейнере
        //получаем размеры контейнера
        const containerWidth = imageContainer.clientWidth;
        const containerHeight = imageContainer.clientHeight;
        //получаем размеры изображения
        const imageWidth = centeredImage.clientWidth;
        const imageHeight = centeredImage.clientHeight;

        //вычисляем координаты для центрирования
        const left = (containerWidth - imageWidth) / 2;
        const top = (containerHeight - imageHeight) / 2;

        //устанавливаем вычисленные координаты для обертки изображения
        imageWrapper.style.left = `${left}px`;
        imageWrapper.style.top = `${top}px`;
    }

    //функция для изменения размера изображения
    function changeImageSize(width, height) {
        //устанавливаем новые размеры изображения
        centeredImage.width = width;
        centeredImage.height = height;
        
        centerImage();//перецентрируем изображение после изменения размера
    }

    smallBtn.addEventListener('click', function() {
        //устанавливаем маленький размер изображения
        changeImageSize(100, 100);
    });

    mediumBtn.addEventListener('click', function() {
        //устанавливаем средний размер изображения
        changeImageSize(400, 400);
    });

    largeBtn.addEventListener('click', function() {
        //устанавливаем большой размер изображения
        changeImageSize(800, 800);
    });

    //добавляем обработчик клика по контейнеру изображения
    imageContainer.addEventListener('click', function(event) {
        const rect = imageContainer.getBoundingClientRect();//получаем координаты контейнера
        //вычисляем координаты клика относительно контейнера
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        //отображаем координаты клика в информационном элементе
        clickInfo.textContent = `X: ${x.toFixed(0)}px, Y: ${y.toFixed(0)}px`;
    });

    //центрируем изображение при полной загрузке страницы
    window.addEventListener('load', centerImage);
    //центрируем изображение при изменении размера окна
    window.addEventListener('resize', centerImage);

    //инициализируем центрирование изображения
    centerImage();
    //начальный размер
    smallBtn.click();
});

