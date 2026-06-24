// ============================================================
// COMPTEUR DE TÉLÉCHARGEMENTS
// ============================================================

let totalDownloads = parseInt(localStorage.getItem('totalDownloads')) || 0;
let clientDownloads = parseInt(localStorage.getItem('clientDownloads')) || 0;
let driverDownloads = parseInt(localStorage.getItem('driverDownloads')) || 0;
let todayDownloads = parseInt(localStorage.getItem('todayDownloads')) || 0;
let weekDownloads = parseInt(localStorage.getItem('weekDownloads')) || 0;
let todayDate = localStorage.getItem('todayDate') || new Date().toDateString();

// Réinitialiser les compteurs quotidiens
function resetDailyCounters() {
    const currentDate = new Date().toDateString();
    if (todayDate !== currentDate) {
        todayDownloads = 0;
        localStorage.setItem('todayDownloads', '0');
        localStorage.setItem('todayDate', currentDate);
        todayDate = currentDate;
    }
}

function updateDownloadCounters() {
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('clientDownloads').textContent = clientDownloads;
    document.getElementById('driverDownloads').textContent = driverDownloads;
    document.getElementById('todayDownloads').textContent = todayDownloads;
    document.getElementById('weekDownloads').textContent = weekDownloads;

    // Meilleure application
    const bestApp = clientDownloads > driverDownloads ? 'Client' :
                    driverDownloads > clientDownloads ? 'Chauffeur' : 'Égalité';
    document.getElementById('bestApp').textContent = bestApp;
}

function incrementDownload(appType) {
    resetDailyCounters();

    totalDownloads++;
    todayDownloads++;
    weekDownloads++;

    localStorage.setItem('totalDownloads', totalDownloads);
    localStorage.setItem('todayDownloads', todayDownloads);
    localStorage.setItem('weekDownloads', weekDownloads);

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
// COMPTEUR EN LIGNE (Simulation avec intervalle)
// ============================================================

function updateOnlineCount() {
    const count = Math.floor(Math.random() * 20) + 5; // Entre 5 et 25
    document.getElementById('onlineCount').textContent = count;
}

// ============================================================
// NEWSLETTER
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletterForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('newsletterEmail').value;
            if (email) {
                // Stocker l'email (simulation)
                let subscribers = JSON.parse(localStorage.getItem('subscribers')) || [];
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('subscribers', JSON.stringify(subscribers));
                    alert('✅ Merci ! Vous êtes abonné aux nouveautés.');
                } else {
                    alert('ℹ️ Vous êtes déjà abonné.');
                }
                this.reset();
            }
        });
    }
});

// ============================================================
// BANNIÈRE DE MISE À JOUR (Simulation)
// ============================================================

function showUpdateBanner() {
    const banner = document.getElementById('updateBanner');
    if (banner) {
        banner.style.display = 'flex';
    }
}

function closeUpdateBanner() {
    const banner = document.getElementById('updateBanner');
    if (banner) {
        banner.style.display = 'none';
        localStorage.setItem('updateBannerClosed', 'true');
    }
}

// ============================================================
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    resetDailyCounters();
    updateDownloadCounters();
    updateOnlineCount();
    setInterval(updateOnlineCount, 30000); // Mise à jour toutes les 30s

    // Afficher la bannière de mise à jour (si pas fermée)
    if (!localStorage.getItem('updateBannerClosed')) {
        setTimeout(showUpdateBanner, 2000);
    }

    const downloadButtons = document.querySelectorAll('.download-btn');
    const notification = document.getElementById('downloadNotification');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const appType = this.dataset.app || 'unknown';
            const appName = this.closest('.app-card').querySelector('h3').textContent;
            const href = this.getAttribute('href');

            incrementDownload(appType);

            if (notification) {
                notification.querySelector('span').textContent = `⬇️ Téléchargement de ${appName}...`;
                notification.classList.add('show');
                setTimeout(() => notification.classList.remove('show'), 2500);
            }

            const link = document.createElement('a');
            link.href = href;
            link.download = href.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    window.closeNotification = function() {
        notification.classList.remove('show');
    };
});

// ============================================================
// FAQ - TOGGLE
// ============================================================

function toggleFaq(element) {
    const answer = element.nextElementSibling;
    const toggle = element.querySelector('.faq-toggle');

    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        toggle.textContent = '+';
    } else {
        answer.style.display = 'block';
        toggle.textContent = '−';
    }
}