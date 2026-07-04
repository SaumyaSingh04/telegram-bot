const pingCommand = async (ctx) => {
  const start = Date.now();
  const msg = await ctx.reply('🏓 Pinging...');
  const latency = Date.now() - start;

  await ctx.telegram.editMessageText(
    ctx.chat.id,
    msg.message_id,
    undefined,
    `🏓 Pong! \`${latency}ms\``,
    { parse_mode: 'Markdown' }
  );
};

export default pingCommand;
