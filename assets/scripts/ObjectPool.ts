import { _decorator, Component, Node, Prefab, instantiate } from 'cc';
const { ccclass, property } = _decorator;

type PoolBucket = {
	prefab: Prefab,
	free: Node[],
};

@ccclass('ObjectPool')
export class ObjectPool extends Component {
	@property({ type: [Prefab], tooltip: 'Prefabs to prewarm (optional)' })
	public prefabs: Prefab[] = [];

	@property
	public prewarmCount: number = 0;

	private _pools: Map<string, PoolBucket> = new Map();

	onLoad() {
		for (const p of this.prefabs) {
			this.registerPrefab(p);
			if (this.prewarmCount > 0) {
				for (let i = 0; i < this.prewarmCount; i++) {
					const n = instantiate(p);
					n.active = false;
					this.node.addChild(n);
					this.recycle(n, p);
				}
			}
		}
	}

	public registerPrefab(prefab: Prefab) {
		const key = prefab.data?.name ?? `${this._pools.size}`;
		if (!this._pools.has(key)) {
			this._pools.set(key, { prefab, free: [] });
		}
	}

	public acquire(prefab: Prefab, parent?: Node): Node {
		const key = prefab.data?.name ?? '';
		let bucket = this._pools.get(key);
		if (!bucket) {
			this.registerPrefab(prefab);
			bucket = this._pools.get(key)!;
		}
		let node: Node | undefined = bucket.free.pop();
		if (!node) {
			node = instantiate(prefab);
		}
		if (parent) parent.addChild(node);
		node.active = true;
		return node;
	}

	public recycle(node: Node, prefab?: Prefab) {
		node.active = false;
		if (prefab) {
			const key = prefab.data?.name ?? '';
			const bucket = this._pools.get(key);
			if (bucket) {
				bucket.free.push(node);
				return;
			}
		}
		// fallback: use node name
		const key = node.name;
		let bucket = this._pools.get(key);
		if (!bucket) {
			// cannot infer prefab reliably; drop it under pool node
			this.node.addChild(node);
			return;
		}
		bucket.free.push(node);
	}
}
