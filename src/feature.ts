export class FeatureId {
    tag: string;
    constructor(tag: string) {
        this.tag = tag;
    }
}

export interface Feature {
    id: FeatureId;

    sqDiff(other: this): number;
    absDiff(other: this): number;

    densify(): number[];
    getPair(): [string, any];
}

export class FeatureVector {
    vec: Feature[];

    constructor(vec: Feature[]) {
        this.vec = vec;
    }

    oneNorm(other: FeatureVector): number {
        let sum = 0;
        for (var i = 0; i < this.vec.length; i++) {
            sum += this.vec[i].absDiff(other.vec[i]);
        }
        return sum;
    }

    twoNorm(other: FeatureVector): number {
        let sum = 0;
        for (var i = 0; i < this.vec.length; i++) {
            sum += this.vec[i].sqDiff(other.vec[i]);
        }
        return Math.sqrt(sum);
    }

    densify(): number[] {
        let lists = this.vec.map(x => x.densify());
        return lists.reduce((acc, x) => acc.concat(x), []);
    }

    toMap(): Map<string, any> {
        let m = new Map<string, any>();
        for (let f of this.vec) {
            let p = f.getPair();
            m.set(p[0], p[1]);
        }
        return m;
    }
}
