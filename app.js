// Variables globales de la partie
let scores = [];
let nomsJoueurs = [];
let joueurActuel = 0;
let totalJoueurs = 2;
let scoreInitial = 501;

// Se lance dès que l'iPad charge l'application
window.onload = function() {
    genererChampsNoms();
};

// Fonction pour créer des messages épurés à la place des alert() du système
function afficherMessage(texte, type = 'info') {
    const container = document.getElementById('notification-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerText = texte;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Génère dynamiquement les lignes d'écriture des prénoms
function genererChampsNoms() {
    const inputNbJoueurs = document.getElementById('player-count');
    totalJoueurs = parseInt(inputNbJoueurs.value);

    if (isNaN(totalJoueurs) || totalJoueurs < 1) totalJoueurs = 1;
    if (totalJoueurs > 8) totalJoueurs = 8; 

    const container = document.getElementById('players-names-inputs');
    container.innerHTML = ''; 

    for (let i = 0; i < totalJoueurs; i++) {
        container.innerHTML += `
            <div class="name-input-group">
                <label>Joueur ${i + 1} :</label>
                <input type="text" class="player-name-field" value="Joueur ${i + 1}">
            </div>
        `;
    }
}

// Initialise le jeu et crée le tableau d'affichage
function demarrerPartie() {
    const inputNbJoueurs = document.getElementById('player-count');
    const selectMode = document.getElementById('game-mode');
    
    totalJoueurs = parseInt(inputNbJoueurs.value);
    scoreInitial = parseInt(selectMode.value);

    if (isNaN(totalJoueurs) || totalJoueurs < 1) return;

    scores = [];
    nomsJoueurs = [];
    joueurActuel = 0;

    const champsNoms = document.querySelectorAll('.player-name-field');
    const grid = document.getElementById('players-grid');
    grid.innerHTML = ''; 

    for (let i = 0; i < totalJoueurs; i++) {
        let nom = champsNoms[i].value.trim();
        if (nom === "") nom = `Joueur ${i + 1}`;

        nomsJoueurs.push(nom);
        scores.push(scoreInitial);

        grid.innerHTML += `
            <div class="player-card ${i === 0 ? 'active' : ''}" id="card-${i}">
                <h2>${nomsJoueurs[i]}</h2>
                <div class="score" id="score-${i}">${scoreInitial}</div>
            </div>
        `;
    }

    document.getElementById('current-player-name').innerText = nomsJoueurs[0];
    document.getElementById('setup-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
    
    afficherMessage(`Partie lancée en mode ${scoreInitial}`, 'success');
}

// Valide les points et applique les règles officielles
function validerLeTour() {
    const input = document.getElementById('points-input');
    const points = parseInt(input.value);

    if (isNaN(points) || points < 0 || points > 180) {
        afficherMessage("Entre un score valide entre 0 et 180", "error");
        return;
    }

    let scoreCalculé = scores[joueurActuel] - points;

    if (scoreCalculé < 0) {
        afficherMessage(`Bust pour ${nomsJoueurs[joueurActuel]} ! Score négatif.`, "error");
    } else if (scoreCalculé === 1) {
        afficherMessage(`Bust pour ${nomsJoueurs[joueurActuel]} ! Impossible de finir à 1.`, "error");
    } else {
        scores[joueurActuel] = scoreCalculé;
        document.getElementById(`score-${joueurActuel}`).innerText = scores[joueurActuel];
    }

    if (scores[joueurActuel] === 0) {
        afficherMessage(`🎯 MATCH ! Victoire de ${nomsJoueurs[joueurActuel]} !`, "success");
        setTimeout(() => {
            quitterPartie();
        }, 2000);
        return;
    }

    input.value = '';
    changerDeJoueur();
}

function changerDeJoueur() {
    document.getElementById(`card-${joueurActuel}`).classList.remove('active');
    joueurActuel = (joueurActuel + 1) % totalJoueurs;
    document.getElementById(`card-${joueurActuel}`).classList.add('active');
    document.getElementById('current-player-name').innerText = nomsJoueurs[joueurActuel];
}

function quitterPartie() {
    document.getElementById('game-screen').style.display = 'none';
    document.getElementById('setup-screen').style.display = 'block';
    document.getElementById('points-input').value = '';
    genererChampsNoms();
}
