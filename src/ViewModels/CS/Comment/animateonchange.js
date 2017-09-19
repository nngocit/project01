import {inject, customAttribute} from 'aurelia-framework';
import {CssAnimator} from 'aurelia-animator-css';

@customAttribute('animateonchange')
@inject(Element, CssAnimator)
export class AnimateOnChangeCustomAttribute {
 
    constructor(element, animator) {
        this.element = element;
        this.animator = animator;
        this.initialValueSet = false;
    }

    valueChanged(newValue){
                    if (this.initialValueSet) {
            this.animator.addClass(this.element, 'background-animationw').then(() => {
                this.animator.removeClass(this.element, 'background-animationw');
            });
        }
        //  if (this.initialValueSet) {
        //     this.animator.addClass(this.element, 'background-animationw').then(() => {
        //         this.animator.removeClass(this.element, 'background-animationw');
        //     });
        // }
        this.initialValueSet = true;
    }
}