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
// GESTIONNAIRE DE TÉLÉCHARGEMENT
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    updateDownloadCounters();

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