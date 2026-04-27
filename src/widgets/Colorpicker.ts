import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Text } from "../core/ui";

class ColorPicker extends Widget {
    private _options: { label: string; color: string }[];
    private _selectedIndex: number = -1;
    private _circles: any[] = [];
    private _dots: any[] = [];
    private _labels: Text[] = [];
    private _swatches: any[] = [];
    private _fontSize: number = 14;

    private readonly RADIO_SIZE  = 18;
    private readonly SPACING     = 35;
    private readonly COLOR_STROKE= "#2A50A0";
    private readonly COLOR_DOT   = "#1A4FB8";
    private readonly COLOR_TEXT  = "#222222";

    constructor(parent: Window) {
        super(parent);
        this._options = [
            { label: "White",      color: "#FFFFFF" },
            { label: "Light Blue", color: "#D6E8FF" },
            { label: "Grey",       color: "#D3D3D3" },
        ];
        this.width = 220;
        this.height = this.SPACING * this._options.length;
        this.role = RoleType.none;
        this.render();
        this.setState(new IdleUpWidgetState());
        this.selectable = false;
    }

    get selectedColor(): string {
        if (this._selectedIndex < 0) return "";
        return this._options[this._selectedIndex].color;
    }

    get selectedLabel(): string {
        if (this._selectedIndex < 0) return "";
        return this._options[this._selectedIndex].label;
    }

    onChange(callback: (event: EventArgs) => void): void {
        this.attach(callback);
    }

    render(): void {
        this._group = (this.parent as Window).window.group();

        this._options.forEach((option, i) => {
            const y = i * this.SPACING;

            // radio circle
            const circle = this._group.circle(this.RADIO_SIZE)
                .move(0, y)
                .fill("#FFFFFF")
                .stroke({ color: this.COLOR_STROKE, width: 2 });
            this._circles.push(circle);

            // inner dot
            const dot = this._group.circle(this.RADIO_SIZE * 0.5)
                .move(this.RADIO_SIZE * 0.25, y + this.RADIO_SIZE * 0.25)
                .fill(this.COLOR_DOT)
                .opacity(0);
            this._dots.push(dot);

            // color swatch
            const swatch = this._group.rect(20, 20)
                .move(this.RADIO_SIZE + 8, y)
                .fill(option.color)
                .stroke({ color: this.COLOR_STROKE, width: 1 })
                .radius(3);
            this._swatches.push(swatch);

            // label
            const lbl = this._group.text(option.label)
                .font({ family: "Arial, sans-serif", size: this._fontSize })
                .fill(this.COLOR_TEXT)
                .move(this.RADIO_SIZE + 36, y + 1);
            this._labels.push(lbl);

            // hit area per row
            const hit = this._group.rect(this.width, this.RADIO_SIZE + 8)
                .move(0, y - 2)
                .opacity(0);

            hit.mousedown(() => this.selectOption(i));
            hit.mouseover(() => this._circles[i].fill("#E0EAFF"));
            hit.mouseout(() => {
                if (this._selectedIndex !== i)
                    this._circles[i].fill("#FFFFFF");
            });
        });

        this.outerSvg = this._group;
    }

    private selectOption(index: number): void {
        if (this._selectedIndex === index) return;

        if (this._selectedIndex >= 0) {
            this._dots[this._selectedIndex].opacity(0);
            this._circles[this._selectedIndex].fill("#FFFFFF");
        }

        this._selectedIndex = index;
        this._dots[index].opacity(1);
        this._circles[index].fill("#E0EAFF");

        // change SVG background color
        const svgEl = document.querySelector("svg");
        if (svgEl) {
            const rect = svgEl.querySelector("rect");
            if (rect) rect.setAttribute("fill", this._options[index].color);
        }

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

export { ColorPicker };