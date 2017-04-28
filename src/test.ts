class FeatId {
    tag: string;
}

class Numeric {
    form: "n";
    id: FeatId;
    data: number;

    static generator(id: FeatId): (d: number) => Numeric {
        return (data) => {
            let f = new Numeric();
            f.form = "n";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

class Bounded<T> {
    form: "b";
    id: FeatId;
    dict: T[];
    data: T;

    static generator<T>(id: FeatId): (d: T, dict: T[]) => Bounded<T> {
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

class Unbounded<T> {
    form: "u";
    id: FeatId;
    data: T;

    static generator<T>(id: FeatId): (d: T) => Unbounded<T> {
        return (data) => {
            let f = new Unbounded<T>();
            f.form = "u";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

class Dense {
    form: "d";
    id: FeatId;
    data: number[];

    static generator<T>(id: FeatId): (d: number[]) => Dense {
        return (data) => {
            let f = new Dense();
            f.form = "d";
            f.id = id;
            f.data = data;
            return f;
        };
    }
}

type Feature = Numeric | Bounded<any> | Unbounded<any> | Dense;

type FeatureVector = Feature[];

function matchFeature<T>(ncase: (n: Numeric) => T,
                         bcase: <U>(b: Bounded<U>) => T,
                         ucase: <U>(u: Unbounded<U>) => T,
                         dcase: (d: Dense) => T)
                        : (f: Feature) => T {
    return (f: Feature) => {
        switch (f.form) {
            case "n": return ncase(f);
            case "b": return bcase(f);
            case "u": return ucase(f);
            case "d": return dcase(f);
        }
    };
}

function matchTwoFeature<T>(ncase: (n1: Numeric, n2: Numeric) => T,
                            bcase: <U>(b1: Bounded<U>, b2: Bounded<U>) => T,
                            ucase: <U>(u1: Unbounded<U>, u2: Unbounded<U>) => T,
                            dcase: (d1: Dense, d2: Dense) => T)
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
        } else if (f1.form === "d" && f2.form === "d") {
            return dcase(f1, f2);
        } else {
            throw new Error("Feature Mismatch: Forms of " +
                            "features are incompatible.");
        }
    };
}


let densifyFeat = matchFeature<number[]>(
    (n: Numeric) => {
        return [n.data];
    },
    <T>(b: Bounded<T>) => {
        return b.dict.map(x => (x === b.data) ? 1 : 0);
    },
    <T>(u: Unbounded<T>) => {
        throw new Error();
    },
    (d: Dense) => d.data
);

let densify = (v: FeatureVector) => {
    let vs = v.map(densifyFeat);
    return vs.reduce((acc, x) => acc.concat(x));
};
