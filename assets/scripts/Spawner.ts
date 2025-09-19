import { _decorator, Component, Node, Prefab, Vec3, math } from 'cc';
import { ObjectPool } from './ObjectPool';
import { Block } from '../prefabs/Block';
import { Pickup } from '../prefabs/Pickup';
import { GameManager } from './GameManager';
import { SnakeController } from './SnakeController';
const { ccclass, property } = _decorator;

@ccclass('Spawner')
export class Spawner extends Component {
	@property(ObjectPool)
	public pool: ObjectPool | null = null;

	@property(Prefab)
	public blockPrefab: Prefab | null = null;

	@property(Prefab)
	public pickupPrefab: Prefab | null = null;

	@property(Node)
	public contentRoot: Node | null = null;

	@property
	public lanes: number = 5;

	@property
	public laneWidth: number = 150;

	@property
	public startY: number = 300;

	@property
	public rowSpacingY: number = 220;

	@property
	public scrollSpeed: number = 120;

	@property(SnakeController)
	public snake: SnakeController | null = null;

	private _nextRowIndex: number = 0;
	private _spawnedRows: Node[] = [];
	private _temp: Vec3 = new Vec3();
	private _difficulty: number = 1;
	private _time: number = 0;

	update(dt: number) {
		if (GameManager.instance?.state !== 1 /* Playing */) return;
		this._time += dt;
		this._difficulty = 1 + Math.min(3, this._time * 0.1);
		// Scroll content upward
		if (this.contentRoot) {
			this.contentRoot.position = this.contentRoot.position.add3f(0, this.scrollSpeed * dt, 0);
		}
		// Ensure rows ahead
		while (this._nextRowIndex < 12) {
			this.spawnRow(this._nextRowIndex);
			this._nextRowIndex++;
		}
		// Recycle rows that passed off-screen
		for (let i = this._spawnedRows.length - 1; i >= 0; i--) {
			const row = this._spawnedRows[i];
			if (row.worldPosition.y > (this.startY + 2000)) {
				row.destroy();
				this._spawnedRows.splice(i, 1);
			}
		}
	}

	private spawnRow(indexAhead: number) {
		if (!this.contentRoot) return;
		const row = new Node(`Row_${Date.now()}_${indexAhead}`);
		this.contentRoot.addChild(row);
		const y = this.startY - indexAhead * this.rowSpacingY;
		row.setPosition(0, y, 0);

		// Decide safe lane
		const safeLane = Math.floor(Math.random() * this.lanes);
		const currentLen = Math.max(1, this.snake?.length ?? 1);
		const maxBlock = Math.max(1, Math.floor(currentLen * this._difficulty));

		for (let lane = 0; lane < this.lanes; lane++) {
			const x = (lane - (this.lanes - 1) * 0.5) * this.laneWidth;
			// Place either a block or a pickup; safe lane favors pickup or small block
			const placePickup = (lane === safeLane) && Math.random() < 0.7;
			if (placePickup) {
				if (this.pickupPrefab && this.pool) {
					const n = this.pool.acquire(this.pickupPrefab, row);
					n.setPosition(x, 0, 0);
				}
			} else {
				if (this.blockPrefab && this.pool) {
					const n = this.pool.acquire(this.blockPrefab, row);
					n.setPosition(x, 0, 0);
					const block = n.getComponent(Block);
					if (block) {
						const val = lane === safeLane ? Math.max(1, Math.floor(currentLen * 0.4)) : math.randomRangeInt(Math.max(1, Math.floor(currentLen * 0.6)), maxBlock + 1);
						block.value = val;
					}
				}
			}
		}
		this._spawnedRows.push(row);
	}
}
