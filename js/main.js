let g_game;
let BACKGROUNDS_AMOUNT = 31;
let LEAF_TEXTURES_AMOUNT = 39;

window.onload = function()
{
    g_game = new Game();

    //Установка атрибутов на миниатюры фонов в HTML 
    for (let i = 1; i <= BACKGROUNDS_AMOUNT; ++i)
    {
        let img_element = document.getElementById(i);
        img_element.onclick = function()
        {
            g_game.setBackground(i);
        }
        img_element.src = `img/thumbnails/min_background_${i}.png`
    }

    g_game.handleWavesSpawn();
}

window.addEventListener('resize', function()
{
    g_game.resize();
});

window.addEventListener('keydown', event =>
{
    if (event.key == 'Enter')
    {
        g_game.createWave(70);
    }
});

window.addEventListener('keydown', event =>
{
    if (event.key == 'Enter')
    {
        g_game.createWave(70);
    }
});

window.onfocus = function()
{
    g_game.hasFocus = true;
    g_game.handleWavesSpawn();
}

window.onblur = function()
{
    g_game.hasFocus = false;
}