const index = require('./../../index');
const utils = require('./../../utils');

exports.info = {
    name: 'remove',
    usage: 'remove [Number]',
    description: 'Removes a given number from the database'
};

exports.run = function (bot, msg, args) {

    utils.userHasPerms(msg.author.id).then(isModerator => {
        if (!isModerator) return msg.reply('Sorry but you dont have permission to use this command!');

        if (args.length > 0) {
            let number = args[0];

            utils.removeScammerNumber(msg.author.id, number).then((removed) => {
                msg.reply(`Successfully removed number:${number} from the database!`).then(m => {
                    m.delete(10000)
                });
            }).catch(err => {
                msg.reply('Sorry but there appears to be an error removing that number!').then(m => {
                    m.delete(10000)
                });
            })
        } else {
            msg.reply(`You must specify a number to remove using the format <remove number>`).then(m => {
                m.delete(10000)
            });
        }
    }).catch(err => {
        console.error(`Error while checking if a user has perms, Error: ${err.stack}`);
        msg.reply(`Unable to check if you have enough perms to do this, aborting!`);
    });
};