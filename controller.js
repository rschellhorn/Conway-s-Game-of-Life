var GameController = {

	DEFAULT_OPTIONS: { height: 40, width: 80, seedProbability: 0.5, tick: 200 /*ms*/ },

	createRandomWorldState: function(height, width, seedProbability) {
		var worldState = [];
		for (var i = 0; i < height * width; i++) {
			worldState.push(Math.random() < seedProbability);
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
			nextWorldState.push(this.computeNextCellState(currentWorldState, width, i));
		}
		return nextWorldState;
	},

	start: function(options) { options = options || {};
		Util.extend(options, GameController.DEFAULT_OPTIONS);

		var height = options['height'];
		var width = options['width'];
		var tick = options['tick'];

		var Display = {

			animate: function(currentWorldState) {
				var nextWorldState;

				if (this.viewPort) {
					nextWorldState = GameController.computeNextWorldState(currentWorldState, width);
					this.updateViewPort(currentWorldState, nextWorldState);
				} else {
					this.createViewPort(currentWorldState);
					nextWorldState = currentWorldState;
				}

				setTimeout(this.animate.bind(this, nextWorldState), tick);
			},

			createViewPort: function(worldState) {
				var viewPort = this.viewPort = document.createElement('ol');
				Util.addClass(viewPort, 'world');
				for (var i = 0; i < worldState.length; i++) {
					var cell = document.createElement('li');
					if (worldState[i]) Util.addClass(cell, 'alive');
					if (i > 0 && i % width == 0) Util.addClass(cell, 'clear');
					viewPort.appendChild(cell);
				}
				document.body.appendChild(viewPort);
			},

			updateViewPort: function(currentWorldState, nextWorldState) {
				for (var i = 0; i < nextWorldState.length; i++) {
					if (nextWorldState[i] == currentWorldState[i]) continue;

					var cell = this.viewPort.childNodes[i];
					if (nextWorldState[i]) {
						Util.addClass(cell, 'alive');
					} else {
						Util.removeClass(cell, 'alive');
					}
				}
			}
		};

		var initialWorldState = this.createRandomWorldState(height, width, options['seedProbability']);
		Display.animate(initialWorldState);
	}
};