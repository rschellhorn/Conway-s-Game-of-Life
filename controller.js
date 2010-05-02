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
		var isNoTopBorderCell = cellIndex - width >= 0;
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

		return currentWorldState[cellIndex]
				? numberOfNeighboursAlive == 2 || numberOfNeighboursAlive == 3
				: numberOfNeighboursAlive == 3;
	},

	computeNextWorldState: function(currentWorldState, width) {
		var nextWorldState = [];
		for (var i = 0; i < currentWorldState.length; i++) {
			nextWorldState.push(GameController.computeNextCellState(currentWorldState, width, i));
		}
		return nextWorldState;
	},

	start: function() {
		var height = 65;
		var width = 125;
		var tick = 200; /*ms */

		var canvas = document.createElement('canvas');
		canvas.setAttribute('height', height * 10);
		canvas.setAttribute('width', width * 10);
		document.body.appendChild(canvas);
		var ctx = canvas.getContext('2d');

		var worldState;

		function next() {
			worldState = worldState
					? GameController.computeNextWorldState(worldState, width)
					: GameController.createRandomWorldState(height, width, 0.5);

			for (var i = 0, x = 0, y = 0; i < worldState.length; i++, x += 10) {
				if (i % width == 0 && i > 0) { x = 0; y += 10; };
				ctx.fillStyle = worldState[i] ? 'yellow' : 'grey';
				ctx.fillRect(x, y, 10, 10);
				ctx.strokeRect(x, y, 10, 10);
			}

			setTimeout(next, tick);
		}

		next();
	}
};