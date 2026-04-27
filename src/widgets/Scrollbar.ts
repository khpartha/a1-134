import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";

class ScrollBar extends Widget {
    private _thumb: any;
    private _upBtn: any;
    private _downBtn: any;
    private _thumbPos: number = 0;
    private _barHeight: number;

    private readonly BAR_WIDTH    = 20;
    private readonly BTN_SIZE     = 20;
    private readonly THUMB_H      = 30;
    private readonly COLOR_TRACK  = "#E8E8E8";
    private readonly COLOR_THUMB  = "#5B8DEF";
    private readonly COLOR_THUMB_H= "#3A6FD8";
    private readonly COLOR_BTN    = "#5B8DEF";
    private readonly COLOR_BTN_H  = "#3A6FD8";
    private readonly COLOR_STROKE = "#2A50A0";
    private readonly COLOR_ARROW  = "#FFFFFF";

    constructor(parent: Window, barHeight: number = 200) {
        super(parent);
        this._barHeight = barHeight;
        this.width = this.BAR_WIDTH;
        this.height = barHeight;
        this.role = RoleType.scrollbar;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get barHeight(): number { return this._barHeight; }
    set barHeight(v: number) { this._barHeight = v; }
    get thumbPosition(): number { return this._thumbPos; }

    onScroll(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    private get trackHeight(): number {
        return this._barHeight - this.BTN_SIZE * 2;
    }

    // offset from thumb's starting position (top of track)
    private setThumb(pos: number): void {
        this._thumbPos = Math.max(0, Math.min(1, pos));
        const offset = this._thumbPos * (this.trackHeight - this.THUMB_H);
        // translateY moves thumb relative to its rendered position
        this._thumb.transform({ translateY: offset });
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        // up button
        this._upBtn = this._group.rect(this.BAR_WIDTH, this.BTN_SIZE)
            .move(0, 0)
            .fill(this.COLOR_BTN)
            .stroke({ color: this.COLOR_STROKE, width: 1 })
            .radius(3);
        this._group.polygon(`10,5 16,15 4,15`).fill(this.COLOR_ARROW);

        // track
        this._group.rect(this.BAR_WIDTH, this.trackHeight)
            .move(0, this.BTN_SIZE)
            .fill(this.COLOR_TRACK)
            .stroke({ color: this.COLOR_STROKE, width: 1 });

        // thumb — anchored at top of track, moved via transform
        this._thumb = this._group.rect(this.BAR_WIDTH - 4, this.THUMB_H)
            .move(2, this.BTN_SIZE)
            .fill(this.COLOR_THUMB)
            .stroke({ color: this.COLOR_STROKE, width: 1 })
            .radius(4);

        // down button
        const downY = this.BTN_SIZE + this.trackHeight;
        this._downBtn = this._group.rect(this.BAR_WIDTH, this.BTN_SIZE)
            .move(0, downY)
            .fill(this.COLOR_BTN)
            .stroke({ color: this.COLOR_STROKE, width: 1 })
            .radius(3);
        this._group.polygon(`10,${downY+15} 16,${downY+5} 4,${downY+5}`)
            .fill(this.COLOR_ARROW);

        this.outerSvg = this._group;

        // up hit area
        const upHit = this._group.rect(this.BAR_WIDTH, this.BTN_SIZE)
            .move(0, 0).opacity(0);
        upHit.mousedown(() => {
            this.setThumb(this._thumbPos - 0.1);
            this.raise(new EventArgs(this, "up"));
        });
        upHit.mouseover(() => this._upBtn.fill(this.COLOR_BTN_H));
        upHit.mouseout(() => this._upBtn.fill(this.COLOR_BTN));

        // down hit area
        const downHit = this._group.rect(this.BAR_WIDTH, this.BTN_SIZE)
            .move(0, downY).opacity(0);
        downHit.mousedown(() => {
            this.setThumb(this._thumbPos + 0.1);
            this.raise(new EventArgs(this, "down"));
        });
        downHit.mouseover(() => this._downBtn.fill(this.COLOR_BTN_H));
        downHit.mouseout(() => this._downBtn.fill(this.COLOR_BTN));

        // track hit — jump to position
        const trackHit = this._group.rect(this.BAR_WIDTH, this.trackHeight)
            .move(0, this.BTN_SIZE).opacity(0);
        trackHit.mousedown((e: MouseEvent) => {
            const groupRect = (this._group as any).node.getBoundingClientRect();
            const clickY = e.clientY - groupRect.top - this.BTN_SIZE;
            const pos = clickY / (this.trackHeight - this.THUMB_H);
            const dir = pos > this._thumbPos ? "down" : "up";
            this.setThumb(pos);
            this.raise(new EventArgs(this, dir));
        });

        // thumb hover
        this._thumb.mouseover(() => this._thumb.fill(this.COLOR_THUMB_H));
        this._thumb.mouseout(() => this._thumb.fill(this.COLOR_THUMB));
    }

    override update(): void { super.update(); }
    pressReleaseState(): void { }
    idleupState(): void { }
    idledownState(): void { }
    pressedState(): void { }
    hoverState(): void { }
    hoverPressedState(): void { }
    pressedoutState(): void { }
    moveState(): void { }
    keyupState(keyEvent?: KeyboardEvent): void { }
}

export { ScrollBar };