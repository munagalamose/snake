import { _decorator, Component, Color, Size } from 'cc';
import { SnakeController } from '../scripts/SnakeController';
import { VisualUtils } from '../scripts/VisualUtils';
const { ccclass } = _decorator;

@ccclass('Pickup')
export class Pickup extends Component {
	onEnable() {
		VisualUtils.ensureSprite(this.node, new Size(40, 40), new Color(120, 255, 140, 255));
		VisualUtils.ensureCircleCollider(this.node, 20, true);
	}

	public collectBy(snake: SnakeController) {
		snake.addSegments(1);
		this.node.destroy();
	}
}
