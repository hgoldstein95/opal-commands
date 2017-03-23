import { Feature, FeatureId } from "./feature";

export class NumericFeature implements Feature {
    id: FeatureId;
    data: number;

    static generator(id: FeatureId): (d: number) => NumericFeature {
        return (data) => {
            let f = new NumericFeature();
            f.id = id;
            f.data = data;
            return f;
        };
    }

    sqDiff(other: NumericFeature): number {
        return Math.pow(this.data - other.data, 2);
    }

    absDiff(other: NumericFeature): number {
        return Math.abs(this.data - other.data);
    }

    densify(): number[] {
        return [this.data];
    }

    getPair(): [string, any] {
        return [this.id.tag, this.data];
    }
}

export class UnboundedFeature<T> implements Feature {
    id: FeatureId;
    data: T;

    static generator<T>(id: FeatureId): (d: T) => UnboundedFeature<T> {
        return (data) => {
            let f = new UnboundedFeature<T>();
            f.id = id;
            f.data = data;
            return f;
        };
    }

    sqDiff(other: UnboundedFeature<T>): number {
        return (this.data === other.data) ? 0 : 1;
    }

    absDiff(other: UnboundedFeature<T>): number {
        return this.sqDiff(other);
    }

    getPair(): [string, any] {
        return [this.id.tag, this.data];
    }

    densify(): number[] {
        throw new Error("Cannot densify general CategoricalFeature.");
    }
}

export class BoundedFeature<T> implements Feature {
    id: FeatureId;
    data: T;
    bound: T[];

    static generator<T>(id: FeatureId, bound: T[]): (d: T) => BoundedFeature<T> {
        return (data) => {
            let f = new BoundedFeature<T>();
            f.id = id;
            f.data = data;
            f.bound = bound;
            return f;
        };
    }

    sqDiff(other: UnboundedFeature<T>): number {
        return (this.data === other.data) ? 0 : 1;
    }

    absDiff(other: UnboundedFeature<T>): number {
        return this.sqDiff(other);
    }

    densify(): number[] {
        return this.bound.map(x => (x === this.data) ? 1 : 0);
    }

    getPair(): [string, any] {
        return [this.id.tag, this.data];
    }
}
