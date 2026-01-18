import { InlineKeyboard } from 'grammy';
import config from '../config/index.js';

/**
 * 创建确认键盘
 */
export function confirmKeyboard(
    confirmCallback: string,
    cancelCallback: string = 'cancel'
): InlineKeyboard {
    return new InlineKeyboard()
        .text('✅ 确认', confirmCallback)
        .text('❌ 取消', cancelCallback);
}

/**
 * 创建返回主菜单键盘
 */
export function backToMenuKeyboard(): InlineKeyboard {
    return new InlineKeyboard().text('🏠 返回主菜单', 'menu:main');
}

/**
 * 创建主菜单键盘
 */
export function mainMenuKeyboard(): InlineKeyboard {
    const webAppUrl = config.telegram.webappUrl || 'https://t.me';
    const keyboard = new InlineKeyboard();

    // 控制面板 (Web App)
    if (webAppUrl.startsWith('https://')) {
        keyboard.webApp('💎 赛博控制面板', webAppUrl);
    } else {
        keyboard.url('💎 赛博控制面板 (浏览器)', webAppUrl);
    }

    return keyboard
        .row()
        .text('📺 添加 B站 监控', 'menu:add')
        .text('📋 监控列表', 'menu:list')
        .row()
        .text('ℹ️ 帮助', 'menu:help');
}

/**
 * 创建分页键盘
 */
export function paginationKeyboard(
    currentPage: number,
    totalPages: number,
    callbackPrefix: string
): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    if (currentPage > 1) {
        keyboard.text('⬅️ 上一页', `${callbackPrefix}:${currentPage - 1}`);
    }

    keyboard.text(`${currentPage}/${totalPages}`, 'noop');

    if (currentPage < totalPages) {
        keyboard.text('➡️ 下一页', `${callbackPrefix}:${currentPage + 1}`);
    }

    return keyboard;
}
