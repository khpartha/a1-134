import { IdleUpWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Text } from "../core/ui";

class RadioButton extends Widget {
    private _options: string[];
    private _selectedIndex: number;
    private _fontSize: number;
    private _circles: any[];
    private _dots: any[];
    private _labels: Text[];

    private readonly RADIO_SIZE   = 18;
    private readonly SPACING      = 30;
    private readonly COLOR_IDLE   = "#FFFFFF";
    private readonly COLOR_HOVER  = "#E0EAFF";
    private readonly COLOR_STROKE = "#2A50A0";
    private readonly COLOR_DOT    = "#1A4FB8";
    private readonly COLOR_TEXT   = "#222222";

    constructor(parent: Window, options: string[]) {
        super(parent);
        if (options.length < 2) {
            throw new Error("RadioButton requires at least 2 options.");
        }
        this._options = options;
        this._selectedIndex = -1;
        this._fontSize = 14;
        this._circles = [];
        this._dots = [];
        this._labels = [];
        this.width = 200;
        this.height = this.SPACING * options.length;
        this.role = RoleType.none;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    set label(values: string[]) {
        this._options = values;
        this._labels.forEach((lbl, i) => lbl.text(this._options[i] ?? ""));
    }

    get label(): string[] {
        return this._options;
    }

    get selectedIndex(): number {
        return this._selectedIndex;
    }

    onChange(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._options.forEach((option, i) => {
            const y = i * this.SPACING;

            const circle = this._group.circle(this.RADIO_SIZE)
                .move(0, y)
                .fill(this.COLOR_IDLE)
                .stroke({ color: this.COLOR_STROKE, width: 2 });
            this._circles.push(circle);

            const dot = this._group.circle(this.RADIO_SIZE * 0.5)
                .move(this.RADIO_SIZE * 0.25, y + this.RADIO_SIZE * 0.25)
                .fill(this.COLOR_DOT)
                .opacity(0);
            this._dots.push(dot);

            const lbl = this._group.text(option)
                .font({ family: "Arial, sans-serif", size: this._fontSize })
                .fill(this.COLOR_TEXT)
                .move(this.RADIO_SIZE + 8, y + 1);
            this._labels.push(lbl);

            // per-row hit area (no global overlay so clicks are not blocked)
            const hit = this._group.rect(this.width, this.RADIO_SIZE + 8)
                .move(0, y - 2)
                .opacity(0)
                .attr('id', i);

            hit.mousedown(() => this.selectOption(i));
            hit.mouseover(() => this._circles[i].fill(this.COLOR_HOVER));
            hit.mouseout(() => {
                if (this._selectedIndex !== i)
                    this._circles[i].fill(this.COLOR_IDLE);
            });
        });

        this.outerSvg = this._group;
    }

    private selectOption(index: number): void {
        if (this._selectedIndex === index) return;

        if (this._selectedIndex >= 0) {
            this._dots[this._selectedIndex].opacity(0);
            this._circles[this._selectedIndex].fill(this.COLOR_IDLE);
        }

        this._selectedIndex = index;
        this._dots[index].opacity(1);
        this._circles[index].fill(this.COLOR_HOVER);

        this.raise(new EventArgs(this));
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

export { RadioButton };