import { Window } from "./core/ui";
import { Button } from "./widgets/button";
import { Heading } from "./widgets/heading";
import { CheckBox } from "./widgets/checkbox";
import { RadioButton } from "./widgets/radiobutton";
import { ScrollBar } from "./widgets/scrollbar";
import { ProgressBar } from "./widgets/progressbar";
import { ColorPicker } from "./widgets/colorpicker";

let w = new Window(window.innerHeight - 10, '100%');

let lbl1 = new Heading(w);
lbl1.text = "Widget Demo";
lbl1.fontSize = 16;
lbl1.move(10, 10);

// ── Button ────────────────────────────────────────────────────────────────────
let btn = new Button(w);
btn.label = "Click Me";
btn.size = { width: 120, height: 40 };
btn.fontSize = 14;
btn.move(12, 40);

let clickCount = 0;
btn.onClick(() => {
    clickCount++;
    lbl1.text = `Button clicked ${clickCount} time${clickCount === 1 ? "" : "s"}!`;
    console.log(`[Button] clicked, total clicks: ${clickCount}`);
});

// ── Check Boxes ───────────────────────────────────────────────────────────────
let chkHeading = new Heading(w);
chkHeading.text = "Choose from the check boxes";
chkHeading.fontSize = 14;
chkHeading.move(12, 95);

let chk = new CheckBox(w);
chk.label = "Enable feature";
chk.move(12, 120);
chk.onChange(() => {
    lbl1.text = chk.checked ? "Feature enabled!" : "Feature disabled!";
    console.log(`[CheckBox] "Enable feature" changed: ${chk.checked}`);
});

let chkColour = new CheckBox(w);
chkColour.label = "Colour";
chkColour.move(12, 150);
chkColour.onChange(() => {
    lbl1.text = chkColour.checked ? "Colour added!" : "No colour!";
    console.log(`[CheckBox] "Colour" changed: ${chkColour.checked}`);
});

let chkNoColour = new CheckBox(w);
chkNoColour.label = "No Colour";
chkNoColour.move(12, 180);
chkNoColour.onChange(() => {
    lbl1.text = chkNoColour.checked ? "No colour!" : "Colour added!";
    console.log(`[CheckBox] "No Colour" changed: ${chkNoColour.checked}`);
});

// ── Radio Buttons ─────────────────────────────────────────────────────────────
let radioHeading = new Heading(w);
radioHeading.text = "Choose an option";
radioHeading.fontSize = 14;
radioHeading.move(250, 95);

let radio = new RadioButton(w, ["Option A", "Option B", "Option C"]);
radio.move(250, 120);
radio.onChange(() => {
    lbl1.text = `Radio selected: ${radio.label[radio.selectedIndex]}`;
    console.log(`[RadioButton] selected index: ${radio.selectedIndex}, label: ${radio.label[radio.selectedIndex]}`);
});
// ── Scroll Bar ────────────────────────────────────────────────────────────────
let scrollHeading = new Heading(w);
scrollHeading.text = "Scroll Bar";
scrollHeading.fontSize = 14;
scrollHeading.move(12, 230);

let scrollbar = new ScrollBar(w, 150);
scrollbar.move(12, 255);
scrollbar.onScroll(() => {
    lbl1.text = `Scrolled: ${(scrollbar.thumbPosition * 100).toFixed(0)}%`;
    console.log(`[ScrollBar] position: ${(scrollbar.thumbPosition * 100).toFixed(0)}%`);
});

// ── Progress Bar ──────────────────────────────────────────────────────────────
let progressHeading = new Heading(w);
progressHeading.text = "Progress Bar (click to set value)";
progressHeading.fontSize = 14;
progressHeading.move(12, 420);

let progress = new ProgressBar(w);
progress.barWidth = 200;
progress.incrementValue = 10;
progress.move(12, 445);

progress.onIncrement(() => {
    lbl1.text = `Progress: ${progress.value}%`;
    console.log(`[ProgressBar] incremented to: ${progress.value}%`);
});

progress.onStateChange(() => {
    console.log(`[ProgressBar] state changed, value: ${progress.value}%`);
});

// ── Custom: Color Picker ───────────────────────────────────────────────────────
let colorHeading = new Heading(w);
colorHeading.text = "Choose Background Colour";
colorHeading.fontSize = 14;
colorHeading.move(12, 500);

let colorPicker = new ColorPicker(w);
colorPicker.move(12, 525);
colorPicker.onChange(() => {
    lbl1.text = `Background: ${colorPicker.selectedLabel}`;
    console.log(`[ColorPicker] selected: ${colorPicker.selectedLabel} (${colorPicker.selectedColor})`);
});