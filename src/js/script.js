async function fetchDiscordWidgetHtml() {
        const discordHeading = `
            <div class="mt-6 mb-2 flex items-center gap-2">
                <svg class="w-4 h-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <h3 class="text-sm font-bold text-white uppercase tracking-wider">Discord</h3>
            </div>
        `;

        try {
            const res = await fetch('https://discord.com/api/guilds/1525996949554073640/widget.json');
            if (!res.ok) throw new Error('Failed to fetch Discord widget');
            const data = await res.json();
            
            const serverName = escapeHtml(data.name || 'Discord Server');
            const onlineCount = data.presence_count || 0;
            const inviteUrl = data.instant_invite || 'https://discord.gg/1525996949554073640';
            const members = data.members || [];

            let membersHtml = '';
            if (members.length === 0) {
                membersHtml = '<p class="text-xs text-gray-400 italic py-1">No members online right now.</p>';
            } else {
                membersHtml = members.slice(0, 10).map(m => {
                    const statusColor = m.status === 'online' ? 'bg-green-500' : m.status === 'idle' ? 'bg-yellow-500' : m.status === 'dnd' ? 'bg-red-500' : 'bg-gray-500';
                    const activity = m.game ? `<span class="text-[11px] text-gray-400 truncate block">Playing ${escapeHtml(m.game.name)}</span>` : '';
                    return `
                        <div class="flex items-center gap-2.5 py-1.5 px-2 rounded-xl bg-white/5 hover:bg-white/10 transition">
                            <div class="relative shrink-0">
                                <img src="${escapeHtml(m.avatar_url)}" alt="${escapeHtml(m.username)}" class="w-8 h-8 rounded-full object-cover border border-white/20">
                                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ${statusColor} border border-black/50"></span>
                            </div>
                            <div class="overflow-hidden flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-white truncate">${escapeHtml(m.username)}</h4>
                                ${activity}
                            </div>
                        </div>
                    `;
                }).join('');
            }

            return discordHeading + `
                <div class="w-full bg-white/5 p-3.5 rounded-xl border border-white/10 shadow-lg overflow-hidden">
                    <div class="flex justify-between items-center mb-3">
                        <div class="min-w-0 mr-2">
                            <h3 class="text-sm font-bold text-white flex items-center gap-1.5 truncate">
                                <i data-lucide="message-square" class="w-4 h-4 text-indigo-400 shrink-0"></i> <span class="truncate">${serverName}</span>
                            </h3>
                            <p class="text-xs text-gray-400 mt-0.5"><span class="w-2 h-2 inline-block rounded-full bg-green-500 mr-1 animate-pulse"></span> ${onlineCount} Members Online</p>
                        </div>
                        <a href="${inviteUrl}" target="_blank" rel="noopener noreferrer" class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition shadow shrink-0">
                            Join
                        </a>
                    </div>
                    <div class="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        ${membersHtml}
                    </div>
                </div>
            `;
        } catch (e) {
            console.error("Error loading custom discord widget:", e);
            return discordHeading + `
                <div class="w-full bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                    <p class="text-xs text-gray-400 mb-3">Join our server for updates & chat!</p>
                    <a href="https://discord.com/invite/1525996949554073640" target="_blank" rel="noopener noreferrer" class="inline-block px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition">
                        Join Discord
                    </a>
                </div>
            `;
        }
    }

// Funktion beim Laden der Seite ausführen
fetchDiscordWidget();
