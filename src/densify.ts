import {
    NumberFeature,
    BooleanFeature,
    BagOfWordsFeature
} from './features';
import { assertNever } from './util';

export type DensifiableFeature =
    BooleanFeature |
    NumberFeature |
    BagOfWordsFeature;

function densifyFeature(f: DensifiableFeature): NumberFeature[] {
    switch (f.kind) {
        case "number": return [f];
        case "boolean": return [new NumberFeature(f.tag, f.data ? 1 : 0)];
        case "bagofwords":
            return f.dictionary.map(word => {
                let n = (word === f.data) ? 1 : 0;
                return new NumberFeature(`${f.tag}_${word}`, n);
            });
        default: return assertNever(f);
    }
}

export function densify<T>(fvec: DensifiableFeature[]): number[] {
    let nested = fvec.map(x => densifyFeature(x));
    let feats: NumberFeature[] = [].concat.apply([], nested); // flatten array
    return feats.map(x => x.data);
}
