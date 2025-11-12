"use client";

import { useEffect } from "react";

export function useKeyboardShortcut(
    key: string,
    callback: () => void,
    options: {
        ctrl?: boolean;
        meta?: boolean;
        shift?: boolean;
        alt?: boolean;
    } = {}
) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const { ctrl = false, meta = false, shift = false, alt = false } = options;

            // Check if the key matches
            if (event.key.toLowerCase() !== key.toLowerCase()) {
                return;
            }

            // Special case: if both ctrl and meta are specified (cross-platform Cmd/Ctrl)
            // Accept EITHER ctrl OR meta being pressed
            const ctrlOrMetaPressed = (ctrl && meta)
                ? (event.ctrlKey || event.metaKey)
                : (!ctrl || event.ctrlKey) && (!meta || event.metaKey);

            // Check other modifiers
            const otherModifiersMatch =
                (!shift || event.shiftKey) &&
                (!alt || event.altKey);

            if (ctrlOrMetaPressed && otherModifiersMatch) {
                event.preventDefault();
                callback();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [key, callback, options]);
}

