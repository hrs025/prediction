import { context, u128, RNG, ContractPromiseBatch} from "near-sdk-as";

import {GameState, Prediction, gameMap } from './model';

export function Create(): u32 {
  const prediction = new Prediction();
  gameMap.set(prediction.predictionID , prediction);
  return prediction.predictionID;
}

export function Predict(_predictionID: u32, _guess1: u32, _guess2: u32): String{
  if(context.attachedDeposit == u128.Zero){
    return 'error in assigning initial amount.';
  }
  const game = gameMap.getSome(_predictionID);
  game.player = context.sender;
  game.gamestate = GameState.joined;
  game.guess1 = _guess1;
  game.guess2 = _guess2;
  game.plyrAmount = context.attachedDeposit;
  gameMap.set(_predictionID, game);
  return 'Prediction Done.';
}

export function End(_predictionID: u32): string{
  const game = gameMap.getSome(_predictionID);
  let rng1 = new RNG<u32>(1, 3);
  let rng2 = new RNG<u32>(1, 3);
  let home = rng1.next()
  let away = rng2.next()
  

  if(game.guess1 == home)
  {
    if(game.guess2 == away){
      game.winner = game.player; 
    }
    else{
      game.winner = "none"; 
    }
  } else{
    game.winner = "none";
  }


  game.gamestate = GameState.ended;
  gameMap.set(_predictionID, game);

  const to_owner = ContractPromiseBatch.create("demo025.testnet");
  const to_winner = ContractPromiseBatch.create(game.player);
  
  
  // Statements
  const dash = "-";
  let Slost = ",  lost and Score: " +home.toString() +dash +away.toString();
  let Swin= ",  Winner and Score: " +home.toString() +dash +away.toString();
  // 
  
  if(game.winner== "none"){
      to_owner.transfer(u128.add(game.plyrAmount, game.initialAmount));
      return game.player +Slost;
  }else {
      to_owner.transfer(game.plyrAmount);
      to_winner.transfer(game.initialAmount);
      return game.player +Swin;
  }
}