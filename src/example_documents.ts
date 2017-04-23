/**
An extended example of document classification using feature vectors.

Having to specify every single feature requires pruning down the set
of features significantly.

This is a classification of the 20-newsgroups dataset. It is just a
set of emails classified into 20 different topics. A popular task is
to create an NLP system to classify other documents into the same
categories.

Required "npm install '@types/node' --save-dev" to work
Also requires "node-svm"
*/

import { FeatureId, FeatureVector } from "./feature";
import {
    NumericFeature,
    UnboundedFeature
} from "./feature_types";
import { ModelGenerator } from "./model";
var fs = require("fs");
var svm = require("node-svm");

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

// You can tell the below gets a bit bloated...
// It also doesn't really use anything but word counts. Length can be useful,
// but there isn't too much metadata attached. In a domain such as product
// recommendation, there would probably be more independent features
class DocumentGenerator implements ModelGenerator<Document> {
    gens = {
        len: NumericFeature.generator(new FeatureId("len")),
        word_car: NumericFeature.generator(new FeatureId("word_car")),
        word_god: NumericFeature.generator(new FeatureId("word_god")),
        word_ark: NumericFeature.generator(new FeatureId("word_ark")),
        word_fast: NumericFeature.generator(new FeatureId("word_fast")),
        word_wheel: NumericFeature.generator(new FeatureId("word_wheel")),
        word_part: NumericFeature.generator(new FeatureId("word_part")),
        word_verse: NumericFeature.generator(new FeatureId("word_verse")),
    };

    generate(doc: Document): FeatureVector {
        return new FeatureVector([
            this.gens.len(doc.getLen()),
            this.gens.word_car(doc.getFreq("car")),
            this.gens.word_god(doc.getFreq("god")),
            this.gens.word_ark(doc.getFreq("ark")),
            this.gens.word_fast(doc.getFreq("fast")),
            this.gens.word_wheel(doc.getFreq("wheel")),
            this.gens.word_part(doc.getFreq("part")),
            this.gens.word_verse(doc.getFreq("verse")),
        ]);
    }
}

// There are technically 20 categories, but I feel adding them all isn't
// particularly informative

var religionDir : string = "20_newsgroup/talk.religion.misc";
var autosDir : string = "20_newsgroup/rec.autos";

var religionFiles : string[] = fs.readdirSync(religionDir);
var autosFiles : string[] = fs.readdirSync(autosDir);

let gen = new DocumentGenerator();

var religionVecs : FeatureVector[] = religionFiles.map(function(filename: string){
    return gen.generate(new Document(fs.readFileSync(religionDir + "/" + filename, {encoding: "utf8"})));
});

var autosVecs : FeatureVector[] = autosFiles.map(function(filename: string){
    return gen.generate(new Document(fs.readFileSync(autosDir + "/" + filename, {encoding: "utf8"})));
});

//Convert back to numeric array for actual library to use
var religionNums : [number[], number][] = religionVecs.map(function(vec : FeatureVector){
    var fv : [number[], number] = [vec.densify(), 0];
    return fv;
});

var autosNums : [number[], number][] = autosVecs.map(function(vec : FeatureVector){
    var fv : [number[], number] = [vec.densify(), 1];
    return fv;
});

var trainingData : [number[], number][] = religionNums.concat(autosNums);

var clf = new svm.CSVC();

var numClassified: number = 0;
var numCorrect: number = 0;

clf.train(trainingData).done(function(){
    trainingData.forEach(function(data: [number[], number]){
        var prediction: number = clf.predictSync(data[0]);
        numClassified++;
        var label = data[1] as number;
        if(label == prediction){
            numCorrect++;
        }
    });

    console.log("Percent correct: %d", numCorrect / numClassified * 100.0);
});
