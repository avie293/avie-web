document.addEventListener('DOMContentLoaded', () => {
    // --- THEME SWITCHER LOGIK ---
    const toggleBtn = document.getElementById('themeToggleBtn');
    const dropdown = document.getElementById('themeDropdown');
    const themeButtons = dropdown.querySelectorAll('button');

    if (toggleBtn && dropdown) {
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
    }

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

        if (dropdown) dropdown.classList.remove('show');
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


    // --- GLOBAL SUPABASE LIKE & UNLIKE SYSTEM ---
    const likeBtn = document.getElementById('likeBtn');
    const likeCountSpan = document.getElementById('likeCount');
    
    const SUPABASE_URL = 'https://hqlotttvwufmtdfmhgzc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbG90dHR2d3VmbXRkZm1oZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjEyMjQsImV4cCI6MjEwMzY5NzIyNH0.8SZxHF7kgsLYD2Zj92oN4GVXc5n-L-kFH6Way1uvYEE';

    // 1. Likes aus Supabase laden
    async function fetchLikes() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/likes?id=eq.profile&select=count`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                const count = data[0].count;
                if (likeCountSpan) likeCountSpan.innerText = count;
                return count;
            }
        } catch (error) {
            console.error('Fehler beim Laden der Likes:', error);
        }
        return 0;
    }

    fetchLikes();

    // Lokalen Status prüfen (ob dieser Browser schon geliked hat)
    const hasLiked = localStorage.getItem('hasLiked') === 'true';
    if (hasLiked && likeBtn) {
        likeBtn.classList.add('liked');
    }

    // 2. Klick-Event für Liken / Unliken
    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            const alreadyLiked = localStorage.getItem('hasLiked') === 'true';
            
            let currentCount = await fetchLikes();
            let newCount = alreadyLiked ? Math.max(0, currentCount - 1) : currentCount + 1;

            try {
                const response = await fetch(`${SUPABASE_URL}/rest/v1/likes?id=eq.profile`, {
                    method: 'PATCH',
                    headers: {
                        'apikey': SUPABASE_ANON_KEY,
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({ count: newCount })
                });

                if (response.ok) {
                    if (likeCountSpan) likeCountSpan.innerText = newCount;

                    if (alreadyLiked) {
                        localStorage.removeItem('hasLiked');
                        likeBtn.classList.remove('liked'); // Wechselt zu grau / nicht ausgefüllt
                    } else {
                        localStorage.setItem('hasLiked', 'true');
                        likeBtn.classList.add('liked'); // Wechselt zu pink / ausgefüllt
                    }
                }
            }
            catch (error) {
                console.error('Fehler beim Speichern des Likes:', error);
            }
        });
    }
});
