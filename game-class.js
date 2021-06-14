'use strict';

class Game {
  constructor() {
    this.table;
    this.rounds;
    this.turn;
    this.whiteCapturedPieces;
    this.blackCapturedPieces;
  }

  static get boardRowSize() {
    return 8;
  }

  static get possibleMovesKing() {
    const dr = [-1, -1, 1, 1];
    const dc = [-1, 1, -1, 1];
    return { dr, dc };
  }

  static get possibleJumpsKing() {
    const dr = [-2, -2, 2, 2];
    const dc = [-2, 2, -2, 2];
    return { dr, dc };
  }

  static get possibleMovesWhiteMen() {
    const dr = [1, 1];
    const dc = [-1, 1];
    return { dr, dc };
  }

  static get possibleJumpsWhiteMen() {
    const dr = [2, 2];
    const dc = [-2, 2];
    return { dr, dc };
  }

  static get possibleMovesRedMen() {
    const dr = [-1, -1];
    const dc = [-1, 1];
    return { dr, dc };
  }

  static get possibleJumpsRedMen() {
    const dr = [-2, -2];
    const dc = [-2, 2];
    return { dr, dc };
  }

  static _checkRowAndCol(row, col) {
    if (isNaN(row) || isNaN(col)) throw new Error('Row or Column are not numbers');
    if (row < 0 || row > Game.boardRowSize - 1 || col < 0 || col > Game.boardRowSize)
      throw new Error('Row or Column are not valid numbers');
  }

  _getPositionOnTable(row, col) {
    Game._checkRowAndCol(row, col);
    return this.table[row][col];
  }

  _setPositionOnTable(row, col, data) {
    Game._checkRowAndCol(row, col);
    this.table[row][col] = data;
  }

  _squareColor(row, col) {
    return (row + col) % 2 ? 'R' : 'W';
  }

  _copyTable() {
    const answer = [];
    for (const row of this.table) {
      const temp = [];
      for (const col of row) {
        temp.push(col);
      }
      answer.push(temp);
    }
    return answer;
  }

  _findPossibleMoves(row, col, color1, color2, table, dr, dc, depth) {
    if (row < 0 || row > Game.boardRowSize - 1 || col < 0 || col > Game.boardRowSize - 1) return 0;
    if (table[row][col] !== color1) return 0;
    if (depth === 2) return 0;
    let answer = 1;
    table[row][col] = color2;
    for (let i = 0; i < dr.length; ++i) {
      answer += this._findPossibleMoves(row + dr[i], col + dc[i], color1, color2, table, dr, dc, depth + 1);
    }
    return answer;
  }

  _findPossibleJumps(row, col, color1, color2, toEat, table, dr, dc, rowEat, colEat) {
    if (row < 0 || row > Game.boardRowSize - 1 || col < 0 || col > Game.boardRowSize - 1) return 0;
    if (table[row][col] !== color1) return 0;
    let answer = 1;
    table[row][col] = color2;
    table[rowEat][colEat] = color2;
    for (let i = 0; i < dr.length; ++i) {
      if (!toEat.includes(table[row + dr[i] / 2][col + dc[i] / 2])) continue;
      answer += this._findPossibleJumps(
        row + dr[i],
        col + dc[i],
        color1,
        color2,
        toEat,
        table,
        dr,
        dc,
        row + dr[i] / 2,
        col + dc[i] / 2
      );
    }
    table[row][col] = color1;
    return answer;
  }

  display() {
    if (!this.table) throw new Error('No board created yet');
    for (const row of this.table) {
      for (const col of row) process.stdout.write(col);
      console.log();
    }
    console.log();
  }

  // Problems with jumps, forgotten
  makeMove(currentRow, currentCol, nextRow, nextCol) {
    let dr, dc;
    const currentPosition = this._getPositionOnTable(currentRow, currentCol);
    const nextPosition = this._getPositionOnTable(nextRow, nextCol);

    if (['R', 'W'].includes(currentPosition)) throw new Error('No piece in the current position');
    if (!['R', 'W'].includes(nextPosition)) throw new Error('There is a piece in the next position');
    if (this.turn === 0 && currentPosition === '+') {
      dr = Game.possibleMovesRedMen.dr;
      dc = Game.possibleMovesRedMen.dc;
    } else if (this.turn === 0 && currentPosition === '*') {
      dr = Game.possibleMovesKing.dr;
      dc = Game.possibleMovesKing.dc;
    } else if (this.turn === 1 && currentPosition === '-') {
      dr = Game.possibleMovesWhiteMen.dr;
      dc = Game.possibleMovesWhiteMen.dc;
    } else if (this.turn === 1 && currentPosition === '=') {
      dr = Game.possibleMovesKing.dr;
      dc = Game.possibleMovesKing.dc;
    } else throw new Error("It's not that color's turn");

    // Check if is a possible move
    const difRow = nextRow - currentRow;
    const difCol = nextCol - currentCol;
    const indexRow = dr.indexOf(difRow);
    const indexCol = dr.indexOf(difCol);
    if (indexRow !== -1 && indexCol !== -1 && indexRow === indexCol) {
      if (this.turn === 0 && nextRow === 0) currentPosition = '*';
      if (this.turn === 1 && nextRow === Game.boardRowSize - 1) currentPosition = '=';
      this._setPositionOnTable(nextRow, nextCol, currentPosition);
      this._setPositionOnTable(currentRow, currentCol, 'R');
      this.turn ^= 1;
    } else throw new Error('Movement not valid');
  }

  setMove(currentRow, currentCol, nextRow, nextCol) {
    const currentPosition = this._getPositionOnTable(currentRow, currentCol);
    const nextPosition = this._getPositionOnTable(nextRow, nextCol);
    this._setPositionOnTable(nextRow, nextCol, currentPosition);
    this._setPositionOnTable(currentRow, currentCol, nextPosition);
  }

  setKing(row, col) {
    const position = this._getPositionOnTable(row, col);
    if (position === '+') this._setPositionOnTable(row, col, '*');
    else if (position === '-') this._setPositionOnTable(row, col, '=');
    else throw new Error('No valid piece to crown');
  }

  deletePiece(row, col) {
    this._setPositionOnTable(row, col, this._squareColor(row, col));
  }

  // Exercises requested
  // Exercise 1
  resetTable() {
    this.table = [];
    this.rounds = 0;
    this.turn = 0;
    this.whiteCapturedPieces = 0;
    this.blackCapturedPieces = 0;
    for (let i = 0; i < Game.boardRowSize; ++i) {
      const row = [];
      for (let j = 0; j < Game.boardRowSize; ++j) {
        row.push(this._squareColor(i, j));
      }
      this.table.push(row);
    }
  }

  // Exercise 2
  newGame() {
    this.resetTable();
    for (let i = 0; i < Game.boardRowSize; ++i) {
      for (let j = 0; j < Game.boardRowSize; ++j) {
        if (i < 3 && this._squareColor(i, j) === 'R') this.table[i][j] = '-';
        if (i > 4 && this._squareColor(i, j) === 'R') this.table[i][j] = '+';
      }
    }
  }

  // Exercise 3 and 6
  printPossibleMoves(row, col, print = true) {
    let dr, dc;
    const copiedTable = this._copyTable();
    const position = this._getPositionOnTable(row, col);
    if (position === '+') {
      dr = Game.possibleMovesRedMen.dr;
      dc = Game.possibleMovesRedMen.dc;
    } else if (position === '-') {
      dr = Game.possibleMovesWhiteMen.dr;
      dc = Game.possibleMovesWhiteMen.dc;
    } else if (position === '*') {
      dr = Game.possibleMovesKing.dr;
      dc = Game.possibleMovesKing.dc;
    } else if (position === '=') {
      dr = Game.possibleMovesKing.dr;
      dc = Game.possibleMovesKing.dc;
    } else throw new Error('No piece on the current position');
    copiedTable[row][col] = 'R';
    const answer = this._findPossibleMoves(row, col, 'R', '.', copiedTable, dr, dc, 0) - 1;
    if (print) console.log(answer);
    else return answer;
  }

  // Exercise 4 and 7
  printPossibleJumps(row, col) {
    let toEat;
    let dr, dc;
    const copiedTable = this._copyTable();
    const position = this._getPositionOnTable(row, col);
    if (position === '+') {
      toEat = ['-', '='];
      dr = Game.possibleJumpsRedMen.dr;
      dc = Game.possibleJumpsRedMen.dc;
    } else if (position === '-') {
      toEat = ['+', '*'];
      dr = Game.possibleJumpsWhiteMen.dr;
      dc = Game.possibleJumpsWhiteMen.dc;
    } else if (position === '*') {
      toEat = ['-', '='];
      dr = Game.possibleJumpsKing.dr;
      dc = Game.possibleJumpsKing.dc;
    } else if (position === '=') {
      toEat = ['+', '*'];
      dr = Game.possibleJumpsKing.dr;
      dc = Game.possibleJumpsKing.dc;
    } else throw new Error('No piece on the current position');
    copiedTable[row][col] = 'R';
    console.log(this._findPossibleJumps(row, col, 'R', '.', toEat, copiedTable, dr, dc, 0) - 1);
  }

  // Exercise 5
  printPiecesWithValidMovesByColor(color) {
    const pieces = color === 'W' ? ['-', '='] : ['+', '*'];
    for (let i = 0; i < Game.boardRowSize; ++i) {
      for (let j = 0; j < Game.boardRowSize; ++j) {
        if (pieces.includes(this.table[i][j])) {
          if (this.printPossibleMoves(i, j, false)) console.log(i, j);
        }
      }
    }
  }
}

module.exports = {
  Game
};
