import Bots from '../data/bots';
import { getIDFromMention } from '../utils/command-utils';
import Deps from '../utils/deps';
import { Command, CommandContext, Permission } from './command';

export default class ClearBadgesCommand implements Command {
    name = 'clear-badges';
    precondition: Permission = 'MANAGE_GUILD';

    constructor(private bots = Deps.get<Bots>(Bots)) {}
    
    execute = async (ctx: CommandContext, userMention: string) => {
        const botId = getIDFromMention(userMention);
        const exists = await this.bots.exists(botId);
        if (!exists)
          throw new TypeError('We are sorry but this bot does not exist inside our system.....Maybe try a bot that is?');

        const savedBot = await this.bots.get(botId);
        savedBot.badges = [];
        savedBot.save();

        return ctx.channel.send(`✔ Cleared out that bots badge and this bot now has \`${savedBot.badges.length}\` badges`);
    }
}
