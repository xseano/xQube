class Game {

    constructor(conf) {
        this.id = this.getRandomInt(1, 65355);
				this.conf = conf;
				this.network = new Network(this);
    }

		start() {
			this.network.onLoad();
		}

		getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}
}
