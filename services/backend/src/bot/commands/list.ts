/**
 * 统一的订阅列表命令
 */

import { Context } from 'grammy';
import {
    getAllBilibiliStreamers,
    getAllYoutubeChannels,
    getAllTwitterUsers
} from '../../database/queries.js';

export async function listAll(ctx: Context) {
    const userId = ctx.from!.id;

    // 获取所有订阅
    const biliStreamers = getAllBilibiliStreamers().filter(s => s.telegram_id === userId);
    const ytChannels = getAllYoutubeChannels().filter(c => c.telegram_id === userId);
    const twUsers = getAllTwitterUsers().filter(u => u.telegram_id === userId);

    if (biliStreamers.length === 0 && ytChannels.length === 0 && twUsers.length === 0) {
        await ctx.reply('📭 你还没有任何订阅\n\n使用以下命令添加订阅：\n/addbili - B站直播\n/addyt - YouTube频道\n/addtw - Twitter用户');
        return;
    }

    let message = '📋 <b>我的订阅列表</b>\n\n';

    // Bilibili
    if (biliStreamers.length > 0) {
        message += '📺 <b>Bilibili 直播 (' + biliStreamers.length + ')</b>\n';
        biliStreamers.forEach((s, index) => {
            const status = s.is_live ? '🔴 直播中' : '⚫ 未开播';
            message += `${index + 1}. ${s.name || s.room_id} ${status}\n`;
            message += `   房间号: <code>${s.room_id}</code>\n`;
        });
        message += '\n';
    }

    // YouTube
    if (ytChannels.length > 0) {
        message += '🎬 <b>YouTube 频道 (' + ytChannels.length + ')</b>\n';
        ytChannels.forEach((c, index) => {
            message += `${index + 1}. ${c.name || c.channel_id}\n`;
            message += `   ID: <code>${c.channel_id}</code>\n`;
        });
        message += '\n';
    }

    // Twitter
    if (twUsers.length > 0) {
        message += '🐦 <b>Twitter 用户 (' + twUsers.length + ')</b>\n';
        twUsers.forEach((u, index) => {
            message += `${index + 1}. ${u.name || u.username}\n`;
            message += `   Handle: <code>${u.username}</code>\n`;
        });
        message += '\n';
    }

    message += '💡 使用 /remove 命令可以取消订阅';

    await ctx.reply(message, { parse_mode: 'HTML' });
}
