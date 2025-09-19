import { _decorator, Component, Node, EventTouch, UITransform, Vec3 } from 'cc';
import { SnakeController } from './SnakeController';
const { ccclass, property } = _decorator;

@ccclass('InputHandler')
export class InputHandler extends Component {
	@property(SnakeController)
	public snakeController: SnakeController | null = null;

	@property
	public sensitivity: number = 1.0;

	private _lastTouchX: number | null = null;

	onEnable() {
		this.node.on(Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.on(Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.on(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
	}

	onDisable() {
		this.node.off(Node.EventType.TOUCH_START, this.onTouchStart, this);
		this.node.off(Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
		this.node.off(Node.EventType.TOUCH_END, this.onTouchEnd, this);
		this.node.off(Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
	}

	private onTouchStart(event: EventTouch) {
		this._lastTouchX = event.getUILocation().x;
	}

	private onTouchMove(event: EventTouch) {
		if (!this.snakeController) return;
		const x = event.getUILocation().x;
		if (this._lastTouchX === null) {
			this._lastTouchX = x;
			return;
		}
		const deltaX = (x - this._lastTouchX) * this.sensitivity;
		this._lastTouchX = x;
		this.snakeController.moveHorizontally(deltaX);
	}

	private onTouchEnd() {
		this._lastTouchX = null;
	}
}
