import { _decorator, Component, Node, Canvas, UITransform, Size, Color, Label, Camera, find } from 'cc';
import { GameManager } from './GameManager';
import { UIManager } from './UIManager';
import { SnakeController } from './SnakeController';
import { InputHandler } from './InputHandler';
import { ObjectPool } from './ObjectPool';
import { Spawner } from './Spawner';
import { VisualUtils } from './VisualUtils';
const { ccclass, property } = _decorator;

@ccclass('Bootstrap')
export class Bootstrap extends Component {
	@property
	public autoStart: boolean = true;

	start() {
		// Canvas
		let canvasNode = find('Canvas');
		if (!canvasNode) {
			canvasNode = new Node('Canvas');
			canvasNode.addComponent(Canvas);
			this.node.scene.addChild(canvasNode);
		}
		// Game Root
		const gameRoot = new Node('GameRoot');
		this.node.scene.addChild(gameRoot);
		const gm = gameRoot.addComponent(GameManager);

		// Snake
		const snakeRoot = new Node('Snake');
		gameRoot.addChild(snakeRoot);
		const head = new Node('Head');
		snakeRoot.addChild(head);
		const segmentRoot = new Node('SegmentRoot');
		snakeRoot.addChild(segmentRoot);
		const snake = head.addComponent(SnakeController);
		snake.segmentRoot = segmentRoot;
		snake.clampHalfWidth = 320;
		gm.snakeRoot = snakeRoot;
		// visuals on head
		VisualUtils.ensureSprite(head, new Size(32, 32), new Color(70, 200, 255, 255));
		VisualUtils.ensureCircleCollider(head, 16, false);

		// Content root for spawner
		const contentRoot = new Node('ContentRoot');
		gameRoot.addChild(contentRoot);

		// Pool + Spawner
		const poolNode = new Node('Pool');
		gameRoot.addChild(poolNode);
		const pool = poolNode.addComponent(ObjectPool);
		const spawner = gameRoot.addComponent(Spawner);
		spawner.pool = pool;
		spawner.contentRoot = contentRoot;
		spawner.snake = snake;

		// UI
		const uiNode = new Node('UI');
		canvasNode.addChild(uiNode);
		const ui = uiNode.addComponent(UIManager);
		ui.snake = snake;

		const gamePanel = new Node('GamePanel');
		uiNode.addChild(gamePanel);
		ui.gamePanel = gamePanel;
		const scoreLabelNode = new Node('ScoreLabel');
		gamePanel.addChild(scoreLabelNode);
		VisualUtils.ensureUITransform(scoreLabelNode, new Size(200, 60));
		const scoreLabel = scoreLabelNode.addComponent(Label);
		scoreLabel.string = '0';
		ui.scoreLabel = scoreLabel;
		const lenLabelNode = new Node('LengthLabel');
		gamePanel.addChild(lenLabelNode);
		VisualUtils.ensureUITransform(lenLabelNode, new Size(200, 60));
		const lenLabel = lenLabelNode.addComponent(Label);
		lenLabel.string = '0';
		ui.lengthLabel = lenLabel;

		const menuPanel = new Node('MenuPanel');
		uiNode.addChild(menuPanel);
		ui.menuPanel = menuPanel;

		const gameOverPanel = new Node('GameOverPanel');
		uiNode.addChild(gameOverPanel);
		ui.gameOverPanel = gameOverPanel;

		// Input panel on canvas
		const inputPanel = new Node('Input');
		canvasNode.addChild(inputPanel);
		VisualUtils.ensureUITransform(inputPanel, new Size(750, 1624));
		inputPanel.addComponent(InputHandler).snakeController = snake;

		// Start game if desired
		if (this.autoStart) {
			gm.startGame();
		}
	}
}
