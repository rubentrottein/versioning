/**
 * Dashboard de Monitoring Système
 * Script principal pour la gestion des données et interactions
 */

class SystemMonitor {
    constructor() {
        this.config = {};
        this.isRunning = false;
        this.updateInterval = null;
        this.logs = [];
        this.alerts = [];
        this.metricsHistory = {
            cpu: [],
            memory: [],
            network: [],
            storage: []
        };
        
        this.init();
    }

    /**
     * Initialisation du dashboard
     */
    async init() {
        try {
            await this.loadConfig();
            this.setupEventListeners();
            this.startMonitoring();
            this.updateLastUpdateTime();
            this.initializeCharts();
            
            console.log('Dashboard initialisé avec succès');
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.showAlert('Erreur d\'initialisation', 'danger');
        }
    }

    /**
     * Chargement de la configuration
     */
    async loadConfig() {
        try {
            const response = await fetch('config.json');
            this.config = await response.json();
        } catch (error) {
            // Configuration par défaut si le fichier n'existe pas
            this.config = {
                refreshInterval: 5000,
                thresholds: {
                    cpu: { warning: 70, danger: 90 },
                    memory: { warning: 80, danger: 95 },
                    storage: { warning: 85, danger: 95 },
                    network: { warning: 100, danger: 200 }
                }
            };
        }
    }

    /**
     * Configuration des événements
     */
    setupEventListeners() {
        // Bouton d'actualisation des logs
        document.getElementById('refresh-logs').addEventListener('click', () => {
            this.refreshLogs();
        });

        // Filtre des logs
        document.getElementById('log-level').addEventListener('change', (e) => {
            this.filterLogs(e.target.value);
        });

        // Mise à jour automatique du temps
        setInterval(() => {
            this.updateLastUpdateTime();
        }, 1000);

        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            this.resizeCharts();
        });
    }

    /**
     * Démarrage du monitoring
     */
    startMonitoring() {
        if (this.isRunning) return;

        this.isRunning = true;
        this.updateConnectionStatus(true);
        this.updateMetrics();
        
        // Mise à jour périodique
        this.updateInterval = setInterval(() => {
            this.updateMetrics();
        }, this.config.refreshInterval);

        // Génération de logs périodique
        setInterval(() => {
            this.generateRandomLog();
        }, 3000);

        // Vérification des alertes
        setInterval(() => {
            this.checkAlerts();
        }, 10000);

        // Nettoyage de l'historique
        setInterval(() => {
            this.cleanupHistory();
        }, 60000);
    }

    /**
     * Arrêt du monitoring
     */
    stopMonitoring() {
        if (!this.isRunning) return;

        this.isRunning = false;
        this.updateConnectionStatus(false);
        
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    /**
     * Mise à jour du statut de connexion
     */
    updateConnectionStatus(isConnected) {
        const statusElement = document.getElementById('connection-status');
        const statusText = statusElement.nextElementSibling;
        
        if (isConnected) {
            statusElement.className = 'status-dot online';
            statusText.textContent = 'Connecté';
        } else {
            statusElement.className = 'status-dot offline';
            statusText.textContent = 'Déconnecté';
        }
    }

    /**
     * Mise à jour des métriques système
     */
    updateMetrics() {
        // Simulation de données réelles avec variation temporelle
        const now = Date.now();
        const timeVariation = Math.sin(now / 60000) * 0.3 + 0.7; // Variation lente
        
        const metrics = {
            cpu: this.generateMetric('cpu', 15 * timeVariation, 85 * timeVariation),
            memory: this.generateMetric('memory', 45, 90),
            network: this.generateMetric('network', 10, 150 * timeVariation, 'MB/s'),
            storage: this.generateMetric('storage', 65, 95)
        };

        // Sauvegarde dans l'historique
        Object.keys(metrics).forEach(key => {
            this.metricsHistory[key].push({
                timestamp: now,
                value: metrics[key].value
            });
        });

        // Mise à jour de l'interface
        Object.keys(metrics).forEach(key => {
            this.updateMetricDisplay(key, metrics[key]);
        });

        // Mise à jour des graphiques
        this.updateCharts(metrics);
    }

    /**
     * Génération d'une métrique simulée
     */
    generateMetric(type, min, max, unit = '%') {
        const value = Math.random() * (max - min) + min;
        const roundedValue = Math.round(value * 10) / 10;
        
        return {
            value: roundedValue,
            unit: unit,
            status: this.getMetricStatus(type, roundedValue)
        };
    }

    /**
     * Détermination du statut d'une métrique
     */
    getMetricStatus(type, value) {
        const thresholds = this.config.thresholds[type];
        if (!thresholds) return 'normal';

        if (value >= thresholds.danger) return 'danger';
        if (value >= thresholds.warning) return 'warning';
        return 'normal';
    }

    /**
     * Mise à jour de l'affichage d'une métrique
     */
    updateMetricDisplay(type, metric) {
        const valueElement = document.getElementById(`${type}-usage`);
        const progressElement = document.getElementById(`${type}-progress`);
        const statusElement = document.getElementById(`${type}-status`);

        if (valueElement) {
            valueElement.textContent = `${metric.value}${metric.unit}`;
        }

        if (progressElement) {
            const percentage = metric.unit === '%' ? metric.value : (metric.value / 200) * 100;
            progressElement.style.width = `${Math.min(percentage, 100)}%`;
            progressElement.className = `progress-fill ${metric.status}`;
        }

        if (statusElement) {
            statusElement.textContent = this.getStatusText(metric.status);
            statusElement.className = `status ${metric.status}`;
        }
    }

    /**
     * Texte du statut
     */
    getStatusText(status) {
        switch (status) {
            case 'normal': return 'Normal';
            case 'warning': return 'Attention';
            case 'danger': return 'Critique';
            default: return 'Inconnu';
        }
    }

    /**
     * Initialisation des graphiques
     */
    initializeCharts() {
        this.resizeCharts();
    }

    /**
     * Redimensionnement des graphiques
     */
    resizeCharts() {
        const cpuChart = document.getElementById('cpu-chart');
        const memoryChart = document.getElementById('memory-chart');

        if (cpuChart) {
            cpuChart.width = cpuChart.offsetWidth;
            cpuChart.height = 200;
        }

        if (memoryChart) {
            memoryChart.width = memoryChart.offsetWidth;
            memoryChart.height = 200;
        }
    }

    /**
     * Mise à jour des graphiques
     */
    updateCharts(metrics) {
        const cpuChart = document.getElementById('cpu-chart');
        const memoryChart = document.getElementById('memory-chart');

        if (cpuChart) {
            this.drawHistoryChart(cpuChart, this.metricsHistory.cpu, '#3498db', 'CPU');
        }

        if (memoryChart) {
            this.drawHistoryChart(memoryChart, this.metricsHistory.memory, '#e74c3c', 'Mémoire');
        }
    }

    /**
     * Dessin d'un graphique d'historique
     */
    drawHistoryChart(canvas, data, color, label) {
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Effacer le canvas
        ctx.clearRect(0, 0, width, height);

        if (data.length < 2) return;

        // Prendre les 50 derniers points
        const recentData = data.slice(-50);
        const maxValue = Math.max(...recentData.map(d => d.value));
        const minValue = Math.min(...recentData.map(d => d.value));
        const range = maxValue - minValue || 1;

        // Dessiner la grille
        ctx.strokeStyle = '#ecf0f1';
        ctx.lineWidth = 1;
        
        // Lignes horizontales
        for (let i = 0; i <= 4; i++) {
            const y = (height / 4) * i;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }

        // Lignes verticales
        for (let i = 0; i <= 10; i++) {
            const x = (width / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }

        // Dessiner la courbe
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        recentData.forEach((point, index) => {
            const x = (index / (recentData.length - 1)) * width;
            const y = height - ((point.value - minValue) / range) * height;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // Remplir sous la courbe
        ctx.fillStyle = color + '20';
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();

        // Afficher les valeurs
        ctx.fillStyle = '#2c3e50';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText(`${label}: ${recentData[recentData.length - 1]?.value.toFixed(1)}%`, 10, 20);
        ctx.fillText(`Min: ${minValue.toFixed(1)}%`, 10, 35);
        ctx.fillText(`Max: ${maxValue.toFixed(1)}%`, 10, 50);
    }

    /**
     * Génération d'un log aléatoire
     */
    generateRandomLog() {
        const logTypes = [
            { level: 'info', messages: [
                'Connexion utilisateur établie',
                'Sauvegarde automatique terminée',
                'Nouvelle session utilisateur',
                'Processus de maintenance démarré',
                'Synchronisation des données terminée'
            ]},
            { level: 'warning', messages: [
                'Utilisation CPU élevée détectée',
                'Espace disque faible',
                'Certificat SSL expire bientôt',
                'Tentative de connexion échouée',
                'Délai de réponse réseau lent'
            ]},
            { level: 'error', messages: [
                'Échec de connexion à la base de données',
                'Service indisponible temporairement',
                'Erreur de validation des données',
                'Timeout de connexion réseau',
                'Échec de sauvegarde automatique'
            ]}
        ];

        const logType = logTypes[Math.floor(Math.random() * logTypes.length)];
        const message = logType.messages[Math.floor(Math.random() * logType.messages.length)];
        const timestamp = new Date().toLocaleTimeString();

        this.addLog(logType.level, message, timestamp);
    }

    /**
     * Ajout d'un log
     */
    addLog(level, message, timestamp) {
        const log = { level, message, timestamp };
        this.logs.unshift(log);

        // Limiter à 100 logs maximum
        if (this.logs.length > 100) {
            this.logs = this.logs.slice(0, 100);
        }

        this.updateLogsDisplay();
    }

    /**
     * Mise à jour de l'affichage des logs
     */
    updateLogsDisplay() {
        const logsList = document.getElementById('logs-list');
        const selectedLevel = document.getElementById('log-level').value;

        let filteredLogs = this.logs;
        if (selectedLevel !== 'all') {
            filteredLogs = this.logs.filter(log => log.level === selectedLevel);
        }

        logsList.innerHTML = '';
        
        if (filteredLogs.length === 0) {
            logsList.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Aucun log disponible</p>';
            return;
        }

        filteredLogs.slice(0, 20).forEach(log => {
            const logElement = document.createElement('div');
            logElement.className = `log-entry ${log.level}`;
            logElement.innerHTML = `
                <span class="log-timestamp">[${log.timestamp}]</span>
                <span class="log-level">[${log.level.toUpperCase()}]</span>
                <span class="log-message">${log.message}</span>
            `;
            logsList.appendChild(logElement);
        });
    }

    /**
     * Actualisation des logs
     */
    refreshLogs() {
        this.updateLogsDisplay();
        this.showTemporaryMessage('Logs actualisés');
    }

    /**
     * Filtrage des logs
     */
    filterLogs(level) {
        this.updateLogsDisplay();
    }

    /**
     * Vérification des alertes
     */
    checkAlerts() {
        // Vérifier les métriques actuelles
        const cpuUsage = parseFloat(document.getElementById('cpu-usage').textContent);
        const memoryUsage = parseFloat(document.getElementById('memory-usage').textContent);
        const storageUsage = parseFloat(document.getElementById('storage-usage').textContent);

        // Alertes basées sur les seuils
        if (cpuUsage > this.config.thresholds.cpu.danger) {
            this.showAlert('CPU Critique', 'danger', `Utilisation CPU: ${cpuUsage}%`);
        } else if (cpuUsage > this.config.thresholds.cpu.warning) {
            this.showAlert('CPU Élevé', 'warning', `Utilisation CPU: ${cpuUsage}%`);
        }

        if (memoryUsage > this.config.thresholds.memory.danger) {
            this.showAlert('Mémoire Critique', 'danger', `Utilisation mémoire: ${memoryUsage}%`);
        }

        if (storageUsage > this.config.thresholds.storage.danger) {
            this.showAlert('Stockage Critique', 'danger', `Espace disque: ${storageUsage}%`);
        }

        // Alertes aléatoires pour la démonstration
        if (Math.random() < 0.1) {
            const randomAlerts = [
                { type: 'info', title: 'Mise à jour disponible', message: 'Une nouvelle version est disponible' },
                { type: 'warning', title: 'Maintenance programmée', message: 'Maintenance prévue dans 2 heures' },
                { type: 'info', title: 'Sauvegarde terminée', message: 'Sauvegarde automatique réussie' }
            ];

            const alert = randomAlerts[Math.floor(Math.random() * randomAlerts.length)];
            this.showAlert(alert.title, alert.type, alert.message);
        }
    }

    /**
     * Affichage d'une alerte
     */
    showAlert(title, type, message = '') {
        // Éviter les doublons
        const existingAlert = this.alerts.find(a => a.title === title && a.type === type);
        if (existingAlert) return;

        const alert = {
            id: Date.now(),
            type,
            title,
            message,
            timestamp: new Date().toLocaleTimeString()
        };

        this.alerts.unshift(alert);
        
        // Limiter à 10 alertes maximum
        if (this.alerts.length > 10) {
            this.alerts = this.alerts.slice(0, 10);
        }

        this.updateAlertsDisplay();
    }

    /**
     * Mise à jour de l'affichage des alertes
     */
    updateAlertsDisplay() {
        const alertsContainer = document.getElementById('alerts-container');
        
        if (this.alerts.length === 0) {
            alertsContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d;">Aucune alerte active</p>';
            return;
        }

        alertsContainer.innerHTML = '';
        this.alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert ${alert.type}`;
            alertElement.innerHTML = `
                <div class="alert-header">
                    <span class="alert-title">${alert.title}</span>
                    <span class="alert-time">${alert.timestamp}</span>
                </div>
                <div class="alert-message">${alert.message}</div>
            `;
            alertsContainer.appendChild(alertElement);
        });
    }

    /**
     * Nettoyage de l'historique des métriques
     */
    cleanupHistory() {
        const maxPoints = 200;
        const cutoff = Date.now() - (24 * 60 * 60 * 1000); // 24 heures

        Object.keys(this.metricsHistory).forEach(key => {
            // Supprimer les points trop anciens
            this.metricsHistory[key] = this.metricsHistory[key].filter(point => 
                point.timestamp > cutoff
            );

            // Limiter le nombre de points
            if (this.metricsHistory[key].length > maxPoints) {
                this.metricsHistory[key] = this.metricsHistory[key].slice(-maxPoints);
            }
        });
    }

    /**
     * Mise à jour du temps de dernière actualisation
     */
    updateLastUpdateTime() {
        const lastUpdateElement = document.getElementById('last-update');
        if (lastUpdateElement) {
            lastUpdateElement.textContent = new Date().toLocaleTimeString();
        }
    }

    /**
     * Affichage d'un message temporaire
     */
    showTemporaryMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 1rem;
            border-radius: 6px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        messageElement.textContent = message;
        document.body.appendChild(messageElement);

        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#temp-message-style')) {
            const style = document.createElement('style');
            style.id = 'temp-message-style';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        setTimeout(() => {
            messageElement.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }, 3000);
    }

    /**
     * Exportation des données
     */
    exportData() {
        const data = {
            timestamp: new Date().toISOString(),
            metrics: this.metricsHistory,
            logs: this.logs.slice(0, 50),
            alerts: this.alerts,
            config: this.config
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `system-monitoring-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    /**
     * Réinitialisation des données
     */
    resetData() {
        this.logs = [];
        this.alerts = [];
        this.metricsHistory = { cpu: [], memory: [], network: [], storage: [] };
        
        this.updateLogsDisplay();
        this.updateAlertsDisplay();
        this.showTemporaryMessage('Données réinitialisées');
    }
}

// Initialisation du dashboard au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    window.monitor = new SystemMonitor();
});

// Gestion de la fermeture de la page
window.addEventListener('beforeunload', () => {
    if (window.monitor) {
        window.monitor.stopMonitoring();
    }
});

// Gestion de la perte de focus
document.addEventListener('visibilitychange', () => {
    if (window.monitor) {
        if (document.hidden) {
            // Réduire la fréquence de mise à jour quand l'onglet n'est pas visible
            window.monitor.config.refreshInterval = 10000;
        } else {
            // Restaurer la fréquence normale
            window.monitor.config.refreshInterval = 5000;
        }
    }
});

// Raccourcis clavier
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'r':
                e.preventDefault();
                if (window.monitor) {
                    window.monitor.refreshLogs();
                }
                break;
            case 'e':
                e.preventDefault();
                if (window.monitor) {
                    window.monitor.exportData();
                }
                break;
        }
    }
});