import { NgModule } from '@angular/core';
import { GesturesDirective } from './gestures/gestures';
import { KeyboardEnterDirective } from './keyboard-enter/keyboard-enter';
import { HighlightDirective } from './highlight/highlight';
@NgModule({
	declarations: [GesturesDirective,
    KeyboardEnterDirective,
    HighlightDirective],
	imports: [],
	exports: [GesturesDirective,
    KeyboardEnterDirective,
    HighlightDirective]
})
export class DirectivesModule {}
