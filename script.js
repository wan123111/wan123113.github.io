const gameContainer = document.getElementById('gameContainer');
const playerBall = document.getElementById('playerBall');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const messageDiv = document.getElementById('message');

// 游戏状态变量
let gameStarted = false;
let playerPosition = { x: 50, y: 50 };
let ballSpeed = 5;
let keysCollected = 0;
let gameOver = false;

// 地图定义 (L:地图, S:守护者区域, B:宝藏)
let locations = [
  { x: 150, y: 100, type: 'L', message: '小心！神庙有守护者！' },
  { x: 300, y: 300, type: 'S', message: '恭喜你，获得钥匙！' },
  { x: 400, y: 400, type: 'B', message: '恭喜你，找到宝藏！' },
];

// 随机生成守护者
let guardians = [
  { x: 250, y: 250, direction: 'left' },
  { x: 350, y: 350, direction: 'right' },
];

// 渲染游戏状态
function render() {
  playerBall.style.left = `${playerPosition.x}px`;
  playerBall.style.top = `${playerPosition.y}px`;

  // 检查玩家是否到达指定地点
  locations.forEach(location => {
    if (Math.abs(playerPosition.x - location.x) < 20 && Math.abs(playerPosition.y - location.y) < 20) {
      handleInteraction(location);
    }
  });

  // 检查是否被守护者追上
  guardians.forEach(guardian => {
    if (Math.abs(playerPosition.x - guardian.x) < 20 && Math.abs(playerPosition.y - guardian.y) < 20) {
      if (!gameOver) {
        gameOver = true;
        messageDiv.innerHTML = '你被守护者追上了！游戏失败。<br>点击“重新开始”按钮重新开始。';
        restartButton.style.display = 'block'; // 显示重新开始按钮
      }
    }
  });

  // 游戏胜利：玩家已经获得钥匙并且到达宝藏位置
  if (keysCollected === 1 && Math.abs(playerPosition.x - 400) < 20 && Math.abs(playerPosition.y - 400) < 20) {
    messageDiv.innerHTML = '恭喜你，成功打开宝箱获得宝藏！游戏胜利！';
    gameOver = true;
    restartButton.style.display = 'block'; // 显示重新开始按钮
  }
}

// 处理玩家与地图物品的互动
function handleInteraction(location) {
  switch (location.type) {
    case 'L':
      if (!map) {
        map = true;
        messageDiv.innerHTML = location.message + '<br>';
        potion = true;
      }
      break;
    case 'S':
      if (!potion) {
        messageDiv.innerHTML = location.message +'<br>';
      } else {
        keysCollected++;
        messageDiv.innerHTML = '你获得了钥匙！可以打开宝箱。';
      }
      break;
    case 'B':
      if (keysCollected > 0) {
        messageDiv.innerHTML = location.message + '<br>你已经获得宝藏，游戏结束！';
        gameOver = true;
        restartButton.style.display = 'block'; // 显示重新开始按钮
      }
      break;
  }
}

// 游戏初始化
function initGame() {
  gameStarted = true;
  playerPosition = { x: 50, y: 50 };
  keysCollected = 0;
  map = false;
  potion = false;
  gameOver = false;
  guardians = [
    { x: 250, y: 250, direction: 'left' },
    { x: 350, y: 350, direction: 'right' },
  ];
  messageDiv.innerHTML = '游戏开始，使用方向键或鼠标控制小球。';
  startButton.style.display = 'none';
  restartButton.style.display = 'none'; // 隐藏重新开始按钮
  gameContainer.style.display = 'block';
  render();
}

// 重新开始游戏
function restartGame() {
  initGame();
}

// 监听键盘事件
document.addEventListener('keydown', function(event) {
  if (gameOver) return;
  
  switch (event.key) {
    case 'ArrowUp':
      playerPosition.y -= ballSpeed;
      break;
    case 'ArrowDown':
      playerPosition.y += ballSpeed;
      break;
    case 'ArrowLeft':
      playerPosition.x -= ballSpeed;
      break;
    case 'ArrowRight':
      playerPosition.x += ballSpeed;
      break;
  }

  // 保证小球不超出边界
  if (playerPosition.x < 0) playerPosition.x = 0;
  if (playerPosition.x > gameContainer.offsetWidth - 30) playerPosition.x = gameContainer.offsetWidth - 30;
  if (playerPosition.y < 0) playerPosition.y = 0;
  if (playerPosition.y > gameContainer.offsetHeight - 30) playerPosition.y = gameContainer.offsetHeight - 30;

  render();
});

// 点击开始游戏按钮
startButton.addEventListener('click', function() {
  initGame();
});

// 点击重新开始按钮
restartButton.addEventListener('click', function() {
  restartGame();
});

// 守护者的移动逻辑
function moveGuardians() {
  if (gameOver) return;
  
  guardians.forEach(guardian => {
    if (guardian.direction === 'left') {
      guardian.x -= 2;
      if (guardian.x <= 50) guardian.direction = 'right';
    } else {
      guardian.x += 2;
      if (guardian.x >= gameContainer.offsetWidth - 30) guardian.direction = 'left';
    }
  });
}

// 更新守护者的位置
function renderGuardians() {
  const guardianElements = document.querySelectorAll('.guardian');
  guardians.forEach((guardian, index) => {
    guardianElements[index].style.left = `${guardian.x}px`;
    guardianElements[index].style.top = `${guardian.y}px`;
  });
}

// 游戏的主循环
function gameLoop() {
  if (gameStarted && !gameOver) {
    moveGuardians();
    renderGuardians();
    render();
  }

  requestAnimationFrame(gameLoop);
}

// 启动游戏循环
gameLoop();
