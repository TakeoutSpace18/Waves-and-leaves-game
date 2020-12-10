class Game
{
    constructor()
    {
        this.app = new PIXI.Application({
            view: document.getElementById("game-canvas"),
            resizeTo: window,
            backgroundColor: 0x1099bb
        });

        this.backgroundSprite = new PIXI.TilingSprite.from('img/sand-background.png', {});
        this.displacementSprite = new PIXI.Sprite.from('img/base_displacement_map.png');
        this.displacementSprite.texture.baseTexture.wrapMode = PIXI.WRAP_MODES.REPEAT;
        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);

        this.app.stage.addChild(this.backgroundSprite);
        this.app.stage.addChild(this.displacementSprite);
        this.backgroundSprite.filters = [this.displacementFilter];



        this.resize();

        //запускаем игровой цикл
        this.app.ticker.add(delta => this.gameLoop(delta));
    }

    resize() //вызывается при инменении размера окна
    {
        window.scrollTo(0, 0);

        let width = window.innerWidth || document.body.clientWidth; 
        let height = window.innerHeight || document.body.clientHeight;
        
        this.backgroundSprite.width = width;
        this.backgroundSprite.height = height;

    }

    gameLoop(delta)
    {
        this.displacementSprite.x += 0.7 * delta;
        this.displacementSprite.y += 0.7 * delta;
        //this.background_sprite.rotation += 0.01 * delta;
    }
}