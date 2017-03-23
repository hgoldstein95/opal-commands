import { FeatureId, FeatureVector } from "./feature";
import {
    NumericFeature,
    UnboundedFeature
} from "./feature_types";
import { ModelGenerator, ModelProcessor } from "./model";

class Document {
    words: string[];
    constructor(text: string) {
        this.words = text.toLowerCase().split(" ");
    }
    getLen(): number {
        return this.words.length;
    }
    getFreq(word: string): number {
        let freq = this.words.reduce((acc, x) => {
            return (x === word) ? acc + 1 : acc;
        }, 0);
        return freq / this.words.length;
    }
    getFirst(): string {
        return this.words[0];
    }
}

class DocumentGenerator implements ModelGenerator<Document> {
    gens = {
        len: NumericFeature.generator(new FeatureId("len")),
        word_the: NumericFeature.generator(new FeatureId("word_the")),
        word_to: NumericFeature.generator(new FeatureId("word_to")),
        first: UnboundedFeature.generator<string>(new FeatureId("first"))
    };

    generate(doc: Document): FeatureVector {
        return new FeatureVector([
            this.gens.len(doc.getLen()),
            this.gens.word_to(doc.getFreq("to")),
            this.gens.word_the(doc.getFreq("the")),
            this.gens.first(doc.getFirst())
        ]);
    }
}

let d1 = new Document("It doesn't look like anything to me.");
let d2 = new Document("These violent delights have violent ends.");
let d3 = new Document("Shall we drink to the lady with the white shoes?");

let gen = new DocumentGenerator();

let v1 = gen.generate(d1);
let v2 = gen.generate(d2);
let v3 = gen.generate(d3);

console.log(v1);
console.log(v2);
console.log(v3);
