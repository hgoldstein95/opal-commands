import {
    NumberFeature,
    BooleanFeature,
    BagOfWordsFeature,
    SparseFeature,
} from './features';
import { distance } from './distance';
import { densify } from './densify';

let v1 = {
    tag: "ls",
    vec: [
        new SparseFeature("dir", "/home/harry"),
        new NumberFeature("hist", 2),
        new BooleanFeature("success", true)
    ]
};
let v2 = {
    tag: "npm",
    vec: [
        new SparseFeature("dir", "/home/harry/Projects/wyatt"),
        new NumberFeature("hist", 1),
        new BooleanFeature("success", true)
    ]
};
let v3 = {
    tag: "ls",
    vec: [
        new SparseFeature("dir", "/home/harry/Projects/wyatt"),
        new NumberFeature("hist", 0),
        new BooleanFeature("success", true)
    ]
};
console.log(distance(v1.vec, v2.vec));
console.log(distance(v3.vec, v2.vec));
