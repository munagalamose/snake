import { _decorator, Component, Label, Color, Size } from 'cc';
import { GameManager } from '../scripts/GameManager';
import { SnakeController } from '../scripts/SnakeController';
import { VisualUtils } from '../scripts/VisualUtils';
const { ccclass, property } = _decorator;

@ccclass('Block')
export class Block extends Component {
	@property({ tooltip: 'Hit points of this block' })
	public value: number = 1;

	@property(Label)
	public label: Label | null = null;

	onEnable() {
		// visuals
		VisualUtils.ensureSprite(this.node, new Size(120, 120), new Color(255, 170, 60, 255));
		VisualUtils.ensureBoxCollider(this.node, 120, 120, false);
		if (!this.label) {
			this.label = this.node.getComponent(Label) || VisualUtils.ensureLabel(this.node, 36, new Color(20, 20, 20, 255));
		}
		this.refreshLabel();
	}

	public hitBySnake(snake: SnakeController) {
		if (GameManager.instance?.isGameOver) return;
		const snakeLen = snake.length;
		if (snakeLen <= 0) return;
		if (snakeLen >= this.value) {
			snake.reduceLength(this.value);
			GameManager.instance?.addScore(this.value);
			this.node.destroy();
		} else {
			this.value -= snakeLen;
			this.refreshLabel();
			snake.reduceLength(snakeLen);
			GameManager.instance?.addScore(snakeLen);
		}
	}

	private refreshLabel() {
		if (this.label) {
			this.label.string = String(Math.max(0, Math.floor(this.value)));
		}
	}
}
