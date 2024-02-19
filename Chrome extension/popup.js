document.addEventListener('DOMContentLoaded', function () {
    // Знаходимо елемент кнопки за його класом
    var button = document.querySelector('.btn-primary');

    // Додаємо обробник події для кліку на кнопці
    button.addEventListener('click', function () {
        // Викликаємо функцію для відкриття нової сторінки
        openNewPage();
    });

    // Функція для відкриття нової сторінки
    function openNewPage() {
        // Відкриваємо нове вікно браузера з новою сторінкою
        window.open('./index.html', '_blank');
    }
});