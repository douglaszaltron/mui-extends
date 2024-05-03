export function randomId() {
    return `mui-${Math.random().toString(36).slice(2, 11)}`;
}
