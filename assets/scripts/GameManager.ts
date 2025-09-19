import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

export enum GameState {
	Menu = 0,
	Playing = 1,
	GameOver = 2,
}

@ccclass('GameManager')
export class GameManager extends Component {
	public static instance: GameManager | null = null;

	@property({ type: Node })
	public snakeRoot: Node | null = null;

	public state: GameState = GameState.Menu;
	public score: number = 0;
	public isGameOver: boolean = false;

	onLoad() {
		GameManager.instance = this;
	}

	startGame() {
		this.state = GameState.Playing;
		this.isGameOver = false;
		this.score = 0;
	}

	endGame() {
		this.state = GameState.GameOver;
		this.isGameOver = true;
	}

	addScore(amount: number) {
		if (this.isGameOver) return;
		this.score += Math.max(0, amount);
	}
}
