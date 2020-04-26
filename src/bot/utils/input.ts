import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
rl.pause();

export const input = (question: string): Promise<string> => new Promise((res, rej) => {
    rl.resume();
    rl.question(question, (data) => {
        res(data);
        rl.pause();
    });
});

export const multiSelect = async (choices: string[]): Promise<number> => {
    let stringChoices = choices.map((s, i) => `${i + 1} - ${s}`).join('\n');
    stringChoices += '\n';
    while (true) {
        const selected = Number(await input(stringChoices));
        if (isNaN(selected) || selected < 1 || selected > choices.length)
            console.log('Enter a correct value');
        else
            return selected - 1;
    }
};