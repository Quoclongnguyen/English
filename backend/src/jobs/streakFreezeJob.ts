import cron from 'node-cron';
import { User } from '../models/User';

/**
 * Scheduled job: Auto-use streak freezes
 * Runs at 00:05 every day (5 mins after midnight)
 * 
 * Logic:
 * 1. Find users who missed yesterday's study
 * 2. Check if they have streak freezes in inventory
 * 3. Auto-use freeze to protect streak (update lastStudyDate to yesterday, decrement freeze)
 */
export function startStreakFreezeJob() {
  // 5 minutes past midnight: '5 0 * * *'
  cron.schedule('5 0 * * *', async () => {
    console.log('🔄 [00:05] Checking daily streak freezes...');
    
    try {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      
      // Find users who:
      // 1. Have lastStudyDate older than yesterday (i.e., didn't study yesterday)
      // 2. Have streakFreezes > 0
      // 3. Have an active streak (count > 0)
      const users = await User.find({
        $or: [
          { 'currentStreak.lastStudyDate': { $lt: yesterday } },
          { 'currentStreak.lastStudyDate': { $exists: false } }
        ],
        streakFreezes: { $gt: 0 },
        'currentStreak.count': { $gt: 0 }
      });
      
      for (const user of users) {
        try {
          user.streakFreezes -= 1;
          user.currentStreak.frozenAt = new Date();
          
          // Protect streak by updating study date to yesterday
          user.currentStreak.lastStudyDate = yesterday;
          
          await user.save();
          
          console.log(`🛡️ [Streak Freeze] Auto-protected user ${user.email} (${user._id}). Freezes left: ${user.streakFreezes}`);
        } catch (err: any) {
          console.error(`❌ Error auto-freezing user ${user._id}:`, err.message);
        }
      }
      
      console.log(`✅ Streak freeze job completed. Evaluated ${users.length} users.`);
    } catch (error: any) {
      console.error('❌ Streak freeze job error:', error.message);
    }
  });
  
  console.log('✅ Streak freeze job scheduled (daily at 00:05)');
}
