class Game
{
    constructor()
    {
        this.app = new PIXI.Application({
            view: document.getElementById("game-canvas"),
            resizeTo: window, // привязка размера canvas к размеру окна
        });
        
        this.screenCenter = new Vector2(0, 0);

        this.backgroundSprite = new PIXI.TilingSprite.from('img/background.png', {});
        this.app.stage.addChild(this.backgroundSprite);

        this.wavesSprite = new PIXI.Sprite(); // displacement map волн
        this.wavesBackground = new PIXI.Graphics(); // черный фон 
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
        
        this.createWave();

        //запускаем игровой цикл
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    resize() //вызывается при инменении размера окна
    {
        window.scrollTo(0, 0);

        //получение нового размера окна
        let width = window.innerWidth || document.body.clientWidth; 
        let height = window.innerHeight || document.body.clientHeight;

        this.screenCenter.x = width / 2;
        this.screenCenter.y = height / 2;
        
        //изменение размера черного фона волн
        this.wavesBackground.clear();
        this.wavesBackground.beginFill(0x000000, 0.5);
        this.wavesBackground.drawRect(-1, -1, width + 2, height + 2);

        //изменение размера фона
        this.backgroundSprite.width = width;
        this.backgroundSprite.height = height;

    }

    gameLoop(delta)
    {
        this.displacementSprite1.x += 0.6 * delta;
        this.displacementSprite1.y += 0.25 * delta;
        this.displacementSprite2.x -= 0.15 * delta;
        this.displacementSprite2.y -= 0.05 * delta;

        //this.wavesSprite.scale.x += 0.01 * delta;
        //this.wavesSprite.scale.y += 0.01 * delta;
    }

    createWave()
    {
        // this.graphics = new PIXI.Graphics();
        // this.graphics.lineStyle(10, 0xFFBD01, 1);
        // this.graphics.beginFill(0xC34288, 1);
        // this.graphics.drawCircle(400, 250, 50);
        // this.graphics.endFill();

        
        //this.waveSprite.addChild(this.graphics);
        //this.wavesSprite.anchor.set(0.5);
        // this.waveSprite.scale.x = 0;
        // this.waveSprite.scale.y = 0;       
    }
}