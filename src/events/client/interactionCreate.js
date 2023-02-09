const { CommandInteraction, Client, InteractionType } = require('discord.js');
const blacklistDB = require('../../database/schemas/BlacklistSchema.js');

module.exports = {
    name: 'interactionCreate',
    /**
     * @param {CommandInteraction} interaction
     * @param {Client} client
     */
    async execute(interaction, client) {
        if (interaction.type == InteractionType.ApplicationCommand) {

            const { guildId, user } = interaction;

            const blacklist = await blacklistDB.findOne({ GuildID: guildId, UserID: user.id });
            if (blacklist) return interaction.reply({ content: `You have been blacklisted.\n> ${blacklist.Reason}`, ephemeral: true });

            const cmd = client.commands.get(interaction.commandName);
            if (!cmd) return;

            try {
                await cmd.execute(interaction, client);
            } catch (error) {
                interaction.reply({ content: 'An error occured whilst trying to run this command.', ephemeral: true });
                console.log(error);
            };
        };
    },
};
