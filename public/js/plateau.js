console.log('debut');

var cardsFound = 0;

var candidat1=false; // 1ere carte retourné
var candidat2=false; // 2eme carte retourné

var coupReussi = true;
var victory = false;
var gameOver = false;
var gameStarted = false;

var messageFinPartie = "Tu as perdu !";
var pseudo = 'xxx';

var gameTimeLimit = 100*1000;
var gameTime = 0;

var lock = false;

$(document).ready(function(){


    $(".start-game").click(function(){

        pseudo = window.prompt("Entre ton prénom pour rentrer dans l'histoire");

        if (pseudo === null || pseudo == ""){
            pseudo = 'xxx';
        }


        $('#pseudo').text(pseudo);

        $('.game').removeClass('hide');
        $('.launcher').addClass('hide');


        gameStarted=true;

    });


    $(".card-cell").click(function(){


        if($(this).hasClass("found")){
            return;
        }

        // mécanisme de verrou
        if(!lock){
            lock=true;

            // plus possible de cliquer sur les cartes quand la partie est finie
            if(!victory && !gameOver)
            {

                // on cache les cartes après un coup pas réussi
                if(!coupReussi && candidat2){
                    console.log('on cache les cartes, le coup n\'est pas réussi');  
                    $('#'.concat(candidat1)).find('.card').addClass('hide');
                    $('#'.concat(candidat2)).find('.card').addClass('hide');
                }

                if(candidat2){
                    candidat1=false;
                    candidat2=false;
                }
            

                if(!candidat2){
                    
                    var candidat = $(this).attr('id');

                    if(candidat == candidat1){
                        console.log("Tu as déjà joué cette carte !");
                        lock = false;
                        return;
                    }

                    $('#'.concat(candidat)).find('.card').removeClass('hide');

                    if(!candidat1){
                        candidat1 = candidat;
                        candidat2=false;
                        
                    }else{

                        
                        candidat2 = candidat;

                        var fruit1 = candidat1.split("_")[0];
                        var fruit2 = candidat2.split("_")[0];

                        if(fruit1 == fruit2 && candidat1 != candidat2){
                            console.log('Bravo, le coup est réussi !');
                            cardsFound=cardsFound+2;

                            $('#'.concat(candidat1)).addClass('found');
                            $('#'.concat(candidat2)).addClass('found');

                            if(cardsFound == 28){
                                messageFinPartie = "Tu as gagné !";
                                $('.restart').removeClass('hide');
                                alert("Victoire !!");
                                victory=true;



                                $.post( "game", {"pseudo":pseudo,"score":(gameTimeLimit-gameTime)/1000})
                                .done(function( data ) {
                                    console.log("ajax fait");
                                    console.log(data);
                                })
                                .fail(function(err){
                                    console.log("erreur ajax");
                                    console.log(err);
                                });

                            }
                            console.log('Cartes trouvées: '. concat(cardsFound));
                            coupReussi=true;

                        }else{
                            coupReussi=false;                    
                        }

                    

                    }
                }
            }else
            
            {

                alert('La partie est terminée !'.concat(' ',messageFinPartie));

            }

            lock = false;
        }

    });

    $( "#progressbar" ).progressbar({
        value: 0
    });


    /* partie sur la barre de proge du temps */
    var myVar = setInterval(timer, 1000);



    function timer() {

        if(!gameOver && gameStarted && !victory){
            
            gameTime=gameTime+1000;

            var progression = gameTime*100/gameTimeLimit;
            
            console.log(progression);

            if(progression>=0 && progression < 70){
                $(".ui-widget-header").addClass("bg-success");
            }

            if(progression>=70 && progression < 95){
                $(".ui-widget-header").addClass("bg-warning");
            }


            if(progression>=95){
                $(".ui-widget-header").addClass("bg-danger");
            }

            $('#timer').text('Temps restant: '.concat((gameTimeLimit-gameTime)/1000,' secondes'));

            $( "#progressbar" ).progressbar({
                value: progression,
                classes: {
                    "ui-progressbar": "highlight"
                }
            });

            if(gameTime == gameTimeLimit){
                alert('Temps écoulé !'.concat(' ',messageFinPartie));
                $('.restart').removeClass('hide');
                gameOver = true;
            }
        }

    }


});
