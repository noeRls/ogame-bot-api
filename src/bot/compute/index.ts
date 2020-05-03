import { GameApi } from "../../Api";

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const dumbLoop = async (game: GameApi) => {
    while (true) {
        console.log('fetching...');
        const resources = await game.resourcesList();
        const factory = await game.resourceFactoryList();
        const mines = Object.values(factory.mines);
        for (const mine of mines) {
            if (await game.canUpgrade(mine, resources)) {
                console.log('upgrade !');
                await game.makeUpgrade(mine);
                break;
            }
        }
        console.log('sleeping');
        await sleep(60 * 1000);
    }
};

export const compute = (game: GameApi) => dumbLoop(game);
