// ============================================================
// CONFIGURATION DE L'API
// ============================================================

const API_URL = 'https://visitor-backend-afgj.onrender.com/api/stats/visitors';

// ============================================================
// COMPTEUR DE TÉLÉCHARGEMENTS (UNIQUEMENT VIA L'API)
// ============================================================

let totalDownloads = 0;
let clientDownloads = 0;
let driverDownloads = 0;

function updateDownloadCounters() {
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('clientDownloads').textContent = clientDownloads;
    document.getElementById('driverDownloads').textContent = driverDownloads;
}

// ============================================================
// ENVOI D'UN TÉLÉCHARGEMENT AU MICRO-SERVICE
// ============================================================

async function sendDownloadStats(appType) {
    try {
        const response = await fetch(`${API_URL}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(`📊 Statistique envoyée pour ${appType}:`, data);
        // Mettre à jour les compteurs avec les données renvoyées
        updateCountersFromAPI(data);
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi des stats:', error);
    }
}

// ============================================================
// RÉCUPÉRATION DES STATISTIQUES EN TEMPS RÉEL
// ============================================================

async function fetchRealTimeStats() {
    try {
        const response = await fetch(`${API_URL}/online`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateCountersFromAPI(data);
        console.log('✅ Statistiques mises à jour:', data);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des stats:', error);
    }
}

// ============================================================
// MISE À JOUR DES COMPTEURS DEPUIS L'API
// ============================================================

function updateCountersFromAPI(data) {
    // Mettre à jour les variables
    totalDownloads = data.totalDownloads || 0;
    clientDownloads = data.clientDownloads || 0;
    driverDownloads = data.driverDownloads || 0;

    // Mettre à jour l'affichage
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('clientDownloads').textContent = clientDownloads;
    document.getElementById('driverDownloads').textContent = driverDownloads;

    // Mettre à jour le compteur "En ligne"
    const onlineElement = document.getElementById('onlineCount');
    if (onlineElement) {
        onlineElement.textContent = data.online || 0;
    }
}

// ============================================================
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Charger les stats au démarrage
    fetchRealTimeStats();

    // Mettre à jour toutes les 15 secondes
    setInterval(fetchRealTimeStats, 15000);

    // Envoyer une visite au chargement
    sendDownloadStats('page_view');

    const downloadButtons = document.querySelectorAll('.download-btn');
    const notification = document.getElementById('downloadNotification');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const appType = this.dataset.app || 'unknown';
            const appName = this.closest('.app-card').querySelector('h3').textContent;
            const href = this.getAttribute('href');

            // ✅ Incrémenter le compteur OPTIMISTE (pour un retour immédiat)
            if (appType === 'client') {
                clientDownloads++;
            } else if (appType === 'driver') {
                driverDownloads++;
            }
            totalDownloads++;
            updateDownloadCounters();

            // ✅ Envoyer la statistique au serveur
            sendDownloadStats(appType);

            // Afficher la notification
            if (notification) {
                notification.querySelector('span').textContent = `⬇️ Téléchargement de ${appName}...`;
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 2500);
            }

            // Démarrer le téléchargement
            const link = document.createElement('a');
            link.href = href;
            link.download = href.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            console.log(`📱 Téléchargement: ${appName} (Total: ${totalDownloads})`);
        });
    });

    window.closeNotification = function() {
        if (notification) notification.classList.remove('show');
    };
});

// ============================================================
// FAQ - TOGGLE (Accordéon)
// ============================================================

function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');

    if (answer && toggle) {
        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            toggle.textContent = '+';
        } else {
            answer.style.display = 'block';
            toggle.textContent = '−';
        }
    }
}

// ============================================================
// MESSAGE DE BIENVENUE DANS LA CONSOLE
// ============================================================

console.log('🚖 Bienvenue sur Abdil Taxi !');
console.log('📊 Les statistiques sont synchronisées en temps réel.');
console.log('📱 Téléchargez l\'application et profitez de nos services.');