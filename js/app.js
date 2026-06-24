// ============================================================
// COMPTEUR DE TÉLÉCHARGEMENTS
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
}

// ============================================================
// COMPTEUR EN LIGNE
// ============================================================

function updateOnlineCount() {
    const count = Math.floor(Math.random() * 20) + 5;
    const onlineElement = document.getElementById('onlineCount');
    if (onlineElement) {
        onlineElement.textContent = count;
    }
}

// ============================================================
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les compteurs
    updateDownloadCounters();
    updateOnlineCount();

    // Mettre à jour le compteur en ligne toutes les 30 secondes
    setInterval(updateOnlineCount, 30000);

    const downloadButtons = document.querySelectorAll('.download-btn');
    const notification = document.getElementById('downloadNotification');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const appType = this.dataset.app || 'unknown';
            const appName = this.closest('.app-card').querySelector('h3').textContent;
            const href = this.getAttribute('href');

            // Incrémenter le compteur
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
console.log(`📊 ${totalDownloads} téléchargements totaux enregistrés.`);
console.log('📱 Téléchargez l\'application et profitez de nos services.');