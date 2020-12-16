class Wave
{
    constructor(game_pointer, power)
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

        // скорости увеличения:
        this.radiusIncreaseSpeed = -0.000006 * Math.pow(power, 3) + 0.000536 * Math.pow(power, 2) + 0.155952 * power;
        this.widthIncreaseSpeed = -0.000003 * Math.pow(power, 3) + 0.000254 * Math.pow(power, 2) + 0.007202 * power; 
        this.scaleIncreaseSpeed = -0.000001 * Math.pow(power, 2) + 0.000815 * power - 0.000113;

        this.currentRadius = 10;
        this.currentWidth = 10;
        this.currentOpacity = 0.3;
    }

    update(delta)
    {
        this.currentRadius += this.radiusIncreaseSpeed * delta;
        this.currentWidth += this.widthIncreaseSpeed * delta;
        this.currentOpacity -= 0.0013 * delta;

        this.displacementSprite.scale.x += this.scaleIncreaseSpeed * delta;
        this.displacementSprite.scale.y += this.scaleIncreaseSpeed * delta;

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
        this.graphics.lineStyle(this.currentWidth, 0xFFFFFF, this.currentOpacity);
        this.graphics.drawCircle(this.p_game.screenMetrics.center.x, this.p_game.screenMetrics.center.y, this.currentRadius);
    }

}