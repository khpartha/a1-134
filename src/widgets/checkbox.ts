import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class CheckBox extends Widget {
    private _box: Rect;
    private _checkmark: any;
    private _label: Text;
    private _input: string;
    private _fontSize: number;
    private _checked: boolean;

    private readonly BOX_SIZE     = 20;
    private readonly COLOR_IDLE   = "#FFFFFF";
    private readonly COLOR_HOVER  = "#E0EAFF";
    private readonly COLOR_STROKE = "#2A50A0";
    private readonly COLOR_CHECK  = "#1A4FB8";
    private readonly COLOR_TEXT   = "#222222";

    constructor(parent: Window) {
        super(parent);
        this.width = 160;
        this.height = this.BOX_SIZE;
        this._input = "Check Box";
        this._fontSize = 14;
        this._checked = false;
        this.role = RoleType.none;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    // ── label property ───────────────────────────────────────────────────────
    set label(value: string) {
        this._input = value;
        this.update();
    }

    get label(): string {
        return this._input;
    }

    // ── checked property ─────────────────────────────────────────────────────
    set checked(value: boolean) {
        this._checked = value;
        this.update();
    }

    get checked(): boolean {
        return this._checked;
    }

    // ── event handler ────────────────────────────────────────────────────────
    onChange(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    // ── render ───────────────────────────────────────────────────────────────
    render(): void {
        this._group = (this.parent as Window).window.group();

        // the checkbox square
        this._box = this._group.rect(this.BOX_SIZE, this.BOX_SIZE)
            .fill(this.COLOR_IDLE)
            .stroke({ color: this.COLOR_STROKE, width: 2 })
            .radius(3);

        // checkmark (drawn as a polyline)
        this._checkmark = this._group.polyline("4,10 8,15 16,5")
            .fill("none")
            .stroke({ color: this.COLOR_CHECK, width: 2.5, linecap: "round", linejoin: "round" })
            .opacity(0); // hidden by default

        // label text to the right of the box
        this._label = this._group.text(this._input)
            .font({ family: "Arial, sans-serif", size: this._fontSize })
            .fill(this.COLOR_TEXT)
            .move(this.BOX_SIZE + 8, 2);

        this.outerSvg = this._group;

        // transparent hit area
        let eventrect = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr('id', 0);

        this.registerEvent(eventrect);
    }

    override update(): void {
        if (this._box != null) {
            this._box.fill(this.COLOR_IDLE);
        }
        if (this._checkmark != null) {
            this._checkmark.opacity(this._checked ? 1 : 0);
        }
        if (this._label != null) {
            this._label.text(this._input);
        }
        super.update();
    }

    // ── states ────────────────────────────────────────────────────────────────
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this._checked = !this._checked;
            this.update();
            this.raise(new EventArgs(this));
        }
        this._box.fill(this.COLOR_HOVER);
    }

    idleupState(): void {
        this._box.fill(this.COLOR_IDLE)
                 .stroke({ color: this.COLOR_STROKE, width: 2 });
    }

    idledownState(): void {
        this._box.fill(this.COLOR_IDLE);
    }

    pressedState(): void {
        this._box.fill(this.COLOR_CHECK).opacity(0.3);
    }

    hoverState(): void {
        this._box.fill(this.COLOR_HOVER).opacity(1);
    }

    hoverPressedState(): void {
        this._box.fill(this.COLOR_CHECK).opacity(0.3);
    }

    pressedoutState(): void {
        this._box.fill(this.COLOR_IDLE).opacity(1);
    }

    moveState(): void { }

    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            this._checked = !this._checked;
            this.update();
            this.raise(new EventArgs(this));
        }
    }
}

export { CheckBox };