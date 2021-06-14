'use strict';
const { Game } = require('./game-class');

/**
 * Legend
 * red board squares >> R
 * red mem >> -
 * red king >> =
 * white board squares >> W
 * white mem >> +
 * white king >> *
 */

const main = () => {
  try {
    const game = new Game();

    // Test create empty table
    /*game.resetTable();
    game.display();*/

    // Test locate parts in their initial positions
    game.newGame();
    game.display();

    // Test moves in mem
    /*game.printPossibleMoves(5, 0);
    game.printPossibleMoves(5, 2);
    game.printPossibleMoves(7, 2);*/

    // Test moves in kings
    /*game.deletePiece(1, 2);
    game.deletePiece(1, 4);
    game.setKing(2, 3);
    game.display();
    game.printPossibleMoves(2, 3);*/

    // Test jumps in mem
    /*game.deletePiece(5, 0);
    game.deletePiece(5, 2);
    game.deletePiece(5, 4);
    game.deletePiece(5, 6);
    game.deletePiece(6, 1);
    game.deletePiece(6, 3);
    game.deletePiece(6, 5);
    game.deletePiece(6, 7);
    game.display();
    game.setMove(7, 0, 3, 2);
    game.setMove(7, 2, 3, 4);
    game.setMove(7, 4, 5, 4);
    // game.setMove(7, 6, 5, 2);
    game.display();
    game.printPossibleJumps(2, 3);*/

    // Test jumps in kings
    /*game.deletePiece(5, 0);
    game.deletePiece(5, 2);
    game.deletePiece(5, 4);
    game.deletePiece(5, 6);
    game.deletePiece(6, 1);
    game.deletePiece(6, 3);
    game.deletePiece(6, 5);
    game.deletePiece(6, 7);
    game.setKing(2, 3);
    game.display();
    game.setMove(7, 0, 3, 2);
    game.setMove(7, 2, 3, 4);
    game.setMove(7, 4, 5, 4);
    game.setMove(7, 6, 5, 2);
    game.display();
    game.printPossibleJumps(2, 3)*/

    // Test pieces with valid moves for a color ('R', 'W')
    /*game.printPiecesWithValidMovesByColor('W');*/
  } catch (error) {
    console.log(error);
  }
};

if (require.main === module) {
  main();
  process.exit();
}
