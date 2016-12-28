module SlowInput {
    class Slide {
        slide: HTMLElement;
        slider: HTMLElement;

        start: string[] = ['mousedown'];
        move: string[] = ['mousemove'];
        end: string[] = ['mouseup', 'touchend', 'touchcancel', 'mouseout'];
        startTouch: string[] = ['touchstart'];
        moveTouch: string[] = ['touchmove'];

        startX: number;
        endX: number;
        endZoneWidth: number; // Tolerance to which it can be considered that it was successfully slided
        slideClass: string = "ph-slide";
        trackMovement: boolean = false;

        constructor (el: HTMLElement, tolerance: number=5) {
            this.slide = el;
            this.endZoneWidth = tolerance;
        }
        
        private calcEndPosition(slide: HTMLElement, slider: HTMLElement): number {
            function num(value: string): number {
                return parseInt(value, 10) || 0;
            }

            let base: number = slide.clientWidth - slider.offsetWidth,
                padding: number,
                styles;
            styles = window.getComputedStyle(slide);
            padding = num(styles.getPropertyValue('padding-left')) + num(styles.getPropertyValue('padding-right'));
            return base - this.endZoneWidth - padding;
        }

        build(el: HTMLElement): void {
            this.slider = document.createElement("div");
            this.slider.classList.add('ph-slide-slider');
            this.slider.classList.add('start');

            el.classList.add(this.slideClass);
            el.appendChild(this.slider);
        }

        private getMouseClientX(e: MouseEvent) {
            return e.clientX || 0;
        }

        private getTouchClientX(e: TouchEvent) {
            return e.touches[0].clientX || 0;
        }

        onDragStart(getX: (e: Event) => number, e: Event) {
            this.trackMovement = true;
            this.slider.style.transform = "translateX(0)"; // Otherwise it might jump on last position once .start is removed
            this.slider.classList.remove("start");
            this.slider.classList.add('move')
            this.startX = getX(e);
        }

        onDragMove(getX: (e: Event) => number, e: Event) {
            window.requestAnimationFrame(() => {
                let dist: number = 0,
                        moved: number = getX(e);

                if (this.trackMovement) {
                      dist = Math.min(Math.max(moved - this.startX, 0), this.endX);
                      this.slider.style.transform =  "translateX(" + dist + "px)";
                      if (dist >= this.endX && this.trackMovement) {
                          this.slide.dispatchEvent(new Event('trigger'));
                          this.onDragEnd();
                      }
                }
            });
        }

        onDragEnd(e?: MouseEvent) {
            this.trackMovement = false;
            this.slider.classList.add("start");
            this.slider.classList.remove('move')
        }

        bindEvents() {
            this.start.forEach((eventtype: string) => {
                this.slider.addEventListener(eventtype, this.onDragStart.bind(this, this.getMouseClientX));
            });
            this.startTouch.forEach((eventtype: string) => {
                this.slider.addEventListener(eventtype, this.onDragStart.bind(this, this.getTouchClientX));
            });
            this.end.forEach((eventtype: string) => {
                this.slider.addEventListener(eventtype, this.onDragEnd.bind(this));
                this.slide.addEventListener(eventtype, this.onDragEnd.bind(this));
            });
            this.move.forEach((eventtype: string) => {
                this.slider.addEventListener(eventtype, this.onDragMove.bind(this, this.getMouseClientX));
            });
            this.moveTouch.forEach((eventtype: string) => {
                this.slide.addEventListener(eventtype, this.onDragMove.bind(this, this.getTouchClientX));
            });
        }

        init() {
            this.build(this.slide);
            this.endX = this.calcEndPosition(this.slide, this.slider);
            this.bindEvents();
        }
    }

    export function slide(selector?: string, tolerance: number=5): void {
        var bind_selector: string = selector || ".ph-slide",
            inputs: NodeListOf<Element>;

        inputs = document.querySelectorAll(bind_selector);
        for(let i=0; i < inputs.length; i++) {
            let ph = new Slide(<HTMLElement>inputs[i], tolerance);
            ph.init();
        }
    }
}
