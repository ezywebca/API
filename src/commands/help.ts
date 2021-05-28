import { Command, CommandContext, Permission } from './command';

export default class HelpCommand implements Command {
    name = 'help';
    precondition: Permission = 'KICK_MEMBERS';
    
    execute = async (ctx: CommandContext) => {
        return ctx.channel.send(
            '🔨 `dl.accept <bot> <reason>` -> accept bot user with reason\n' +
            '🅰 `dl.add-badge <bot> <badge_name>` -> add a badge to a bot\n' +
            '🅰 `dl.clear-badges <bot>` -> clear badges from a bot\n' +
            '🅰 `dl.delete <bot> <reason>` -> delete a bot from the list\n' +
            '🔨 `dl.decline <bot> <reason>` -> decline bot user with reason\n' +
            '🔨 `dl.help` -> show this\n' +
            '✅ `dl.ping` -> `DisList.Me ping` -> pong!\n' +
            '🔨 `dl.q` -> show approval queue');
    }
}
