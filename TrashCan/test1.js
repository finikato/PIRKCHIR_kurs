const resultElement = document.getElementById('registrationResult');
registrationBtn.addEventListener('click', function() {
    const answer = prompt('Желаете пройти регистрацию на сайте?');
    if (answer == "Да")
    {
        resultElement.textContent = 'Круто!';
        resultElement.style.color = '#4CAF50'; 
    }
    else
    {
        resultElement.textContent = 'Попробуй ещё раз';
        resultElement.style.color = '#ffffffff';
    }
});

const loginResult = document.getElementById('loginResult');
loginBtn.addEventListener('click', function() {
    const answer = prompt('Кто вы сударь любезный');
    if (answer == "Админ")
    {
        const answer = prompt('Якой вы юродиевый');
        if(answer == "Я главный")
        {
            loginResult.textContent = 'Здравствуйте';
            loginResult.style.color = '#4CAF50'; 
        }
    }
    else
    {
        loginResult.textContent = 'Неверный пароль';
        loginResult.style.color = '#ffffffff';
    }
});

let isTrue = true;
likeBtn.addEventListener('click', function() {
    isTrue = !isTrue; 
    if (isTrue) 
    { 
        likeBtn.style.backgroundColor = '#7e7f7eff'; 
    } 
    else 
    {
        likeBtn.style.backgroundColor = '#b51b1bff'; 
    }
});


const drawBtn = document.getElementById('drawBtn');
const drawingCanvas = document.getElementById('drawingCanvas');

let isDrawing = false;

drawBtn.addEventListener('click', function() {
    isDrawing = !isDrawing;

    if (isDrawing) {
        drawBtn.classList.add('drawing');
        drawBtn.textContent = 'Остановить рисование';
        drawingCanvas.style.cursor = 'crosshair';
    } else {
        drawBtn.classList.remove('drawing');
        drawBtn.textContent = 'Начать рисование';
        drawingCanvas.style.cursor = 'default';
    }
});

drawingCanvas.addEventListener('mousemove', function(e) {
    if (!isDrawing) return;
    
    const dot = document.createElement('div');
    dot.className = 'dot';
    
    const rect = drawingCanvas.getBoundingClientRect();
    dot.style.left = (e.clientX - rect.left - 5) + 'px';
    dot.style.top = (e.clientY - rect.top - 5) + 'px';

    const colors = ['#ff6b6b', '#6b8cff', '#6bff8c', '#ffd86b', '#c66bff'];
    dot.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

    drawingCanvas.appendChild(dot);
    drawingCanvas.style.cursor = 'url("cursor.cur") 0 20, crosshair';

    setTimeout(() => {
        if (dot.parentNode === drawingCanvas) {
            dot.remove();
        }
    }, 2000);
});


