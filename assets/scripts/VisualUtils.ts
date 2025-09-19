import { _decorator, Component, Node, UITransform, Size, Sprite, Color, SpriteFrame, Texture2D, ImageAsset, Label, LabelOutline, math, director } from 'cc';
import { Collider2D, CircleCollider2D, BoxCollider2D } from 'cc';
const { ccclass } = _decorator;

@ccclass('VisualUtils')
export class VisualUtils extends Component {
	// Empty component: static helpers only
	public static ensureUITransform(node: Node, size: Size): UITransform {
		let ui = node.getComponent(UITransform);
		if (!ui) ui = node.addComponent(UITransform);
		ui.setContentSize(size);
		return ui;
	}

	public static ensureSprite(node: Node, size: Size, color: Color): Sprite {
		const ui = this.ensureUITransform(node, size);
		let sprite = node.getComponent(Sprite);
		if (!sprite) sprite = node.addComponent(Sprite);
		// Create a 2x2 solid color texture
		const img = new ImageAsset();
		img.reset({ width: 2, height: 2, _data: new Uint8Array(2 * 2 * 4) });
		for (let i = 0; i < 4; i++) {
			img.data[i * 4 + 0] = color.r;
			img.data[i * 4 + 1] = color.g;
			img.data[i * 4 + 2] = color.b;
			img.data[i * 4 + 3] = color.a;
		}
		const tex = new Texture2D();
		tex.image = img;
		const frame = new SpriteFrame();
		frame.texture = tex;
		sprite.spriteFrame = frame;
		return sprite;
	}

	public static ensureLabel(node: Node, fontSize: number, color: Color): Label {
		let label = node.getComponent(Label);
		if (!label) label = node.addComponent(Label);
		label.string = label.string || '1';
		label.fontSize = fontSize;
		label.color = color;
		label.horizontalAlign = Label.HorizontalAlign.CENTER;
		label.verticalAlign = Label.VerticalAlign.CENTER;
		return label;
	}

	public static ensureCircleCollider(node: Node, radius: number, isSensor = false): CircleCollider2D {
		let col = node.getComponent(CircleCollider2D);
		if (!col) col = node.addComponent(CircleCollider2D);
		col.radius = radius;
		col.sensor = isSensor;
		return col;
	}

	public static ensureBoxCollider(node: Node, width: number, height: number, isSensor = false): BoxCollider2D {
		let col = node.getComponent(BoxCollider2D);
		if (!col) col = node.addComponent(BoxCollider2D);
		col.size.set(width, height);
		col.sensor = isSensor;
		return col;
	}
}
