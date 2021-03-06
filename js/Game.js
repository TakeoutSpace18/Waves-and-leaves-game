class Game
{
    constructor()
    {
        //Подключение к ПО NeuroPlay
        this.neuroplay = new NeuroplayConnector();
        this.neuroplay.connect();
        this.neuroplay.on('bci', this.handleInput);

        this.currentInputData = 0;
        this.maxInputData = 0;
        this.currentLeavesAmount = 0;
        this.removedLeavesAmount = 0;

        //HTML элементы
        this.indicatorBgElement = document.getElementById('indicator-bg');
        this.indicatorWidth = this.indicatorBgElement.getBoundingClientRect().width;
        this.indicatorMaxMarker = document.getElementById('max-marker');
        this.removedLeavesElement = document.getElementById('removed-leaves-value')

        this.app = new PIXI.Application(
        {
            view: document.getElementById("game-canvas"),
            resizeTo: window, // привязка размера canvas к размеру окна
        });

        this.screenMetrics = new ScreenMetrics();
        this.hasFocus = true; // Активно ли окно

        //Загрузка фона
        this.currentBackgroundId = null;
        this.backgroundSprite = new PIXI.TilingSprite;
        this.app.stage.addChild(this.backgroundSprite);

        let chosenBg = getCookie("chosenBackground")
        if (chosenBg)
        {
            //Установка ранее стоявшего фона
            this.setBackground(chosenBg)
        }
        else
        {
            this.setBackground(1);
        }
                
        //Загрузка текстур
        //Листья
        this.leavesTextures = [];
        for (let i = 1; i <= LEAF_TEXTURES_AMOUNT; ++i)
        {
            this.leavesTextures.push(new PIXI.Texture.from(`img/leaves/leaf_${i}.png`));
        }

        this.waveDisplacementTexture = new PIXI.Texture.from('img/wave_displacement_map.png');
        this.baseDisplacementTexture = new PIXI.Texture.from('img/base_displacement_map.png');

        this.wavesArray = [];
        this.leavesArray = [];

        this.resize();

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
            this.screenMetrics.maxWaveRadius = Math.sqrt(Math.pow(width / 2, 2) + Math.pow(height / 2, 2)) * 1.15;
            this.screenMetrics.screenArea = width * height;

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
        g_game.currentInputData = data.concentration;

        let newIndicatorLevel = map(data.concentration, 0, 100, g_game.indicatorWidth, 0);
        g_game.indicatorBgElement.style.clipPath = `inset(0px ${newIndicatorLevel}px 0px 0px)`;

        if (g_game.currentInputData > g_game.maxInputData)
        {
            g_game.maxInputData = g_game.currentInputData;
            let newMaxLevel = map(g_game.maxInputData, 0, 100, 0, g_game.indicatorWidth) - 5
            g_game.indicatorMaxMarker.style.left = `${newMaxLevel}px`;
        }

        console.log(newIndicatorLevel)
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

        for (let leaf of this.leavesArray)
        {
            leaf.update(delta);
        }

        if (this.currentLeavesAmount < 40)
        {
            this.spawnLeaves(Math.floor(this.screenMetrics.screenArea / 33593));
        }
    }

    createWave(power)
    {
        this.wavesArray.push(new Wave(this, power));
    }

    handleWavesSpawn()
    {
        let timeout = map(g_game.currentInputData, 30, 100, 3000, 1000);
        if (g_game.currentInputData >= 30)
        {
            g_game.createWave(g_game.currentInputData);
        }
        else
        {
            timeout = 500;
        }
        
        if (g_game.hasFocus)
        {
            setTimeout(g_game.handleWavesSpawn, timeout);
        }
    }

    spawnLeaves(amount)
    {
        this.currentLeavesAmount += amount;
        for (let i = 0; i < amount; ++i)
        {
            let x = getRandomInt(0, this.screenMetrics.dimensions.x);
            let y = getRandomInt(0, this.screenMetrics.dimensions.y);

            let timeout = getRandomInt(0, 2500);
            setTimeout(function()
            {
                g_game.leavesArray.push(new Leaf(x, y, g_game))
            }, timeout)

        }
    }

    setBackground(id)
    {
        this.currentBackgroundId = id;
        this.backgroundSprite.texture = new PIXI.Texture.from(`img/backgrounds/background_${this.currentBackgroundId}.jpg`);

        //Сохранение информации о выбранном фоне. Удалится через год.
        document.cookie = `chosenBackground=${id}; max-age=${365 * 24 * 60 * 60}`;
        console.log('Current background: ' + this.currentBackgroundId);
    }
}