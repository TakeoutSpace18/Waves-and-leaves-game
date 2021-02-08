let g_game;
let backgroundsAmount = 31;

window.onload = function()
{
    g_game = new Game();

    //Установка атрибутов на миниатюры фонов в HTML 
    for (let i = 1; i <= backgroundsAmount; ++i)
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