class Game
{
    constructor()
    {
        //Подключение к ПО NeuroPlay
        this.neuroplay = new NeuroplayConnector();
        this.neuroplay.connect();
        this.neuroplay.on('bci', this.handleInput);

        this.app = new PIXI.Application({
            view: document.getElementById("game-canvas"),
            resizeTo: window, // привязка размера canvas к размеру окна
        });
        
        this.screenMetrics = new ScreenMetrics();

        this.backgroundSprite = new PIXI.TilingSprite.from('img/background.png', {});
        this.app.stage.addChild(this.backgroundSprite);

        //Загрузка текстур
        this.leafTexture = new PIXI.Texture.from('img/leaf_1.png');
        this.waveDisplacementTexture = new PIXI.Texture.from('img/wave_displacement_map.png');
        this.baseDisplacementTexture = new PIXI.Texture.from('img/base_displacement_map.png');

        this.wavesArray = [];
        this.leavesArray = [];

        this.resize();
        
        // this.leavesArray.push(new Leaf(800, 200, this));
        // this.leavesArray.push(new Leaf(600, 400, this));
        // this.leavesArray.push(new Leaf(400, 560, this));
        // this.leavesArray.push(new Leaf(200, 800, this));
        // this.leavesArray.push(new Leaf(1000, 430, this));
        // this.leavesArray.push(new Leaf(1200, 670, this));
        // this.leavesArray.push(new Leaf(1400, 340, this));

        this.wavesSprite = new PIXI.Sprite(); // displacement map волн
        this.wavesBackground = new PIXI.Graphics(); // черный фон 
        this.wavesSprite.filters = [new PIXI.filters.BlurFilter()];
        this.wavesSprite.addChild(this.wavesBackground);
        this.app.stage.addChild(this.wavesSprite);

        // эффект искажения для воды
        this.displacementSprite1 = new PIXI.Sprite(this.baseDisplacementTexture);
        this.displacementSprite1.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter1 = new PIXI.filters.DisplacementFilter(this.displacementSprite1);
        this.app.stage.addChild(this.displacementSprite1);

        this.displacementSprite2 = new PIXI.Sprite(this.baseDisplacementTexture);
        this.displacementSprite2.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter2 = new PIXI.filters.DisplacementFilter(this.displacementSprite2);
        this.app.stage.addChild(this.displacementSprite2);
        this.displacementSprite2.x = 100;
        
        this.backgroundSprite.filters = [this.displacementFilter1, this.displacementFilter2];

        
        // this.leaf_test = new Leaf(800, 430, this);
        // this.leaf_test.setTargetSpeed(4.0);
        // this.leaf_test.isMoving = true;
        
        //запускаем игровой цикл
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    resize() //вызывается при инменении размера окна
    {
        window.scrollTo(0, 0);

        //получение нового размера окна
        let width = window.innerWidth || document.body.clientWidth; 
        let height = window.innerHeight || document.body.clientHeight;

        //перерасчёт метрик экрана
        this.screenMetrics.dimensions.x = width;
        this.screenMetrics.dimensions.y = height;
        this.screenMetrics.center.x = width / 2;
        this.screenMetrics.center.y = height / 2;
        this.screenMetrics.maxWaveRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) * 1.2; 
        
        //перерасчёт расстояний от центра до листьев
        for (let leaf of this.leavesArray)
        {
            leaf.calculateDistanceFromCenter();
        }

        //изменение размера фона
        this.backgroundSprite.width = width;
        this.backgroundSprite.height = height;

    }

    //Обработка данных с нейроинтерфейса
    //вызывается 10 раз в секунду
    handleInput(data)
    {
        console.log(this.leavesArray.length());
    }

    gameLoop(delta)
    {
        //console.log(this.leavesArray.length);

        //анимация искажений на воде
        this.displacementSprite1.x += 0.6 * delta;
        this.displacementSprite1.y += 0.25 * delta;
        this.displacementSprite2.x -= 0.15 * delta;
        this.displacementSprite2.y -= 0.05 * delta;

        // обновление волн
        for (let wave of this.wavesArray)
        {
            wave.update(delta);
        }
        
        for (let leaf of this.leavesArray)
        {
            leaf.update(delta);
        }

        //this.leaf_test.update(delta);
    }

    createWave(power)
    {
        console.log('created wave')
        this.wavesArray.push(new Wave(this, 60));
    }

    spawnLeaves(amount)
    {
        for (let i = 0; i < amount; ++i)
        {
            let x = getRandomInt(0, this.screenMetrics.dimensions.x);
            let y = getRandomInt(0, this.screenMetrics.dimensions.y);

            let timeout = getRandomInt(0, 2000);
            setTimeout(function(){g_game.leavesArray.push(new Leaf(x, y, g_game))}, timeout)

        }
    }

}