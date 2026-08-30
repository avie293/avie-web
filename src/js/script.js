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


    // --- LIKE SYSTEM LOGIK ---
    const likeBtn = document.getElementById('likeBtn');
    const likeCountSpan = document.getElementById('likeCount');
    
    // Einzigartiger Name für deinen Zähler in der Cloud
    const namespace = 'avie29-social-likes'; 
    const key = 'likes';

    // 1. Like-Stand beim Laden abrufen
    fetch(`https://api.countapi.xyz/get/${namespace}/${key}`)
        .then(response => response.json())
        .then(data => {
            if (likeCountSpan) likeCountSpan.innerText = data.value;
        })
        .catch(() => {
            if (likeCountSpan) likeCountSpan.innerText = '0';
        });

    // Prüfen, ob der User auf diesem Gerät schon mal geliked hat
    if (localStorage.getItem('hasLiked') === 'true' && likeBtn) {
        likeBtn.classList.add('liked');
    }

    // 2. Klick-Event für das Herz
    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            if (localStorage.getItem('hasLiked') === 'true') {
                return; // Verhindert Spam vom selben Browser
            }

            // Zähler in der Cloud um 1 erhöhen
            fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
                .then(response => response.json())
                .then(data => {
                    if (likeCountSpan) likeCountSpan.innerText = data.value;
                    likeBtn.classList.add('liked');
                    localStorage.setItem('hasLiked', 'true');
                })
                .catch(error => {
                    console.error('Fehler beim Speichern des Likes', error);
                });
        });
    }
});
