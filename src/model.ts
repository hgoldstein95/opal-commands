import { FeatureVector } from "./feature";

export interface ModelGenerator<T> {
    generate(t: T): FeatureVector;
}

export interface ModelProcessor<T> {
    process(v: FeatureVector): T;
}
