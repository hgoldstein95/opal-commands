type FeatureForm = "n" | "b" | "u" | "p";

/**
 * A simple representation of a feature ID.
 */
export class FeatId {
    tag: string;
    form: FeatureForm;

    constructor(tag: string, form: FeatureForm) {
        this.tag = tag;
        this.form = form;
    }
}

/**
 * A feature type wrapping a single numeric value.
 */
export class Numeric {
    form: "n";
    id: FeatId;
    data: number;

    static generator(id: FeatId): (d: number) => Numeric {
        if (id.form != "n") {
            throw new Error("ID for Numeric must have form \"n\".");
        }
        return (data) => {
            let f = new Numeric();
            f.form = "n";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

/**
 * A feature type containing a categorical feature from a defined set of
 * possible categories.
 */
export class Bounded<T> {
    form: "b";
    id: FeatId;
    dict: T[];
    data: T;

    static generator<T>(id: FeatId): (d: T, dict: T[]) => Bounded<T> {
        if (id.form != "b") {
            throw new Error("ID for Bounded must have form \"b\".");
        }
        return (data, dict) => {
            let f = new Bounded<T>();
            f.form = "b";
            f.id = id;
            f.dict = dict;
            f.data = data;
            return f;
        };
    }
}

/**
 * A feature representing an arbitrary categorical feature.
 */
export class Unbounded<T> {
    form: "u";
    id: FeatId;
    data: T;

    static generator<T>(id: FeatId): (d: T) => Unbounded<T> {
        if (id.form != "u") {
            throw new Error("ID for Unbounded must have form \"u\".");
        }
        return (data) => {
            let f = new Unbounded<T>();
            f.form = "u";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

/**
 * A complex feature that contains a list of unlabeled numeric features.
 */
export class Packed {
    form: "p";
    id: FeatId;
    data: number[];

    static generator<T>(id: FeatId): (d: number[]) => Packed {
        if (id.form != "p") {
            throw new Error("ID for Packed must have form \"p\".");
        }
        return (data) => {
            let f = new Packed();
            f.form = "p";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

/**
 * The type of all features.
 */
export type Feature = Numeric | Bounded<any> | Unbounded<any> | Packed;


/**
 * Pattern match on a feature.
 *
 * @param ncase the `Numeric` branch
 * @param bcase the `Bounded` branch
 * @param ucase the `Unbounded` branch
 * @param pcase the `Packed` branch
 * @returns     a function that takes any feature to a `T`
 */
export function matchFeature<T>(ncase: (n: Numeric) => T,
    bcase: <U>(b: Bounded<U>) => T,
    ucase: <U>(u: Unbounded<U>) => T,
    pcase: (d: Packed) => T)
    : (f: Feature) => T {
    return (f: Feature) => {
        switch (f.form) {
            case "n": return ncase(f);
            case "b": return bcase(f);
            case "u": return ucase(f);
            case "p": return pcase(f);
        }
    };
}

/**
 * Pattern match on two features.
 *
 * @param ncase the `Numeric` branch
 * @param bcase the `Bounded` branch
 * @param ucase the `Unbounded` branch
 * @param pcase the `Packed` branch
 * @returns     a function that takes any pair of features to a `T`
 */
export function matchTwoFeature<T>(ncase: (n1: Numeric, n2: Numeric) => T,
    bcase: <U>(b1: Bounded<U>, b2: Bounded<U>) => T,
    ucase: <U>(u1: Unbounded<U>, u2: Unbounded<U>) => T,
    pcase: (d1: Packed, d2: Packed) => T)
    : (f1: Feature, f2: Feature) => T {
    return (f1: Feature, f2: Feature) => {
        if (f1.id.tag !== f2.id.tag) {
            throw new Error("Feature Mismatch: Incompatible feature IDs.");
        }
        if (f1.form === "n" && f2.form === "n") {
            return ncase(f1, f2);
        } else if (f1.form === "b" && f2.form === "b") {
            return bcase(f1, f2);
        } else if (f1.form === "u" && f2.form === "u") {
            return ucase(f1, f2);
        } else if (f1.form === "p" && f2.form === "p") {
            return pcase(f1, f2);
        } else {
            throw new Error("Feature Mismatch: Forms of " +
                "features are incompatible.");
        }
    };
}

/**
 * The type of a feature vector, optimized for lookup as well as efficient
 * transformation to other representations.
 */
export class FeatureVector {
    data: Map<FeatId, Feature>;

    constructor(vs: Feature[]) {
        this.data = new Map();
        for (let f of vs) {
            this.data.set(f.id, f);
        }
    }

    getN(id: FeatId): Numeric {
        return this.getT<Numeric>(id, "n");
    }

    getB<T>(id: FeatId): Bounded<T> {
        return this.getT<Bounded<T>>(id, "b");
    }

    getU<T>(id: FeatId): Unbounded<T> {
        return this.getT<Unbounded<T>>(id, "u");
    }

    getP(id: FeatId): Packed {
        return this.getT<Packed>(id, "p");
    }

    getT<T extends Feature>(id: FeatId, form: FeatureForm): T {
        if (id.form != form) {
            throw new Error("Expected form \"" +
                            form +
                            "\" found \"" +
                            id.form +
                            "\".");
        }
        let f = this.data.get(id);
        if (!f) throw new Error("Cannot find feature with ID (" +
                                id.tag +
                                ").");
        return f as T;
    }

    map<T>(fn: (feat: Feature) => T): T[] {
        let res = [];
        for (let feat of this.data.values()) {
            res.push(fn(feat));
        }
        return res;
    }
}
