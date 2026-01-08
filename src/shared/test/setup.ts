import '@testing-library/jest-dom';

class ResizeObserverMock {
    constructor() {}

    observe() {}

    unobserve() {}

    disconnect() {}
}

if (!('ResizeObserver' in globalThis)) {
    globalThis.ResizeObserver = ResizeObserverMock;
}
