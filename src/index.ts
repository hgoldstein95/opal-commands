import * as child from 'child_process';

// ---- General Use Code ----

class OpalFeatVec {
    featMap: Map<string, number>;

    constructor(initial: [string, number][] = []) {
        this.featMap = new Map(initial);
    }

    addFeature(k: string, v: number): OpalFeatVec {
        this.featMap.set(k, v);
        return this;
    }
}

interface OpalModel {
    train: (data: OpalFeatVec[]) => void;
    predict: (fv: OpalFeatVec) => void;
    format: (fv: OpalFeatVec) => string;
}


// ---- Problem Specific Code ----

class Wabbit implements OpalModel {
    train(data: OpalFeatVec[]) {
    }

    predict(data: OpalFeatVec) {
        console.log(this.format(data));

        // child.exec("ls", (error, stdout, stderr) => {
        //     if (error) {
        //         console.error(`exec error: ${error}`);
        //         return;
        //     }
        //     console.log(`stdout: ${stdout}`);
        //     console.log(`stderr: ${stderr}`);
        // });
    }

    format(fv: OpalFeatVec): string {
        var res = "|";
        fv.featMap.forEach((v, k) => {
            res += " ";
            res += k;
            res += ":";
            res += v.toString();
        });
        return res;
    }
}

let wabbit: OpalModel = new Wabbit();

let cmd = new OpalFeatVec([["cmdroot_ls", 1], ["dir_depth", 10]]);

wabbit.predict(cmd);
