import { useState, useEffect } from "react";

export default function useWindowSize() {
    const isClient = typeof window === "object"; // проверяем наличие window

    const getSize = () => {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined,
        };
    };

    const [windowSize, setWindowSize] = useState(getSize);

    useEffect(() => {
        if (!isClient) {
            return false; // Если window не определен, то ранние подписки на события изменения размеров не требуются
        }

        const handleResize = () => {
            setWindowSize(getSize());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    return windowSize;
}
