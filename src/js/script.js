var initialCats = [
	{
		"name": "Leo",
		"imgSrc": "img/leo.jpg",
		"imgAlt": "A pic of my cat Leo.",
		"clickCount": 0,
		"nickNames": ["Leopold", "Leonides"]
	}, {
		"name": "Lucifur",
		"imgSrc": "img/lucifur.jpg",
		"imgAlt": "A pic of my cat Lucifur.",
		"clickCount": 0,
		"nickNames": ["Lucifur Ball"]
	}, {
		"name": "Rudy",
		"imgSrc": "img/rudy.jpg",
		"imgAlt": "A pic of my cat Rudy.",
		"clickCount": 0,
		"nickNames": ["Rude-y"]
	}, {
		"name": "Poncho",
		"imgSrc": "img/poncho.jpg",
		"imgAlt": "A pic of my mom's cat Poncho.",
		"clickCount": 0,
		"nickNames": ["Grouch-ass"]
	}, {
		"name": "Mouse",
		"imgSrc": "img/mouse.jpg",
		"imgAlt": "A pic of my old cat Mouse.",
		"clickCount": 0,
		"nickNames": ["Basket-case"]
	}
]

var Cat = function(data) {
	this.name = ko.observable(data.name);
	this.imgSrc = ko.observable(data.imgSrc);
	this.imgAlt = ko.observable(data.imgAlt);
	this.clickCount = ko.observable(data.clickCount);
	this.nickNames = ko.observable(data.nickNames);

	this.level = ko.computed(function() {
		if (this.clickCount() < 10) {
			return "Newborn";
		} else if (this.clickCount() < 20) {
			return "Infant";
		} else {
			return "It's a cat.";
		}
	}, this);
}

var ViewModel = function () {
	var self = this;

	this.catList = ko.observableArray([]);

	initialCats.forEach(function(catItem) {
		self.catList.push( new Cat(catItem) );
	});

	this.currentCat = ko.observable( this.catList()[0] );
	
	this.incrementCounter = function() {
		self.currentCat().clickCount(self.currentCat().clickCount() + 1);
	};

	this.updateCurrent = function() {
		self.currentCat(this);
	}
	// this.updateCurrent = (function(cat) {
	// 	return function() {
	// 		self.currentCat = cat;
	// 	}
	// }($data));
}

ko.applyBindings(new ViewModel());
