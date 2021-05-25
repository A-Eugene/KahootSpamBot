const Discord = require('discord.js');
const { Worker } = require('worker_threads');
const Kahoot = require("kahoot.js-updated");

const client = new Discord.Client();

const token = process.env.token;
const prefix = 'kahootspam ';
const color = {
  red: '#e61010',
  green: '#10e61e'
}

require('./keepalive.js');

Array.prototype.insert = function(index, item) {
  this.splice(index, 0, item);
};

function dockerify(i, args) {
  const bot = new Kahoot;
  bot.join(args[0], `${args[1]}${i}`);

  bot.on("QuestionStart", question => {
    let choice = Math.floor(Math.random() * question.numberOfChoices);

    question.answer(choice);
  });
}

function sendError(message, error) {
  switch (error) {
    case 'length':
      error = 'there should be 3 arguments!';
      break;
    case 'num':
      error = 'game pin and amount of bots should only be positive integers(numbers)!';
      break;
    case '404':
      error = 'GameNotFound!';
      break;
  }

  let embed = new Discord.MessageEmbed()
    .setTitle('SpamBot Error')
    .setColor(color.red)
    .addField('Usage:', 'kahootspam [Game Pin without space] [Bot name] [Amount of bots]', false)
    .setFooter(`Error: ${error}`);

  message.channel.send(embed);
}

client.once('ready', () => {
	console.log('Bot Ready!');
});

client.on('message', async message => {
	if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (command == 'help') {
    let embed = new Discord.MessageEmbed()
      .setTitle('Kahoot Spambot Help')
      .setColor(color.green)
      .setDescription('Kahoot SpamBot is a discord bot that is made to flood live-hosted kahoot games and answers randomly. Just put the game pin, bot name, and the amount of bots and this bot will do the work itself. The more bots you requested the more chances of your bot getting 1st, 2nd or 3rd place which will open the possibilities of getting your teachers insane HAHAHAHA')
      .addField('Commands:', `1. kahootspam help: gives a brief explanation on how this bot works and how to use its commands\n2. kahootspam [Game Pin without space] [Bot name] [Amount of bots]: floods kahoot game with [Game Pin] with the name [Bot name]1, [Bot name]2 to [Bot name][Amount of Bots] and answer the questions randomly`, false)
      .addField('User agreement:', `1. I do not take any responsibilities on how will you use this bot, use this at your own risk\n2. This bot is in a development stage. Bugs and glitches might appear anytime so please be patient because we all wanted the best this bot can do :)`, false)
      .setFooter('Kahoot SpamBot by A Eugene#5558');

    message.channel.send(embed);
  } else {
    args.insert(0, command);

    if (args.length < 3) {
      sendError(message, 'length');
      return;
    }

    args[0] = parseInt(args[0]);
    args[2] = parseInt(args[2]);

    if (isNaN(args[0]) || isNaN(args[2]) || args[0] < 0 || args[2] < 0) {
      sendError(message, 'num');
      return;
    }

    for (i = 1; i <= args[2]; i++) {
      dockerify(i, args);
    }

    let embed = new Discord.MessageEmbed()
      .setTitle('SpamBot has started, please wait and see the result! If the game is not getting flooded please recheck your game pin :)')
      .setColor(color.green)
      .setFooter('Kahoot SpamBot by A Eugene#5558');
    
    message.channel.send(embed);
  }
});

client.login(token);



