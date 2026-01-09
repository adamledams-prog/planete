// Variables de jeu
let gameState = {
    energy: 0,
    metal: 0,
    crystal: 0,
    shield: 0,
    workers: 0,
    questCompleted: false,
    chestOpened: false
};

// Charger l'état du jeu
function loadGameState() {
    // Ne pas charger les anciennes données - toujours recommencer à 0
    updateDisplay();
}

// Sauvegarder l'état du jeu
function saveGameState() {
    localStorage.setItem('planetGameState', JSON.stringify(gameState));
}

// Mettre à jour l'affichage
function updateDisplay() {
    document.getElementById('energy').textContent = gameState.energy;
    document.getElementById('metal').textContent = gameState.metal;
    document.getElementById('crystal').textContent = gameState.crystal;
    document.getElementById('shield').textContent = gameState.shield;
    
    // Mettre à jour les sections si elles existent
    const energyDisplay = document.getElementById('energy-display');
    const metalDisplay = document.getElementById('metal-display');
    const crystalDisplay = document.getElementById('crystal-display');
    const shieldDisplay = document.getElementById('shield-display');
    const workerCount = document.getElementById('worker-count');
    
    if (energyDisplay) energyDisplay.textContent = gameState.energy;
    if (metalDisplay) metalDisplay.textContent = gameState.metal;
    if (crystalDisplay) crystalDisplay.textContent = gameState.crystal;
    if (shieldDisplay) shieldDisplay.textContent = gameState.shield;
    if (workerCount) workerCount.textContent = gameState.workers;
    
    // Mettre à jour la quête
    updateQuest();
    
    saveGameState();
}

// Afficher une section spécifique
function showSection(sectionName) {
    // Cacher toutes les sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.add('hidden'));
    
    // Cacher la vue de la planète si on affiche une section
    const planetView = document.querySelector('.planet-view');
    if (sectionName !== 'planet') {
        planetView.style.display = 'none';
        
        // Afficher la section demandée
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    } else {
        planetView.style.display = 'block';
    }
}

// Collecter des ressources
function collectResources() {
    const energyGain = Math.floor(Math.random() * 50) + 25;
    const metalGain = Math.floor(Math.random() * 30) + 15;
    const crystalGain = Math.floor(Math.random() * 20) + 10;
    
    gameState.energy += energyGain * gameState.workers;
    gameState.metal += metalGain * gameState.workers;
    gameState.crystal += crystalGain * gameState.workers;
    
    updateDisplay();
    
    alert(`Ressources collectées!\n⚡ +${energyGain * gameState.workers} Énergie\n🔩 +${metalGain * gameState.workers} Métal\n💎 +${crystalGain * gameState.workers} Cristal`);
}

// Lancer une attaque
function launchAttack(type) {
    const messageEl = document.getElementById('attack-message');
    
    if (type === 'laser') {
        if (gameState.energy >= 50) {
            gameState.energy -= 50;
            updateDisplay();
            messageEl.textContent = '⚡ Attaque laser lancée! -50 énergie';
            messageEl.style.color = '#ffff00';
        } else {
            messageEl.textContent = '❌ Pas assez d\'énergie!';
            messageEl.style.color = '#ff0000';
        }
    } else if (type === 'missile') {
        if (gameState.metal >= 100) {
            gameState.metal -= 100;
            updateDisplay();
            messageEl.textContent = '🚀 Missile lancé! -100 métal';
            messageEl.style.color = '#ffff00';
        } else {
            messageEl.textContent = '❌ Pas assez de métal!';
            messageEl.style.color = '#ff0000';
        }
    }
}

// Améliorer le bouclier
function upgradeShield() {
    const messageEl = document.getElementById('defense-message');
    
    if (gameState.crystal >= 200) {
        gameState.crystal -= 200;
        gameState.shield = Math.min(gameState.shield + 20, 200);
        updateDisplay();
        messageEl.textContent = '🛡️ Bouclier amélioré! +20% (Coût: -200 cristal)';
        messageEl.style.color = '#00ff88';
    } else {
        messageEl.textContent = '❌ Pas assez de cristal!';
        messageEl.style.color = '#ff0000';
    }
}

// Embaucher le premier travailleur gratuitement
function hireFreeWorker() {
    const freeBtn = document.getElementById('free-worker-btn');
    const timerEl = document.getElementById('worker-timer');
    const timerSeconds = document.getElementById('timer-seconds');
    
    freeBtn.disabled = true;
    freeBtn.style.opacity = '0.5';
    timerEl.style.display = 'block';
    
    let countdown = 5;
    const interval = setInterval(() => {
        countdown--;
        timerSeconds.textContent = countdown;
        
        if (countdown <= 0) {
            clearInterval(interval);
            gameState.workers = 1;
            gameState.metal += 10;
            updateDisplay();
            
            // Cacher l'offre gratuite
            document.getElementById('free-worker-offer').style.display = 'none';
            // Afficher le bouton pour embaucher d'autres travailleurs
            document.getElementById('regular-worker-btn').style.display = 'block';
            
            const messageEl = document.getElementById('worker-message');
            messageEl.textContent = '🎉 Premier travailleur embauché! +10 métal';
            messageEl.style.color = '#00ff88';
        }
    }, 1000);
}

// Embaucher un travailleur
function hireWorker() {
    const messageEl = document.getElementById('worker-message');
    
    if (gameState.metal >= 50) {
        gameState.metal -= 50;
        gameState.workers += 1;
        updateDisplay();
        messageEl.textContent = '👷 Travailleur embauché! Total: ' + gameState.workers;
        messageEl.style.color = '#00ff88';
    } else {
        messageEl.textContent = '❌ Pas assez de métal!';
        messageEl.style.color = '#ff0000';
    }
}

// Attaquer une planète
function attackPlanet(planetName) {
    const damage = Math.floor(Math.random() * 30) + 10;
    const reward = Math.floor(Math.random() * 100) + 50;
    
    alert(`Attaque sur la planète ${planetName}!\nDégâts infligés: ${damage}%\nRécompense: +${reward} de chaque ressource`);
    
    gameState.energy += reward;
    gameState.metal += reward;
    gameState.crystal += reward;
    
    updateDisplay();
}

// Mettre à jour la quête
function updateQuest() {
    const questProgress = document.getElementById('quest-progress');
    const questReward = document.getElementById('quest-reward');
    
    if (questProgress) {
        questProgress.textContent = Math.min(gameState.metal, 10);
    }
    
    if (questReward && !gameState.questCompleted && gameState.metal >= 10) {
        gameState.questCompleted = true;
        questReward.style.display = 'block';
    }
}

// Ouvrir le coffre
function openChest() {
    if (gameState.chestOpened) return;
    
    gameState.chestOpened = true;
    gameState.energy += 50;
    gameState.metal += 20;
    
    updateDisplay();
    
    alert('🎉 Coffre ouvert!\n⚡ +50 Énergie\n🔩 +20 Métal');
    
    // Faire disparaître le coffre
    const questReward = document.getElementById('quest-reward');
    if (questReward) {
        questReward.innerHTML = '<p style="color: #00ff88;">✅ Récompense récupérée!</p>';
    }
}

// Initialiser le jeu au chargement
window.addEventListener('load', () => {
    loadGameState();
});
