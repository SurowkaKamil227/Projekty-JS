const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
const dots = document.querySelectorAll('.dot');
const pauseButton = document.getElementById('pause');
const resumeButton = document.getElementById('resume');

let currentIndex = 0;
let interval;
const slideInterval = 3000;

function goToSlide(index) {
    slider.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach(dot => dot.classList.remove('active'));
    dots[index].classList.add('active');
    currentIndex = index;
}

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
}

function startSlider() {
    interval = setInterval(nextSlide, slideInterval);
}

function pauseSlider() {
    clearInterval(interval);
}

prevButton.addEventListener('click', prevSlide);
nextButton.addEventListener('click', nextSlide);
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => goToSlide(index));
});
pauseButton.addEventListener('click', pauseSlider);
resumeButton.addEventListener('click', startSlider);

goToSlide(currentIndex);
startSlider();
