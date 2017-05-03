class Game {

    constructor(conf) {
        this.id = this.getRandomInt(1, 65355);
				this.conf = conf;
    }

		start() {
      this.network = new Network(this);
			this.network.onLoad();
		}

    startOpen() {
      this.network = new Network(this);
      this.network.onOpen();
    }

		getRandomInt(min, max) {
			min = Math.ceil(min);
			max = Math.floor(max);
			return Math.floor(Math.random() * (max - min)) + min;
		}
}
