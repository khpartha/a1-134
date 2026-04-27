import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "../core/ui";

class ProgressBar extends Widget {
    private _track: Rect;
    private _fill: Rect;
    //private _label: Text;
    private _value: number = 0;
    private _incrementValue: number = 10;

    private readonly BAR_HEIGHT   = 24;
    private readonly COLOR_TRACK  = "#E0E0E0";
    private readonly COLOR_FILL   = "#5B8DEF";
    private readonly COLOR_STROKE = "#2A50A0";
    private readonly COLOR_TEXT   = "#FFFFFF";

    private _onIncrementCallback: ((event: EventArgs) => void) | null = null;
    private _onStateChangeCallback: ((event: EventArgs) => void) | null = null;

    constructor(parent: Window) {
        super(parent);
        this.width = 200;
        this.height = this.BAR_HEIGHT;
        this.role = RoleType.none;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    // ── width property ────────────────────────────────────────────────────────
    set barWidth(value: number) {
        this.width = value;
        if (this._track != null) {
            this._track.width(this.width);
            this.updateFill();
        }
    }

    get barWidth(): number {
        return this.width;
    }

    // ── increment value property ──────────────────────────────────────────────
    set incrementValue(value: number) {
        this._incrementValue = Math.max(0, Math.min(100, value));
    }

    get incrementValue(): number {
        return this._incrementValue;
    }

    // ── current value ─────────────────────────────────────────────────────────
    get value(): number {
        return this._value;
    }

    // ── increment method ──────────────────────────────────────────────────────
    increment(amount?: number): void {
        const step = amount !== undefined ? amount : this._incrementValue;
        this._value = Math.max(0, Math.min(100, this._value + step));
        this.updateFill();
        if (this._onIncrementCallback)
            this._onIncrementCallback(new EventArgs(this));
    }

    // ── event handlers ────────────────────────────────────────────────────────
    onIncrement(callback: (event: EventArgs) => void): void {
        this._onIncrementCallback = callback;
    }

    onStateChange(callback: (event: EventArgs) => void): void {
        this._onStateChangeCallback = callback;
    }

    // ── helpers ───────────────────────────────────────────────────────────────
 private updateFill(): void {
    if (this._fill == null) return;
    const fillWidth = (this._value / 100) * this.width;
    this._fill.width(Math.max(0, fillWidth));
}

   // ── render ────────────────────────────────────────────────────────────────
    render(): void {
        this._group = (this.parent as Window).window.group();

        // track
        this._track = this._group.rect(this.width, this.BAR_HEIGHT)
            .move(0, 0)
            .fill(this.COLOR_TRACK)
            .stroke({ color: this.COLOR_STROKE, width: 1.5 })
            .radius(5);

        // fill
        this._fill = this._group.rect(0, this.BAR_HEIGHT)
            .move(0, 0)
            .fill(this.COLOR_FILL)
            .radius(5);

        this.outerSvg = this._group;

        // transparent hit area — click to jump to position
        const eventrect = this._group.rect(this.width, this.BAR_HEIGHT)
            .opacity(0).attr('id', 0);

        eventrect.mousedown((e: MouseEvent) => {
            const rect = (this._group as any).node.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            this._value = Math.max(0, Math.min(100, (clickX / this.width) * 100));
            this.updateFill();
            if (this._onIncrementCallback)
                this._onIncrementCallback(new EventArgs(this));
        });

        this.registerEvent(eventrect);
    }

    override update(): void {
        this.updateFill();
        super.update();
    }


    // ── states ────────────────────────────────────────────────────────────────
    idleupState(): void {
        this._track?.stroke({ color: this.COLOR_STROKE, width: 1.5 });
        if (this._onStateChangeCallback)
            this._onStateChangeCallback(new EventArgs(this));
    }

    hoverState(): void {
        this._track?.stroke({ color: "#1A4FB8", width: 2 });
        if (this._onStateChangeCallback)
            this._onStateChangeCallback(new EventArgs(this));
    }

    pressedState(): void {
        if (this._onStateChangeCallback)
            this._onStateChangeCallback(new EventArgs(this));
    }

    pressReleaseState(): void {
        if (this._onStateChangeCallback)
            this._onStateChangeCallback(new EventArgs(this));
    }

    idledownState(): void { }
    hoverPressedState(): void { }
    pressedoutState(): void { }
    moveState(): void { }
    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            this.increment();
        }
    }
}

export { ProgressBar };