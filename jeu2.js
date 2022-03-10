let joueur = true;
let counter = 0;
let tab = [];
const nbLignes = 7;
const nbColonnes = 8;
let occuppees = [0, 0, 0, 0, 0, 0, 0, 0];
let gameOn = true;
let player1Options = [[], [], [], [], [], []];
let player2Options = [[], [], [], [], [], []];
let playableColumns = [0, 1, 2, 3, 4, 5, 6, 7];
let arrPlayer;
let speed;
let score1 = 0;
let score2 = 0;
let landscape;

const comments = {
	bragg : ["Ah mais t'es un faible, en fait", "T'es mauvais, Jack!", "I have balls of steel"],
    IAWin : ["Wasted", "Il ne peut en rester qu'un", "Boooooom baby!", "Hasta la vista, baby", "Le travail et le talent, voilà le secret", "Alors infidèle ? On s'en va sans dire au revoir ?"],
    YouWin : ["Ménagez-moi, Monsieur, c'est mon pucelage", "Au revoir", "C'est pas ma guerre", "Vous avez gagné... sans panache", "I'll be back", "Je suis trop vieux pour ces conneries", "Ne sois pas humble, tu n’es pas si génial", "De défaites en défaites, jusqu'à la victoire"],
    win : ["La précision est la politesse des rois", "Fallait pas jouer le mauvais chameau", "Il ne peut y avoir deux tigres sur la même coline", "Seuls les morts ont vu la fin de la guerre"],
    trap : ["Il y a trois sortes de personnes : ceux qui savent compter et ceux qui ne savent pas", "Sssplendide !", "Le risque que j’ai pris était calculé, mais je suis tellement mauvais en mathématiques."],
    provoke : ["Ah ça, à force d'enculer les poules on finit par casser des œufs", "Habile !", "Faux. Nul. Zéro", "Tu m'auras pas comme ça, San Ku Kaï", "Vous ne passerez pas !", "Avoir l'air d'un faux-jeton à ce point-là, j'te jure que c'est vraiment de la franchise !", " Si l'on peut se payer mon corps en y mettant le prix, je n'aime pas beaucoup qu'on se paye ma tête !"],
    mock : ["Très beau coup", "Incroyable", "Quel talent!", "Prix Nobel de Puissance 4"],
    destabilize : ["Si tu as envie d’abandonner, regarde d’où tu es parti.", "Ta foi peut déplacer des montagnes et ton doute peut les créer."],
    angry : ["...", "How dare you ?!", "Mortecouille !", "Arkoum Slimane, mon Président !"],
    general: ["Tant qu'il y aura un Kurde, il y aura un Kurdistan", "J'apprécie les fruits aux sirops !", "Pas changer assiette pour fromage !", "Wether it is noble in the mind to suffer", "On me dit le plus grand bien des harengs pommes à l'huile", "Nous sommes en guerre", "Alors comme ça, vous connaissez personnellement Albert Simon ?", "C'est cela oui", "Je sens, très cher, que nous vivons le début d'une très belle amitié", "J'ai toujours eu foi en la bonté des inconnus", "A la robe pourpre ! A la folle jeunesse !", "Pour survivre à la guerre, il faut devenir la guerre.", "Quand une femme change d'homme, elle change de coiffure", "Ce qui est terrible sur cette terre, c’est que tout le monde a ses raisons.", "Le fou se questionne, le sage demande", "Nous sommes deux fois armés si nous nous battons avec foi.", "Les crabes pensent-ils que nous marchons de coté?"],
    bored : ["Une mer calme n’a jamais fait de marin habile.", "Tiens! J'me fais chier", "Voyage au bout de l'ennui"],
    replay : ["Retenter de perdre", "Rejouer", "Essaye encore"],
    cancel : ["Fuire comme un lâche", "Annuler", "Capituler"],
    start : ["Bonjour", "Allez, à la mine", "C'est parti", "Tirez les premiers, Messieurs les Anglais !"]
}

tab = getTab(nbLignes, nbColonnes)
play()
getRatio()
$("#text").html(getRandom(comments.start, false))
window.onresize = reportWindowSize;
$("#displayScore1").html(score1);
$("#displayScore2").html(score2);

function getRatio(){
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    if(wWidth > wHeight) {
        landscape = false
    } else {
        landscape = true
    }
}

function reportWindowSize() {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let numItems = $(".coin").length
    if (wHeight > wWidth && !landscape) {
        positionCoins(wWidth, numItems, 10, 4.5)
    } else if (wHeight < wWidth && landscape) {
        positionCoins(wWidth, numItems, 4.5, 10)
    }
}

function positionCoins(wWidth, numItems, scale, prevScale) {
    landscape = !landscape
    let unit = (100 / wWidth)
    for (let i = 0; i < numItems; i++) {
        let marginOfTop = Math.round((parseInt($(".coin").eq(i).css("marginTop")) * unit) / prevScale)
        $(".coin").eq(i).css({
            marginTop: marginOfTop * scale + "vw"
        })
    }
  }

//fonction qui initie le tableau vierge
function getTab(lignes, col) {
    tab = []
    for (let i = 0; i < lignes; i++) {
        let ligne = []
        for (let k = 0; k < col; k++) {
            ligne.push(0)
        }
        tab.push(ligne)
    }
    return tab
}

// fonction qui gère les tours (joueur 1 ou joueur 2)
function play(){
    counter === 0 && !joueur && alert("joueur 2 commence !")
  	gameOn && joueur && player1();
  	gameOn && !joueur && player2();
    //player1() //activer pour enlever l'IA et mettre les autres lignes en commentaires
}


// fonction qui lance le tour du joueur 1
function player1(){
	$(".column").on("click", 
  	function(){
        if (gameOn){
            console.log("Joueur 1");
            let colId = parseInt(this.id);
            if (occuppees[colId] === nbLignes) {
                return
            }// ici l'ordre est important :  d'abord on retire le coup qu'on vient de faire des possibilités du joueur 2, sauf les coups perdants
            for(let i = 0; i < player2Options.length - 1; i++){
                let toRemove = player2Options[i].indexOf(colId)
                if( toRemove >= 0){
                    player2Options[i].splice(toRemove, 1)
                }
            }// et si on joue un coup perdant, alors le coup perdant passe dans les possibilités de gagner du joueur 2
            if(player2Options[5].indexOf(colId) >= 0){
                player2Options[0].push(colId)
                console.log("jai fait un mauvais coup !")
                console.log(player2Options)
            }
            getColumnValues(colId)
            //think() // pour le contrôle seulement; enlever dans le cadre de match contre l'IA
            console.log("Je joue en " + colId)
            player1Options = [[], [], [], [], [], []];
            checkAxis(1, true)
            play(); // désactiver pour enlever l'IA
        }
    })
}

// fonction qui lance le tour du joueur 2
function player2(){
    $("#text").fadeOut(speed)
    $("#text").html("")
    setTimeout(function(){
        console.log("___________________________________")
        console.log("Joueur 2");
        player2Options = [[], [], [], [], [], []];
        checkAxis(2, false)
        let colId = think();
        console.log("Je joue en " + colId)
        getColumnValues(colId);
        checkAxis(2, true)
        console.log("___________________________________")
    }, speed)
    $("#text").fadeIn(speed)
}

// fonction qui va initier une vérification du jeu tous azimuts
function checkAxis(player, checkwin){
    check(true, false, false, false, 0, nbLignes, 0, nbColonnes, "ligne", player, checkwin);
    check(false, true, false, false, 0, nbColonnes, 0, nbLignes, "colonne", player, checkwin);
    check(false, false, true, false, - 3, nbColonnes - 3, 0, nbLignes, "diagonale gauche droite", player, checkwin);
    check(false, false, false, true, 3, nbColonnes + 3, 0, nbLignes, "diagonale droite gauche", player, checkwin);
}

// fonction qui prend les décisions de l'IA (joueur 2)
function think(){
    if(playableColumns.length > 1) {
        let optionsData;
        if(player1Options[2].length >= player2Options[2].length) {
            optionsData = [player2Options[0], player1Options[0], player1Options[1], player2Options[1], player1Options[2], player2Options[2], player1Options[3], player2Options[3], player1Options[4], player2Options[4]];
        } else {
            optionsData = [player2Options[0], player1Options[0], player1Options[1], player2Options[1], player2Options[2], player1Options[2], player1Options[3], player2Options[3], player1Options[4], player2Options[4]];
        }
        console.log(optionsData)
        let forbidden = player2Options[5].concat(player1Options[5]);
        let refinedForbidden = []
        for(let i = 0; i < forbidden.length; i++) {
            if(refinedForbidden.indexOf(forbidden[i]) === -1) {
                refinedForbidden.push(forbidden[i])
            }
        }
        console.log(forbidden)
        console.log(refinedForbidden)
        let refinedData = [player2Options[0], player1Options[0]]
        for (let i = 2; i < optionsData.length; i++) { // on enleve les coups perdants des options de jeu
            let arr2 = getRefinedData(optionsData[i], refinedForbidden)
            refinedData.push(arr2)
            arr2 = []
        }
        let isEmpty = arr => Array.isArray(arr) && arr.every(isEmpty);
        if(!isEmpty(refinedData)) {
            //manageComments(refinedData, forbidden)
            return counterOrAttack(refinedData, refinedForbidden)
        }
        else if (isEmpty(refinedData)) {
            if(refinedForbidden.length === playableColumns.length) {
                console.log("toutes les colonnes sont en forbidden")
                let bestOption = getRefinedData(player2Options[5], player1Options[5])
                if(bestOption.length > 0) {
                    console.log("j'évite le forbidden ennemi")
                    $("#text").html(getRandom(comments.provoke, false))
                    return getRandom(bestOption, false)
                } else if (player2Options[5].length > 0) {
                    console.log("je joue mes forbidden")
                    $("#text").html(getRandom(comments.destabilize, false))
                    return getRandom(player2Options[5], false)
                } else if(player1Options[5].length > 0) {
                    console.log("pas le choix, je joue les forbidden ennemis")
                    $("#text").html(getRandom(comments.angry, false))
                    return getRandom(player1Options[5], false)
                }
            } else if(refinedForbidden.length !== playableColumns.length || isEmpty(refinedForbidden)) {
                console.log("HASARD")
                $("#text").html(getRandom(comments.bragg, false))
                let randomOptions = getRefinedData(playableColumns, refinedForbidden)
                console.log(randomOptions)
                let randomWeight = calculateWeight(1, randomOptions)
                let randomMax = Math.max(...randomWeight)
                let bestRandom = getRandom(randomWeight, randomMax)
                return randomOptions[bestRandom]
            }
        }
    } else { // si il n'y a plus qu'une colonne, alors on joue la colonne
        $("#text").html(getRandom(comments.destabilize, false))
        return playableColumns[0]
    }
}

function getRandom(data, condition){
    let random;
    if (condition){
        let arr = []
        let count = 0;
        for(let i = 0; i < data.length; i++){
            if(data[i] === condition){
                arr.push(count)
            }
            count++
        }
        random = Math.floor(Math.random() * arr.length)
        return arr[random]
    } else {
        random = Math.floor(Math.random() * data.length)
        return data[random]
    }
}

// fonction qui définit le commentaire
function manageComments(refinedData, forbidden, index) {
    switch (index) {
        case 0 :
            $("#text").html(getRandom(comments.IAWin, false))
        break;
        case 1 :
            refinedData[index].length === 1 ? $("#text").html(getRandom(comments.mock, false)) : $("#text").html(getRandom(comments.angry, false))
        break;
        case 2 :
            refinedData[index].length === 1 ? $("#text").html(getRandom(comments.provoke, false)) : $("#text").html(getRandom(comments.destabilize, false))
        break;
        case 3 :
            refinedData[index].length === 1 ? $("#text").html(getRandom(comments.trap, false)) : $("#text").html(getRandom(comments.bragg, false))
        break;
        case 4 :
            $("#text").html(getRandom(comments.general, false))
        break;
        case 5 :
            $("#text").html(getRandom(comments.general, false))
        break;
        case 6 :
            $("#text").html(getRandom(comments.general, false))
        break;
        case 7 :
            $("#text").html(getRandom(comments.general, false))
        break;
        case 8 :
            counter > 10 ? $("#text").html(getRandom(comments.bored, false)) : $("#text").html(getRandom(comments.general, false))
        break;
        case 9 :
            counter > 10 ? $("#text").html(getRandom(comments.bored, false)) : $("#text").html(getRandom(comments.general, false))
        break;
    }
}


function counterOrAttack(refinedData, refinedForbidden){
    for(let k = 0; k < refinedData.length; k++) {
        if(refinedData[k].length > 0) {
            manageComments(refinedData, refinedForbidden, k)
            if (refinedData[k].length === 1) {
                return refinedData[k][0]
            } else {
                let weight1 = calculateWeight(1, refinedData[k])
                console.log(refinedData[k])
                let max1 = Math.max(...weight1)
                let index1 = getRandom(weight1, max1)
                if(max1){
                    if(max1 === 0) {
                        alert("0 !")
                        console.log(playableColumns)
                        return getRandom(playableColumns, false)
                    } else {
                        return refinedData[k][index1]
                    }
                } else {
                    let randomOptions = getRefinedData(playableColumns, refinedForbidden)
                    console.log(randomOptions)
                    let randomWeight = calculateWeight(1, randomOptions)
                    let randomMax = Math.max(...randomWeight)
                    let bestRandom = getRandom(randomWeight, randomMax)
                    return randomOptions[bestRandom]
                }
            }
        }
    }
}

function getRefinedData(data, toCompare) {
    let arr= []
    for(let i = 0; i < data.length; i++) {
        if(toCompare.indexOf(data[i]) === -1) {
            arr.push(data[i])
        }
    }
    return arr
}

// fonction qui joue la colonne, pour le joueur 1 ou le joueur 2
function getColumnValues(colId) {
    counter < nbLignes * nbColonnes ? counter ++ : counter = 1;
    if(counter === nbLignes * nbColonnes) {gameOn = false} // si il y a autant de coups joués que de cases dans le jeu, alors le jeu s'arrête
    occuppees[colId] += 1;
    if(occuppees[colId] === nbLignes){
        let fullColumn = playableColumns.indexOf(parseInt(colId))
        playableColumns.splice(fullColumn, 1)
    }
    let player = joueur ? 1 : 2;
    let lineId = occuppees[colId] - 1;
    tab[lineId][colId] = player;
    creerJeton(colId, lineId + 1, player);
    joueur = !joueur;
}

// fonction qui affiche les jetons à l'écran et fait les animations
function creerJeton(colId, lineId, player) {
    let wWidth = window.innerWidth;
    let wHeight = window.innerHeight;
    let top = wHeight > wWidth ? -10 : -4.5
    let coin = $("<div class='coin'></div>");
    let destination = top * lineId;
    let margin = -200;
    let inner = player === 1 ? " #a30808" : "#cfbd00"
    speed = 80 * (nbLignes/(lineId + 1));
    coin.css({
  	    marginTop : margin + "px",
        background : player === 1 ? "red" : "gold",
        outlineColor : inner
    }).animate({
    marginTop : destination + "vw"
    }, speed).animate({
    marginTop : destination - 1 + "vw"
    }, 90).animate({
    marginTop : destination + "vw"
    }, 90)
    $(".column").eq(colId).append(coin);
}

function calculateWeight(player, refinedData){
    let weight = []
    for(let i = 0; i < refinedData.length; i++){
        let check1 = checkValidity([occuppees[refinedData[i]], refinedData[i]], 0, 1, -1, 0, 1, -1, player)
        let check2 = checkValidity([occuppees[refinedData[i]], refinedData[i]], 0, 0, -1, 0, 0, -1, player)
        let check3 = checkValidity([occuppees[refinedData[i]], refinedData[i]], -1, 0, -1, 0, -1, -1, player)
        let check4 = checkValidity([occuppees[refinedData[i]], refinedData[i]], -1, 0, 0, 0, -1, 0, player)
        let check5 = checkValidity([occuppees[refinedData[i]], refinedData[i]], -1, 0, 0, 1, -1, 1, player)
        let check6 = checkValidity([occuppees[refinedData[i]], refinedData[i]], 0, 0, 0, 1, 0, 1, player)
        let check7 = checkValidity([occuppees[refinedData[i]], refinedData[i]], 0, 1, 0, 1, 1, 1, player)
        let count = 0
        let check = [check1, check2, check3, check4, check5, check6, check7]
            for(let j = 1; j < check.length; j++) {
                if(check[j]) {
                    count ++
                }
            }
            weight.push(count)
    }
    return weight
}

// fonction principale de verification des axes :  vertical, ligne, diagonale gauche droite, diagonale droite gauche
function check(line, column, LtoR, RtoL, start1, end1, start2, end2, item, player, checkwin){
    arrPlayer = player === 1 ? player1Options : player2Options
	for (let i = start1; i < end1; i++){
    let coinCounter = 0;
        for (let k = start2; k < end2; k++){
            let arrCoords =	line ? [i, k] : 
                            column ? [k, i] : 
                            LtoR && i + k >= 0 && i + k < nbColonnes ?
                            [k, i + k] :
                            RtoL && i - k >=0 && i - k < nbColonnes &&
                            [k, i - k];
            let coords =	line ? 	tab[i][k] : 
                            column ? tab[k][i] : 
                            LtoR && i + k >= 0 && i + k < nbColonnes ?
                            tab[k][i + k] :
                            RtoL && i - k >=0 && i - k < nbColonnes &&
                            tab[k][i - k];
            if(coords === player) {
                coinCounter++;
                if(coinCounter === 1){
                   line && checkSpaceOf2Line(arrCoords, item, player)
                   LtoR && checkSpaceOf2LtoR(arrCoords, item, player)
                   RtoL && checkSpaceOf2RtoL(arrCoords, item, player)
                   line && checkBridgeof1Line(arrCoords, item, player)
                   LtoR && checkBridgeof1LtoR(arrCoords, item, player)
                   RtoL && checkBridgeof1RtoL(arrCoords, item, player)
                }
                else if(coinCounter === 2){
                   line && prevent3Line(arrCoords, item, player)
                   LtoR && prevent3LtoR(arrCoords, item, player)
                   RtoL && prevent3RtoL(arrCoords, item, player)
                   line && checkBridgeOf2Line(arrCoords, item, player)
                   LtoR && checkBridgeOf2LtoR(arrCoords, item, player)
                   RtoL && checkBridgeOf2RtoL(arrCoords, item, player)
                   column && prevent3Column(arrCoords, item, player)
                }
                else if(coinCounter === 3){
                    line && checkBridgeOf3Line(arrCoords, item, player)
                    LtoR && checkBridgeOf3LtoR(arrCoords, item, player)
                    RtoL && checkBridgeOf3RtoL(arrCoords, item, player)
                    column && preventWinColumn(arrCoords, item, player)
                }
                else if(checkwin && coinCounter === 4){
                    win(player)
                }
            }else{
                coinCounter = 0;
            }
        }
    }
}

function win(player){
    if(player === 1){
        score1 += 1
        $("#displayScore1").html(score1);
        $("#menu").css({
            backgroundImage: "url(https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/Gay_Pride_Flag.svg/1200px-Gay_Pride_Flag.svg.png)",
            backgroundSize: "100% 100%"
        });
        $("#win").html(getRandom(comments.YouWin, false));
        $("#announce").html("");
        $("#wintext").html("- Vous avez gagné !! -")
    } else {
        score2 += 1
        $("#displayScore2").html(score2);
        $("#menu").css({
            background : "black"
        });
        $("#win").html(getRandom(comments.IAWin, false));
        $("#announce").html("- L'IA a gagné -")
        $("#wintext").html('"' + getRandom(comments.win, false) + '"')
    }
    $("#textContinue").html(getRandom(comments.replay, false))
    $("#textCancel").html(getRandom(comments.cancel, false))
    $("#menu").fadeIn()
    getTab(nbLignes, nbColonnes)
    $("#continue").on("click", 
        function(){
            reinit()
        }
    )
    $("#cancel").on("click", 
        function(){
            $("#menu").fadeOut()
            gameOn = false;
        }
    )
}

function reinit(){
    $(".coin").remove()
    gameOn = true;
    player1Options = [[], [], [], [], [], []];
    player2Options = [[], [], [], [], [], []];
    occuppees = [0, 0, 0, 0, 0, 0, 0, 0];
    playableColumns = [0, 1, 2, 3, 4, 5, 6, 7];
    tab = getTab(nbLignes, nbColonnes)
    $("#menu").fadeOut()
    joueur = true;
    counter = 0;
    $("#text").html(getRandom(comments.start, false))
}

// fonction qui check les lignes en configuration X _ _ X en ligne
function checkSpaceOf2Line(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 0, 0, 3, 0, 3, player)
    let check2 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
    let check3 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, 0)
    let check4 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 0, 1)
    let check5 = checkSupport(arrCoords, -1, 0, 0, 2, -1, 2, -1, 0, 2)
    let check6 = checkSupport(arrCoords, -1, 0, 0, 3, -1, 3, -1, 0, 3)
    logicForSpaceOf2(arrCoords, item, check1, check2, check3, check4, check5, check6)
}

// fonction qui check les lignes en configuration X _ _ X en LtoR
function checkSpaceOf2LtoR(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 3, 0, 3, 3, 3, player)
    let check2 = checkValidity(arrCoords, 0, 1, 0, 1, 1, 1, 0)
    let check3 = checkValidity(arrCoords, 0, 2, 0, 2, 2, 2, 0)
    let check4 = checkSupport(arrCoords, 0, 0, 0, 1, 0, 1, -1, 0, 1)
    let check5 = checkSupport(arrCoords, 0, 1, 0, 2, 1, 2, -1, 1, 2)
    let check6 = checkSupport(arrCoords, 0, 2, 0, 3, 2, 3, -1, 2, 3)
    logicForSpaceOf2(arrCoords, item, check1, check2, check3, check4, check5, check6)
}

// fonction qui check les lignes en configuration X _ _ X en RtoL
function checkSpaceOf2RtoL(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 3, 0, -3, 3, -3, player)
    let check2 = checkValidity(arrCoords, 0, 1, 0, -1, 1, -1, 0)
    let check3 = checkValidity(arrCoords, 0, 2, 0, -2, 2, -2, 0)
    let check4 = checkSupport(arrCoords, 0, 0, 0, -1, 0, -1, -1, 0, -1)
    let check5 = checkSupport(arrCoords, 0, 1, 0, -2, 1, -2, -1, 1, -2)
    let check6 = checkSupport(arrCoords, 0, 2, -3, 0, 2, -3, -1, 2, -3)
    logicForSpaceOf2(arrCoords,item, check1, check2, check3, check4, check5, check6)
}

// fonction qui gère la logique des configurations X _ _ X
function logicForSpaceOf2(arrCoords, item, check1, check2, check3, check4, check5, check6) {
    check1 && check2 && check3 && check4 && check5 && check6 && (arrPlayer[4].push(check2[1]) && console.log(item + " : Prevent en " + check2[1]))
    check1 && check2 && check3 && check4 && check5 && check6 && (arrPlayer[4].push(check3[1]) && console.log(item + " : Prevent en " + check3[1]))
    check1 && check2 && check3 && check4 && !check5 && check6 && (arrPlayer[4].push(check2[1]) && console.log(item + " : Prevent en " + check2[1]))
    check1 && check2 && check3 && !check4 && check5 && check6 && (arrPlayer[4].push(check3[1]) && console.log(item + " : Prevent en " + check3[1]))
    check2 && !check1 && check3 && check4 && check5 && check6 && (arrPlayer[4].push(check2[1]) && console.log(item + " : Prevent en " + check2[1]))
    check2 && !check1 && check3 && check4 && check5 && check6 && (arrPlayer[4].push((check2[1] - 1)) && console.log(item + " : Prevent en " + (check2[1] - 1)))
    check2 && !check1 && check3 && check4 && check5 && check6 && (arrPlayer[4].push(check3[1]) && console.log(item + " : Prevent en " + check3[1]))
}

// fonction qui évite les pièges _x_x_ en ligne et bloque les alignements de 3 en _x_x_
function checkBridgeof1Line(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, player)
    let check2 = checkValidity(arrCoords, 0, 0, -1, 0, 0, -1, 0)
    let check3 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
    let check4 = checkValidity(arrCoords, 0, 0, 0, 3, 0, 3, 0)
    let check5 = checkSupport(arrCoords, -1, 0, -1, 0, -1, -1, -1, 0, -1)
    let check6 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 0, 1)
    let check7 = checkSupport(arrCoords, -1, 0, 0, 3, -1, 3, -1, 0, 3)
    logicForBridgeOf1(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, true, false, false, player)
}

// fonction qui évite les pièges _x_x_ en diagonale gauche droite et bloque les alignements de 3 en _x_x_
function checkBridgeof1LtoR(arrCoords, item, player){
        let check1 = checkValidity(arrCoords, 0, 2, 0, 2, 2, 2, player)
        let check2 = check1 && checkValidity(arrCoords, -1, 0, -1, 0, -1, -1, 0)
        let check3 = check1 && checkValidity(arrCoords, 0, 1, 0, 1, 1, 1, 0)
        let check4 = check1 && checkValidity(arrCoords, 0, 3, 0, 3, 3, 3, 0)
        let check5 = check1 && checkSupport(arrCoords, -2, 0, -1, 0, -2, -1, -2, -1, -1)
        let check6 = check1 && checkSupport(arrCoords, 0, 0, 0, 1, 0, 1, 0, 0, 1)
        let check7 = check1 && checkSupport(arrCoords, 0, 2, 0, 3, 2, 3, 0, 2, 3)
        logicForBridgeOf1(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, false, true, false, player)
}

// fonction qui évite les pièges _x_x_ en diagonale droite gauche et bloque les alignements de 3 en _x_x_
function checkBridgeof1RtoL(arrCoords, item, player){
        var check1 = checkValidity(arrCoords, 0, 2, -2, 0, 2, -2, player)
        var check2 = checkValidity(arrCoords, 0, 3, -3, 0, 3, -3, 0)
        var check3 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, 0)
        var check4 = checkValidity(arrCoords, -1, 0, 0, 1, -1, 1, 0)
        var check5 = checkSupport(arrCoords, 0, 2, -3, 0, 2, -3, 2, 2, 3)
        var check6 = checkSupport(arrCoords, 0, 0, -1, 0, 0, -1, 0, 0, -1)
        var check7 = checkSupport(arrCoords, -2, 0, 0, 1, -2, 1, -2, -1, 1)
        logicForBridgeOf1(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, false, false, true, player)
}

// fonction qui traite la logique des bridges de 1 _x_x_
function logicForBridgeOf1(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, line, LtoR, RtoL, player) {
    check1 && check2 && check3 && check4 && check5 && check6 && check7 && (arrPlayer[1].push(check3[1]) && console.log(item + " : Prevent Build Win en " + check3[1]))
    check1 && check2 && check3 && !check4 && check5 && check6 && (arrPlayer[2].push(check3[1]) && console.log(item + " : Prevent 3 en " + check3[1]))
    check1 && !check2 && check3 && check4 && check6 && check7 && (arrPlayer[2].push(check3[1]) && console.log(item + " : Prevent 3 en " + check3[1]))
    check1 && check2 && check5 && check3 && !check4 && (arrPlayer[2].push(check2[1]) && console.log(item + " : Prevent 3 en " + check2[1]))
    check1 && check4 && check7 && check3 && !check2 && (arrPlayer[2].push(check4[1]) && console.log(item + " : Prevent 3 en " + check4[1]))
    check1 && check2 && check3 && check4 && check5 && !check6 && check7 && (arrPlayer[3].push(check2[1]) && console.log(item + " : Prevent 3 en " + check2[1]))
    check1 && check2 && check3 && check4 && check5 && !check6 && check7 && (arrPlayer[3].push(check4[1]) && console.log(item + " : Prevent 3 en " + check4[1]))
}

// fonction qui évite les pièges _ _X X _ _ en ligne 
function prevent3Line(arrCoords, item, player){
    var check1 = checkValidity(arrCoords, 0, 0,-3, 0, 0, -3, 0)
    var check2 = checkValidity(arrCoords, 0, 0,-2, 0, 0, -2, 0)
    var check3 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
    var check4 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, 0)
    var check5 = checkSupport(arrCoords, -1, 0, -3, 0, -1, -3, -1, 0, -3)
    var check6 = checkSupport(arrCoords, -1, 0, -2, 0, -1, -2, -1, 0, -2)
    var check7 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 0, 1)
    var check8 = checkSupport(arrCoords, -1, 0, 0, 2, -1, 2, -1, 0, 2)
    logicForPrevent3(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, true, false, false, player)
}

// fonction qui évite les pièges _ _X X _ _ en diagonale LtoR
function prevent3LtoR(arrCoords, item, player) {
        var check1 = checkValidity(arrCoords, -3, 0, -3, 0, -3, -3, 0)
        var check2 = checkValidity(arrCoords, -2, 0, -2, 0, -2, -2, 0)
        var check3 = checkValidity(arrCoords, 0, 1, 0, 1, 1, 1, 0)
        var check4 = checkValidity(arrCoords,0, 2, 0, 2, 2, 2, 0)
        var check5 = checkSupport(arrCoords, -4, 0, -3, 0, -4, -3, -4, -3, -3)
        var check6 = checkSupport(arrCoords, -3, 0, -2, 0, -3, -2, -3, -2, -3)
        var check7 = checkSupport(arrCoords, 0, 0, 0, 1, 0, 1, 0, 0, 1)
        var check8 = checkSupport(arrCoords, 0, 1, 0, 2, 1, 2, 0, 1, 2)
        logicForPrevent3(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, false, true, false, player)
}

// fonction qui évite les pièges _ _X X _ _ en diagonale RtoL
function prevent3RtoL(arrCoords, item, player) {
        var check1 = checkValidity(arrCoords, 0, 2, -2, 0, 2, -2, 0)
        var check2 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, 0)
        var check3 = checkValidity(arrCoords, -2, 0, 0, 2, -2, 2, 0)
        var check4 = checkValidity(arrCoords, -3, 0, 0, 3, -3, 3, 0)
        var check5 = checkSupport(arrCoords, 0, 1, -2, 0, 1, -2, 0, 1, -2)
        var check6 = checkSupport(arrCoords, 0, 0, -1, 0, 0, -1, 0, 0, -1)
        var check7 = checkSupport(arrCoords, -3, 0, 0, 2, -3, 2, -3, -2, 2)
        var check8 = checkSupport(arrCoords, -4, 0, 0, 3, -4, 3, -4, -3, 3)
        logicForPrevent3(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, false, false, true, player)
}

// fonctionn qui traite la logique des Prevent 3 dans le cas de figure :  _ _ x x _ _
function logicForPrevent3(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, line, LtoR, RtoL, player){
    check1 && check2 && check3 && check4 && check5 && check6 && check7 && check8 && (arrPlayer[1].push(check2[1]) && console.log(item + ": Prevent Win en " + check2[1]));
    check1 && check2 && check3 && check4 && check5 && check6 && check7 && check8 && (arrPlayer[1].push(check3[1]) && console.log(item + ": Prevent Win en " + check3[1]));
    check1 && check2 && check3 && check5 && check6 && check7 && (arrPlayer[1].push(check2[1]) && console.log(item + ": Prevent Win en " + check2[1]));
    check2 && check3 && check4 && check6 && check7 && check8 && (arrPlayer[1].push(check3[1]) && console.log(item + ": Prevent Win en " + check3[1]));
    check2 && check6 && check3 && check7 && (arrPlayer[2].push(check2[1]) && console.log(item + ": Prevent 3 en " + check2[1]));
    check2 && check6 && check3 && check7 && (arrPlayer[2].push(check3[1]) && console.log(item + ": Prevent 3 en " + check3[1]));
    check1 && check2 && check6 && (arrPlayer[2].push(check2[1]) && console.log(item + ": Prevent 3 en " + check2[1]));
    check3 && check4 && check7 && (arrPlayer[2].push(check3[1]) && console.log(item + ": Prevent 3 en " + check3[1]));
    check1 && check2 && check5 && (arrPlayer[2].push(check1[1]) && console.log(item + ": Prevent 3 en " + check1[1]));
    check4 && check7 && check8 && (arrPlayer[2].push(check4[1]) && console.log(item + ": Prevent 3 en " + check4[1]));
    line && checkTRap(arrCoords, player, 1)
    line && checkTRap(arrCoords, player, 2)
    line && checkTRap(arrCoords, player, 3)
    line && checkTRap(arrCoords, player, 4)
    line && checkTRap(arrCoords, player, 5)
    line && checkTRap(arrCoords, player, 6)
}

// LtoR && check2 && check6 && check3 && check7 && (arrPlayer[2].push(check2[1]) && console.log(item + ": Prevent 3 en " + check2[1]));
// LtoR && check2 && check6 && check3 && check7 && (arrPlayer[2].push(check3[1]) && console.log(item + ": Prevent 3 en " + check3[1]));
// RtoL && check2 && check6 && check3 && check7 && (arrPlayer[2].push(check2[1]) && console.log(item + ": Prevent 3 en " + check2[1]));
// RtoL && check2 && check6 && check3 && check7 && (arrPlayer[2].push(check3[1]) && console.log(item + ": Prevent 3 en " + check3[1]));
// check2 && check6 && check3 && check7 && (arrPlayer[4].push(check2[1]) && console.log(item + ": Prevent 3 en " + check2[1]));
// check2 && check6 && check3 && check7 && (arrPlayer[4].push(check3[1]) && console.log(item + ": Prevent 3 en " + check3[1]));

// fonction qui contre les bridges x_xx_x en ligne
function checkBridgeOf2Line(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 0, -3, 0, 0, -3, player)
    let check2 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, player)
    let check3 = checkValidity(arrCoords, 0, 0, -2, 0, 0, -2, 0)
    let check4 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
    let check5 = checkSupport(arrCoords, -1, 0, -3, 0, -1, -3, -1, 0, -3)
    let check6 = checkSupport(arrCoords, -1, 0, -2, 0, -1, -2, -1, 0, -2)
    let check7 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 0, 1)
    let check8 = checkSupport(arrCoords, -1, 0, 0, 2, -1, 2, -1, 0, 2)
    logicForBridgeOf2(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, -2, -1, 1, -1, player, true, false, false)
}

// fonction qui contre les bridges x_xx_x en diagonale LtoR
function checkBridgeOf2LtoR(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, -3, 0, -3, 0, -3, -3, player)
    let check2 = checkValidity(arrCoords, 0, 2, 0, 2, 2, 2, player)
    let check3 = checkValidity(arrCoords, -2, 0, -2, 0, -2, -2, 0)
    let check4 = checkValidity(arrCoords, 0, 1, 0, 1, 1, 1, 0)
    let check5 = checkSupport(arrCoords, -4, 0, -3, 0, -4, -3, -4, -3, -3)
    let check6 = checkSupport(arrCoords, -3, 0, -2, 0, -3, -2, -3, -2, -2)
    let check7 = checkSupport(arrCoords,0, 0, 0, 1, 0, 1, 0, 0, 1)
    let check8 = checkSupport(arrCoords, 0, 1, 0, 2, 1, 2, 0, 1, 2)
    logicForBridgeOf2(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, -2, -3, 1, 0, player, false, true, false)
}

// fonction qui contre les bridges x_xx_x en diagonale RtoL
function checkBridgeOf2RtoL(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 2, -2, 0, 2, -2, player)
    let check2 = checkValidity(arrCoords, -3, 0, 0, 3, -3, 3, player)
    let check3 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, 0)
    let check4 = checkValidity(arrCoords, -2, 0, 0, 2, -2, 2, 0)
    let check5 = checkSupport(arrCoords, 0, 1, -2, 0, 1, -2, 0, 1, -2)
    let check6 = checkSupport(arrCoords, 0, 0, -1, 0, 0, -1, 0, 0, -1)
    let check7 = checkSupport(arrCoords, -3, 0, 0, 2, -3, 2, -3, -2, 2)
    let check8 = checkSupport(arrCoords, -4, 0, 0, -3, -4, 3, -4, -3, 3) 
    logicForBridgeOf2(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, -1, 0, 2, -3, player, false, false, true)
}

//fonction qui gère la logique des bridges x_xx_x
function logicForBridgeOf2(item, arrCoords, check1, check2, check3, check4, check5, check6, check7, check8, a, b, c, d, player, line, LtoR, RtoL){
    check1 && check3 && check5 && check6 && (arrPlayer[0].push(check3[1]) && console.log(item + ": Prevent Win en " + check3[1]))
    check2 && check4 && check7 && check8 && (arrPlayer[0].push(check4[1]) && console.log(item + ": Prevent Win en " + check4[1]))
    check1 && check5 && check3 && !check6 && occuppees[arrCoords[1] + a] === arrCoords[0] + b && (arrPlayer[5].push(check3[1]) && console.log(item + ": Forbidden en " + check3[1]))
    check2 && check4 && !check7 && check8 && occuppees[arrCoords[1] + c] === arrCoords[0] + d && (arrPlayer[5].push(check4[1]) && console.log(item + ": Forbidden en " + check4[1]))
}

// fonction qui empeche les colonnes de 3
function prevent3Column(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, 0)
    check1 && arrCoords[0] < nbLignes - 2 && (arrPlayer[2].push(check1[1]) && console.log(item + ": Prevent 3 en " + check1[1]))
}

// fonction qui empeche de gagner en colonne
function preventWinColumn(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, 0)
    arrCoords[0] <= nbLignes - 1 && check1 && (arrPlayer[0].push(check1[1]) && console.log(item + ": Prevent Win en " + check1[1]))
}

// fonction qui contre les combinaisons gagnantes _xxx_ en ligne
function checkBridgeOf3Line(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 0, -3, 0, 0, -3, 0)
    let check2 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
    let check3 = checkSupport(arrCoords, -1, 0, -3, 0, -1, -3, -1, 0, -3)
    let check4 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 0, 1)

    check1 && check3 && (arrPlayer[0].push(check1[1]) && console.log(item + ": Prevent Win en " + check1[1]))
    check2 && check4 && (arrPlayer[0].push(check2[1]) && console.log(item + ": Prevent Win en " + check2[1]))
    check1 && !check3 && occuppees[arrCoords[1] - 3] === arrCoords[0] - 1 && (arrPlayer[5].push((arrCoords[1] - 3)) && console.log(item + " : Forbidden en " + (arrCoords[1] - 3)))
    check2 && !check4 && occuppees[arrCoords[1] + 1] === arrCoords[0] - 1 && (arrPlayer[5].push((arrCoords[1] + 1)) && console.log(item + " : Forbidden en " + (arrCoords[1] + 1)))
    if(check1 || check2) trap(arrCoords, player, true, false, false, false)
    if(check1 || check2) trap(arrCoords, 0, true, false, false, true)
    checkTRap(arrCoords, player, 1)
    checkTRap(arrCoords, player, 2)
    checkTRap(arrCoords, player, 3)
    checkTRap(arrCoords, player, 4)
    checkTRap(arrCoords, player, 5)
    checkTRap(arrCoords, player, 6)
}

// fonction qui contre les combinaisons gagnantes _xxx_ en diagonale LtoR
function checkBridgeOf3LtoR(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, -3, 0, -3, 0, -3, -3, 0)
    let check2 = checkValidity(arrCoords, 0, 1, 0, 1, 1, 1, 0)
    let check3 = checkSupport(arrCoords, -4, 0, -3, 0, -4, -3, -4, -3, -3)
    let check4 = checkSupport(arrCoords,0, 0, 0, 1, 0, 1, 0, 0, 1)

    check1 && check3 && (arrPlayer[0].push(check1[1]) && console.log(item + ": Prevent Win en " + check1[1]))
    check2 && check4 && (arrPlayer[0].push(check2[1]) && console.log(item + ": Prevent Win en " + check2[1]))
    check1 && !check3 && occuppees[arrCoords[1] - 3] === arrCoords[0] - 4 && (arrPlayer[5].push((arrCoords[1] - 3)) && console.log(item + ": Forbidden en " + (arrCoords[1] - 3)))
    check2 && !check4 && occuppees[arrCoords[1] + 1] === arrCoords[0] && (arrPlayer[5].push((arrCoords[1] + 1)) && console.log(item + ": Forbidden en " + (arrCoords[1] + 1)))
    if(check1 || check2) trap(arrCoords, player, false, true, false, false)
    if(check1 || check2) trap(arrCoords, 0, false, true, false, true)
}

// fonction qui contre les combinaisons gagnantes _xxx_ en diagonale RtoL
function checkBridgeOf3RtoL(arrCoords, item, player){
    let check1 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, 0)
    let check2 = checkValidity(arrCoords, -3, 0, 0, 3, -3, 3, 0)
    let check3 = checkSupport(arrCoords, 0, 0, -1, 0, 0, -1, 0, 0, -1)
    let check4 = checkSupport(arrCoords, -4, 0, 0, 3, -4, 3, -4, -3, 3)

    check1 && check3 && (arrPlayer[0].push(check1[1]) && console.log(item + ": Prevent Win en " + check1[1]))
    check2 && check4 && (arrPlayer[0].push(check2[1]) && console.log(item + ": Prevent Win en " + check2[1]))
    check2 && !check4 && occuppees[arrCoords[1] + 3] === arrCoords[0] - 4 && (arrPlayer[5].push((arrCoords[1] + 3)) && console.log(item + ": Forbidden en " + (arrCoords[1] + 3)))
    check1 && !check3 && occuppees[arrCoords[1] - 1] === arrCoords[0] && (arrPlayer[5].push((arrCoords[1] - 1)) && console.log(item + ": Forbidden en " + (arrCoords[1] - 1)))
    if(check1 || check2) trap(arrCoords, player, false, false, true, false)
    if(check1 || check2) trap(arrCoords, 0, false, false, true, true)
}

// fonction qui vérifie la validité des checks (inférieur à nb de lignes et supérieur à 0, inférieur à nombre de colonnes et supérieur à 0)
function checkValidity(arrCoords, a, b, c, d, e, f, player){
    if( arrCoords[0] + a >= 0 &&
        arrCoords[0] + b < nbLignes &&
        arrCoords[1] + c >= 0 &&
        arrCoords[1] + d < nbColonnes &&
        tab[arrCoords[0] + e][arrCoords[1] + f] === player){
            return [arrCoords[0] + e, arrCoords[1] + f]
    } else {
        return false
    }
}

// fonction qui vérifie si le check a un support (si la ligne est à 0 ou bien si il est possible de jouer à la position du check)
function checkSupport(arrCoords, a, b, c, d, e, f, g, h, i){
    if( arrCoords[0] + a >= 0 && 
        arrCoords[0] + b < nbLignes && 
        arrCoords[1] + c >= 0 && 
        arrCoords[1] + d < nbColonnes && 
        tab[arrCoords[0] + e][arrCoords[1] + f] !== 0){ 
            return [arrCoords[0] + e, arrCoords[1] + f] 
    } else if (  
        arrCoords[0] + g < 0 && 
        arrCoords[0] + b < nbLignes &&
        arrCoords[1] + c >= 0 &&
        arrCoords[1] + d < nbColonnes){
            return [arrCoords[0] + h, arrCoords[1] + i]
    } else {
        return false
    }
}

function trap(arrCoords, player, line, LtoR, RtoL, zero) {
    let check1;
    let check2;
    let check3;
    if(line) {
        check1 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, player)
        check2 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, player)
        check3 = checkValidity(arrCoords, 0, 1, -2, 0, 1, -2, player)
        !zero && logicForTrapOf3(arrCoords, check1, check2, check3, 1, -2, 1, -1, 1, 0)
        zero && logicForTrapOfZero(check1, check2, check3, 1, -2, 1, -1, 1, 0)
    } else if(LtoR) {
        check1 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, player)
        check2 = checkValidity(arrCoords, 0, 0, -1, 0, 0, -1, player)
        check3 = checkValidity(arrCoords, -1, 0, -2, 0, -1, -2, player)
        !zero && logicForTrapOf3(arrCoords, check1, check2, check3, -1, -2, 0, -1, 1, 0)
        zero && logicForTrapOfZero(check1, check2, check3, -1, -2, 0, -1, 1, 0)
    } else if(RtoL) {
        check3 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, player)
        check2 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, player)
        check1 = checkValidity(arrCoords, -1, 0, 0, 2, -1, 2, player)
        !zero && logicForTrapOf3(arrCoords, check1, check2, check3, 1, 0, 0, 1, -1, 2)
        zero && logicForTrapOfZero(check1, check2, check3, 1, 0, 0, 1, -1, 2)
    }
}

function logicForTrapOf3(arrCoords, check1, check2, check3, a, b, c, d, e, f) {
    check1 && check2 && tab[arrCoords[0] + a][arrCoords[1] + b] === 0 && (arrPlayer[1].push(check2[1] - 1) && console.log(check1 + " - " + check2 + " Piège  en " + (check2[1] - 1) + " !"))
    check1 && check3 && tab[arrCoords[0] + c][arrCoords[1] + d] === 0 && (arrPlayer[1].push(check1[1] - 1) && console.log(check1 + " - " + check3 + " Piège  en " + (check1[1] - 1) + " !"))
    check2 && check3 && tab[arrCoords[0] + e][arrCoords[1] + f] === 0 && (arrPlayer[1].push(check2[1] + 1) && console.log(check2 + " - " + check3 + " Piège  en " + (check2[1] + 1) + " !"))
}

function logicForTrapOfZero(check1, check2, check3, a, b, c, d, e, f) {
    console.log(check1 + " - " + check2 + " - " + check3)
    check1 && check2 && check3 && (arrPlayer[1].push(check2[1]) && console.log(check2 + " Piège  en " + (check2[1]) + " !"))
    check1 && check2 && (arrPlayer[2].push(check1[1]) && console.log(check1 + " - " + check2 + " Piège en retard en " + (check1[1]) + " !"))
    check1 && check3 && (arrPlayer[2].push(check3[1]) && console.log(check1 + " - " + check3 + " Piège en retard en " + (check3[1]) + " !"))
    check2 && check3 && (arrPlayer[2].push(check2[1]) && console.log(check2 + " - " + check3 + " Piège en retard en " + (check2[1]) + " !"))
}

function checkTRap(arrCoords, player, context){
    let check1;
    let check2;
    let check3;
    let check4;
    let check5;
    let check6;
    let check7;
    if (context === 1){
        check1 = checkValidity(arrCoords, -1, 0, 0, 0, -1, 0, player)
        check2 = checkValidity(arrCoords, -2, 0, -1, 0, -2, -1, player)
        check3 = checkValidity(arrCoords, 0, 1, 0, 2, 1, 2, 0)
        check4 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, 0)
        check5 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, -1, 1)
        check6 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
        check7 = checkSupport(arrCoords, -1, 0, 0, 2, -1, 2, -1, -1, 2)
    } else if(context === 2){
        check1 = checkValidity(arrCoords, -1, 0, 0, 2, -1, 2, player)
        check2 = checkValidity(arrCoords, -2, 0, 0, 3, -2, 3, player)
        check3 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, 0)
        check4 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, 0)
        check5 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, -1, 1)
        check6 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
        check7 = false
    } else if(context === 3){
        check1 = checkValidity(arrCoords, -1, 0, -1, 0, -1, -1, player)
        check2 = checkValidity(arrCoords, -2, 0, 0, 0, -2, 0, player)
        check3 = checkValidity(arrCoords, 0, 1, -3, 0, 1, -3, 0)
        check4 = checkValidity(arrCoords, 0, 0, -3, 0, 0, -3, 0)
        check5 = checkSupport(arrCoords, -1, 0, 0, -2, -1, -2, -1, -1, -2)
        check6 = checkValidity(arrCoords, 0, 0, -2, 0, 0, -2, 0)
        check7 = checkSupport(arrCoords, -1, 0, -3, 0, -1, -3, -1, -1, -3)
    } else if(context === 4){
        check1 = checkValidity(arrCoords, -1, 0, -3, 0, -1, -3, player)
        check2 = checkValidity(arrCoords, -2, 0, -4, 0, -2, -4, player)
        check3 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, 0)
        check4 = checkValidity(arrCoords, 0, 0, -3, 0, 0, -3, 0)
        check5 = checkSupport(arrCoords, -1, 0, -2, 0, -1, -2, -1, -1, -2)
        check6 = checkValidity(arrCoords, 0, 0, -2, 0, 0, -2, 0)
        check7 = false
    } else if(context === 5){
        check1 = checkValidity(arrCoords, 0, 1, 0, 0, 1, 0, player)
        check2 = checkValidity(arrCoords, 0, 2, -1, 0, 2, -1, player)
        check3 = checkValidity(arrCoords, -1, 0, 0, 2, -1, 2, 0)
        check4 = checkValidity(arrCoords, 0, 0, 0, 2, 0, 2, 0)
        check5 = checkSupport(arrCoords, -1, 0, 0, 1, -1, 1, -1, 1, 1)
        check6 = checkValidity(arrCoords, 0, 0, 0, 1, 0, 1, 0)
        check7 = false
    } else if(context === 6){
        check1 = checkValidity(arrCoords, 0, 1, -1, 0, 1, -1, player)
        check2 = checkValidity(arrCoords, 0, 2, 0, 0, 2, 0, player)
        check3 = checkValidity(arrCoords, -1, 0, -3, 0, -1, -3, 0)
        check4 = checkValidity(arrCoords, 0, 0, -3, 0, 0, -3, 0)
        check5 = checkSupport(arrCoords, -1, 0, -2, 0, -1, -2, -1, -1, -2)
        check6 = checkValidity(arrCoords, 0, 0, -2, 0, 0, -2, 0)
        check7 = false
    }
    check1 && check2 && check3 && check4 && check5 && check6 && (arrPlayer[1].push(check5[1]) && console.log("Piège en " + check5[1]))
    check1 && check2 && check3 && check4 && !check5 && check6 && occuppees[check6[1]] === arrCoords[0] - 1 && (arrPlayer[5].push(check6[1]) && console.log("Forbidden en " + check6[1]))
    check1 && check2 && check3 && check4 && !check5 && check6 && check7 && (arrPlayer[1].push(check7[1]) && console.log("Piège en " + check7[1]))
}