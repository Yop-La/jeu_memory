console.log('debut');

var cardsFound = 0;

var candidat1=false;
var candidat2=false;

var coupReussi = true;

const sleep = (milliseconds) => {
    return new Promise(resolve => setTimeout(resolve, milliseconds))
  }
  

$(document).ready(function(){
    console.log('debut');
    $(".card-cell").click(function(){

        // on peut pas cliquer sur un found
        // on peut pas cliquer sur un candidat1        
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
                console.log("Tu as déjà joué cette carte !")
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
                    console.log('Cartes trouvées: '. concat(cardsFound));
                    coupReussi=true;

                }else{
                    coupReussi=false;                    
                }

               

            }
        }

    });
});

console.log('fin');