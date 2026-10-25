import dotenv from 'dotenv';
dotenv.config();

import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import Job from '../models/Job.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Notification from '../models/Notification.js';
import Bookmark from '../models/Bookmark.js';

async function cleanMockAlumni() {
  console.log('🔄 Connecting to MongoDB Atlas to clean mock alumni...');
  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Failed to connect to MongoDB');
    process.exit(1);
  }

  try {
    const mockAlumni = await User.find({ role: 'ALUMNI' });
    const alumniIds = mockAlumni.map(a => a._id);
    console.log(`Found ${alumniIds.length} alumni in database.`);

    if (alumniIds.length > 0) {
      const deletedJobs = await Job.deleteMany({ postedBy: { $in: alumniIds } });
      console.log(`Deleted ${deletedJobs.deletedCount} jobs posted by mock alumni.`);

      const deletedRequests = await MentorshipRequest.deleteMany({
        $or: [{ mentorId: { $in: alumniIds } }, { studentId: { $in: alumniIds } }]
      });
      console.log(`Deleted ${deletedRequests.deletedCount} mentorship requests.`);

      const deletedNotifs = await Notification.deleteMany({
        $or: [{ recipient: { $in: alumniIds } }, { sender: { $in: alumniIds } }]
      });
      console.log(`Deleted ${deletedNotifs.deletedCount} notifications.`);

      const deletedBookmarks = await Bookmark.deleteMany({
        user: { $in: alumniIds }
      });
      console.log(`Deleted ${deletedBookmarks.deletedCount} bookmarks.`);

      const deletedUsers = await User.deleteMany({ role: 'ALUMNI' });
      console.log(`✅ Successfully removed ${deletedUsers.deletedCount} alumni from MongoDB Atlas.`);
    }

    const remainingAlumni = await User.countDocuments({ role: 'ALUMNI' });
    const remainingUsers = await User.find({}, 'name email role');
    console.log(`Current Alumni count in DB: ${remainingAlumni}`);
    console.log('Remaining registered users in database:');
    console.table(remainingUsers.map(u => ({ id: u._id.toString(), name: u.name, email: u.email, role: u.role })));

    process.exit(0);
  } catch (err) {
    console.error('Error cleaning mock alumni:', err);
    process.exit(1);
  }
}

cleanMockAlumni();
