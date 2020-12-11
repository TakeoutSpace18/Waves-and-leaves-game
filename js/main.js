let g_game;

function Vector2(x, y)
{
    this.x = x != null ? x : 0;
    this.y = y != null ? y : 0;
}

window.onload = function()
{
    g_game = new Game();
}

window.addEventListener('resize', function()
{
    g_game.resize();
});