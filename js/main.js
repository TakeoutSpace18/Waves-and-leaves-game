let g_game;

window.onload = function()
{
    g_game = new Game();
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
        g_game.createWave(65);
    } 
});
window.addEventListener('keydown', event =>
{
    if (event.key == 'Backspace')
    {
        g_game.spawnLeaves(30);
    } 
});