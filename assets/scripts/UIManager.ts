import { _decorator, Component, Node, Label } from 'cc';
import { GameManager, GameState } from './GameManager';
import { SnakeController } from './SnakeController';
const { ccclass, property } = _decorator;

@ccclass('UIManager')
export class UIManager extends Component {
	@property(Label)
	public scoreLabel: Label | null = null;

	@property(Label)
	public lengthLabel: Label | null = null;

	@property(Node)
	public menuPanel: Node | null = null;

	@property(Node)
	public gamePanel: Node | null = null;

	@property(Node)
	public gameOverPanel: Node | null = null;

	@property(SnakeController)
	public snake: SnakeController | null = null;

	update() {
		const gm = GameManager.instance;
		if (!gm) return;
		if (this.scoreLabel) this.scoreLabel.string = String(gm.score);
		if (this.lengthLabel) this.lengthLabel.string = String(this.snake?.length ?? 0);
		if (this.menuPanel) this.menuPanel.active = gm.state === GameState.Menu;
		if (this.gamePanel) this.gamePanel.active = gm.state === GameState.Playing;
		if (this.gameOverPanel) this.gameOverPanel.active = gm.state === GameState.GameOver;
	}

	onClickPlay() {
		GameManager.instance?.startGame();
	}

	onClickRetry() {
		GameManager.instance?.startGame();
	}
}
