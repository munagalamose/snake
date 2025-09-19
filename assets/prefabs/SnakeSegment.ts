import { _decorator, Component, Vec3, Color, Size } from 'cc';
import { VisualUtils } from '../scripts/VisualUtils';
const { ccclass, property } = _decorator;

@ccclass('SnakeSegment')
export class SnakeSegment extends Component {
	@property
	public followLerp: number = 0.2;

	public targetPosition: Vec3 | null = null;
	private _temp: Vec3 = new Vec3();

	onLoad() {
		// Auto visuals
		VisualUtils.ensureSprite(this.node, new Size(28, 28), new Color(70, 200, 255, 255));
		VisualUtils.ensureCircleCollider(this.node, 14, true);
	}

	update(dt: number) {
		if (!this.targetPosition) return;
		const current = this.node.position;
		this._temp.set(
			current.x + (this.targetPosition.x - current.x) * this.followLerp,
			current.y + (this.targetPosition.y - current.y) * this.followLerp,
			current.z + (this.targetPosition.z - current.z) * this.followLerp,
		);
		this.node.setPosition(this._temp);
	}
}
