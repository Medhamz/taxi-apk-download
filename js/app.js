// Gestionnaire de téléchargement
document.addEventListener('DOMContentLoaded', function() {
    const downloadButtons = document.querySelectorAll('.download-btn');
    const notification = document.getElementById('downloadNotification');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const appName = this.closest('.app-card').querySelector('h3').textContent;
            const href = this.getAttribute('href');

            // Afficher la notification
            if (notification) {
                notification.querySelector('span').textContent = `⬇️ Téléchargement de ${appName} en cours...`;
                notification.classList.add('show');

                // Cacher après 3 secondes
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

            // Analytics simple
            console.log(`📱 Téléchargement: ${appName}`);
        });
    });

    // Fermeture de la notification
    window.closeNotification = function() {
        notification.classList.remove('show');
    };
});

// Compteur de téléchargements (optionnel)
let downloadCount = 0;

function trackDownload(appName) {
    downloadCount++;
    console.log(`📊 Téléchargements totaux: ${downloadCount}`);
    // Vous pouvez envoyer cette donnée à votre backend
}