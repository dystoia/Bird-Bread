class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/bread.png');
        this.load.image('spaceship', './assets/bird.png');
        this.load.image('skyfield', './assets/skyfield.png');
        this.load.image('fastbird', './assets/fastbird.png');
        // load spritesheet
        this.load.spritesheet('poof', './assets/poof.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 14});
    }

    create() {
        // place tile sprite
        this.skyfield = this.add.tileSprite(0, 0, 640, 480, 'skyfield').setOrigin(0, 0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0 ,0);

        // add Rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        // add Spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        // add Fast Bird (x1)
        this.fastbird = new Fastbird(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'fastbird', 0, 20).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('poof', { start: 0, end: 14, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;

        // display score
        let scoreConfig = {
            fontFamily: 'Comic Sans',
            fontSize: '28px',
            backgroundColor: '#668cff',
            color: '#FFFFFF',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        // display time
        let timeConfig = {
            fontFamily: 'Comic Sans',
            fontSize: '28px',
            backgroundColor: '#668cff',
            color: '#FFFFFF',
            align: 'center',
              padding: {
                top: 5,
                bottom: 5,
              },
            fixedWidth: 100,
            right: 0,
          }

        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig);
        this.timeLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.formatTime(this.gameClock), timeConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← to Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
    }

    update() {
        // check key input for restart / menu
        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }

        this.skyfield.tilePositionX -= 4;  // update tile sprite

        if(!this.gameOver) {
            this.p1Rocket.update();             // update p1
            this.ship01.update();               // update spaceship (x3)
            this.ship02.update();
            this.ship03.update();
            this.fastbird.update();             // update Fast bird
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.fastbird)) {
            this.p1Rocket.reset();
            this.shipExplode(this.fastbird);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    checkCollisionfastbird(rocket, ship) {
        if( rocket.x + rocket.width > ship.x &&
            rocket.x < ship.x + ship.width &&
            rocket.y + rocket.height > ship.y &&
            rocket.y < ship.y + ship.height) {
                ship.alpha = 0;
                this.fastbirdExplode(ship)
                rocket.reset();
                ship.reset();  
        }
    }

    fastbirdExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after ani completes
          ship.reset();                       // reset ship position
          ship.alpha = 1;                     // make ship visible again
          boom.destroy();                     // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += 5;
        this.scoreLeft.text = this.p1Score;       
        this.sound.play('poof');
      }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;                         
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'poof').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
            ship.reset();                         // reset ship position
            ship.alpha = 1;                       // make ship visible again
            boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score; 
        
        this.sound.play('sfx_poof');
      }
      formatTime(ms) {
        let sec = ms/1000;
        let min = Math.floor(sec/60);
        let seconds = sec%60;
        seconds = seconds.toString().padStart(2, "0");
        return `${min}:${seconds}`;
    }
}