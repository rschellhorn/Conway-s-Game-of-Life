var Util = Util || {

	/**
	 *
	 */
	extend: function(dest, source, allowOverwrite) {
		for (var prop in source) {
			if (source.hasOwnProperty(prop) && (allowOverwrite || !dest.hasOwnProperty(prop)))
				dest[prop] = source[prop];
		}
		return dest;
	},

	/**
	 *
	 */
	addClass: function(element, className) {
		if (element.className.length) {
			var classes = this.getClassList(element);
			if (classes.indexOf(className) == -1) {
				classes.push(className);
				this.setClassList(element, classes);
			}
		} else {
			element.className = className;
		}
	},

	/**
	 *
	 */
	removeClass: function(element, className) {
		var classes = this.getClassList(element), index;
		if ((index = classes.indexOf(className)) > -1) {
			delete classes[index];
			this.setClassList(element, classes);
		}
	},

	/**
	 *
	 */
	getClassList: function(element) {
		return element.className.length ? element.className.split(/\s+/) : [];
	},

	/**
	 *
	 */
	setClassList: function(element, classes) {
		element.className = classes.join(' ');
	}
}

Array.slice = Array.slice || function(c, i) {
	return Array.prototype.slice.call(c, i);
}

Util.extend(Function.prototype, {
	
	/**
	 *
	 */
	bind: function() {
		var handler = this, args = Array.slice(arguments, 0), obj = args.shift();

		return function() {
			return handler.apply(obj, args.concat(Array.slice(arguments, 0)));
		}
	}
});