/* Copyright 2010, Rob Schellhorn. All Rights Reserved
 * Javascript implementation of Conway's Game of Life
 * http://en.wikipedia.org/wiki/Conway%27s_Game_of_Life
 */
var GameController = {

	createRandomWorldState: function(height, width, seedProbability) {
		var worldState = [];
		for (var i = height * width; i-- > 0;) {
			worldState[i] = Math.random() < seedProbability;
		}
		return worldState;
	},

	computeNextCellState: function(currentWorldState, width, cellIndex) {
		var isNoLeftBorderCell = cellIndex % width != 0;
		var isNoRightBorderCell = cellIndex % width < width - 1;
		var isNoTopBorderCell = cellIndex >= width;
		var isNoBottomBorderCell = cellIndex + width < currentWorldState.length;

		var numberOfNeighboursAlive = 0;
		if (isNoLeftBorderCell && currentWorldState[cellIndex - 1]) numberOfNeighboursAlive++;
		if (isNoRightBorderCell && currentWorldState[cellIndex + 1]) numberOfNeighboursAlive++;
		if (isNoTopBorderCell && currentWorldState[cellIndex - width]) numberOfNeighboursAlive++;
		if (isNoBottomBorderCell && currentWorldState[cellIndex + width]) numberOfNeighboursAlive++;
		if (isNoLeftBorderCell && isNoTopBorderCell && currentWorldState[cellIndex - width - 1]) numberOfNeighboursAlive++;
		if (isNoRightBorderCell && isNoTopBorderCell && currentWorldState[cellIndex - width + 1]) numberOfNeighboursAlive++;
		if (isNoLeftBorderCell && isNoBottomBorderCell && currentWorldState[cellIndex + width - 1]) numberOfNeighboursAlive++;
		if (isNoRightBorderCell && isNoBottomBorderCell && currentWorldState[cellIndex + width + 1]) numberOfNeighboursAlive++;

		return numberOfNeighboursAlive == 3 || (numberOfNeighboursAlive == 2 && currentWorldState[cellIndex]);
	},

	computeNextWorldState: function(currentWorldState, width) {
		var nextWorldState = [];
		for (var i = currentWorldState.length; i-- > 0;) {
			nextWorldState[i] = GameController.computeNextCellState(currentWorldState, width, i);
		}
		return nextWorldState;
	},

	start: function(height, width) { /* defaults to: */ height = height || 65; width = width || 125;
		var canvas = document.createElement('canvas');
		canvas.setAttribute('height', height * 10);
		canvas.setAttribute('width', width * 10);
		document.body.appendChild(canvas);
		var ctx = canvas.getContext('2d');

		var worldState = GameController.createRandomWorldState(height, width, 0.5);
		for (var i = 0, x, y = -10; i < worldState.length; i++, x += 10) {
			if (i % width == 0) { x = 0; y += 10; };
			ctx.strokeRect(x, y, 10, 10);
		}

		setInterval(function() {
			for (var i = 0, x, y = -10; i < worldState.length; i++, x += 10) {
				if (i % width == 0) { x = 0; y += 10; };
				ctx.fillStyle = worldState[i] ? '#fff944' : '#929292';
				ctx.fillRect(x + 1, y + 1, 8, 8);
			}

			worldState = GameController.computeNextWorldState(worldState, width);
		}, 250 /* ms */ );
	}
};