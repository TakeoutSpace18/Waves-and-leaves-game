class Wave
{
    constructor(game_pointer)
    {
        this.p_game = game_pointer; // указатель на главный класс
        
        // поле для отрисовки белого круга
        this.graphics = new PIXI.Graphics();
        this.p_game.wavesSprite.addChild(this.graphics);

        // спрайт с displacement map
        this.displacementSprite = new PIXI.Sprite(this.p_game.waveDisplacementTexture);
        this.displacementSprite.anchor.set(0.5);
        this.displacementSprite.scale.set(0.1);
        this.displacementSprite.x = g_game.screenMetrics.center.x;
        this.displacementSprite.y = g_game.screenMetrics.center.y;

        this.p_game.app.stage.addChild(this.displacementSprite);

        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite, 20);
        this.p_game.backgroundSprite.filters.push(this.displacementFilter);

        this.currentRadius = 10;
        this.currentWidth = 10;
    }

    update(delta)
    {
        this.currentRadius += 5 * delta;
        this.currentWidth += 0.37 * delta;

        this.displacementSprite.scale.x += 0.023 * delta;
        this.displacementSprite.scale.y += 0.023 * delta;

        // Если волна вышла за пределы экрана,
        // удаляем её и всё, что для неё создали.
        if (this.currentRadius > this.p_game.screenMetrics.maxWaveRadius)
        {
            let index = this.p_game.backgroundSprite.filters.indexOf(this.displacementFilter);
            this.p_game.backgroundSprite.filters.splice(index, 1);
            this.p_game.app.stage.removeChild(this.displacementSprite);
            this.p_game.wavesSprite.removeChild(this.graphics);
            this.p_game.wavesArray.shift()
        }

        // Отрисовка белого круга
        this.graphics.clear();
        this.graphics.lineStyle(this.currentWidth, 0xFFFFFF, 0.2);
        this.graphics.drawCircle(this.p_game.screenMetrics.center.x, this.p_game.screenMetrics.center.y, this.currentRadius);
    }

}