/**
 * 插件化架构的核心定义
 */

import { Context } from 'grammy';

// 订阅项的通用接口
export interface Subscription {
    id: number;
    userId: number;
    targetId: string; // 频道ID、用户ID或URL
    name?: string;
    extra?: any;      // 插件特定的额外数据
}

// 插件接口定义
export interface SourcePlugin {
    // 插件元数据
    name: string;      // 唯一标识符 (e.g., 'bilibili')
    label: string;     // 显示名称 (e.g., 'B站直播')
    interval: number;  // 轮询间隔 (毫秒)

    // 生命周期方法
    init(): Promise<void>;    // 初始化 (建表等)
    start(): void;            // 开始监控
    stop(): void;             // 停止监控

    // 订阅管理
    addSubscription(userId: number, target: string, name?: string): Promise<any>;
    removeSubscription(userId: number, target: string): Promise<boolean>;
    getSubscriptions(userId: number): Promise<Subscription[]>;

    // 交互处理 (可选)
    handleCallback?(ctx: Context, action: string, data: string): Promise<void>;
}
