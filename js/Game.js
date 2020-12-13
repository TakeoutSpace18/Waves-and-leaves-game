class Game
{
    constructor()
    {
        this.app = new PIXI.Application({
            view: document.getElementById("game-canvas"),
            resizeTo: window, // привязка размера canvas к размеру окна
        });
        
        this.screenMetrics = new ScreenMetrics();

        this.backgroundSprite = new PIXI.TilingSprite.from('img/background.png', {});
        this.app.stage.addChild(this.backgroundSprite);

        this.waveDisplacementTexture = new PIXI.Texture.from('img/wave_displacement_map.png');
        this.wavesArray = [];

        this.wavesSprite = new PIXI.Sprite(); // displacement map волн
        this.wavesBackground = new PIXI.Graphics(); // черный фон 
        this.wavesSprite.filters = [new PIXI.filters.BlurFilter()];
        this.wavesSprite.addChild(this.wavesBackground);
        this.app.stage.addChild(this.wavesSprite);

        // эффект искажения для воды
        this.displacementSprite1 = new PIXI.Sprite.from('img/base_displacement_map.png');
        this.displacementSprite1.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter1 = new PIXI.filters.DisplacementFilter(this.displacementSprite1);
        this.app.stage.addChild(this.displacementSprite1);

        this.displacementSprite2 = new PIXI.Sprite.from('img/base_displacement_map.png');
        this.displacementSprite2.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter2 = new PIXI.filters.DisplacementFilter(this.displacementSprite2);
        this.app.stage.addChild(this.displacementSprite2);
        this.displacementSprite2.x = 100;
        
        this.backgroundSprite.filters = [this.displacementFilter1, this.displacementFilter2];

        this.resize();
        
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
        this.screenMetrics.maxWaveRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2));
        
        //изменение размера фона
        this.backgroundSprite.width = width;
        this.backgroundSprite.height = height;

    }

    gameLoop(delta)
    {
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
    }

    createWave()
    {
        console.log('created wave')
        this.wavesArray.push(new Wave(this));
    }
}