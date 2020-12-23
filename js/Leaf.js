let friction = 0.22;
let rotationFriction = 0.0002;
let maxOffset = 20;
let maxOffsetSpeed = 0.18;

class Leaf
{
    constructor(spawn_x, spawn_y, game_pointer)
    {
        this.p_game = game_pointer; //указатель на главный класс

        this.sprite = new PIXI.Sprite(this.p_game.leavesTextures[getRandomIntInclusive(1, 30)]);
        this.sprite.anchor.set(0.5);
        this.sprite.angle = getRandomInt(0, 360);
        this.sprite.alpha = 0;
        this.p_game.app.stage.addChild(this.sprite);
        
        this.isMoving = false; //True, если тело находится под действием волны
        this.isRotating = false; //True, если вращается
        this.inFade = true; //True, если в данный момент изменяется прозрачность
        
        this.globalPosition = new Vector2(spawn_x, spawn_y);
        
        //Сдвиг листа относительно глобальной позиции
        this.currentOffset = new Vector2(0,0);
        this.currentOffsetSpeed = new Vector2(0, 0);
        this.currentOffsetSpeed.x = getRandomFloat(-maxOffsetSpeed, maxOffsetSpeed);
        this.currentOffsetSpeed.y = getRandomFloat(-maxOffsetSpeed, maxOffsetSpeed);
        
        
        this.distanceFromCenter = 0;
        this.calculateDistanceFromCenter();

        this.wavesAffectedBy = []

        //Добавление уже прошедших волн в массив
        for (let wave of this.p_game.wavesArray)
        {
            if (wave.currentRadius > this.distanceFromCenter)
            {
                this.wavesAffectedBy.push(wave);
            }
        }

        //Предварительный расчет направления движения
        let x = this.globalPosition.x - this.p_game.screenMetrics.center.x;
        let y = this.globalPosition.y - this.p_game.screenMetrics.center.y;
        this.sin = Math.sin(Math.atan(x / y)) * (y / Math.abs(y));
        this.cos = Math.cos(Math.atan(x / y)) * (y / Math.abs(y));

        this.currentSpeed = 0;
        this.currentRotationSpeed = 0;
        this.currentRotationDirection = 0; //Может быть -1, 0, 1
    }

    update(delta)
    {
        //Постепенное проявление при появлении
        if (this.inFade)
        {
            this.sprite.alpha += 0.08 * delta;
            if (this.sprite.alpha >= 1)
            {
                this.inFade = false;
            }
        }

        //Обработка движения 
        if (this.isMoving)
        {
            this.currentSpeed -= friction;

            if (this.currentSpeed <= 0)
            {
                this.currentSpeed = 0;
                this.isMoving = false;
            }

            this.globalPosition.x += this.currentSpeed * this.sin * delta;
            this.globalPosition.y += this.currentSpeed * this.cos * delta;
            this.calculateDistanceFromCenter();

            //Удаление листа, если он вышел за пределы экрана
            if (this.globalPosition.x < -this.p_game.screenMetrics.center.x * 0.1
                || this.globalPosition.x > this.p_game.screenMetrics.dimensions.x + this.p_game.screenMetrics.center.x * 0.1
                || this.globalPosition.y < -this.p_game.screenMetrics.center.x * 0.1
                || this.globalPosition.y > this.p_game.screenMetrics.dimensions.y + this.p_game.screenMetrics.center.x * 0.1)
            {
                this.p_game.app.stage.removeChild(this.sprite);
                let index = this.p_game.leavesArray.indexOf(this);
                this.p_game.leavesArray.splice(index, 1);
                this.p_game.currentLeavesAmount--;
            }
        }

        //Обработка вращения
        if (this.isRotating)
        {
            this.currentRotationSpeed -= rotationFriction * delta;
            if (this.currentRotationSpeed <= 0)
            {
                this.currentRotationSpeed = 0;
                this.isRotating = false;
            }
        }
        
        //Обработка сдвига
        this.currentOffset.x += this.currentOffsetSpeed.x * delta;
        if (Math.abs(this.currentOffset.x) >= maxOffset)
        {
            this.currentOffsetSpeed.x = getRandomFloat(-maxOffsetSpeed, maxOffsetSpeed);
        }
        this.currentOffset.y += this.currentOffsetSpeed.y * delta;
        if (Math.abs(this.currentOffset.y) >= maxOffset)
        {
            this.currentOffsetSpeed.y = getRandomFloat(-maxOffsetSpeed, maxOffsetSpeed);
        }
        
        //Применение полученных данных к спрайту
        this.sprite.rotation += this.currentRotationSpeed * this.currentRotationDirection * delta;
        this.sprite.x = this.globalPosition.x + this.currentOffset.x;
        this.sprite.y = this.globalPosition.y + this.currentOffset.y;
    }
    
    calculateDistanceFromCenter()
    {
        let x = this.globalPosition.x - this.p_game.screenMetrics.center.x;
        let y = this.globalPosition.y - this.p_game.screenMetrics.center.y;
        this.distanceFromCenter = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
    }

    setSpeed(speed)
    {
        this.isMoving = true;
        this.isRotating = true;
        this.currentSpeed = speed;
        this.currentRotationDirection = getRandomIntInclusive(-1, 1);
        this.currentRotationSpeed = speed * 0.002;
    }
}