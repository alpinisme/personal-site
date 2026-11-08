import {
    FIELD_HEIGHT,
    FIELD_WIDTH,
    MOISTURE_MAX,
    MOISTURE_MIN,
    PASS_LINE_ALPHA_CUTOFF,
    readCell,
    YIELD_MAX,
    YIELD_MIN,
} from './synthetic-field';

const RAMP: [number, number, number][] = [
    [0.7, 0.2, 0.16],
    [0.91, 0.53, 0.23],
    [0.95, 0.85, 0.42],
    [0.56, 0.76, 0.37],
    [0.14, 0.52, 0.27],
];
const LAST_RAMP_SEGMENT = RAMP.length - 2;

const SETTING_NAMES = [
    'low',
    'high',
    'steps',
    'calibration',
    'moistureLimit',
] as const;
type SettingName = (typeof SETTING_NAMES)[number];
type Settings = Record<SettingName, number>;

const DEFAULTS: Settings = {
    low: 140,
    high: 250,
    steps: 7,
    calibration: 1,
    moistureLimit: MOISTURE_MAX,
};

const FORMATS: Record<SettingName, (value: number) => string> = {
    low: (value) => `${value} bu/ac`,
    high: (value) => `${value} bu/ac`,
    steps: String,
    calibration: (value) => `×${value.toFixed(2)}`,
    moistureLimit: (value) =>
        value >= MOISTURE_MAX ? 'all' : `${value.toFixed(1)}%`,
};

const READOUT_PROMPT = 'Point at the field to read a value.';

const VERTEX_SHADER = `#version 300 es
void main() {
    vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
    gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform highp sampler2D data;
uniform float low, high, steps, calibration, moistureLimit;
uniform vec3 ramp[${RAMP.length}];
out vec4 color;

vec3 rampColor(float position) {
    float scaled = position * ${(RAMP.length - 1).toFixed(1)};
    int index = int(min(floor(scaled), ${LAST_RAMP_SEGMENT.toFixed(1)}));
    return mix(ramp[index], ramp[index + 1], scaled - float(index));
}

void main() {
    ivec2 cell = ivec2(gl_FragCoord.xy);
    vec4 stored = texelFetch(data, ivec2(cell.x, ${FIELD_HEIGHT - 1} - cell.y), 0);
    if (stored.a == 0.0) {
        color = vec4(0.0);
        return;
    }

    float yieldLevel = (stored.r * 255.0 * 256.0 + stored.g * 255.0) / 65535.0;
    float yieldValue = mix(${YIELD_MIN.toFixed(1)}, ${YIELD_MAX.toFixed(1)}, yieldLevel) * calibration;
    float moisture = mix(${MOISTURE_MIN.toFixed(1)}, ${MOISTURE_MAX.toFixed(1)}, stored.b);

    if (moisture > moistureLimit) {
        color = vec4(vec3(0.5) * 0.3, 0.3);
        return;
    }

    float position = clamp((yieldValue - low) / (high - low), 0.0, 1.0);
    float colorStep = min(floor(position * steps), steps - 1.0);
    vec3 shade = rampColor(colorStep / (steps - 1.0));
    bool onPassLine = stored.a < ${PASS_LINE_ALPHA_CUTOFF.toFixed(2)};
    color = vec4(onPassLine ? shade * 0.84 : shade, 1.0);
}`;

function compileProgram(gl: WebGL2RenderingContext) {
    const program = gl.createProgram();
    const sources: [number, string][] = [
        [gl.VERTEX_SHADER, VERTEX_SHADER],
        [gl.FRAGMENT_SHADER, FRAGMENT_SHADER],
    ];
    for (const [type, source] of sources) {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        gl.attachShader(program, shader);
        const log = gl.getShaderInfoLog(shader);
        if (log) console.error(log);
    }
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) return program;
    if (!gl.isContextLost()) console.error(gl.getProgramInfoLog(program));
    return null;
}

function createRenderer(gl: WebGL2RenderingContext, cells: Uint8Array) {
    let uniforms: Partial<Record<SettingName, WebGLUniformLocation | null>> =
        {};

    const setUp = () => {
        const program = compileProgram(gl);
        if (!program) return false;
        gl.useProgram(program);
        gl.bindVertexArray(gl.createVertexArray());
        gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA8,
            FIELD_WIDTH,
            FIELD_HEIGHT,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            cells,
        );
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.uniform3fv(gl.getUniformLocation(program, 'ramp'), RAMP.flat());
        uniforms = Object.fromEntries(
            SETTING_NAMES.map((name) => [
                name,
                gl.getUniformLocation(program, name),
            ]),
        );
        return true;
    };

    const draw = (settings: Settings) => {
        for (const name of SETTING_NAMES) {
            gl.uniform1f(uniforms[name] ?? null, settings[name]);
        }
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    return { setUp, draw };
}

function loadField() {
    return new Promise<Uint8Array>((resolve, reject) => {
        const worker = new Worker(
            new URL('./field-worker.ts', import.meta.url),
            { type: 'module' },
        );
        worker.onmessage = (event: MessageEvent<Uint8Array>) => {
            worker.terminate();
            resolve(event.data);
        };
        worker.onerror = reject;
    });
}

function rampCss(position: number) {
    const scaled = position * (RAMP.length - 1);
    const index = Math.min(Math.floor(scaled), LAST_RAMP_SEGMENT);
    const fraction = scaled - index;
    const [r, g, b] = RAMP[index].map(
        (start, channel) =>
            (start + (RAMP[index + 1][channel] - start) * fraction) * 255,
    );
    return `rgb(${r} ${g} ${b})`;
}

function mount(root: HTMLElement) {
    const canvas = root.querySelector('canvas')!;
    const readout = root.querySelector<HTMLElement>('[data-readout]')!;
    const legend = root.querySelector<HTMLElement>('[data-legend]')!;
    const scaleLow = root.querySelector<HTMLElement>('[data-scale-low]')!;
    const scaleHigh = root.querySelector<HTMLElement>('[data-scale-high]')!;
    const controls = root.querySelector<HTMLElement>('[data-controls]')!;
    const unsupported = root.querySelector<HTMLElement>('[data-unsupported]')!;

    const showUnsupported = () => {
        unsupported.hidden = false;
        controls.hidden = true;
        readout.hidden = true;
    };

    const gl = canvas.getContext('webgl2', { antialias: false });
    if (!gl) {
        showUnsupported();
        return;
    }

    let cells: Uint8Array | null = null;
    let renderer: ReturnType<typeof createRenderer> | null = null;

    const settings = { ...DEFAULTS };
    const inputs = Object.fromEntries(
        SETTING_NAMES.map((name) => [
            name,
            root.querySelector<HTMLInputElement>(`[data-input="${name}"]`)!,
        ]),
    ) as Record<SettingName, HTMLInputElement>;
    let hovered: { x: number; y: number } | null = null;
    let drawQueued = false;

    const updateReadout = () => {
        const cell = hovered && cells && readCell(cells, hovered.x, hovered.y);
        readout.textContent = cell
            ? `${(cell.yieldValue * settings.calibration).toFixed(0)} bu/ac · ${cell.moisture.toFixed(1)}% moisture`
            : READOUT_PROMPT;
    };

    const queueDraw = () => {
        if (drawQueued || !renderer) return;
        drawQueued = true;
        requestAnimationFrame(() => {
            drawQueued = false;
            renderer?.draw(settings);
        });
    };

    const render = () => {
        for (const name of SETTING_NAMES) {
            inputs[name].value = String(settings[name]);
            const output = root.querySelector(`[data-out="${name}"]`)!;
            output.textContent = FORMATS[name](settings[name]);
        }
        legend.replaceChildren(
            ...Array.from({ length: settings.steps }, (_, step) => {
                const swatch = document.createElement('span');
                swatch.style.background = rampCss(step / (settings.steps - 1));
                return swatch;
            }),
        );
        scaleLow.textContent = String(settings.low);
        scaleHigh.textContent = String(settings.high);
        updateReadout();
        queueDraw();
    };

    const applyInput = (name: SettingName, value: number) => {
        if (name === 'low') settings.low = Math.min(value, settings.high - 1);
        else if (name === 'high')
            settings.high = Math.max(value, settings.low + 1);
        else settings[name] = value;
    };

    for (const name of SETTING_NAMES) {
        inputs[name].addEventListener('input', () => {
            applyInput(name, Number(inputs[name].value));
            render();
        });
    }

    root.querySelector('[data-reset]')!.addEventListener('click', () => {
        Object.assign(settings, DEFAULTS);
        render();
    });

    canvas.addEventListener('pointermove', (event) => {
        const box = canvas.getBoundingClientRect();
        hovered = {
            x: Math.floor(
                ((event.clientX - box.left) / box.width) * FIELD_WIDTH,
            ),
            y: Math.floor(
                ((event.clientY - box.top) / box.height) * FIELD_HEIGHT,
            ),
        };
        updateReadout();
    });
    canvas.addEventListener('pointerleave', () => {
        hovered = null;
        updateReadout();
    });

    canvas.addEventListener('webglcontextlost', (event) =>
        event.preventDefault(),
    );
    canvas.addEventListener('webglcontextrestored', () => {
        if (renderer?.setUp()) queueDraw();
        else showUnsupported();
    });

    render();

    loadField().then((field) => {
        cells = field;
        renderer = createRenderer(gl, field);
        if (renderer.setUp()) queueDraw();
        else showUnsupported();
    }, showUnsupported);
}

export function mountLegendDemos() {
    document.querySelectorAll<HTMLElement>('[data-legend-demo]').forEach(mount);
}
