import type { ActivityType } from '../types';
import { storageService } from './storage';

export interface Reminder {
  id: string;
  type: ActivityType;
  intervalDays: number;
  enabled: boolean;
  lastNotified?: string;
}

export interface Notification {
  id: string;
  type: 'reminder' | 'inactivity' | 'info';
  title: string;
  message: string;
  activityType?: ActivityType;
  createdAt: string;
  read: boolean;
}

const REMINDER_STORAGE_KEY = 'coffee_traceability_reminders';
const NOTIFICATION_STORAGE_KEY = 'coffee_traceability_notifications';
const INACTIVITY_DAYS = 7; // 7日間活動がなければ通知

const defaultReminders: Reminder[] = [
  { id: 'fertilize', type: 'fertilize', intervalDays: 30, enabled: true },
  { id: 'prune', type: 'prune', intervalDays: 90, enabled: true },
  { id: 'pestControl', type: 'pestControl', intervalDays: 14, enabled: true },
  { id: 'mowing', type: 'mowing', intervalDays: 14, enabled: true },
  { id: 'observe', type: 'observe', intervalDays: 7, enabled: true },
];

const activityTypeLabels: Record<ActivityType, string> = {
  harvest: '収穫',
  fertilize: '施肥',
  prune: '剪定',
  process: '加工',
  observe: '観察',
  pestControl: '防除',
  mowing: '草刈り',
  planting: '植栽',
};

export const reminderService = {
  getReminders(): Reminder[] {
    try {
      const data = localStorage.getItem(REMINDER_STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      // 初回はデフォルトリマインダーを保存
      this.saveReminders(defaultReminders);
      return defaultReminders;
    } catch (error) {
      console.error('Failed to load reminders:', error);
      return defaultReminders;
    }
  },

  saveReminders(reminders: Reminder[]): void {
    try {
      localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders:', error);
    }
  },

  updateReminder(reminder: Reminder): void {
    const reminders = this.getReminders();
    const index = reminders.findIndex(r => r.id === reminder.id);
    if (index >= 0) {
      reminders[index] = reminder;
    } else {
      reminders.push(reminder);
    }
    this.saveReminders(reminders);
  },

  getNotifications(): Notification[] {
    try {
      const data = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to load notifications:', error);
      return [];
    }
  },

  saveNotifications(notifications: Notification[]): void {
    try {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  },

  addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): void {
    const notifications = this.getNotifications();
    const newNotification: Notification = {
      ...notification,
      id: `notification_${Date.now()}`,
      createdAt: new Date().toISOString(),
      read: false,
    };
    notifications.unshift(newNotification);
    // 最大50件まで保持
    if (notifications.length > 50) {
      notifications.pop();
    }
    this.saveNotifications(notifications);
  },

  markAsRead(id: string): void {
    const notifications = this.getNotifications();
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      this.saveNotifications(notifications);
    }
  },

  markAllAsRead(): void {
    const notifications = this.getNotifications();
    notifications.forEach(n => n.read = true);
    this.saveNotifications(notifications);
  },

  clearNotifications(): void {
    this.saveNotifications([]);
  },

  getUnreadCount(): number {
    return this.getNotifications().filter(n => !n.read).length;
  },

  // リマインダーのチェックと通知生成
  checkReminders(): Notification[] {
    const activities = storageService.getAll();
    const reminders = this.getReminders();
    const newNotifications: Notification[] = [];
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // 各リマインダーをチェック
    for (const reminder of reminders) {
      if (!reminder.enabled) continue;

      // 最後の通知が今日なら スキップ
      if (reminder.lastNotified === today) continue;

      // その活動タイプの最新の活動を取得
      const lastActivity = activities
        .filter(a => a.type === reminder.type)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

      let shouldNotify = false;

      if (!lastActivity) {
        // 一度も活動がない場合は通知
        shouldNotify = true;
      } else {
        const lastActivityDate = new Date(lastActivity.date);
        const daysSinceLastActivity = Math.floor(
          (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        shouldNotify = daysSinceLastActivity >= reminder.intervalDays;
      }

      if (shouldNotify) {
        const notification: Omit<Notification, 'id' | 'createdAt' | 'read'> = {
          type: 'reminder',
          title: `${activityTypeLabels[reminder.type]}のリマインダー`,
          message: `${activityTypeLabels[reminder.type]}の時期です。${reminder.intervalDays}日ごとの作業を確認してください。`,
          activityType: reminder.type,
        };
        newNotifications.push({
          ...notification,
          id: `notification_${Date.now()}_${reminder.id}`,
          createdAt: new Date().toISOString(),
          read: false,
        });

        // リマインダーの最終通知日を更新
        reminder.lastNotified = today;
      }
    }

    // 活動がない場合の通知をチェック
    const lastAnyActivity = activities
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

    if (lastAnyActivity) {
      const lastActivityDate = new Date(lastAnyActivity.date);
      const daysSinceLastActivity = Math.floor(
        (now.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceLastActivity >= INACTIVITY_DAYS) {
        // 今日すでに非活動通知を送っているかチェック
        const existingNotifications = this.getNotifications();
        const hasInactivityNotificationToday = existingNotifications.some(
          n => n.type === 'inactivity' && n.createdAt.startsWith(today)
        );

        if (!hasInactivityNotificationToday) {
          newNotifications.push({
            id: `notification_inactivity_${Date.now()}`,
            type: 'inactivity',
            title: '活動記録のお知らせ',
            message: `${daysSinceLastActivity}日間活動が記録されていません。コーヒーの様子を確認しましょう。`,
            createdAt: new Date().toISOString(),
            read: false,
          });
        }
      }
    }

    // 新しい通知を保存
    if (newNotifications.length > 0) {
      const allNotifications = [...newNotifications, ...this.getNotifications()];
      if (allNotifications.length > 50) {
        allNotifications.length = 50;
      }
      this.saveNotifications(allNotifications);
      this.saveReminders(reminders);
    }

    return newNotifications;
  },

  // 活動タイプごとの最終活動日を取得
  getLastActivityDates(): Record<ActivityType, string | null> {
    const activities = storageService.getAll();
    const result: Record<ActivityType, string | null> = {
      harvest: null,
      fertilize: null,
      prune: null,
      process: null,
      observe: null,
      pestControl: null,
      mowing: null,
      planting: null,
    };

    for (const activityType of Object.keys(result) as ActivityType[]) {
      const lastActivity = activities
        .filter(a => a.type === activityType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
      
      if (lastActivity) {
        result[activityType] = lastActivity.date;
      }
    }

    return result;
  },
};

