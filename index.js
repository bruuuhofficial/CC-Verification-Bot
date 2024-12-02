const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const TOKEN = 'MTMxMzI0NDczMzk4ODE0MzE0NQ.GM0wkq.0x3niKLugLSSas--0Qs6b-R8R-0f-d_c9cRamM'; 
const SERVER_ID = '1313112054718140518';
const CHANNEL_ID = '1313212860997959710';
const ROLE_ID = '1313123496603418655';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, 
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', async () => {
  console.log(`${client.user.tag} is online!`);

  const channel = await client.channels.fetch(CHANNEL_ID);
  if (!channel) return console.error('Channel not found.');

  const messages = await channel.messages.fetch({ limit: 10 });
  const existingMessage = messages.find((msg) => msg.author.id === client.user.id);

  if (!existingMessage) {
    const embed = new EmbedBuilder()
      .setColor('#0099FF')
      .setTitle('BOT VERIFICATION')
      .setDescription('Verify To Gain Access To All Bots.');

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('verify')
        .setLabel('VERIFY')
        .setStyle(ButtonStyle.Primary)
    );

    await channel.send({ embeds: [embed], components: [row] });
    console.log('Verification message sent.');
  } else {
    console.log('Verification message already exists.');
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isButton()) return;

  if (interaction.customId === 'verify') {
    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const role = interaction.guild.roles.cache.get(ROLE_ID);

      if (role) {
        await member.roles.add(role);
        await interaction.reply({
          content: 'You have been verified and given the role!',
          ephemeral: true,
        });
        console.log(`Verified ${interaction.user.tag} and added the role.`);
      } else {
        await interaction.reply({
          content: 'Verification failed: Role not found.',
          ephemeral: true,
        });
        console.error('Role not found.');
      }
    } catch (error) {
      console.error('Error during interaction handling:', error);
      await interaction.reply({
        content: 'Something went wrong. Please try again later.',
        ephemeral: true,
      });
    }
  }
});

client.login(TOKEN);
