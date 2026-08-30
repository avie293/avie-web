document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER LOGIK ---
    const toggleBtn = document.getElementById('themeToggleBtn');
    const dropdown = document.getElementById('themeDropdown');
    const themeButtons = dropdown.querySelectorAll('button');

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('show');
    });

    document.addEventListener('click', () => {
        dropdown.classList.remove('show');
    });

    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    function applyTheme(theme) {
        if (theme === 'system') {
            localStorage.removeItem('theme');
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', systemPrefersDark ? 'dark' : 'light');
        } else {
            localStorage.setItem('theme', theme);
            document.documentElement.setAttribute('data-theme', theme);
        }

        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        dropdown.classList.remove('show');
    }

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme('system');
    }

    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedTheme = btn.getAttribute('data-theme');
            applyTheme(selectedTheme);
        });
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (!localStorage.getItem('theme')) {
            applyTheme('system');
        }
    });


    // --- LIKE SYSTEM LOGIK (Stabil & Lokal) ---
    const likeBtn = document.getElementById('likeBtn');
    const likeCountSpan = document.getElementById('likeCount');
    
    // Startwert der Likes (wird im Browser gespeichert)
    let currentLikes = parseInt(localStorage.getItem('profileLikes')) || 14; 
    if (likeCountSpan) likeCountSpan.innerText = currentLikes;

    // Prüfen, ob der User auf diesem Gerät schon mal geliked hat
    const hasLiked = localStorage.getItem('hasLiked') === 'true';
    if (hasLiked && likeBtn) {
        likeBtn.classList.add('liked');
    }

    // Klick-Event für das Herz (mit Umschalt-Funktion zum Entliken)
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            if (localStorage.getItem('hasLiked') === 'true') {
                currentLikes = Math.max(0, currentLikes - 1);
                localStorage.setItem('profileLikes', currentLikes);
                localStorage.removeItem('hasLiked');
                likeBtn.classList.remove('liked');
            } else {
                currentLikes += 1;
                localStorage.setItem('profileLikes', currentLikes);
                localStorage.setItem('hasLiked', 'true');
                likeBtn.classList.add('liked');
            }
            if (likeCountSpan) likeCountSpan.innerText = currentLikes;
        });
    }
});
