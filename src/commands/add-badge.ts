import Bots from '../data/bots';
import { getIDFromMention } from '../utils/command-utils';
import Deps from '../utils/deps';
import { Command, CommandContext, Permission } from './command';

export default class AddBadgeCommand implements Command {
    name = 'add-badge';
    precondition: Permission = 'MANAGE_GUILD';

    constructor(private bots = Deps.get<Bots>(Bots)) {}
    
    execute = async (ctx: CommandContext, userMention: string, badgeName: string) => {
        const botId = getIDFromMention(userMention);
        const exists = await this.bots.exists(botId);
        if (!exists)
          throw new TypeError('We are sorry but this bot does not exist inside our system.....Maybe try a bot that is?');

        const savedBot = await this.bots.get(botId);
        savedBot.badges.push(badgeName.toUpperCase() as any);
        savedBot.save();

        return ctx.channel.send(`✔ Great this bot now has \`${savedBot.badges.length}\` badges`);
    }
}
