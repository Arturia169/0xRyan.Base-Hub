/**
 * Bilibili 相关命令
 */

import type { Context } from 'grammy';
import { pluginManager } from '../../core/PluginManager.js';
import { getOrCreateUser } from '../../database/queries.js';
import { logger } from '../../utils/logger.js';

const log = logger.child('BotCmd:Bili');

/**
 * 添加监控主播
 * /addbili <RoomID>
 */
export async function addBili(ctx: Context) {
    if (!ctx.message?.text) return;

    const parts = ctx.message.text.split(' ');
    // parts[0] is /addbili, so we pass parts.slice(1)
    await pluginManager.handleAddCommand(ctx, 'bilibili', parts.slice(1));
}

/**
 * 移除监控主播
 * /removebili <RoomID>
 */
export async function removeBili(ctx: Context) {
    if (!ctx.message?.text) return;

    const parts = ctx.message.text.split(' ');
    if (parts.length !== 2) {
        await ctx.reply('⚠️ 格式错误\n请使用: `/removebili 房间号`');
        return;
    }

    const roomId = parts[1];
    const user = ctx.from!;

    // 确保用户存在
    getOrCreateUser(user.id, user.username, user.first_name);

    try {
        const plugin = pluginManager.get('bilibili');
        if (!plugin) {
            await ctx.reply('❌ 插件未加载');
            return;
        }

        const success = await plugin.removeSubscription(user.id, roomId);
        if (success) {
            await ctx.reply(`✅ 已停止监控直播间 ${roomId}`);
        } else {
            await ctx.reply(`⚠️ 你没有监控直播间 ${roomId}`);
        }
    } catch (error: any) {
        log.error(error);
        await ctx.reply('❌ 移除失败');
    }
}

/**
 * 列出已监控的主播
 * /listbili
 */
export async function listBili(ctx: Context) {
    const user = ctx.from!;
    const dbUser = getOrCreateUser(user.id, user.username, user.first_name);

    const streamers = getBilibiliStreamersByUser(dbUser.id);

    if (streamers.length === 0) {
        await ctx.reply('📭 你还没有监控任何 Bilibili 直播间\n使用 `/addbili 房间号` 添加');
        return;
    }

    let message = '📺 <b>你的 Bilibili 监控列表</b>\n\n';

    for (const s of streamers) {
        const status = s.is_live === 1 ? '🟢 直播中' : '⚫ 未开播';
        const link = `<a href="https://live.bilibili.com/${s.room_id}">${s.room_id}</a>`;

        message += `${status} - 房间: ${link}\n`;
        if (s.last_title) {
            message += `📝 ${s.last_title}\n`;
        }
        message += '\n';
    }

    await ctx.reply(message, {
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true }
    });
}
