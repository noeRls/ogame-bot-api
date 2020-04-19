import { bot } from './bot';

bot().catch(e => {
  console.error(e);
  console.error('An error occured');
});
