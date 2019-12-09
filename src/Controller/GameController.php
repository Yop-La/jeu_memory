<?php

namespace App\Controller;

use App\Entity\Game;
use App\Repository\GameRepository;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Common\Persistence\ObjectManager;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class GameController extends AbstractController
{
    /**
     * @Route("/", name="plateau")
     */
    public function afficher_plateau(GameRepository $repo)
    {
        
        $games = $repo->findTopTenBestPlayers();

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
            'games' => $games
        ]);
    }

    /**
     * @Route("/games/delete", name="delete_games")
     */
    public function deleteGames(GameRepository $repo)
    {

        $repo->deleteAll();

        return new Response(
            '<html><body>Scores supprimés</body></html>'
        );
    
    }


    /** 
    * @Route("/game",name="game") 
    */ 
    public function game(Request $request) {  
        
        $manager = $this->getDoctrine()->getManager();

        $method = $request->getMethod();

        if($method != 'POST'){
            $jsonData['msg'] = 'Bad request. Only post request is accepted';
        }

        

        $body = $request->getContent();
        $body = json_decode($body);

        
        $game = new Game();
        $game->setPseudo($request->request->get('pseudo'))
            ->setScore($request->request->get('score'));        
        $manager->persist($game);
        $manager->flush();

        $jsonData = array();
        $jsonData['msg'] = $method;
        $jsonData['body'] = $body;
        $jsonData['statut'] = 'ok';
        $jsonData['type'] = gettype($body);

        return new JsonResponse($jsonData); 
        
    }  







}
