class Vector2
{
    constructor(x, y)
    {
        this.x = x != null ? x : 0;
        this.y = y != null ? y : 0;
    }
}

function ScreenMetrics(center_x, center_y, max_wave_radius, width, height)
{
    this.dimensions = new Vector2(width, height);
    this.center = new Vector2(center_x, center_y);
    this.maxWaveRadius = max_wave_radius != null ? max_wave_radius : 0;
    this.screenArea = width * height;
}

function getRandomInt(min, max)
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function getRandomIntInclusive(min, max)
 {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //Максимум и минимум включаются
}

function getRandomFloat(min, max)
{
    return Math.random() * (max - min) + min;
}

function map(x, in_min, in_max, out_min, out_max)
{
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
