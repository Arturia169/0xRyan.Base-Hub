/**
 * 配置管理模块
 * 负责加载和验证环境变量配置
 */

import 'dotenv/config';
import process from 'node:process';

/**
 * 应用配置
 */
export const config = {
    // Telegram 配置
    telegram: {
        botToken: process.env.TELEGRAM_BOT_TOKEN || '',
        allowedUserIds: process.env.ALLOWED_USER_IDS
            ? process.env.ALLOWED_USER_IDS.split(',').map((id) => parseInt(id.trim(), 10))
            : [],
        webappUrl: process.env.WEBAPP_URL || '',
    },

    // 监控配置
    monitor: {
        interval: parseInt(process.env.MONITOR_INTERVAL || '60', 10) * 1000, // 默认1分钟
    },

    // 日志级别
    logLevel: process.env.LOG_LEVEL || 'info',

    // Cyber Home 配置
    homeDashboardApiKey: process.env.HOME_DASHBOARD_API_KEY || '',

    // 代理配置
    proxyUrl: process.env.HTTPS_PROXY || process.env.HTTP_PROXY || '',
};

/**
 * 验证必要的配置是否存在
 */
export function validateConfig(): void {
    const errors: string[] = [];

    if (!config.telegram.botToken) {
        errors.push('缺少 TELEGRAM_BOT_TOKEN 环境变量');
    }

    if (errors.length > 0) {
        throw new Error(`配置验证失败:\n${errors.join('\n')}`);
    }
}

export default config;
