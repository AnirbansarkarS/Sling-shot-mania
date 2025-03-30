
        const canvas = document.getElementById("gameCanvas");
        const ctx = canvas.getContext("2d");
        
        let background = new Image();
        background.src = "background.jpg";
        
        let slingshotImg = new Image();
        slingshotImg.src = "Slingshot.png";
        
        let target = { x: 700, y: 350, width: 40, height: 40 };
        
        let bird = { x: 150, y: 350, radius: 15, vx: 0, vy: 0, dragging: false, launched: false };
        let gravity = 0.4;
        let slingX = 150, slingY = 350;
        let startX, startY;
        
        canvas.addEventListener("mousedown", (e) => {
            let dx = e.offsetX - bird.x;
            let dy = e.offsetY - bird.y;
            if (Math.sqrt(dx * dx + dy * dy) < bird.radius) {
                bird.dragging = true;
                startX = e.offsetX;
                startY = e.offsetY;
            }
        });

        canvas.addEventListener("mousemove", (e) => {
            if (bird.dragging) {
                bird.x = e.offsetX;
                bird.y = e.offsetY;
            }
        });
        
        canvas.addEventListener("mouseup", (e) => {
            if (bird.dragging) {
                bird.vx = (slingX - bird.x) * 0.2;
                bird.vy = (slingY - bird.y) * 0.2;
                bird.dragging = false;
                bird.launched = true;
            }
        });
        
        function update() {
            if (bird.launched) {
                bird.vy += gravity;
                bird.x += bird.vx;
                bird.y += bird.vy;

                if (bird.y + bird.radius > canvas.height) {
                    bird.y = canvas.height - bird.radius;
                    bird.vy *= -0.6;
                }
                if (bird.x + bird.radius > canvas.width || bird.x - bird.radius < 0) {
                    bird.vx *= -0.6;
                }
                
                checkCollision();
            }
        }
        
        function checkCollision() {
            if (
                bird.x + bird.radius > target.x &&
                bird.x - bird.radius < target.x + target.width &&
                bird.y + bird.radius > target.y &&
                bird.y - bird.radius < target.y + target.height
            ) {
                nextLevel();
            }
        }
        
        function nextLevel() {
            alert("You hit the target! Moving to next level...");
            target.x = Math.random() * (canvas.width - 50) + 50;
            target.y = Math.random() * (canvas.height - 100) + 50;
            restartGame();
        }
        
        function drawSlingshot() {
            if (bird.dragging) {
                ctx.strokeStyle = "brown";
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(slingX, slingY);
                ctx.lineTo(bird.x, bird.y);
                ctx.stroke();
            }
        }

        function drawPointer() {
            if (bird.dragging) {
                let tempVx = (slingX - bird.x) * 0.2;
                let tempVy = (slingY - bird.y) * 0.2;
                let tempX = bird.x;
                let tempY = bird.y;
                
                ctx.fillStyle = "yellow";
                
                for (let i = 0; i < 10; i++) {
                    tempVy += gravity;
                    tempX += tempVx;
                    tempY += tempVy;
                    
                    ctx.beginPath();
                    ctx.arc(tempX, tempY, 3, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
            
            if (!bird.launched) {
                ctx.drawImage(slingshotImg, slingX - 20, slingY - 50, 40, 100);
            }
            
            drawSlingshot();
            drawPointer();
            
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = "blue";
            ctx.fillRect(target.x, target.y, target.width, target.height);
        }
        
        function restartGame() {
            bird.x = 150;
            bird.y = 350;
            bird.vx = 0;
            bird.vy = 0;
            bird.launched = false;
        }
        
        document.getElementById("restartBtn").addEventListener("click", restartGame);
        
        function gameLoop() {
            update();
            draw();
            requestAnimationFrame(gameLoop);
        }
        
        gameLoop();
    
