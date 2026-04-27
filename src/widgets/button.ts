import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string = "Button";
    private defaultFontSize: number = 14;
    private defaultWidth: number = 100;
    private defaultHeight: number = 36;

    // Color palette for the custom look
    private readonly COLOR_IDLE    = "#5B8DEF";   // calm blue
    private readonly COLOR_HOVER   = "#3A6FD8";   // darker blue
    private readonly COLOR_PRESSED = "#1A4FB8";   // deep blue (pressed)
    private readonly COLOR_TEXT    = "#FFFFFF";   // white label
    private readonly COLOR_STROKE  = "#2A50A0";   // border

    constructor(parent: Window) {
        super(parent);
        this.height = this.defaultHeight;
        this.width  = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this.role = RoleType.button;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    // ── label property ──────────────────────────────────────────────────────
    set label(value: string) {
        this._input = value;
        this.update();
    }

    get label(): string {
        return this._input;
    }

    // ── size property ───────────────────────────────────────────────────────
    set size(value: { width: number; height: number }) {
        this.width  = value.width;
        this.height = value.height;
        if (this._rect != null) {
            this._rect.width(this.width);
            this._rect.height(this.height);
        }
        this.update();
    }

    get size(): { width: number; height: number } {
        return { width: this.width, height: this.height };
    }

    set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    // ── onClick convenience wrapper ─────────────────────────────────────────
    onClick(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    // ── layout helpers ──────────────────────────────────────────────────────
    private positionText(): void {
        let box: Box = this._text.bbox();
        this._text_y = (+this._rect.y() + (+this._rect.height() / 2) - (box.height / 2));
        this._text_x = (+this._rect.x() + (+this._rect.width()  / 2) - (box.width  / 2));
        this._text.x(this._text_x);
        if (this._text_y > 0) {
            this._text.y(this._text_y);
        }
    }

    private styleRect(fill: string, ry: number = 6): void {
        this._rect.fill(fill)
                  .stroke({ color: this.COLOR_STROKE, width: 1.5 })
                  .radius(ry);
    }

    // ── render ──────────────────────────────────────────────────────────────
    render(): void {
        this._group = (this.parent as Window).window.group();
        this._rect  = this._group.rect(this.width, this.height);

         this.styleRect(this.COLOR_IDLE);

        
        this._text = this._group.text(this._input)
            .font({ family: "Arial, sans-serif", size: this._fontSize, weight: "600" })
            .fill(this.COLOR_TEXT);

        this.outerSvg = this._group;

         let eventrect = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr('id', 0);

        this.registerEvent(eventrect);
    }

    // ── update ──────────────────────────────────────────────────────────────
    override update(): void {
        if (this._text != null) {
            this._text.font('size', this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
        if (this._rect != null) {
            this._rect.fill(this._backcolor ?? this.COLOR_IDLE);
        }
        super.update();
    }

    // ── state: pressReleaseState (fires click event) ─────────────────────────
    pressReleaseState(): void {
        this.styleRect(this.COLOR_HOVER);
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
        }
    }

    // ── states ───────────────────────────────────────────────────────────────

    /** Normal resting state */
    idleupState(): void {
        this.styleRect(this.COLOR_IDLE);
        this._text.fill(this.COLOR_TEXT);
    }

    /** Mouse held down on the window but not over the button */
    idledownState(): void {
        this.styleRect(this.COLOR_IDLE);
    }

    /** Mouse button pressed while hovering over the button */
    pressedState(): void {
        // shift slightly to simulate a physical press
        this.styleRect(this.COLOR_PRESSED);
        this._rect.radius(4);
    }

    /** Mouse hovering over the button (no press) */
    hoverState(): void {
        this.styleRect(this.COLOR_HOVER);
    }

    /** Mouse hovering + button held from outside */
    hoverPressedState(): void {
        this.styleRect(this.COLOR_PRESSED);
    }

    /** Pressed then dragged outside the button */
    pressedoutState(): void {
        this.styleRect(this.COLOR_IDLE);
    }

    /** Mouse movement – no visual change needed for a basic button */
    moveState(): void { }

    /** Keyboard event (e.g. Enter/Space triggers click) */
    keyupState(keyEvent?: KeyboardEvent): void {
        if (keyEvent && (keyEvent.key === "Enter" || keyEvent.key === " ")) {
            this.raise(new EventArgs(this));
        }
    }
}

export { Button };