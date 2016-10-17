declare module SlowInput {
    class PressHold {
        timeout: number | null;
        hold: number;
        start: string[];
        end: string[];
        startClass: string;
        dispatchClick: boolean;
        el: HTMLElement;
        constructor(el: HTMLElement, hold?: number);
        private canceltimeout();
        private onSuccess();
        bindEvents(): void;
        setClasses(): void;
        init(): void;
    }
    function press_hold(selector?: string): void;
}
