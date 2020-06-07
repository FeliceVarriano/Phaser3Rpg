class GameScene extends Phaser.Scene{
    constructor(){
        super('Game');

    }

    init(){
        this.scene.launch('UI');
        this.score = 0;
    }

    create(){        
        this.createAudio();
        this.createPlayer();
        this.createChests();
        this.createWalls();
        this.addCollisions();
        this.createInput();    
    }

    update(){
        this.player.update(this.cursors);
    }

    createAudio(){
        this.goldPickupAudio = this.sound.add('goldSound', {loop: false});
    }

    createPlayer(){
        this.player = new Player(this, 32, 32, 'characters', 0);

    }

    createChests(){
        // Create a chest group
        this.chests = this.physics.add.group();  

        // possible chest locations
        this.chestPositions = [[100, 100], [200, 200], [300, 300], [400, 400], [500, 500]];

        //specify the max number of possible chests
        this.maxNumberOfChests = 3;
        for(let i = 0; i < this.maxNumberOfChests; i++){
            //spawn chest
            this.spawnChest();
        }
    }

    spawnChest(){
        const location = this.chestPositions[Math.floor(Math.random() * this.chestPositions.length)];

        let chest = this.chests.getFirstDead();
        if(!chest){
            const chest = new Chest(this, location[0], location[1], 'items', 0); 
                //Add chest to chest group
            this.chests.add(chest);
        }else{
            chest.setPosition(location[0], location[1]);
            chest.makeActive();
        }

    }

    createWalls(){
        this.wall = this.physics.add.image(500, 100, 'button1');
        this.wall.setImmovable();
    }

    addCollisions(){
        this.physics.add.collider(this.player, this.wall);
        this.physics.add.overlap(this.player, this.chests, this.collectChest, null, this);
    }

    createInput(){
        this.cursors = this.input.keyboard.createCursorKeys();
    }


    collectChest(player, chest){
        //Play gold pickup sound
        this.goldPickupAudio.play();
        //update our score
        this.score += chest.coins;
        // Update score in the UI
        this.events.emit('updateScore', this.score);
        //Destroy the Chest Game object.
        chest.makeInactive();
        //Spawn a new chest
        this.time.delayedCall(1000, this.spawnChest, [], this);
    }
}