export type Feature =
    BooleanFeature |
    NumberFeature |
    BagOfWordsFeature |
    SparseFeature;

export class NumberFeature {
    kind: "number";
    tag: string;
    data: number;

    constructor(t: string, d: number) {
        this.kind = "number";
        this.tag = t;
        this.data = d;
    }
}

export class BooleanFeature {
    kind: "boolean";
    tag: string;
    data: boolean;

    constructor(t: string, d: boolean) {
        this.kind = "boolean";
        this.tag = t;
        this.data = d;
    }
}

export class BagOfWordsFeature {
    kind: "bagofwords";
    tag: string;
    data: string;
    dictionary: string[];

    constructor(t: string, d: string, dict: string[]) {
        this.kind = "bagofwords";
        this.tag = t;
        this.data = d;
        this.dictionary = dict;
    }
}

export class SparseFeature {
    kind: "sparse";
    tag: string;
    data: string;

    constructor(t: string, d: string) {
        this.kind = "sparse";
        this.tag = t;
        this.data = d;
    }
}
