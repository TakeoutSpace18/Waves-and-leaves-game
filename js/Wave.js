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
        this.radiusIncreaseSpeed = 0.00000366 * Math.pow(power, 3) - 0.00071429 * Math.pow(power, 2) + 0.18479853 * power;
        this.widthIncreaseSpeed = 0.0000002 * Math.pow(power, 3) - 0.0000531 * Math.pow(power, 2) + 0.0134223 * power; 
        this.scaleIncreaseSpeed = 0.00000001 * Math.pow(power, 3) - 0.00000190 * Math.pow(power, 2) + 0.00078340 * power;
        this.opacityDecreaseSpeed = 0.0000000015 * Math.pow(power, 3) - 0.0000003000 * Math.pow(power, 2) + 0.0000476154 * power;

        this.currentRadius = 10;
        this.currentWidth = 10;
        this.currentOpacity = 0.3;
    }

    update(delta)
    {
        this.currentRadius += this.radiusIncreaseSpeed * delta;
        this.currentWidth += this.widthIncreaseSpeed * delta;
        this.currentOpacity -= this.opacityDecreaseSpeed * delta;

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

        //Обработка столкновения волны с листьями
        for (let leaf of this.p_game.leavesArray)
        {
            if (this.currentRadius > leaf.distanceFromCenter && leaf.wavesAffectedBy.indexOf(this) == -1)
            {
                leaf.wavesAffectedBy.push(this);
                let forceCoef = map(this.currentRadius, 0, this.p_game.screenMetrics.maxWaveRadius, 1, 0.55);
                leaf.setSpeed(this.radiusIncreaseSpeed * forceCoef);
            }
        }

        // Отрисовка белого круга
        this.graphics.clear();
        this.graphics.lineStyle(this.currentWidth, 0xFFFFFF, this.currentOpacity);
        this.graphics.drawCircle(this.p_game.screenMetrics.center.x, this.p_game.screenMetrics.center.y, this.currentRadius);
    }

}