import { context, u128, RNG, PersistentMap} from "near-sdk-as";

export enum GameState{
  created,
  joined,
  ended,
}

@nearBindgen
export class Prediction {
  predictionID: u32;
  player: string;
  winner: string;
  guess1: u32;
  guess2: u32;
  initialAmount: u128;
  plyrAmount: u128;
  gamestate: GameState;

  constructor(){
    const rng = new RNG<u32>(1, u32.MAX_VALUE);
    const roll = rng.next();
    this.predictionID = roll;
    this.plyrAmount = u128.Zero;
    this.initialAmount = context.attachedDeposit;
    this.gamestate = GameState.created;
  }
}

export const gameMap = new PersistentMap<u32, Prediction>("gr");
