//функция-конструктор Accumulator
function Accumulator(startingValue) {
    this.value = startingValue;//текущее значение накопленной суммы
    this.history = [];//массив для хранения истории операций
    
    this.read = function() {//метод для чтения ввода пользователя
        const input = prompt('Введите стоимость товара (можно отрицательную для возврата):');//запрос ввода от пользователя
        
        if (input === null) {//проверка на отмену ввода
            return null;//возврат null при отмене
        }
        
        const number = parseFloat(input);//преобразование строки в число
        
        if (isNaN(number)) {//проверка на корректность числа
            throw new Error('Введите корректное число!');//ошибка при некорректном вводе
        }
        
        this.value += number;//добавление числа к текущему значению
        this.addToHistory(number);//добавление операции в историю
        return number;//возврат введенного числа
    };
    
    this.addToHistory = function(number) {//метод добавления записи в историю
        this.history.push({//добавление объекта в массив истории
            amount: number,//сумма операции
            timestamp: new Date(),//временная метка операции
            totalAfter: this.value//общая сумма после операции
        });
    };
    
    this.reset = function() {//метод сброса накопленной суммы
        this.value = 0;//обнуление текущего значения
        this.history = [];//очистка массива истории
    };
    
    this.getHistory = function() {//метод получения истории операций
        return this.history.slice().reverse();//возвращаем в обратном порядке
    };
}

//объект корзины 
const cart = {
    accumulator: new Accumulator(0),//создание экземпляра Accumulator
    
    init: function() {//метод инициализации корзины
        this.updateDisplay();//обновление отображения на странице
    },
    
    addItem: function() {//метод добавления товара в корзину
        const addedValue = this.accumulator.read();//чтение ввода пользователя
            
            if (addedValue !== null) {//проверка что ввод не отменен
                this.updateDisplay();//обновление отображения
                this.showStatus(`Добавлено: ${addedValue} ₽`, 'success');//статус успешного добавления
            }
    },
    
    reset: function() {//метод сброса корзины
        this.accumulator.reset();//вызов метода reset аккумулятора
        this.updateDisplay();//обновление отображения
        this.hideHistory();//скрытие истории операций
        this.showStatus('Корзина очищена', 'success');//статус сброса
    },
    
    updateDisplay: function() {//метод обновления отображения суммы
        document.getElementById('total').textContent = this.accumulator.value.toFixed(2);//установка текста элемента с округлением до сотыхЫ
    },
    
    showStatus: function(message, type) {//метод показа статусных сообщений
        const statusEl = document.getElementById('status');//получение элемента статуса
        statusEl.textContent = message;//установка текста сообщения
        statusEl.className = `status ${type}`;//установка CSS классов
        statusEl.style.display = 'block';//показ элемента
        
        setTimeout(() => {//автоматическое скрытие через 3 секунды
            statusEl.style.display = 'none';//скрытие элемента
        }, 3000);
    },
    
    toggleHistory: function() {//метод переключения видимости истории
        const historyEl = document.getElementById('history');//получение элемента истории
        const isVisible = historyEl.style.display !== 'none';//проверка текущей видимости
        
        if (isVisible) {//если видно - скрыть
            this.hideHistory();//вызов метода скрытия
        } else {//если скрыто - показать
            this.showHistory();//вызов метода показа
        }
    },
    
    showHistory: function() {//метод показа истории операций
        const historyEl = document.getElementById('history');//получение элементов DOM
        const historyList = document.getElementById('historyList');
        
        const history = this.accumulator.getHistory();//получение истории операций
        historyList.innerHTML = '';//очистка списка истории
        
        if (history.length === 0) {//проверка на пустую историю
            historyList.innerHTML = '<div class="history-item">История пуста</div>';//сообщение о пустой истории
        } else {//если есть операции
            history.forEach(item => {//создание элементов для каждой операции
                const itemEl = document.createElement('div');//создание элемента
                itemEl.className = 'history-item';//установка класса
                
                const sign = item.amount >= 0 ? '+' : '';//определение знака для отображения
                const amountClass = item.amount >= 0 ? 'positive' : 'negative';//CSS класс в зависимости от знака
                
                itemEl.innerHTML = `
                    <span class="${amountClass}">${sign}${item.amount.toFixed(2)} ₽</span>
                        ${item.timestamp.toLocaleTimeString()}
                        Итого: ${item.totalAfter.toFixed(2)} ₽
                `;
                
                historyList.appendChild(itemEl);//добавление элемента в список
            });
        }
        
        historyEl.style.display = 'block';//делаем историю видимой
    },
    
    hideHistory: function() {//метод скрытия истории операций
        document.getElementById('history').style.display = 'none';//делаем историю невидимой
    }
};

//инициализация корзины при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {//обработчик загрузки старт при полной загрузке страницы
    cart.init();//вызов метода инициализации корзины
});

function truncate(str, maxlength) {
            return str.length <= maxlength ? str : str.slice(0, maxlength - 1) + "…";
        }

        //применяем ко всем элементам с классом truncate-text
        document.addEventListener('DOMContentLoaded', function() {//работает только после загрузки всего HTML
            const textElements = document.querySelectorAll('.truncate-text');//для всех элементов этого класса
            for (let i = 0; i < textElements.length; i++) {
            let element = textElements[i];//получаем элемент по индексу
            element.textContent = truncate(element.textContent, 75);//обрезаем текст
        }
        });