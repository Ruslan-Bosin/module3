const text = "НАЧНЁМ?";
let index = 0;
let planetarium;

document.addEventListener('DOMContentLoaded', () => {
    createStars();
    initTitleAnimation();
    initPlanets();
    initPlanetariumLink();
    const victoryScreen = document.querySelector('.victory-screen');
    const container = document.querySelector('.container');
    planetarium = document.querySelector('.planetarium');
    const hiddenCardScreen = document.querySelector('.hidden-card-screen');
    const secondCardScreen = document.querySelector('.second-card-screen');
    const typewriterElement = document.querySelector('.typewriter');
    const inputTextElement = document.querySelector('.input-text');
    const mobileInput = document.querySelector('.mobile-input');
    
    [victoryScreen, hiddenCardScreen, secondCardScreen, planetarium].forEach(screen => screen.classList.add('hidden'));
    container.classList.remove('hidden');

    typewriterElement.style.display = 'block';
    inputTextElement.style.display = 'block';
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) {
        inputTextElement.style.display = 'none';
    }
    
    typeWriter();
    
    initTyping();
    initTimeoutMessage();
    initParallax();
    initCursorEffect();
    initEyeMovement();
    initCardGame();
    initHiddenCardGame();
    initCardEffect();
});

function initPlanets() {
    const planet1 = document.querySelector('.planet-1');
    const planet2 = document.querySelector('.planet-2');
    const planet3 = document.querySelector('.planet-3');
    const secondPage = document.querySelector('.second-page');
    const hiddenCardScreen = document.querySelector('.hidden-card-screen');
    const secondCardScreen = document.querySelector('.second-card-screen');
    const planetarium = document.querySelector('.planetarium');
    
    planet1.addEventListener('click', () => {
        planetarium.classList.add('hidden');
        secondPage.classList.remove('hidden');
    });
    
    planet2.addEventListener('click', () => {
        planetarium.classList.add('hidden');
        hiddenCardScreen.classList.remove('hidden');
    });
    
    planet3.addEventListener('click', () => {
        planetarium.classList.add('hidden');
        secondCardScreen.classList.remove('hidden');
    });
}

function initCardGame() {
    const cards = document.querySelectorAll('.memory-card');
    const cardScreen = document.querySelector('.second-card-screen');
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let matchedPairs = 0;
    let collectedCards = 0;

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.dataset.card === secondCard.dataset.card;

        if (isMatch) {
            matchedPairs++;
            disableCards();
            if (matchedPairs === 5) {
                collectedCards++;
                const bottomCards = document.querySelectorAll('.second-card-screen .bottom-cards .card');
                if (collectedCards <= bottomCards.length) {
                    const cardToActivate = bottomCards[collectedCards - 1];
                    cardToActivate.innerHTML = '<img src="./images/latishev.png" alt="Card">';
                    cardToActivate.classList.add('active');
                }
                
                setTimeout(() => {
                    cardScreen.classList.add('hidden');
                    planetarium.classList.remove('hidden');
                    resetBoard();
                    matchedPairs = 0;
                    cards.forEach(card => {
                        card.classList.remove('flipped');
                        card.addEventListener('click', flipCard);
                    });
                }, 1000);
            }
        } else {
            unflipCards();
        }
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetBoard();
    }

    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1500);
    }

    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    cards.forEach(card => card.addEventListener('click', flipCard));
}

function initHiddenCardGame() {
    const hiddenCardScreen = document.querySelector('.hidden-card-screen');
    const centerCard = document.querySelector('.center-card');
    let gameCompleted = false;
    
    let memoryGameCompleted = false;
    const memoryGameCards = document.querySelectorAll('.second-card-screen .bottom-cards .card');
    
    const scatteredCardsContainer = document.querySelector('.scattered-cards-container');
    for (let i = 0; i < 17; i++) {
        const card = document.createElement('div');
        card.className = 'scattered-card';
        
        let randomX, randomY;
        if (i < 3) {
            randomX = window.innerWidth / 2 - 115 + (Math.random() * 100 - 50);
            randomY = window.innerHeight / 2 - 163 + (Math.random() * 100 - 50);
        } else {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
            const angle = Math.random() * Math.PI * 2;
            const distance = (Math.random() * 0.6 + 0.4) * radius;
            
            randomX = centerX + Math.cos(angle) * distance - 115;
            randomY = centerY + Math.sin(angle) * distance - 163;
        }
        
        const img = document.createElement('img');
        img.src = './images/backsidecard.png';
        img.alt = 'Card back';
        img.style.width = '100%';
        img.style.height = '100%';
        img.draggable = false;
        card.appendChild(img);

        const randomRotation = Math.random() * 360;
        
        card.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotation}deg)`;
        card.style.position = 'absolute';
        
        scatteredCardsContainer.appendChild(card);
        makeDraggable(card);
    }
    
    centerCard.addEventListener('click', () => {
        centerCard.classList.add('flipped');
        
        gameCompleted = true;
        
        const bottomCards = document.querySelectorAll('.hidden-card-screen .bottom-cards .card');
        if (bottomCards[1]) {
            bottomCards[1].classList.add('active');
            bottomCards[1].innerHTML = '<img src="./images/kamella.png" alt="Card 2">';
        }
        
        setTimeout(() => {
            // Check if memory game is also completed
            memoryGameCompleted = memoryGameCards[1]?.classList.contains('active') || false;
            
            if (checkAllGamesCompleted() && memoryGameCompleted) {
                const victoryScreen = document.querySelector('.victory-screen');
                hiddenCardScreen.classList.add('hidden');
                victoryScreen.classList.remove('hidden');
            } else {
                hiddenCardScreen.classList.add('hidden');
                planetarium.classList.remove('hidden');
            }
        }, 3000);
    });
    
    return {
        isCompleted: () => gameCompleted
    };
}

function checkAllGamesCompleted() {
    const memoryGame = document.querySelector('.second-card-screen .bottom-cards .card:nth-child(2)');
    const hiddenGame = document.querySelector('.hidden-card-screen .bottom-cards .card:nth-child(2)');
    const firstGame = document.querySelector('.second-page .bottom-cards .card:nth-child(1)').classList.contains('active');
    victoryScreen.classList.remove('hidden');
    
    return hiddenGame?.classList.contains('active') && firstGame;
}

function makeDraggable(element) {
    let isDragging = false;
    let startX;
    let startY;
    let startTransform;
    let currentX = 0;
    let currentY = 0;
    let currentRotation;

    function getInitialTransform() {
        const transform = element.style.transform;
        const rotateMatch = transform.match(/rotate\(([^)]+)\)/);
        currentRotation = rotateMatch ? rotateMatch[0] : '';
        
        const translate = transform.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
        if (translate) {
            currentX = parseFloat(translate[1]);
            currentY = parseFloat(translate[2]);
        }
    }

    function dragStart(e) {
        if (e.target === element || e.target.parentElement === element) {
            isDragging = true;
            startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
            startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
            startTransform = element.style.transform;
            element.style.zIndex = '1000';
            element.style.cursor = 'grabbing';
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            
            const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
            const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            currentX += deltaX;
            currentY += deltaY;
            
            element.style.transform = `translate(${currentX}px, ${currentY}px) ${currentRotation}`;
            
            startX = clientX;
            startY = clientY;
        }
    }

    function dragEnd(e) {
        isDragging = false;
        element.style.zIndex = '';
        element.style.cursor = 'move';
    }

    getInitialTransform();
    element.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);
    element.addEventListener('touchstart', dragStart);
    document.addEventListener('touchmove', drag);
    document.addEventListener('touchend', dragEnd);
}

function transitionToPage(from, to) {
    const overlay = document.querySelector('.transition-overlay');
    if (!overlay) {
        if (from) from.classList.add('hidden');
        if (to) to.classList.remove('hidden');
        return;
    }
    
    overlay.classList.add('active');
    
    if (from) from.classList.add('hidden');
    
    setTimeout(() => {
        to.classList.remove('hidden');
        overlay.classList.remove('active');
    }, 1000);
}

function initEyeMovement() {
    const eye = document.querySelector('.eye-inner');
    const eyeContainer = document.querySelector('.eye');
    
    document.addEventListener('mousemove', (e) => {
        const eyeRect = eyeContainer.getBoundingClientRect();
        const eyeCenterX = eyeRect.left + eyeRect.width / 2;
        const eyeCenterY = eyeRect.top + eyeRect.height / 2;
        
        const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
        const distance = Math.min(10, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        eye.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
}

function initCursorEffect() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            card.style.setProperty('--x', x);
            card.style.setProperty('--y', y);
        });
    });
}

function initPlanetariumLink() {
    const planetariumLink = document.querySelector('.planetarium-link');
    const hintText = document.querySelector('.hint-text');
    let hasClicked = false;
    let hintTimeout;
    
    hintTimeout = setTimeout(() => {
        if (!hasClicked) {
            hintText.classList.add('visible');
        }
    }, 15000);
    
    planetariumLink.addEventListener('click', () => {
        hasClicked = true;
        hintText.classList.add('visible');
        clearTimeout(hintTimeout);
    
        const secondPage = document.querySelector('.second-page');
        const planetarium = document.querySelector('.planetarium');
        transitionToPage(secondPage, planetarium);
    });
}

function initCardEffect() {
    const card = document.querySelector('.card-wrapper');
    const container = document.querySelector('.right-content');

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY = ((x - centerX) / centerX) * 30;
        const rotateX = -((y - centerY) / centerY) * 30;

        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    container.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0) rotateY(0)';
    });
}

function initTitleAnimation() {
    const titles = ['МЕЖВСЕЛЕНСКИЙ', 'КОЛЛЕКЦИОННЫЙ', 'ФЕСТИВАЛЬ'];
    const titleElement = document.querySelector('.title');
    const secondPage = document.querySelector('.second-page');
    let currentIndex = 0;
    let isFirstTitle = true;

    function updateTitle() {
        currentIndex = (currentIndex + 1) % titles.length;
        titleElement.textContent = titles[currentIndex];
    }

    titleElement.textContent = titles[currentIndex];
    setInterval(updateTitle, 1000);

    const cornerSpheres = document.querySelectorAll('.corner-sphere');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const isHidden = secondPage.classList.contains('hidden');
                cornerSpheres.forEach(sphere => {
                    sphere.style.opacity = isHidden ? '0' : '1';
                });
            }
        });
    });

    observer.observe(secondPage, { attributes: true });

    cornerSpheres.forEach(sphere => {
        sphere.style.opacity = secondPage.classList.contains('hidden') ? '0' : '1';
    });
}

function initTimeoutMessage() {
    const timeoutMessage = document.querySelector('.timeout-message');
    timeoutMessage.textContent = 'НАПЕЧАТАЙТЕ ВАШ ОТВЕТ';
    const secondPage = document.querySelector('.second-page');
    
    let timeoutId;
    
    function showMessage() {
        if (!secondPage.classList.contains('hidden')) {
            timeoutMessage.style.opacity = '0';
        } else {
            timeoutMessage.style.opacity = '1';
        }
    }
    
    function resetTimeout() {
        timeoutMessage.style.opacity = '0';
        clearTimeout(timeoutId);
        timeoutId = setTimeout(showMessage, 10000);
    }
    
    document.addEventListener('keypress', resetTimeout);
    resetTimeout();
}

function initTyping() {
    let inputText = '';
    const inputDisplay = document.querySelector('.input-text');
    const mobileInput = document.querySelector('.mobile-input');
    
    function handleKeyInput(e) {
        const key = e.key.toUpperCase();
        
        if (key === 'Д' && inputText === '') {
            inputText += key;
            inputDisplay.textContent = inputText;
        } else if (key === 'А' && inputText === 'Д') {
            inputText += key;
            inputDisplay.textContent = inputText;
            
            setTimeout(() => {
                document.body.style.transition = 'opacity 1s';
                document.body.style.opacity = '0';
                const firstPage = document.querySelector('.container');
                const secondPage = document.querySelector('.second-page');
                
                setTimeout(() => {
                    document.querySelector('.typewriter').style.display = 'none';
                    document.querySelector('.input-text').style.display = 'none';
                    document.querySelector('.mobile-input').style.display = 'none';
                    transitionToPage(firstPage, secondPage);
                    document.body.style.opacity = '1';
                }, 1000);
            }, 1000);
        }
    }
    
    document.addEventListener('keypress', handleKeyInput);
    mobileInput.addEventListener('input', (e) => {
        const lastChar = e.target.value.slice(-1).toUpperCase();
        const event = new KeyboardEvent('keypress', { key: lastChar });
        handleKeyInput(event);
        e.target.value = '';  // Clear the input after processing
    });
}

function createStars() {
    const starsContainer = document.querySelector('.stars');
    const planetariumStars = document.createElement('div');
    const hiddenScreenStars = document.createElement('div');
    const victoryScreenStars = document.createElement('div');
    
    planetariumStars.className = 'stars';
    hiddenScreenStars.className = 'stars';
    victoryScreenStars.className = 'stars';
    
    document.querySelector('.planetarium').appendChild(planetariumStars);
    document.querySelector('.hidden-card-screen').appendChild(hiddenScreenStars);
    document.querySelector('.victory-screen').appendChild(victoryScreenStars);
    
    [starsContainer, planetariumStars, hiddenScreenStars, victoryScreenStars].forEach(container => {
        const numStars = 40;
    
        for (let i = 0; i < numStars; i++) {
            const star = document.createElement('img');
            star.src = './images/Star 8.svg';
            star.className = 'star';
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;
            container.appendChild(star);
        }
    });
}

function typeWriter() {
    const element = document.querySelector('.typewriter');
    if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, 150);
    }
}

function initParallax() {
    document.addEventListener('mousemove', (e) => {
        const stars = document.querySelectorAll('.star');
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        stars.forEach(star => {
            const rect = star.getBoundingClientRect();
            const starX = rect.left + rect.width / 2;
            const starY = rect.top + rect.height / 2;
            const distanceFromCenter = Math.sqrt(
                Math.pow(starX - centerX, 2) + 
                Math.pow(starY - centerY, 2)
            );
            
            const speed = (distanceFromCenter / Math.max(window.innerWidth, window.innerHeight)) * 50;
            const x = (mouseX * speed) / 100;
            const y = (mouseY * speed) / 100;
            star.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}