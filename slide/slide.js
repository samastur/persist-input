var SlowInput;
(function (SlowInput) {
    var Slide = (function () {
        function Slide(el) {
            this.start = ['mousedown'];
            this.move = ['mousemove'];
            this.end = ['mouseup', 'touchend', 'touchcancel', 'mouseout'];
            this.startTouch = ['touchstart'];
            this.moveTouch = ['touchmove'];
            this.endZoneWidth = 5; // Tolerance to which it can be considered that it was successfully slided
            this.slideClass = "ph-slide";
            this.trackMovement = false;
            this.slide = el;
        }
        Slide.prototype.calcEndPosition = function (slide, slider) {
            function num(value) {
                return parseInt(value, 10) || 0;
            }
            var base = slide.clientWidth - slider.offsetWidth, padding, styles;
            styles = window.getComputedStyle(slide);
            padding = num(styles.getPropertyValue('padding-left')) + num(styles.getPropertyValue('padding-right'));
            return base - this.endZoneWidth - padding;
        };
        Slide.prototype.build = function (el) {
            this.slider = document.createElement("div");
            this.slider.classList.add('ph-slide-slider');
            this.slider.classList.add('start');
            el.classList.add(this.slideClass);
            el.appendChild(this.slider);
        };
        Slide.prototype.getMouseClientX = function (e) {
            return e.clientX || 0;
        };
        Slide.prototype.getTouchClientX = function (e) {
            return e.touches[0].clientX || 0;
        };
        Slide.prototype.onDragStart = function (getX, e) {
            this.trackMovement = true;
            this.slider.style.left = "0px"; // Otherwise it might jump on last position once .start is removed
            this.slider.classList.remove("start");
            this.slider.classList.add('move');
            this.startX = getX(e);
        };
        Slide.prototype.onDragMove = function (getX, e) {
            var dist = 0, moved = getX(e);
            if (this.trackMovement) {
                dist = Math.min(Math.max(moved - this.startX, 0), this.endX);
                this.slider.style.left = dist + "px";
                if (dist >= this.endX && this.trackMovement) {
                    this.slide.dispatchEvent(new Event('trigger'));
                    this.onDragEnd();
                }
            }
        };
        Slide.prototype.onDragEnd = function (e) {
            this.trackMovement = false;
            this.slider.classList.add("start");
            this.slider.classList.remove('move');
        };
        Slide.prototype.bindEvents = function () {
            var _this = this;
            this.start.forEach(function (eventtype) {
                _this.slider.addEventListener(eventtype, _this.onDragStart.bind(_this, _this.getMouseClientX));
            });
            this.startTouch.forEach(function (eventtype) {
                _this.slider.addEventListener(eventtype, _this.onDragStart.bind(_this, _this.getTouchClientX));
            });
            this.end.forEach(function (eventtype) {
                _this.slider.addEventListener(eventtype, _this.onDragEnd.bind(_this));
                _this.slide.addEventListener(eventtype, _this.onDragEnd.bind(_this));
            });
            this.move.forEach(function (eventtype) {
                _this.slider.addEventListener(eventtype, _this.onDragMove.bind(_this, _this.getMouseClientX));
            });
            this.moveTouch.forEach(function (eventtype) {
                _this.slide.addEventListener(eventtype, _this.onDragMove.bind(_this, _this.getTouchClientX));
            });
        };
        Slide.prototype.init = function () {
            this.build(this.slide);
            this.endX = this.calcEndPosition(this.slide, this.slider);
            this.bindEvents();
        };
        return Slide;
    }());
    function slide(selector) {
        var bind_selector = selector || ".ph-slide", inputs;
        inputs = document.querySelectorAll(bind_selector);
        for (var i = 0; i < inputs.length; i++) {
            var ph = new Slide(inputs[i]);
            ph.init();
        }
    }
    SlowInput.slide = slide;
})(SlowInput || (SlowInput = {}));
