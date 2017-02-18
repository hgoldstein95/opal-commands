import {
    NumberFeature,
    BooleanFeature,
    BagOfWordsFeature,
    SparseFeature,
} from './features';
import { distance } from './distance';
import { densify } from './densify';

// --- Examples ---

let f1 = new BagOfWordsFeature("f1", "bar", ["foo", "bar", "baz"]);
let f2 = new NumberFeature("f2", 42);
let f3 = new BooleanFeature("f3", false);
let f4 = new SparseFeature("f4", "/home/harry");

let g1 = new BagOfWordsFeature("g1", "foo", ["foo", "bar", "baz"]);
let g2 = new NumberFeature("g2", 41);
let g3 = new BooleanFeature("g3", true);
let g4 = new SparseFeature("g4", "/home/harry");

let fvec = [f1, f2, f3];
let gvec = [g1, g2, g3];

console.log(densify(fvec));
console.log(densify(gvec));
console.log(distance(fvec, gvec));
console.log(distance([f1, f2, f3, f4], [g1, g2, g3, g4]));
