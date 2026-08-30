document.addEventListener('DOMContentLoaded', () => {
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


    const likeBtn = document.getElementById('likeBtn');
    const likeCountSpan = document.getElementById('likeCount');
    const namespace = 'avie29-socials-page-2026';
    const key = 'likes';

    fetch(`https://api.counterapi.dev/v1/${namespace}/${key}/`)
        .then(response => {
            if (!response.ok) throw new Error('API nicht erreichbar');
            return response.json();
        })
        .then(data => {
            if (likeCountSpan) likeCountSpan.innerText = data.count;
        })
        .catch(() => {
            if (likeCountSpan) likeCountSpan.innerText = '14';
        });

    const hasLiked = localStorage.getItem('hasLiked') === 'true';
    if (hasLiked && likeBtn) {
        likeBtn.classList.add('liked');
    }

    if (likeBtn) {
        likeBtn.addEventListener('click', () => {
            const alreadyLiked = localStorage.getItem('hasLiked') === 'true';
            const action = alreadyLiked ? 'down' : 'up';
            const endpoint = `https://api.counterapi.dev/v1/${namespace}/${key}/${action}`;

            fetch(endpoint)
                .then(response => response.json())
                .then(data => {
                    if (likeCountSpan) likeCountSpan.innerText = data.count;
                    
                    if (alreadyLiked) {
                        localStorage.removeItem('hasLiked');
                        likeBtn.classList.remove('liked');
                    } else {
                        localStorage.setItem('hasLiked', 'true');
                        likeBtn.classList.add('liked');
                    }
                })
                .catch(error => {
                    console.error('Fehler beim Aktualisieren des Likes:', error);
                });
        });
    }
});
