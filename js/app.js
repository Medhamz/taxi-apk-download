// ============================================================
// CONFIGURATION DE L'API
// ============================================================

const API_URL = 'https://visitor-backend-afgj.onrender.com/api/stats/visitors';

// ============================================================
// COMPTEUR DE TÉLÉCHARGEMENTS (Local + API)
// ============================================================

let totalDownloads = parseInt(localStorage.getItem('totalDownloads')) || 0;
let clientDownloads = parseInt(localStorage.getItem('clientDownloads')) || 0;
let driverDownloads = parseInt(localStorage.getItem('driverDownloads')) || 0;

function updateDownloadCounters() {
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('clientDownloads').textContent = clientDownloads;
    document.getElementById('driverDownloads').textContent = driverDownloads;
}

function incrementDownload(appType) {
    totalDownloads++;
    localStorage.setItem('totalDownloads', totalDownloads);

    if (appType === 'client') {
        clientDownloads++;
        localStorage.setItem('clientDownloads', clientDownloads);
    } else if (appType === 'driver') {
        driverDownloads++;
        localStorage.setItem('driverDownloads', driverDownloads);
    }

    updateDownloadCounters();

    // ✅ Envoyer la statistique au micro-service
    sendDownloadStats(appType);
}

// ============================================================
// ENVOI DES STATISTIQUES AU MICRO-SERVICE
// ============================================================

async function sendDownloadStats(appType) {
    try {
        // On utilise l'endpoint /track pour enregistrer une visite
        await fetch(`${API_URL}/track`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(`📊 Statistique envoyée pour ${appType}`);
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

        // Mettre à jour les compteurs avec les données de l'API
        const onlineElement = document.getElementById('onlineCount');
        const totalElement = document.getElementById('totalDownloads');
        const clientElement = document.getElementById('clientDownloads');
        const driverElement = document.getElementById('driverDownloads');

        if (onlineElement) {
            onlineElement.textContent = data.online || 0;
        }
        if (totalElement) {
            totalElement.textContent = data.totalDownloads || 0;
        }
        if (clientElement) {
            clientElement.textContent = data.clientDownloads || 0;
        }
        if (driverElement) {
            driverElement.textContent = data.driverDownloads || 0;
        }

        // Mettre à jour les variables locales
        totalDownloads = data.totalDownloads || 0;
        clientDownloads = data.clientDownloads || 0;
        driverDownloads = data.driverDownloads || 0;

        console.log('✅ Statistiques mises à jour:', data);
    } catch (error) {
        console.error('❌ Erreur lors de la récupération des stats:', error);
        // En cas d'erreur, on garde les valeurs locales
    }
}

// ============================================================
// COMPTEUR EN LIGNE (Maintenant alimenté par l'API)
// ============================================================

// La fonction updateOnlineCount est remplacée par fetchRealTimeStats

// ============================================================
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les compteurs avec l'API
    fetchRealTimeStats();

    // Mettre à jour les statistiques toutes les 30 secondes
    setInterval(fetchRealTimeStats, 30000);

    // Envoyer une visite lors du chargement de la page
    sendDownloadStats('page_view');

    const downloadButtons = document.querySelectorAll('.download-btn');
    const notification = document.getElementById('downloadNotification');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const appType = this.dataset.app || 'unknown';
            const appName = this.closest('.app-card').querySelector('h3').textContent;
            const href = this.getAttribute('href');

            // Incrémenter le compteur local
            incrementDownload(appType);

            // Afficher la notification
            if (notification) {
                notification.querySelector('span').textContent = `⬇️ Téléchargement de ${appName}...`;
                notification.classList.add('show');
                setTimeout(() => {
                    notification.classList.remove('show');
                }, 2500);
            }

            // Démarrer le téléchargement
            const link = document.createElement('a');
            link.href = href;
            link.download = href.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Log dans la console
            console.log(`📱 Téléchargement: ${appName} (Total: ${totalDownloads})`);
        });
    });

    // Fermeture de la notification
    window.closeNotification = function() {
        if (notification) {
            notification.classList.remove('show');
        }
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