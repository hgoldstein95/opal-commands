import { FeatureVector } from "./feature";

export interface ModelGenerator<T> {
    generate(t: T): FeatureVector;
}
