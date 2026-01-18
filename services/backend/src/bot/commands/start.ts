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

我是你的全源情报助手，实时监控 B站、YouTube、Twitter 等平台的关键动态。

<b>📺 支持平台：</b>
• <b>Bilibili</b> - 主播开播提醒
• <b>YouTube</b> - 频道新视频推送
• <b>Twitter/X</b> - 用户推文监控
• <b>GitHub</b> - 活动热力图 (Mini App)
• <b>系统监控</b> - Docker 容器状态

<b>🛠️ 快速开始：</b>
/addbili - 添加 B站 直播监控
/addyt - 添加 YouTube 频道
/addtw - 添加 Twitter 用户
/help - 查看完整命令列表

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

<b>🎬 YouTube 频道监控：</b>
/addyt &lt;频道ID&gt; [自定义名称]
  例: /addyt UCxxxxxx 某某频道
  
/listyt
  查看已订阅的 YouTube 频道
  
/removeyt &lt;频道ID&gt;
  取消订阅指定频道

<b>🐦 Twitter/X 用户监控：</b>
/addtw &lt;用户名&gt; [自定义名称]
  例: /addtw @elonmusk 马斯克
  
/listtw
  查看已订阅的 Twitter 用户
  
/removetw &lt;用户名&gt;
  取消订阅指定用户

<b>💎 赛博控制面板：</b>
点击 [💎 赛博控制面板] 按钮即可在 Telegram 内直接打开 Web App 看板。

<b>❓ 其他：</b>
/start - 回到主菜单
/help - 显示此帮助
  `;

  await ctx.reply(helpMessage, { parse_mode: 'HTML' });
});

export default composer;
