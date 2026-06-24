// ============================================================
// COMPTEUR DE TÉLÉCHARGEMENTS (Avec stockage local)
// ============================================================

let totalDownloads = parseInt(localStorage.getItem('totalDownloads')) || 0;
let clientDownloads = parseInt(localStorage.getItem('clientDownloads')) || 0;
let driverDownloads = parseInt(localStorage.getItem('driverDownloads')) || 0;

// Mettre à jour l'affichage des compteurs
function updateDownloadCounters() {
    document.getElementById('totalDownloads').textContent = totalDownloads;
    document.getElementById('clientDownloads').textContent = clientDownloads;
    document.getElementById('driverDownloads').textContent = driverDownloads;
}

// Incrémenter le compteur
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
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Afficher les compteurs au chargement
    updateDownloadCounters();

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
                notification.querySelector('span').textContent = `⬇️ Téléchargement de ${appName} en cours... (${totalDownloads} téléchargements)`;
                notification.classList.add('show');

                setTimeout(() => {
                    notification.classList.remove('show');
                }, 3000);
            }

            // Démarrer le téléchargement
            const link = document.createElement('a');
            link.href = href;
            link.download = href.split('/').pop();
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Analytics
            console.log(`📱 Téléchargement: ${appName} (Total: ${totalDownloads})`);
        });
    });

    // Fermeture de la notification
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

// ============================================================
// ANIMATION AU SCROLL (Avec Intersection Observer)
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observer les cartes d'application
    document.querySelectorAll('.app-card, .review-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
});

// ============================================================
// EFFET DE SURVOL SUR LES BOUTONS
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.download-btn').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

// ============================================================
// MESSAGE DE BIENVENUE PERSONNALISÉ
// ============================================================

console.log('🚖 Bienvenue sur Abdil Taxi !');
console.log(`📊 ${totalDownloads} téléchargements totaux enregistrés.`);
console.log('📱 Téléchargez l\'application et profitez de nos services.');