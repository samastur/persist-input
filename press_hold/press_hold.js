var SlowInput;
(function (SlowInput) {
    var PressHold = (function () {
        function PressHold(el, hold) {
            if (hold === void 0) { hold = 2000; }
            this.start = ['mousedown', 'touchstart'];
            this.end = ['mouseup', 'touchend', 'touchcancel', 'mouseout'];
            this.startClass = "";
            this.dispatchClick = false;
            this.el = el;
            this.hold = hold;
        }
        PressHold.prototype.canceltimeout = function () {
            this.el.classList.remove(this.startClass);
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
        };
        PressHold.prototype.onSuccess = function () {
            this.canceltimeout();
            this.dispatchClick = true;
            this.el.dispatchEvent(new Event('click'));
        };
        PressHold.prototype.bindEvents = function () {
            var _this = this;
            this.start.forEach(function (eventtype) {
                _this.el.addEventListener(eventtype, function (e) {
                    _this.el.classList.add(_this.startClass);
                    _this.timeout = setTimeout(_this.onSuccess.bind(_this), _this.hold);
                });
            });
            this.end.forEach(function (eventtype) {
                _this.el.addEventListener(eventtype, function (e) {
                    _this.canceltimeout();
                });
            });
            this.el.addEventListener('click', function (e) {
                if (!_this.dispatchClick) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return false;
                }
                else {
                    _this.dispatchClick = false;
                }
            });
        };
        PressHold.prototype.setClasses = function () {
            if (this.el.hasAttribute('ph-start-class')) {
                this.startClass = this.el.getAttribute('ph-start-class');
            }
        };
        PressHold.prototype.init = function () {
            this.setClasses();
            this.bindEvents();
        };
        return PressHold;
    }());
    SlowInput.PressHold = PressHold;
    function press_hold(selector) {
        var bind_selector = selector || ".ph-hold-press", inputs;
        inputs = document.querySelectorAll(bind_selector);
        for (var i = 0; i < inputs.length; i++) {
            var ph = new PressHold(inputs[i]);
            ph.init();
        }
    }
    SlowInput.press_hold = press_hold;
})(SlowInput || (SlowInput = {}));
