document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let player, zombies, bullets, items, score, keys, gameOver, redZombieTimer, difficultyTimer, difficultyLevel;

    function initGame() {
        player = {
            x: canvas.width / 2,
            y: canvas.height - 30,
            width: 20,
            height: 20,
            speed: 5,
            lives: 2,
            bulletCount: 1,
            extraShot: 0,  // 用於記錄額外的對稱射擊次數
            lastShotTime: 0,
            invincibleTime: 0,
            shootCooldown: 300 ,
            invertedControls: false
        };

        zombies = [];
        bullets = [];
        items = [];
        score = 0;
        keys = {};
        gameOver = false;
        redZombieTimer = 0;
        difficultyTimer = 0;
        difficultyLevel = 1;
    }
    function autoShoot() {
        const currentTime = Date.now();
        if (currentTime - player.lastShotTime >= player.shootCooldown) {
            // 主要子彈
            for (let i = 0; i < player.bulletCount; i++) {
                bullets.push({
                    x: player.x,
                    y: player.y - player.height / 2 - i * 10,
                    speedY: -5,  // 向上移動的速度
                    isZombieBullet: false,
                    penetration: player.bulletPenetration
                });
            }
            
            // 額外的對稱子彈
            for (let i = 0; i < player.extraShot; i++) {
                const angle = Math.PI / 6 * (i + 1);  // 30度的倍數
                bullets.push({
                    x: player.x,
                    y: player.y - player.height / 2,
                    speedX: Math.sin(angle) * 5,  // 水平速度
                    speedY: -Math.cos(angle) * 5,  // 垂直速度
                    isZombieBullet: false,
                    penetration: player.bulletPenetration
                });
                bullets.push({
                    x: player.x,
                    y: player.y - player.height / 2,
                    speedX: -Math.sin(angle) * 5,  // 對稱的水平速度
                    speedY: -Math.cos(angle) * 5,  // 垂直速度
                    isZombieBullet: false,
                    penetration: player.bulletPenetration
                });
            }
            
            player.lastShotTime = currentTime;
        }
    }
    function drawPlayer() {
        ctx.fillStyle = Date.now() < player.invincibleTime ? 'rgba(0, 0, 255, 0.5)' : 'blue';
        ctx.fillRect(player.x - player.width / 2, player.y - player.height / 2, player.width, player.height);
    }

    function drawZombies() {
        zombies.forEach(zombie => {
            ctx.fillStyle = zombie.color;
            ctx.fillRect(zombie.x - zombie.width / 2, zombie.y - zombie.height / 2, zombie.width, zombie.height);
            if (zombie.health > 1) {
                ctx.fillStyle = 'white';
                ctx.font = '12px Arial';
                ctx.fillText(zombie.health, zombie.x, zombie.y);
            }
        });
    }
    function drawBullets() {
        ctx.fillStyle = 'black';
        bullets.forEach(bullet => {
            if (bullet.isBrownBullet) {
                ctx.fillStyle = 'brown';
                ctx.fillRect(bullet.x - bullet.size / 2, bullet.y - bullet.size / 2, bullet.size, bullet.size);
                ctx.fillStyle = 'black';
            } else if (!bullet.isZombieBullet) {
                // 玩家的子彈
                ctx.fillRect(bullet.x - 4, bullet.y - 5, 8, 10);
            } else {
                // 其他殭屍的子彈（保持原來的大小）
                ctx.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
            }
        });
    }

    function drawItems() {
        items.forEach(item => {
            ctx.fillStyle = 'purple';
            ctx.fillRect(item.x - 7.5, item.y - 7.5, 15, 15);
            ctx.fillStyle = 'white';
            ctx.font = '12px Arial';  // 稍微增加字體大小
            let icon;
            switch(item.type) {
                case 'smaller':
                    icon = '<';
                    break;
                case 'moreBullets':
                    icon = '--';
                    break;
                case 'extraLife':
                    icon = 'hp';
                    break;
                case 'random':
                    icon = '?';
                    break;
                case 'extraShot':
                    icon = '+';
                    break;
            }
            ctx.fillText(icon, item.x - 5, item.y + 5);  // 調整文字位置
        });
    
    }

    function drawScore() {
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.fillText(`得分: ${score}`, 10, 20);
        ctx.fillText(`生命: ${player.lives}`, 10, 40);
        ctx.fillText(`難度: ${difficultyLevel}`, 10, 60);
    }

    function drawGameOver() {
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('遊戲結束', canvas.width / 2 - 60, canvas.height / 2);
        ctx.font = '20px Arial';
        ctx.fillText(`最終得分: ${score}`, canvas.width / 2 - 50, canvas.height / 2 + 30);
        ctx.fillText('按 R 鍵重新開始', canvas.width / 2 - 70, canvas.height / 2 + 60);
    }

    function updatePlayer() {
        const moveUp = player.invertedControls ? keys.ArrowDown : keys.ArrowUp;
        const moveDown = player.invertedControls ? keys.ArrowUp : keys.ArrowDown;
        const moveLeft = player.invertedControls ? keys.ArrowRight : keys.ArrowLeft;
        const moveRight = player.invertedControls ? keys.ArrowLeft : keys.ArrowRight;

        if (moveLeft && player.x > player.width / 2) player.x -= player.speed;
        if (moveRight && player.x < canvas.width - player.width / 2) player.x += player.speed;
        if (moveUp && player.y > player.height / 2) player.y -= player.speed;
        if (moveDown && player.y < canvas.height - player.height / 2) player.y += player.speed;
    }

    function updateZombies() {
        // 生成綠色殭屍
        if (Math.random() < 0.02) {
            zombies.push({
                x: Math.random() * canvas.width,
                y: 0,
                width: 20,
                height: 20,
                speed: 1 + Math.random(),
                color: 'green',
                health: 1 * difficultyLevel,
                canShoot: score >= 30,
                lastHealthDecreaseTime: Date.now()
            });
        }

        // 生成紅色殭屍
        redZombieTimer++;
        if (redZombieTimer >= 600) {
            let redZombie = {
                x: Math.random() * canvas.width,
                y: 0,
                width: 30,
                height: 30,
                speed: 0.5 + Math.random() * 0.5,
                color: 'red',
                health: 10 * difficultyLevel,
                canShoot: true,
                lastHealthDecreaseTime: Date.now()
            };
            zombies.push(redZombie);
            shootZombieBullets(redZombie);
            redZombieTimer = 0;
        }
 // 生成紫色殭屍
        if (Math.random() < 0.003) {  // 每幀有0.3%的機率生成紫色殭屍
            let purpleZombie = {
                x: Math.random() * canvas.width,
                y: 0,
                width: 22,
                height: 22,
                speed: 2 + Math.random(),  // 紫色殭屍速度較快
                color: 'orange',
                health: 1,  // 血量為分數的一半，最少為2
                canShoot: false
            };
            zombies.push(purpleZombie);
            console.log("紫色殭屍生成");
        }
        // 生成棕色殭屍
        if (Math.random() < 0.001) {  // 每幀有0.5%的機率生成棕色殭屍
            let brownZombie = {
                x: Math.random() * canvas.width,
                y: 0,
                width: 25,
                height: 25,
                speed: 1 + Math.random(),
                color: 'brown',
                health: Math.max(3, score),  // 血量等於當前分數，最少為3,  // 血量是玩家分數的三倍，最少為3
                canShoot: true,
                lastShootTime: 0,
                moveDirection: Math.random() * Math.PI * 2  // 初始隨機移動方向
            };
            zombies.push(brownZombie);
            console.log("棕色殭屍生成"); // 用於調試
        }

        zombies.forEach((zombie, index) => {
            if (zombie.color === 'brown') {
                // 棕色殭屍的移動邏輯
                if (Math.random() < 0.02) {
                    // 每幀有2%的機會改變移動方向
                    zombie.moveDirection = Math.random() < 0.5 ? -1 : 1; // -1 表示向左，1 表示向右
                }
    
                // 向下移動
                zombie.y += zombie.speed * 0.5; // 減慢向下移動的速度
    
                // 左右移動
                zombie.x += zombie.moveDirection * zombie.speed;
    
                // 確保棕色殭屍不會移出畫面左右邊界
                zombie.x = Math.max(zombie.width / 2, Math.min(canvas.width - zombie.width / 2, zombie.x));
    
                // 棕色殭屍發射子彈
                const currentTime = Date.now();
                if (currentTime - zombie.lastShootTime > 2000) {  // 每2秒發射一次子彈
                    shootBrownZombieBullets(zombie);
                    zombie.lastShootTime = currentTime;
                }


            }  else if (zombie.color === 'orange') {
                // 紫色殭屍的新移動邏輯
                let dx = player.x - zombie.x;
                
                // 持續向下移動
                zombie.y += zombie.speed;
                
                // 左右移動以追逐玩家
                if (Math.abs(dx) > 5) {  // 添加一個小的閾值，避免抖動
                    zombie.x += Math.sign(dx) * zombie.speed * 0.5;  // 減慢左右移動速度
                }
                
                // 確保紫色殭屍不會移出畫面左右邊界
                zombie.x = Math.max(zombie.width / 2, Math.min(canvas.width - zombie.width / 2, zombie.x));
            }
            else {
                zombie.y += zombie.speed;
            }

            // 其他殭屍的邏輯保持不變
            if (zombie.canShoot) {
                if (zombie.color === 'red' && Math.random() < 0.01) {
                    shootZombieBullets(zombie);
                } else if (zombie.color === 'green' && Math.random() < 0.005) {
                    zombieExplode(zombie);
                    zombies.splice(index, 1);
                }
            }

            if (zombie.color === 'red') {
                const currentTime = Date.now();
                if (currentTime - zombie.lastHealthDecreaseTime >= 1000) {
                    zombie.health -= 10;
                    zombie.lastHealthDecreaseTime = currentTime;
                    if (zombie.health <= 0) {
                        dropItem(zombie.x, zombie.y, true);
                        zombies.splice(index, 1);
                        score++;
                    }
                }
            }
        });

        // 移除離開畫面的殭屍
        zombies = zombies.filter(zombie => {
            if (zombie.color === 'brown') {
                return zombie.y < canvas.height + zombie.height / 2;
            } else {
                return zombie.y < canvas.height + zombie.height / 2;
            }
        });
    }

    function shootZombieBullets(zombie) {
        for (let i = 0; i < 10; i++) {
            let angle = Math.random() * Math.PI;
            let speed = 1 + Math.random() * 2;
            bullets.push({
                x: zombie.x,
                y: zombie.y,
                speedX: Math.cos(angle) * speed,
                speedY: Math.sin(angle) * speed,
                isZombieBullet: true,
                zombieId: zombie.id  // 添加殭屍ID以識別子彈來源
            });
        }
    }

    function shootBrownZombieBullets(zombie) {
        const angle = Math.atan2(player.y - zombie.y, player.x - zombie.x);
        bullets.push({
            x: zombie.x,
            y: zombie.y,
            speedX: Math.cos(angle) * 3,
            speedY: Math.sin(angle) * 3,
            isZombieBullet: true,
            isBrownBullet: true,
            zombieId: zombie.id,
            size: Math.random() < 0.3 ? 15 : 8  // 30% 機率生成大子彈 (15x15)，否則為正常大小 (8x8)
        });
    }
    function zombieExplode(zombie) {
        for (let i = 0; i < 8; i++) {
            let angle = (i / 8) * Math.PI * 2;
            bullets.push({
                x: zombie.x,
                y: zombie.y,
                speedX: Math.cos(angle) * 2,
                speedY: Math.sin(angle) * 2,
                isZombieBullet: true,
                zombieId: zombie.id
            });
        }
    }
    function dropItem(x, y, isSpecial) {
        if (isSpecial || Math.random() < 0.4) {  // 綠色殭屍有 40% 機率掉落道具
            items.push({
                x: x,
                y: y,
                width: 15,  // 更新寬度
                height: 15, // 更新高度
                type: ['smaller', 'moreBullets', 'extraLife', 'random', 'extraShot'][Math.floor(Math.random() * 5)]
            });
        }
    }

    function updateBullets() {
        bullets.forEach(bullet => {
            if (bullet.isZombieBullet) {
                bullet.x += bullet.speedX;
                bullet.y += bullet.speedY;
            } else {
                bullet.x += bullet.speedX || 0;  // 如果沒有 speedX，則為 0
                bullet.y += bullet.speedY;
            }
        });

        bullets = bullets.filter(bullet => 
            bullet.y > 0 && bullet.y < canvas.height && 
            bullet.x > 0 && bullet.x < canvas.width
        );
    }

    function updateItems() {
        items.forEach(item => {
            item.y += 2;
        });

        items = items.filter(item => item.y < canvas.height);
    }

    function updateDifficulty() {
        difficultyTimer++;
        if (difficultyTimer >= 600) {
            difficultyLevel++;
            difficultyTimer = 0;
            score += 10;
        }
    }

    function checkCollisions() {
        bullets.forEach((bullet, bulletIndex) => {
            if (!bullet.isZombieBullet) {
                zombies.forEach((zombie, zombieIndex) => {
                    if (bullet.x + 4 > zombie.x - zombie.width / 2 &&
                        bullet.x - 4 < zombie.x + zombie.width / 2 &&
                        bullet.y + 5 > zombie.y - zombie.height / 2 &&
                        bullet.y - 5 < zombie.y + zombie.height / 2) {
                        if (zombie.color === 'brown') {
                            zombie.health -= 1;  // 棕色殭屍生命值只減1
                        } else {
                            zombie.health -= bullet.penetration ? 2 : 1;  // 其他殭屍根據子彈穿透性減1或2
                        }
                            bullets.splice(bulletIndex, 1);  // 移除子彈
                        if (zombie.health <= 0) {
                            dropItem(zombie.x, zombie.y, zombie.color === 'red' || zombie.color === 'brown');
                            zombies.splice(zombieIndex, 1);
                            score++;
                        }
                        return;  // 結束這次迭代
                    }
                });
            } else {  // 所有殭屍的子彈都會傷害玩家
                // 檢查殭屍子彈是否擊中玩家
                let bulletSize = bullet.isBrownBullet ? bullet.size : 4;
                if (player.x - player.width / 2 < bullet.x + bulletSize / 2 &&
                    player.x + player.width / 2 > bullet.x - bulletSize / 2 &&
                    player.y - player.height / 2 < bullet.y + bulletSize / 2 &&
                    player.y + player.height / 2 > bullet.y - bulletSize / 2) {
                    if (Date.now() > player.invincibleTime) {
                        player.lives--;
                        if (player.lives <= 0) {
                            gameOver = true;
                        } else {
                            player.invincibleTime = Date.now() + 2000;  // 2秒無敵時間
                        }
                    }
                    bullets.splice(bulletIndex, 1);
                }
            }
        });
    
        // 檢查玩家是否與殭屍碰撞
        if (Date.now() > player.invincibleTime) {
            zombies.forEach((zombie) => {
                if (player.x + player.width / 2 > zombie.x - zombie.width / 2 &&
                    player.x - player.width / 2 < zombie.x + zombie.width / 2 &&
                    player.y + player.height / 2 > zombie.y - zombie.height / 2 &&
                    player.y - player.height / 2 < zombie.y + zombie.height / 2) {
                    player.lives--;
                    if (player.lives <= 0) {
                        gameOver = true;
                    } else {
                        player.invincibleTime = Date.now() + 2000;  // 2秒無敵時間
                    }
                    if (zombie.color === 'orange') {
                    zombies.splice(zombies.indexOf(zombie), 1);
                    }
                }
            });
        }
    
        items.forEach((item, index) => {
            if (player.x + player.width / 2 > item.x - 7.5 &&
                player.x - player.width / 2 < item.x + 7.5 &&
                player.y + player.height / 2 > item.y - 7.5 &&
                player.y - player.height / 2 < item.y + 7.5) {
                // ... 道具效果邏輯保持不變 ...
            
                switch(item.type) {
                    case 'smaller':
                        player.width /= 1.2;
                        player.height /= 1.2;
                        break;
                    case 'moreBullets':
                        player.bulletCount++;
                        break;
                    case 'extraLife':
                        player.lives++;
                        break;
                    case 'random':
                        applyRandomEffect();
                        break;
                    case 'extraShot':
                        player.extraShot++;  // 增加額外的對稱射擊次數
                        break;
                }
                items.splice(index, 1);
            }
        });
    }
    function applyRandomEffect() {
        const effects = ['bulletPenetration', 'playerGrow', 'invincible', 'extraBullet', 'invertControls'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
    
        switch (randomEffect) {
            case 'bulletPenetration':
                player.bulletPenetration = true;
                setTimeout(() => { player.bulletPenetration = false; }, 5000);
                break;
            case 'playerGrow':
                player.width *= 1.5;
                player.height *= 1.5;
                setTimeout(() => {
                    player.width /= 1.5;
                    player.height /= 1.5;
                }, 5000);
                break;
            case 'invincible':
                player.invincibleTime = Date.now() + 5000;
                break;
            case 'extraBullet':
                player.bulletCount++;
                break;
            case 'invertControls':
                player.invertedControls = !player.invertedControls;  // 切換控制反轉狀態
                break;
        }
    }

    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!gameOver) {
            updatePlayer();
            autoShoot();  // 添加這行來實現自動射擊

            updateZombies();
            updateBullets();
            updateItems();
            updateDifficulty();
            checkCollisions();
   
            drawPlayer();
            drawZombies();
            drawBullets();
            drawItems();
            drawScore();

            requestAnimationFrame(gameLoop);
        } else {
            drawGameOver();
        }
    }

    document.addEventListener('keydown', (event) => {
        keys[event.code] = true;
        // 移除與空白鍵射擊相關的代碼
        if (event.code === 'KeyR' && gameOver) {
            initGame();
            gameLoop();
        }
    });

    document.addEventListener('keyup', (event) => {
        keys[event.code] = false;
    });

    initGame();
    gameLoop();
});