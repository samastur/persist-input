var SlowInput;
(function (SlowInput) {
    var Slide = (function () {
        function Slide(el, tolerance) {
            if (tolerance === void 0) { tolerance = 5; }
            this.start = ['mousedown'];
            this.move = ['mousemove'];
            this.end = ['mouseup', 'touchend', 'touchcancel', 'mouseout'];
            this.startTouch = ['touchstart'];
            this.moveTouch = ['touchmove'];
            this.slideClass = "ph-slide";
            this.trackMovement = false;
            this.slide = el;
            this.endZoneWidth = tolerance;
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
            this.slider.style.transform = "translateX(0)"; // Otherwise it might jump on last position once .start is removed
            this.slider.classList.remove("start");
            this.slider.classList.add('move');
            this.startX = getX(e);
        };
        Slide.prototype.onDragMove = function (getX, e) {
            var _this = this;
            window.requestAnimationFrame(function () {
                var dist = 0, moved = getX(e);
                if (_this.trackMovement) {
                    dist = Math.min(Math.max(moved - _this.startX, 0), _this.endX);
                    _this.slider.style.transform = "translateX(" + dist + "px)";
                    if (dist >= _this.endX && _this.trackMovement) {
                        _this.slide.dispatchEvent(new Event('trigger'));
                        _this.onDragEnd();
                    }
                }
            });
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
    function slide(selector, tolerance) {
        if (tolerance === void 0) { tolerance = 5; }
        var bind_selector = selector || ".ph-slide", inputs;
        inputs = document.querySelectorAll(bind_selector);
        for (var i = 0; i < inputs.length; i++) {
            var ph = new Slide(inputs[i], tolerance);
            ph.init();
        }
    }
    SlowInput.slide = slide;
})(SlowInput || (SlowInput = {}));
