<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;

class GameController extends AbstractController
{
    /**
     * @Route("/", name="game")
     */
    public function afficher_plateau()
    {
        
        $imgs = array_diff(scandir("images/fruits"), array('..', '.'));

        $nb_fruits = count($imgs);


        // on tire 14 pairs pour constituer le deck
        shuffle($imgs);
        $imgs = array_slice($imgs,0,14);
        $decks = array_merge($imgs,$imgs);
        

        // on enlève l'extension png
        $decks = array_map(function($img){
            return(str_replace(".png","",$img));
        },$decks);

            
        // on mélange le deck
        shuffle($decks);

        
        return $this->render('game/plateau.html.twig', [
            'decks' => $decks,
        ]);
    }
}
