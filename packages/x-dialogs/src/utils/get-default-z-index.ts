const elevations = {
    dialog: 1300,
} as const;

export function getDefaultZIndex(level: keyof typeof elevations) {
    return elevations[level];
}
