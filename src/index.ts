import * as child from 'child_process';

class CommandFeature {
    f1: number;
    f2: number;
    constructor(f1: number, f2: number) {
        this.f1 = f1;
        this.f2 = f2;
    }

    toWabbit() {
        return `| f1:${this.f1} f2:${this.f2}`;
    }
}

class Wabbit {
    train(data: CommandFeature[]) {
    }

    predict(data: CommandFeature) {
        console.log(data.toWabbit());

        child.exec("ls", (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
    }
}

let wabbit = new Wabbit();

wabbit.predict(new CommandFeature(10, 20));
