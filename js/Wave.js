class Wave
{
    constructor(game_pointer)
    {
        this.p_game = game_pointer; // указатель на главный класс

        this.graphics = new PIXI.Graphics();
        this.p_game.wavesSprite.addChild(this.graphics);

        this.displacementSprite = new PIXI.Sprite(this.p_game.waveDisplacementTexture);
        this.displacementSprite.anchor.set(0.5);
        this.displacementSprite.scale.set(0);
        this.displacementSprite.x = g_game.screenMetrics.center.x;
        this.displacementSprite.y = g_game.screenMetrics.center.y;

        this.p_game.wavesSprite.addChild(this.displacementSprite);

        this.displacementFilter = new PIXI.filters.DisplacementFilter(this.displacementSprite);
        this.p_game.backgroundSprite.filters.push(this.displacementFilter);

        this.currentRadius = 10;
        this.currentWidth = 10;
    }

    update(delta)
    {
        this.currentRadius += 10 * delta;
        this.currentWidth += 1 * delta;

        this.displacementSprite.scale.x += 0.1 * delta;
        this.displacementSprite.scale.y += 0.1 * delta;

        // если волна вышла за пределы экрана
        if (this.currentRadius > this.p_game.screenMetrics.maxWaveRadius)
        {
            this.p_game.backgroundSprite.filters.splice(2);
            this.p_game.wavesSprite.removeChild(this.graphics);
            this.p_game.wavesArray.shift()
        }

        this.graphics.clear();
        this.graphics.lineStyle(this.currentWidth, 0xFFFFFF, 0.5);
        this.graphics.drawCircle(this.p_game.screenMetrics.center.x, this.p_game.screenMetrics.center.y, this.currentRadius);
    }

}