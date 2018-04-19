import { Directive, Input, HostListener, Renderer } from '@angular/core';
const ATTR_NAME = 'myTabindex';
/**
 * Generated class for the KeyboardEnterDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: `[${ATTR_NAME}]`// Attribute selector
})
export class KeyboardEnterDirective {
  @Input(`${ATTR_NAME}`) myTabindex: string;
  constructor(private renderer: Renderer) {
    console.log('Hello KeyboardEnterDirective Directive');
  }
  @HostListener('keydown', ['$event']) onInputChange(e) {
		var code = e.keyCode || e.which;

		if (code === 13) {
		//	console.log(e.srcElement,"e.srcElement")
			let next: HTMLElement = this.getMyNextFocusableElement(e.srcElement);
		if (next) {
		//	console.log(next,"next")
				e.preventDefault();
				this.renderer.invokeElementMethod(next, 'focus', []);
			}
		}
  }
  private getMyNextFocusableElement(elem: HTMLElement): HTMLElement {
		let tabindex: number = parseInt(this.myTabindex || '0');
		let next: HTMLElement = MyUtils.getNextFocusableElement(elem, ATTR_NAME, tabindex);
		return next;
	}
}
const MyUtils = (() => {
	const FOCUSABLES = ['input', 'select', 'textarea', 'object','datetime'];
	const FOCUSABLES_SELECTOR = FOCUSABLES.join(',');

	function getNextFocusableElement(elem: HTMLElement, attrName: string, tabindex: number): HTMLElement {
		let form = getFormElement(elem);
		console.log(form,"form")
		let next = null;

		tabindex++;
		next = getElement(form, attrName, tabindex);

		while (next) {
			next = getFocusableElement(next);

			if (next) {
				return next;
			}

			tabindex++;
			next = getElement(form, attrName, tabindex);
		}

		return null;
  }
  function getFormElement(elem: HTMLElement): HTMLElement {
		let form = elem ? <HTMLElement>elem.parentElement : null;

		while (form && (form.tagName.toLowerCase() !== 'form')) {
			form = form.parentElement;
		}

		return form;
	}

	function getElement(form: HTMLElement, attrName: string, tabindex: number): HTMLElement {
		let selector = `[${attrName}="${tabindex}"]`;
		let elem = form ? <HTMLElement>form.querySelector(selector) : null;
		//console.log(elem,"elem")
		return elem;
  }
  
  function getFocusableElement(elem: HTMLElement): HTMLElement {
		let tagName = elem.tagName.toLowerCase();
		let focusable = FOCUSABLES.some(
			tagFocusable => tagFocusable === tagName
		);

		if (!focusable) {
			elem = <HTMLElement>elem.querySelector(FOCUSABLES_SELECTOR);
			focusable = !!elem;
		}

		if (focusable) {
			//TODO: verify if elem disabled, readonly, hidden, etc...
			// in which case focusable must be changed to false
		}

		if (focusable) {
			return elem;
		}
	}

	return {
		getNextFocusableElement: getNextFocusableElement
	};
})();

