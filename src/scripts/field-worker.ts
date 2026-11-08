import { buildField } from './synthetic-field';

const cells = buildField();
self.postMessage(cells, { transfer: [cells.buffer] });
