class ParchisGame {
  constructor() {
    this.canvas = document.getElementById('board');
    this.ctx = this.canvas.getContext('2d');
    this.turnElem = document.getElementById('turn');
    this.diceElem = document.getElementById('dice');
    this.rollBtn = document.getElementById('roll');
    this.msgElem = document.getElementById('message');

    this.center = 300;
    this.radius = 240;
    this.pieceRadius = 12;

    this.colors = ['yellow', 'red', 'blue', 'green'];
    this.colorMap = {
      yellow: '#e6e600',
      red: '#d60000',
      blue: '#0066d6',
      green: '#009933'
    };
    this.startOffset = {
      yellow: 0,
      red: 17,
      blue: 34,
      green: 51
    };

    // create board coordinates
    this.path = [];
    for (let i = 0; i < 68; i++) {
      const angle = Math.PI / 2 - (2 * Math.PI * i) / 68;
      const x = this.center + this.radius * Math.cos(angle);
      const y = this.center - this.radius * Math.sin(angle);
      this.path.push({ x, y });
    }

    this.finalPaths = {};
    for (const color of this.colors) {
      const startIdx = this.startOffset[color];
      const startAngle = Math.PI / 2 - (2 * Math.PI * startIdx) / 68;
      this.finalPaths[color] = [];
      for (let s = 1; s <= 6; s++) {
        const r = this.radius - (s * this.radius) / 7;
        const x = this.center + r * Math.cos(startAngle);
        const y = this.center - r * Math.sin(startAngle);
        this.finalPaths[color].push({ x, y });
      }
    }

    this.basePos = {
      yellow: [
        { x: 90, y: 510 },
        { x: 150, y: 510 },
        { x: 90, y: 570 },
        { x: 150, y: 570 }
      ],
      red: [
        { x: 450, y: 90 },
        { x: 510, y: 90 },
        { x: 450, y: 150 },
        { x: 510, y: 150 }
      ],
      blue: [
        { x: 450, y: 510 },
        { x: 510, y: 510 },
        { x: 450, y: 570 },
        { x: 510, y: 570 }
      ],
      green: [
        { x: 90, y: 90 },
        { x: 150, y: 90 },
        { x: 90, y: 150 },
        { x: 150, y: 150 }
      ]
    };

    this.players = this.colors.map(color => ({
      color,
      pieces: [-1, -1, -1, -1]
    }));

    this.current = 0;
    this.diceValue = 1;
    this.state = 'waiting_roll';

    this.rollBtn.addEventListener('click', () => this.rollDice());
    this.canvas.addEventListener('click', e => this.handleBoardClick(e));

    this.draw();
    this.updateTurnInfo();
  }

  getCurrentPlayer() {
    return this.players[this.current];
  }

  updateTurnInfo() {
    const player = this.getCurrentPlayer();
    this.turnElem.textContent = `Turno de ${player.color}`;
  }

  rollDice() {
    if (this.state !== 'waiting_roll') return;
    this.diceValue = Math.floor(Math.random() * 6) + 1;
    this.diceElem.textContent = this.diceValue;
    const movable = this.getMovablePieces(this.current, this.diceValue);
    if (movable.length === 0) {
      this.msgElem.textContent = 'No se puede mover. Siguiente jugador.';
      this.nextPlayer();
    } else if (movable.length === 1) {
      this.movePiece(this.current, movable[0]);
    } else {
      this.msgElem.textContent = 'Elige ficha a mover.';
      this.state = 'piece_selection';
      this.highlightPieces(movable);
    }
  }

  highlightPieces(indices) {
    this.highlighted = indices;
    this.draw();
  }

  clearHighlight() {
    this.highlighted = [];
  }

  handleBoardClick(e) {
    if (this.state !== 'piece_selection') return;
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const player = this.getCurrentPlayer();
    for (let i = 0; i < 4; i++) {
      if (!this.highlighted.includes(i)) continue;
      const pos = player.pieces[i];
      const coord = this.getPieceCoord(player.color, pos);
      if (this.distance(x, y, coord.x, coord.y) <= this.pieceRadius) {
        this.movePiece(this.current, i);
        break;
      }
    }
  }

  getPieceCoord(color, pos) {
    if (pos === -1) {
      return this.basePos[color][0]; // default base pos used for click detection
    }
    if (pos < 68) {
      const global = (pos + this.startOffset[color]) % 68;
      return this.path[global];
    }
    if (pos < 74) {
      return this.finalPaths[color][pos - 68];
    }
    return { x: this.center, y: this.center };
  }

  drawBoard() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // outer circle
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.center, this.center, this.radius, 0, Math.PI * 2);
    ctx.stroke();

    // final paths
    for (const color of this.colors) {
      const path = this.finalPaths[color];
      ctx.fillStyle = this.colorMap[color];
      for (const pos of path) {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  drawPieces() {
    const ctx = this.ctx;
    for (let p = 0; p < this.players.length; p++) {
      const player = this.players[p];
      for (let i = 0; i < 4; i++) {
        const pos = player.pieces[i];
        const coord = this.getPieceCoord(player.color, pos);
        ctx.fillStyle = this.colorMap[player.color];
        ctx.beginPath();
        ctx.arc(coord.x, coord.y, this.pieceRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.stroke();
        if (this.highlighted && this.highlighted.includes(i) && this.current === p) {
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(coord.x, coord.y, this.pieceRadius + 4, 0, Math.PI * 2);
          ctx.stroke();
          ctx.lineWidth = 1;
        }
      }
    }
  }

  draw() {
    this.drawBoard();
    this.drawPieces();
  }

  getMovablePieces(playerIndex, dice) {
    const player = this.players[playerIndex];
    const res = [];
    for (let i = 0; i < 4; i++) {
      const pos = player.pieces[i];
      if (pos === -1 && dice === 5) res.push(i);
      else if (pos >= 0 && pos + dice <= 73) res.push(i);
    }
    return res;
  }

  movePiece(playerIndex, pieceIndex) {
    const player = this.players[playerIndex];
    const pos = player.pieces[pieceIndex];
    let dest = pos;
    if (pos === -1) {
      dest = 0;
    } else {
      dest = pos + this.diceValue;
    }
    player.pieces[pieceIndex] = dest;

    const captured = this.checkCapture(player.color, dest);

    this.msgElem.textContent = '';
    this.clearHighlight();
    this.draw();

    if (this.checkWinner(playerIndex)) {
      this.msgElem.textContent = `${player.color} ha ganado!`;
      this.state = 'game_over';
      return;
    }

    if (captured) {
      this.msgElem.textContent = `${player.color} come ficha y juega de nuevo.`;
      this.state = 'waiting_roll';
      this.updateTurnInfo();
    } else {
      this.nextPlayer();
    }
  }

  checkCapture(color, destPos) {
    if (destPos >= 68) return false;
    const global = (destPos + this.startOffset[color]) % 68;
    let captured = false;
    for (let p = 0; p < this.players.length; p++) {
      if (this.players[p].color === color) continue;
      for (let i = 0; i < 4; i++) {
        const pos = this.players[p].pieces[i];
        if (pos < 0 || pos >= 68) continue;
        const g = (pos + this.startOffset[this.players[p].color]) % 68;
        if (g === global) {
          this.players[p].pieces[i] = -1;
          captured = true;
        }
      }
    }
    return captured;
  }

  checkWinner(playerIndex) {
    return this.players[playerIndex].pieces.every(p => p === 73);
  }

  nextPlayer() {
    this.current = (this.current + 1) % this.players.length;
    this.state = 'waiting_roll';
    this.updateTurnInfo();
    this.draw();
  }

  distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new ParchisGame();
});
