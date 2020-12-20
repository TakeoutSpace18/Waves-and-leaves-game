let acceleration = 3;
let deceleration = 0.05;

class Leaf
{
    constructor(spawn_x, spawn_y, game_pointer)
    {
        this.p_game = game_pointer; //указатель на главный класс

        this.sprite = new PIXI.Sprite(this.p_game.leavesTextures[getRandomInt(0, 6)]);
        this.sprite.scale.set(3);
        this.sprite.anchor.set(0.5);
        this.sprite.alpha = 0;
        this.p_game.app.stage.addChild(this.sprite);

        this.wavesAffectedBy = []

        this.isMoving = false; //True, если тело находится под действием волны
        this.inFade = true; //True, если в данный момент изменяется прозрачность

        this.globalPosition = new Vector2(spawn_x, spawn_y);
        this.distanceFromCenter = 0;
        this.calculateDistanceFromCenter();

        //Предварительный расчет направления движения
        let x = this.globalPosition.x - this.p_game.screenMetrics.center.x;
        let y = this.globalPosition.y - this.p_game.screenMetrics.center.y;
        this.sin = Math.sin(Math.atan(x / y)) * (y / Math.abs(y));
        this.cos = Math.cos(Math.atan(x / y)) * (y / Math.abs(y));

        this.targetSpeed = 0;
        this.currentSpeed = 0;
    }

    update(delta)
    {
        if (this.inFade)
        {
            this.sprite.alpha += 0.08 * delta;
            if (this.sprite.alpha >= 1)
            {
                this.inFade = false;
            }
        }

        if (this.isMoving)
        {
            if (this.currentSpeed >= this.targetSpeed)
            {
                this.targetSpeed = 0;
            }

            let a;
            if (this.targetSpeed == 0)
            {
                //Если тело замедляется, используется меньшее ускорение
                a = -deceleration;
            }
            else
            {
                //Если тело ускоряется, используется большее ускорение
                a = acceleration;
            }

            //Применение ускорения к текущей скорости
            this.currentSpeed += a;
            // this.currentSpeed = a * this.targetSpeed + (1 - a) * this.currentSpeed;

            if (this.currentSpeed <= 0)
            {
                //Если скорость стала отрицательной, значит тело остановилось.
                // (Двигаться к центру экрана тело не может) 
                this.currentSpeed = 0;
                this.isMoving = false;
            }

            this.globalPosition.x += this.currentSpeed * this.sin * delta;
            this.globalPosition.y += this.currentSpeed * this.cos * delta;
            this.calculateDistanceFromCenter();

            if (this.distanceFromCenter > this.p_game.screenMetrics.maxWaveRadius)
            {
                //Удаление листа, если он вышел за пределы экрана
                this.p_game.app.stage.removeChild(this.sprite);
                let index = this.p_game.leavesArray.indexOf(this);
                this.p_game.leavesArray.splice(index, 1);
            }
        }
        
        
        this.sprite.x = this.globalPosition.x;
        this.sprite.y = this.globalPosition.y;
    }
    
    calculateDistanceFromCenter()
    {
        let x = this.globalPosition.x - this.p_game.screenMetrics.center.x;
        let y = this.globalPosition.y - this.p_game.screenMetrics.center.y;
        this.distanceFromCenter = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    setTargetSpeed(target_speed)
    {
        this.isMoving = true;
        this.targetSpeed = target_speed;
    }
}