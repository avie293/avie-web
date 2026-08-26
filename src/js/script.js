// --- DISCORD SERVER WIDGET LIVE DATA ---
async function fetchDiscordWidget() {
    const SERVER_ID = "1538981431680827542"; 

    if (SERVER_ID === "PLACEHOLDER_DISCORD_SERVER_ID") {
        document.getElementById('discord-name').textContent = "Trage Server ID ein";
        return;
    }

    try {
        const response = await fetch(`https://discord.com/api/guilds/${SERVER_ID}/widget.json`);
        const data = await response.json();

        // Server-Name und Statistiken von der Live-API eintragen
        document.getElementById('discord-name').textContent = data.name;
        document.getElementById('discord-presence').textContent = data.presence_count || 0;
        document.getElementById('discord-members').textContent = data.members ? data.members.length : (data.approximate_member_count || 0);
        
        // Join-Button verknüpfen
        if (data.instant_invite) {
            document.querySelector('.discord-join-btn').href = data.instant_invite;
        }

    } catch (error) {
        console.error("Fehler beim Laden des Discord Widgets:", error);
        document.getElementById('discord-name').textContent = "Server offline / Widget aus";
    }
}

// Funktion beim Laden der Seite ausführen
fetchDiscordWidget();