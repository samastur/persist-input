module SlowInput {

    export class PressHold {
        timeout: number | null;
        hold: number; // How many milliseconds are needed to register press
        start: string[] = ['mousedown', 'touchstart'];
        end: string[] = ['mouseup', 'touchend', 'touchcancel', 'mouseout'];
        startClass: string = "";
        dispatchClick: boolean = false;
        el: HTMLElement;

        constructor(el: HTMLElement, hold: number = 2000) {
            this.el = el;
            this.hold = hold;
        }

        private canceltimeout(): void {
            this.el.classList.remove(this.startClass);
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        }

        private onSuccess(): void {
            this.canceltimeout();
            this.dispatchClick = true;
            this.el.dispatchEvent(new Event('click'));
        }

        bindEvents() {
            this.start.forEach((eventtype: string) => {
                this.el.addEventListener(eventtype, (e: Event): void => {
                    this.el.classList.add(this.startClass);
                    this.timeout = setTimeout(this.onSuccess.bind(this), this.hold);
                });
            });

            this.end.forEach((eventtype: string) => {
                this.el.addEventListener(eventtype, (e: Event): void => {
                    this.canceltimeout();
                });
            });

            this.el.addEventListener('click', (e: Event) => {
                if (!this.dispatchClick) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                } else {
                    this.dispatchClick = false;
                }
            });
        }

        setClasses() {
            if (this.el.hasAttribute('ph-start-class')) {
                this.startClass = this.el.getAttribute('ph-start-class');
            }
        }

        init() {
            this.setClasses();
            this.bindEvents();
        }
    }

    export function press_hold(selector?: string): void {
        var bind_selector: string = selector || ".ph-hold-press",
            inputs: NodeListOf<Element>;

        inputs = document.querySelectorAll(bind_selector);
        for(let i=0; i < inputs.length; i++) {
            let ph = new PressHold(<HTMLElement>inputs[i]);
            ph.init();
        }
    }
}
