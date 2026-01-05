import { useLayoutEffect, useState } from 'react';

export function useElementHeight(
    ref: React.RefObject<HTMLElement | null>
) {
    const [height, setHeight] = useState<number>(0);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!el) return;

        const update = () => {
            const next = Math.ceil(el.getBoundingClientRect().height);
            setHeight(next);
        };

        update();

        const ro = new ResizeObserver(() => update());
        ro.observe(el);

        return () => ro.disconnect();
    }, [ref]);

    return height;
}
