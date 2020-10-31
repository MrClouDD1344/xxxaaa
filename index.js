const Discord = require('discord.js');
require('dotenv').config(); 

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
    const hushedRole = message.guild.roles.cache.find(r => r.name === 'Hushed');
    if (message.member.hasPermission('PRIORITY_SPEAKER') || message.member.hasPermission('ADMINISTRATOR')) {
        try {
        // Command startstory [user(s)] ran {Can be run without arguments}
        if (message.content.startsWith('?startstorytime')) {
            // Mute everybody in the voice channel
            const userList = message.member.voice.channel.members.array();
            userList.forEach(element => {
                element.voice.setMute(true);
                element.roles.add(hushedRole);
            });
            // Unmutes the command caller if no argument has been provided
            if (!message.mentions.users.size) {
                message.member.voice.setMute(false);
                message.member.roles.remove(hushedRole);
                message.reply('Story time has begun. Everyone is quiet and you can proceed.');
            }
            // Unmutes anyone who was mentioned in the arguments
            else {
                const muteList = message.mentions.members.array();
                let usernameArray = new Array();
                muteList.forEach(element => {
                    element.voice.setMute(false);
                    element.roles.remove(hushedRole);
                    usernameArray.push(element.displayName);
                });
            usernameArray = usernameArray.join(', ');
            message.channel.send(`Story time has begun. Everyone is quiet. ${usernameArray}, please proceed.`);
            }
        }
        // Stops the story by unmuting everyone
        else if (message.content.startsWith('?stopstorytime')) {
            const userList = message.member.voice.channel.members.array();
            userList.forEach(element => {
                element.voice.setMute(false);
                element.roles.remove(hushedRole);
            });
            message.channel.send('Story time is now over. Everyone may speak now.');
        }
        else if (message.content.startsWith('?helpstorytime')) {
            message.reply('\nMake sure you join a voice channel before activated the commands.\nThere are two commands:\n    ?startstory\n    ?stopstory\nYou can mention anyone with ?startstory and it will mute everyone but them.\nIf you run it without any mentions, it will mute everyone but you.\n?stopstory will unmute everyone\n');
            }
    }
    catch(error) {
        console.error(error);
    }
}
 else {
    // eslint-disable-next-line quotes
    message.reply("You don't have permission to use this command.");
}
});

client.on('voiceStateUpdate', async (oldState, newState) => {
    const oldServer = oldState.guild;
    const oldChannel = oldState.channel;
    const oldMember = oldState.member;
    const newChannel = newState.channel;

    // If the user changed voice channels or the user joined a channel (after not being in one)
    if (oldChannel && newChannel && oldChannel !== newChannel || !oldChannel) {
        // Check if they have the "Hushed" role.
        if (oldMember.roles.cache.some(role => role.name === 'Hushed')) {
            // Remove the "Hushed" role, if the user has it.
            const role = oldServer.roles.cache.find(r => r.name === 'Hushed');
            try {
                await oldMember.roles.remove(role);
                console.log(`- "Hushed" role removed from ${oldMember.user.tag}.`);
                // Unmute this member.
                await oldMember.voice.setMute(false);
                console.log(`- User ${oldMember.user.tag} unmuted.`);
            }
 catch (error) {
                console.error(error);
            }
        }
    }
});

client.login('NzcxOTYxMzUyMTMzNTQxODg4.X5zvCA.zUBDeTPAcfTUwjIUQJfcD7hmFa4')
