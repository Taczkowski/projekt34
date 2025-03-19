document.addEventListener('DOMContentLoaded', function() {
    const themeSwitcherToggle = document.getElementById('themeSwitcherToggle');
    const slider = document.getElementById('slider');
    const body = document.body;

    const themes = ['day', 'midnight', 'night'];
    const themeIcons = {
        day: 'day.png',
        midnight: 'midnight.png',
        night: 'night.png'
    };

    let currentThemeIndex = 0;

    // Ustaw początkowy motyw i ikonę
    updateTheme();

    // Obsługa kliknięcia
    themeSwitcherToggle.addEventListener('click', function() {
        currentThemeIndex = (currentThemeIndex + 1) % themes.length;
        updateTheme();
    });

    function updateTheme() {
        const theme = themes[currentThemeIndex];
        body.setAttribute('data-theme', theme);
        updateSliderIcon(theme);
        updateSliderPosition(currentThemeIndex);
    }

    function updateSliderIcon(theme) {
        const icon = slider.querySelector('.theme-icon');
        icon.src = themeIcons[theme];
        icon.alt = theme.charAt(0).toUpperCase() + theme.slice(1);
    }

    function updateSliderPosition(index) {
        const toggleHeight = themeSwitcherToggle.offsetHeight;
        const sectionHeight = toggleHeight / themes.length;
        slider.style.top = `${index * sectionHeight}px`;
    }
});
// script.js
themeSwitcherToggle.addEventListener('click', function() {
    body.classList.add('theme-changing');
    slider.classList.add('slider-jump');
    
    currentThemeIndex = (currentThemeIndex + 1) % themes.length;
    
    setTimeout(() => {
        updateSliderPosition(currentThemeIndex);
        updateSliderIcon(themes[currentThemeIndex]);
        body.setAttribute('data-theme', themes[currentThemeIndex]);
    }, 200);

    setTimeout(() => {
        body.classList.remove('theme-changing');
        slider.classList.remove('slider-jump');
    }, 600);
});