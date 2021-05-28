import Bots from '../data/bots';
import { handleFeedback } from '../modules/reviewal';
import { getMemberFromMention } from '../utils/command-utils';
import Deps from '../utils/deps';
import { Command, CommandContext, Permission } from './command';

export default class DenyCommand implements Command {
  aliases = ['deny', 'reject', 'nope', 'srry'];
  name = 'decline';
  precondition: Permission = 'KICK_MEMBERS';

  constructor(private bots = Deps.get<Bots>(Bots)) {}
  
  execute = async (ctx: CommandContext, userMention: string, ...reason: string[]) => {
    const botMember = getMemberFromMention(userMention, ctx.guild);
    const exists = await this.bots.exists(botMember.id);
    if (!exists)
      throw new TypeError('We are sorry but this bot does not exist inside our system.....Maybe try a bot that is?');

    const message = reason.join(' ');
    if (message.length < 50)
      throw new TypeError('To Decline this bot your reason must be >= 50 characters long.');

    await handleFeedback(botMember.id, {
      approved: false,
      by: ctx.user.id,
      message
    });

    await botMember.kick(message);

    return ctx.channel.send(`✅ Success this bot is now declined.`);
  }
}
