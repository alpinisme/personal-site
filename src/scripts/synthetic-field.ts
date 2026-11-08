export const FIELD_WIDTH = 560;
export const FIELD_HEIGHT = 350;
export const YIELD_MIN = 80;
export const YIELD_MAX = 300;
export const MOISTURE_MIN = 14;
export const MOISTURE_MAX = 28;

/** Separates pass-line cells from the rest once the alpha channel is normalized to 0–1. */
export const PASS_LINE_ALPHA_CUTOFF = 0.75;

const OUTSIDE_FIELD_ALPHA = 0;
const PASS_LINE_ALPHA = 128;
const IN_PASS_ALPHA = 255;
const CHANNELS = 4;
const MAX_16_BIT = 65535;

const PASS_WIDTH = 11;
const PASS_TILT = -0.055;
const PASS_COUNT = 80;
const PASS_VARIATION = 0.05;

const LATTICE_SIZE = 64;
const OCTAVE_WEIGHTS = [4, 2, 1];

const BOUNDARY: [number, number][] = [
    [18, 34],
    [388, 12],
    [545, 52],
    [540, 236],
    [442, 248],
    [426, 336],
    [36, 322],
];

const WET_SPOT = { x: 170, y: 215, radiusX: 62, radiusY: 42 };

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

/** Returns the seeded mulberry32 generator, so the field looks the same on every visit. */
function seededRandom(seed: number) {
    let state = seed;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
        mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
        return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
}

/** Builds a smooth noise function by layering interpolated random lattices. */
function noiseField(seed: number, scale: number) {
    const lattice = Float32Array.from(
        { length: LATTICE_SIZE * LATTICE_SIZE },
        seededRandom(seed),
    );
    const mask = LATTICE_SIZE - 1;
    const at = (x: number, y: number) =>
        lattice[(y & mask) * LATTICE_SIZE + (x & mask)];
    const smooth = (t: number) => t * t * (3 - 2 * t);
    const sample = (x: number, y: number) => {
        const left = Math.floor(x);
        const top = Math.floor(y);
        const u = smooth(x - left);
        const v = smooth(y - top);
        const upper = at(left, top) * (1 - u) + at(left + 1, top) * u;
        const lower = at(left, top + 1) * (1 - u) + at(left + 1, top + 1) * u;
        return upper * (1 - v) + lower * v;
    };
    const totalWeight = OCTAVE_WEIGHTS.reduce((sum, weight) => sum + weight);
    return (x: number, y: number) =>
        OCTAVE_WEIGHTS.reduce((sum, weight, octave) => {
            const frequency = 2 ** octave / scale;
            return sum + sample(x * frequency, y * frequency) * weight;
        }, 0) / totalWeight;
}

function insideField(x: number, y: number) {
    let inside = false;
    for (let i = 0, j = BOUNDARY.length - 1; i < BOUNDARY.length; j = i++) {
        const [xi, yi] = BOUNDARY[i];
        const [xj, yj] = BOUNDARY[j];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * Builds the made-up field as RGBA8 cells, with data rather than color in each channel:
 * R and G hold a 16-bit yield, B holds moisture, and A marks pass lines and cells outside the field.
 */
export function buildField() {
    const cells = new Uint8Array(FIELD_WIDTH * FIELD_HEIGHT * CHANNELS);
    const soil = noiseField(11, 110);
    const wetness = noiseField(29, 150);
    const nextPass = seededRandom(47);
    const passOffsets = Array.from(
        { length: PASS_COUNT },
        () => (nextPass() - 0.5) * PASS_VARIATION,
    );

    for (let y = 0; y < FIELD_HEIGHT; y++) {
        for (let x = 0; x < FIELD_WIDTH; x++) {
            if (!insideField(x + 0.5, y + 0.5)) continue;

            const across = y - x * PASS_TILT + 40;
            const pass = Math.floor(across / PASS_WIDTH) % PASS_COUNT;
            const wetSpot = Math.exp(
                -(
                    ((x - WET_SPOT.x) / WET_SPOT.radiusX) ** 2 +
                    ((y - WET_SPOT.y) / WET_SPOT.radiusY) ** 2
                ),
            );
            const yieldLevel = clamp01(
                soil(x, y) * 1.15 - 0.08 - wetSpot * 0.35 + passOffsets[pass],
            );
            const moistureLevel = clamp01(
                wetness(x, y) * 1.25 - 0.25 + wetSpot * 0.45,
            );
            const encodedYield = Math.round(yieldLevel * MAX_16_BIT);
            const onPassLine = across % PASS_WIDTH < 1;

            const index = (y * FIELD_WIDTH + x) * CHANNELS;
            cells[index] = encodedYield >> 8;
            cells[index + 1] = encodedYield & 255;
            cells[index + 2] = Math.round(moistureLevel * 255);
            cells[index + 3] = onPassLine ? PASS_LINE_ALPHA : IN_PASS_ALPHA;
        }
    }
    return cells;
}

/** Decodes one cell's measurements, or returns null when the point is outside the field. */
export function readCell(cells: Uint8Array, x: number, y: number) {
    if (x < 0 || y < 0 || x >= FIELD_WIDTH || y >= FIELD_HEIGHT) return null;
    const index = (y * FIELD_WIDTH + x) * CHANNELS;
    if (cells[index + 3] === OUTSIDE_FIELD_ALPHA) return null;

    const yieldLevel = (cells[index] * 256 + cells[index + 1]) / MAX_16_BIT;
    const moistureLevel = cells[index + 2] / 255;
    return {
        yieldValue: YIELD_MIN + yieldLevel * (YIELD_MAX - YIELD_MIN),
        moisture: MOISTURE_MIN + moistureLevel * (MOISTURE_MAX - MOISTURE_MIN),
    };
}
