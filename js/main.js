let g_game;

window.onload = function()
{
    g_game = new Game();
}

window.addEventListener('resize', function()
{
    g_game.resize();
});

window.addEventListener('keydown', event =>
{
    if (event.key == 'Enter')
    {
        g_game.createWave();
    } 
});
window.addEventListener('keydown', event =>
{
    if (event.key == 'Backspace')
    {
        g_game.spawnLeaves(30);
    } 
});