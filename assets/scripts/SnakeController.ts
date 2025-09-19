import { _decorator, Component, Node, Prefab, instantiate, Vec3, UITransform, math, Collider2D, Contact2DType, IPhysics2DContact } from 'cc';
import { SnakeSegment } from '../prefabs/SnakeSegment';
import { GameManager } from './GameManager';
import { Block } from '../prefabs/Block';
import { Pickup } from '../prefabs/Pickup';
const { ccclass, property } = _decorator;

@ccclass('SnakeController')
export class SnakeController extends Component {
	@property({ tooltip: 'Prefab used for new body segments' })
	public segmentPrefab: Prefab | null = null;

	@property({ tooltip: 'Spacing in units between segments' })
	public segmentSpacing: number = 40;

	@property({ tooltip: 'Horizontal speed clamp per drag step' })
	public maxStepX: number = 60;

	@property({ tooltip: 'Half width in UI units for horizontal clamping' })
	public clampHalfWidth: number = 300;

	@property(Node)
	public segmentRoot: Node | null = null;

	private _segments: Node[] = [];
	private _headTarget: Vec3 = new Vec3();
	private _tmp: Vec3 = new Vec3();

	get length(): number {
		return this._segments.length;
	}

	onLoad() {
		// Ensure head is segment index 0
		if (this._segments.length === 0) {
			this._segments.push(this.node);
		}
		const col = this.getComponent(Collider2D);
		if (col) {
			col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
		}
	}

	onDestroy() {
		const col = this.getComponent(Collider2D);
		if (col) {
			col.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
		}
	}

	public moveHorizontally(deltaX: number) {
		if (GameManager.instance?.isGameOver) return;
		// Clamp delta per step for stability
		const clamped = math.clamp(deltaX, -this.maxStepX, this.maxStepX);
		this._headTarget.set(this.node.position);
		this._headTarget.x += clamped;
		// Clamp to bounds
		this._headTarget.x = math.clamp(this._headTarget.x, -this.clampHalfWidth, this.clampHalfWidth);
		this.node.setPosition(this._headTarget);
	}

	update(dt: number) {
		// Update following targets for segments > 0
		for (let i = 1; i < this._segments.length; i++) {
			const prev = this._segments[i - 1];
			const seg = this._segments[i];
			const segComp = seg.getComponent(SnakeSegment);
			if (segComp) {
				segComp.targetPosition = prev.position;
			}
		}
	}

	public addSegments(count: number) {
		if (!this.segmentPrefab || !this.segmentRoot) return;
		for (let i = 0; i < count; i++) {
			const last = this._segments[this._segments.length - 1];
			const newSeg = instantiate(this.segmentPrefab);
			this.segmentRoot.addChild(newSeg);
			// position new segment at the last segment with spacing behind on Y
			this._tmp.set(last.position.x, last.position.y - this.segmentSpacing, last.position.z);
			newSeg.setPosition(this._tmp);
			this._segments.push(newSeg);
		}
	}

	public reduceLength(count: number) {
		let toRemove = Math.min(count, Math.max(0, this._segments.length));
		// Never remove the head node itself; treat head as one life as well
		while (toRemove > 0 && this._segments.length > 0) {
			const seg = this._segments.pop();
			if (!seg) break;
			if (seg === this.node) {
				// Removing the last life triggers game over
				GameManager.instance?.endGame();
				break;
			}
			seg.destroy();
			toRemove--;
		}
		if (this._segments.length === 0) {
			GameManager.instance?.endGame();
		}
	}

	private onBeginContact(selfCol: Collider2D, otherCol: Collider2D, contact: IPhysics2DContact | null) {
		if (GameManager.instance?.isGameOver) return;
		const otherNode = otherCol.node;
		const block = otherNode.getComponent(Block);
		if (block) {
			block.hitBySnake(this);
			return;
		}
		const pickup = otherNode.getComponent(Pickup);
		if (pickup) {
			pickup.collectBy(this);
			return;
		}
	}
}
