document.addEventListener('DOMContentLoaded', () => {
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


    const likeBtn = document.getElementById('likeBtn');
    const likeCountSpan = document.getElementById('likeCount');
    const timeAgoSpan = document.getElementById('timeAgo');    
    const SUPABASE_URL = 'https://hqlotttvwufmtdfmhgzc.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxbG90dHR2d3VmbXRkZm1oZ3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxMjEyMjQsImV4cCI6MjEwMzY5NzIyNH0.8SZxHF7kgsLYD2Zj92oN4GVXc5n-L-kFH6Way1uvYEE';

    function formatTimeAgo(dateString) {
        if (!dateString) return 'Long time ago';
        const creationDate = new Date(dateString);
        const now = new Date();
        const diffTime = now - creationDate;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 30) return `${diffDays} days ago`;
        if (diffMonths < 12) return diffMonths === 1 ? '1 month ago' : `${diffMonths} months ago`;
        return diffYears === 1 ? '1 year ago' : `${diffYears} years ago`;
    }

    async function fetchProfileData() {
        try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/likes?id=eq.profile&select=count,created_at`, {
                headers: {
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                }
            });
            const data = await response.json();
            if (data && data.length > 0) {
                const count = data[0].count;
                const createdAt = data[0].created_at;

                if (likeCountSpan) likeCountSpan.innerText = count;

                if (timeAgoSpan && createdAt) {
                    timeAgoSpan.innerText = formatTimeAgo(createdAt);
                }

                return count;
            }
        } catch (error) {
            console.error('ERROR while loading profile data:', error);
        }
        return 0;
    }

    fetchProfileData();

    setInterval(() => {
        fetchProfileData();
    }, 10000);

    const hasLiked = localStorage.getItem('hasLiked') === 'true';
    if (hasLiked && likeBtn) {
        likeBtn.classList.add('liked');
    }

    if (likeBtn) {
        likeBtn.addEventListener('click', async () => {
            const alreadyLiked = localStorage.getItem('hasLiked') === 'true';
            const responseCheck = await fetch(`${SUPABASE_URL}/rest/v1/likes?id=eq.profile&select=count`, {
                headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` }
            });
            const checkData = await responseCheck.json();
            let currentCount = checkData[0] ? checkData[0].count : 0;
            
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
                        likeBtn.classList.remove('liked');
                    } else {
                        localStorage.setItem('hasLiked', 'true');
                        likeBtn.classList.add('liked');
                    }
                }
            }
            catch (error) {
                console.error('ERROR while lining:', error);
            }
        });
    }
});
