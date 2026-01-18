/**
 * /start 命令处理器
 * 显示欢迎消息和功能介绍
 */

import { Composer, Context } from 'grammy';
import { mainMenuKeyboard } from '../keyboards.js';
import { getOrCreateUser } from '../../database/queries.js';

const composer = new Composer();

composer.command('start', async (ctx: Context) => {
  const user = ctx.from;
  if (!user) return;

  // 创建或获取用户
  getOrCreateUser(user.id, user.username, user.first_name);

  const welcomeMessage = `
🤖 <b>欢迎来到赛博基地情报中心！</b>

我是你的情报助手，负责实时监控并汇总来自 B站、YouTube 及社媒的关键动态。

<b>📺 当前支持：</b>
• <b>Bilibili</b> - 主播开播提醒 / 动态同步
• <b>GitHub</b> - 活动热力图展示 (Mini App)
• <b>系统监控</b> - 实时 Docker 容器健康状态

<b>🛠️ 常用命令：</b>
/addbili - 添加 B站 监控房间
/listbili - 查看我的监控列表
/removebili - 移除监控房间
/help - 详尽说明

点击下方按钮进入<b>控制面板</b>查看实时看板。
  `;

  await ctx.reply(welcomeMessage, {
    parse_mode: 'HTML',
    reply_markup: mainMenuKeyboard(),
  });
});

composer.command('help', async (ctx: Context) => {
  const helpMessage = `
📖 <b>使用帮助</b>

<b>📺 B站 监控管理：</b>
/addbili &lt;房间号&gt;
  例: /addbili 22637261
  
/listbili
  查看所有正在监控的主播状态
  
/removebili &lt;房间号&gt;
  取消对指定房间的监控

<b>💎 赛博控制面板：</b>
点击 [💎 赛博控制面板] 按钮即可在 Telegram 内直接打开 Web App 看板。

<b>❓ 其他：</b>
/start - 回到主菜单
/help - 显示此帮助
  `;

  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

export default composer;
