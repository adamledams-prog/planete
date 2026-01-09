// Variables de jeu
let gameState = {
    energy: 0,
    metal: 0,
    crystal: 0,
    shield: 0,
    workers: 0,
    questCompleted: false,
    chestOpened: false,
    defenseUnlocked: false,
    quest2Completed: false,
    chest2Opened: false,
    attackUnlocked: false,
    quest2Visible: false,
    questBadgeClicked: false
};

// Charger l'état du jeu
function loadGameState() {
    // Effacer les anciennes données et recommencer à zéro
    localStorage.removeItem('planetGameState');
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
    
    // Mettre à jour le bouclier dans la section défense
    const shieldDisplayDefense = document.getElementById('shield-display-defense');
    if (shieldDisplayDefense) shieldDisplayDefense.textContent = gameState.shield;
    
    // Mettre à jour le badge de défense
    const defenseBadge = document.getElementById('defense-badge');
    if (defenseBadge) {
        if (gameState.defenseUnlocked && gameState.metal >= 40) {
            defenseBadge.style.display = 'inline-block';
        } else {
            defenseBadge.style.display = 'none';
        }
    }
    
    // Mettre à jour le badge d'attaque
    const attackBadge = document.getElementById('attack-badge');
    if (attackBadge && gameState.attackUnlocked) {
        attackBadge.style.display = 'inline-block';
    } else if (attackBadge) {
        attackBadge.style.display = 'none';
    }
    
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
        
        // Si on ouvre la section quête, masquer le badge
        if (sectionName === 'quest') {
            gameState.questBadgeClicked = true;
            const questBadge = document.getElementById('quest-badge');
            if (questBadge) {
                questBadge.style.display = 'none';
            }
        }
        
        // Si on ouvre la section attaque, masquer le badge
        if (sectionName === 'attack') {
            const attackBadge = document.getElementById('attack-badge');
            if (attackBadge) {
                attackBadge.style.display = 'none';
            }
            gameState.attackUnlocked = false;
            saveGameState();
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
            
            // Débloquer la défense après le premier travailleur
            gameState.defenseUnlocked = true;
            
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
    const regularBtn = document.getElementById('regular-worker-btn');
    const timerEl = document.getElementById('worker-timer-regular');
    const timerSeconds = document.getElementById('timer-seconds-regular');
    
    if (gameState.energy >= 50) {
        gameState.energy -= 50;
        updateDisplay();
        
        regularBtn.disabled = true;
        regularBtn.style.opacity = '0.5';
        timerEl.style.display = 'block';
        messageEl.textContent = '';
        
        let countdown = 5;
        timerSeconds.textContent = countdown;
        
        const interval = setInterval(() => {
            countdown--;
            timerSeconds.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(interval);
                
                gameState.workers += 1;
                gameState.energy += 75;
                gameState.metal += 20;
                
                updateDisplay();
                
                regularBtn.disabled = false;
                regularBtn.style.opacity = '1';
                timerEl.style.display = 'none';
                
                messageEl.textContent = '🎉 Travailleur embauché! +75 énergie +20 métal. Total: ' + gameState.workers;
                messageEl.style.color = '#00ff88';
            }
        }, 1000);
    } else {
        messageEl.textContent = '❌ Pas assez d\'énergie!';
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
    const claimBtn = document.getElementById('claim-quest-btn');
    const questBadge = document.getElementById('quest-badge');
    
    if (questProgress) {
        questProgress.textContent = Math.min(gameState.metal, 10);
    }
    
    // Afficher le badge de notification si on a 10 métal et que la quête n'est pas complétée
    if (questBadge && !gameState.questBadgeClicked) {
        if (gameState.metal >= 10 && !gameState.questCompleted && !gameState.chestOpened) {
            questBadge.style.display = 'inline-block';
        } else if (gameState.quest2Visible && !gameState.quest2Completed && gameState.shield >= 20) {
            questBadge.style.display = 'inline-block';
        } else {
            questBadge.style.display = 'none';
        }
    }
    
    // Afficher le bouton Réclamer si on a 10 métal et que la quête n'est pas encore complétée
    if (claimBtn && gameState.metal >= 10 && !gameState.questCompleted && !gameState.chestOpened) {
        claimBtn.style.display = 'block';
    } else if (claimBtn) {
        claimBtn.style.display = 'none';
    }
    
    // Afficher l'état final si le coffre a été ouvert
    const chestOpened = document.getElementById('chest-opened');
    if (chestOpened && gameState.chestOpened) {
        document.getElementById('quest-reward').style.display = 'none';
        chestOpened.style.display = 'block';
    }
    
    // Quête 2: Protection planétaire
    const questBox2 = document.getElementById('quest-box-2');
    const questProgress2 = document.getElementById('quest-progress-2');
    const claimBtn2 = document.getElementById('claim-quest-btn-2');
    
    // Afficher la quête 2 si la première est terminée
    if (questBox2 && gameState.chestOpened && !gameState.quest2Visible) {
        gameState.quest2Visible = true;
        questBox2.style.display = 'block';
        saveGameState();
    }
    
    if (questProgress2) {
        questProgress2.textContent = Math.min(gameState.shield, 20);
    }
    
    // Afficher le bouton Réclamer pour la quête 2
    if (claimBtn2 && gameState.shield >= 20 && !gameState.quest2Completed && !gameState.chest2Opened && gameState.quest2Visible) {
        claimBtn2.style.display = 'block';
    } else if (claimBtn2) {
        claimBtn2.style.display = 'none';
    }
    
    // Afficher l'état final si le coffre 2 a été ouvert
    const chestOpened2 = document.getElementById('chest-opened-2');
    if (chestOpened2 && gameState.chest2Opened) {
        document.getElementById('quest-reward-2').style.display = 'none';
        chestOpened2.style.display = 'block';
        
        // Débloquer l'attaque
        const attackLockedBtn = document.getElementById('attack-locked-btn');
        const attackMenuBtn = document.getElementById('attack-menu-btn');
        if (attackLockedBtn && attackMenuBtn) {
            attackLockedBtn.style.display = 'none';
            attackMenuBtn.style.display = 'block';
            gameState.attackUnlocked = true;
        }
    }
}

// Réclamer la quête
function claimQuest() {
    if (gameState.metal < 10 || gameState.questCompleted) return;
    
    gameState.questCompleted = true;
    saveGameState();
    
    // Cacher le bouton Réclamer
    document.getElementById('claim-quest-btn').style.display = 'none';
    
    // Afficher le coffre
    document.getElementById('quest-reward').style.display = 'block';
    
    // Animation d'ouverture du coffre après 1 seconde
    setTimeout(() => {
        openChest();
    }, 1000);
}

// Ouvrir le coffre
function openChest() {
    if (gameState.chestOpened) return;
    
    const chestBox = document.getElementById('chest-box');
    
    // Animation d'ouverture
    if (chestBox) {
        chestBox.classList.add('chest-opening');
    }
    
    // Après l'animation, donner les récompenses
    setTimeout(() => {
        gameState.chestOpened = true;
        gameState.energy += 50;
        gameState.metal += 20;
        
        updateDisplay();
        
        // Afficher les récompenses
        document.getElementById('quest-reward').style.display = 'none';
        document.getElementById('chest-opened').style.display = 'block';
    }, 1500);
}

// Initialiser le jeu au chargement
window.addEventListener('load', () => {
    loadGameState();
});

// Réclamer la quête 2
function claimQuest2() {
    if (gameState.shield < 20 || gameState.quest2Completed) return;
    
    gameState.quest2Completed = true;
    gameState.questBadgeClicked = false;
    saveGameState();
    
    // Cacher le bouton Réclamer
    document.getElementById('claim-quest-btn-2').style.display = 'none';
    
    // Afficher le coffre
    document.getElementById('quest-reward-2').style.display = 'block';
    
    // Animation d'ouverture du coffre après 1 seconde
    setTimeout(() => {
        openChest2();
    }, 1000);
}

// Ouvrir le coffre 2
function openChest2() {
    if (gameState.chest2Opened) return;
    
    const chestBox = document.getElementById('chest-box-2');
    
    // Animation d'ouverture
    if (chestBox) {
        chestBox.classList.add('chest-opening');
    }
    
    // Après l'animation, donner les récompenses
    setTimeout(() => {
        gameState.chest2Opened = true;
        gameState.energy += 100;
        gameState.attackUnlocked = true;
        
        updateDisplay();
        
        // Afficher les récompenses
        document.getElementById('quest-reward-2').style.display = 'none';
        document.getElementById('chest-opened-2').style.display = 'block';
        
        // Débloquer l'attaque
        const attackLockedBtn = document.getElementById('attack-locked-btn');
        const attackMenuBtn = document.getElementById('attack-menu-btn');
        if (attackLockedBtn && attackMenuBtn) {
            attackLockedBtn.style.display = 'none';
            attackMenuBtn.style.display = 'block';
        }
    }, 1500);
}

// Acheter du bouclier
function buyShield() {
    const messageEl = document.getElementById('defense-message');
    const buyBtn = document.getElementById('buy-shield-btn');
    const constructionEl = document.getElementById('defense-construction');
    const timerEl = document.getElementById('defense-timer');
    
    if (gameState.metal >= 40) {
        gameState.metal -= 40;
        updateDisplay();
        
        buyBtn.disabled = true;
        buyBtn.style.opacity = '0.5';
        constructionEl.style.display = 'block';
        messageEl.textContent = '';
        
        let countdown = 5;
        timerEl.textContent = countdown;
        
        const interval = setInterval(() => {
            countdown--;
            timerEl.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(interval);
                
                gameState.shield += 20;
                
                // Afficher le badge de quête si on atteint 20% et que la quête 2 est visible
                if (gameState.shield >= 20 && gameState.quest2Visible && !gameState.quest2Completed) {
                    const questBadge = document.getElementById('quest-badge');
                    if (questBadge) {
                        questBadge.style.display = 'inline-block';
                    }
                }
                
                updateDisplay();
                
                buyBtn.disabled = false;
                buyBtn.style.opacity = '1';
                constructionEl.style.display = 'none';
                
                messageEl.textContent = '✅ Bouclier amélioré! +20% (Total: ' + gameState.shield + '%)';
                messageEl.style.color = '#00ff88';
            }
        }, 1000);
    } else {
        messageEl.textContent = '❌ Pas assez de métal! (40 métal requis)';
        messageEl.style.color = '#ff0000';
    }
}
