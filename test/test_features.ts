import * as test from 'tape';
import {
    NumberFeature,
    BooleanFeature,
    BagOfWordsFeature,
    SparseFeature
} from '../src/features';
import { densify } from '../src/densify';
import { distance } from '../src/distance';

export function test_features() {
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

    test('densify_1', (t) => {
        t.same(densify(fvec), [0, 1, 0, 42, 0]);
        t.end();
    });

    test('densify_2', (t) => {
        t.same(densify(gvec), [1, 0, 0, 41, 1]);
        t.end();
    });

    test('distance_1', (t) => {
        t.equal(distance(fvec, gvec), 2);
        t.end();
    });

    test('distance_2', (t) => {
        t.equal(distance([f1, f2, f3, f4], [g1, g2, g3, g4]), 2);
        t.end();
    });
}
