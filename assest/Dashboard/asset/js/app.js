const cardsContainer = document.querySelector('.cards');
const prevArrow = document.getElementById('prevArrow');
const nextArrow = document.getElementById('nextArrow');
let currentIndex = 0;

function updateSlidePosition() {
    const cardWidth = cardsContainer.clientWidth / 5; 
    cardsContainer.style.transform = 'translateX(-' + currentIndex * cardWidth + 'px)';
}

if (window.location.pathname =='/assest/dashboard/index.html') {
    nextArrow.addEventListener('click', () => {
        if (currentIndex < cardsContainer.children.length - 2) {
            currentIndex++;
            updateSlidePosition();
        }
    });
    
    prevArrow.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateSlidePosition();
        }
    });   
}

function toggleActive(button) {
    const buttons = document.querySelectorAll('.btn-2');
    buttons.forEach(btn => {
        btn.classList.remove('btn');
    });
    button.classList.toggle('btn-2-active');
}








