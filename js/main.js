let g_game;

window.onload = function()
{
    g_game = new Game();
}

window.addEventListener('resize', function()
{
    g_game.resize();
});