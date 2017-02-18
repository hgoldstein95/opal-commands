import { Feature } from './features';
import { assertNever } from './util';

function euclidTerm(f1: Feature, f2: Feature): number {
    switch (f1.kind) {
        case "number":
            if (f2.kind === "number") {
                return Math.pow(f1.data - f2.data, 2);
            } else {
                throw new Error();
            }
        case "boolean":
            if (f2.kind === "boolean") {
                return (f1.data === f2.data) ? 0 : 1;
            } else {
                throw new Error();
            }
        case "bagofwords":
            // TODO: Add dictionary distance
            if (f2.kind === "bagofwords") {
                return (f1.data === f2.data) ? 0 : 2;
            } else {
                throw new Error();
            }
        case "sparse":
            if (f2.kind === "sparse") {
                return (f1.data === f2.data) ? 0 : 2;
            } else {
                throw new Error();
            }
        default: return assertNever(f1);
    }
}

export function distance<T>(v1: Feature[], v2: Feature[]) {
    let terms = v1.map((e, i) => euclidTerm(e, v2[i]));
    let sum = terms.reduce((acc, e) => e + acc, 0);
    return Math.sqrt(sum);
}
