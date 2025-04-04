const track = document.getElementById('carouselTrack');
    const items = document.querySelectorAll('.carousel-item');
    const dotsContainer = document.getElementById('dots');
    const totalItems = items.length;
    let itemWidth = items[0].offsetWidth;

    let currentIndex = 0;
    let isDragging = false;
    let startX = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    function createDots() {
      for (let i = 0; i < totalItems - 2; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => {
          currentIndex = i;
          updateCarousel();
        });
        dotsContainer.appendChild(dot);
      }
    }

    function updateDots() {
      document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));
      if (dotsContainer.children[currentIndex]) {
        dotsContainer.children[currentIndex].classList.add('active');
      }
    }

    function updateCarousel() {
      itemWidth = items[0].offsetWidth;
      if (currentIndex >= totalItems - 2) {
        currentIndex = 0;
      }
      currentTranslate = currentIndex * -itemWidth;
      track.style.transform = `translateX(${currentTranslate}px)`;
      updateDots();
    }

    function autoScroll() {
      currentIndex = (currentIndex + 1) % (totalItems - 2);
      updateCarousel();
    }

    let autoScrollInterval = setInterval(autoScroll, 3000);
    function resetAutoScroll() {
      clearInterval(autoScrollInterval);
      autoScrollInterval = setInterval(autoScroll, 3000);
    }

    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX;
      prevTranslate = currentTranslate;
      clearInterval(autoScrollInterval);
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const movedBy = currentTranslate - prevTranslate;
      if (movedBy < -itemWidth / 3 && currentIndex < totalItems - 3) {
        currentIndex++;
      } else if (movedBy > itemWidth / 3 && currentIndex > 0) {
        currentIndex--;
      }
      updateCarousel();
      resetAutoScroll();
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const moved = e.pageX - startX;
      currentTranslate = prevTranslate + moved;
      track.style.transform = `translateX(${currentTranslate}px)`;
    });

    window.addEventListener('resize', () => {
      itemWidth = items[0].offsetWidth;
      updateCarousel();
    });

    createDots();
    updateCarousel();

