import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Event from '../models/Event.js';
import MentorshipRequest from '../models/MentorshipRequest.js';
import Notification from '../models/Notification.js';
import ContactMessage from '../models/ContactMessage.js';
import Bookmark from '../models/Bookmark.js';
import EventRegistration from '../models/EventRegistration.js';
import { connectDB } from '../config/db.js';

export const seedDatabase = async () => {
  console.log('🔄 Starting Alumni Network Directory Seed Script...');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Cannot seed database: MongoDB connection failed.');
    process.exit(1);
  }

  try {
    // Clean existing seed collections
    await Promise.all([
      User.deleteMany({}),
      Job.deleteMany({}),
      Event.deleteMany({}),
      MentorshipRequest.deleteMany({}),
      Notification.deleteMany({}),
      ContactMessage.deleteMany({}),
      Bookmark.deleteMany({}),
      EventRegistration.deleteMany({})
    ]);

    console.log('🧹 Cleaned existing database collections.');

    // Common password for demo accounts
    const studentPassword = await bcrypt.hash('Student@123', 10);
    const alumniPassword = await bcrypt.hash('Alumni@123', 10);
    const adminPassword = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || 'Admin@123456', 10);

    // 1. Create Admin
    const admin = await User.create({
      name: 'Dr. K. S. Ramanathan',
      email: 'admin@college.edu',
      passwordHash: adminPassword,
      role: 'ADMIN',
      college: 'National Institute of Technology',
      department: 'Dean of Alumni & Student Affairs',
      degree: 'Ph.D',
      graduationYear: 1998,
      academicYear: '',
      city: 'Bengaluru',
      bio: 'Dean of Alumni Relations & Career Development. Coordinating student mentorship and institutional placements.',
      verificationStatus: 'VERIFIED',
      isActive: true
    });

    // 2. Create Alumni
    const alumniData = [
      {
        name: 'Priya Sharma',
        email: 'priya.sharma@microsoft.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2022,
        company: 'Microsoft',
        jobTitle: 'Software Engineer',
        industry: 'Software & Technology',
        experience: 4,
        city: 'Bengaluru',
        profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
        bio: 'Passionate software engineer with a strong interest in building scalable cloud products and solving real-world distributed systems problems. Active mentor for college students and placement preparation.',
        linkedInUrl: 'https://linkedin.com/in/priya-sharma-demo',
        mentorshipAvailable: true,
        mentorshipTopics: ['Placement Preparation', 'DSA & Coding Interviews', 'Resume Review', 'Career Guidance'],
        verificationStatus: 'VERIFIED',
        skills: ['Java', 'Python', 'React', 'SQL', 'Problem Solving', 'Azure', 'Microservices'],
        profileViews: 148
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@meta.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Electronics & Communication',
        degree: 'B.Tech',
        graduationYear: 2021,
        company: 'Meta',
        jobTitle: 'Backend Developer',
        industry: 'Social Media & Tech',
        experience: 5,
        city: 'Hyderabad',
        profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        bio: 'Core backend engineer building high-throughput services with Node.js and distributed databases. Passionate about helping juniors crack tech rounds.',
        linkedInUrl: 'https://linkedin.com/in/amit-kumar-demo',
        mentorshipAvailable: true,
        mentorshipTopics: ['DSA & Coding Interviews', 'Career Guidance', 'Placement Preparation'],
        verificationStatus: 'VERIFIED',
        skills: ['Node.js', 'SQL', 'AWS', 'Distributed Systems', 'System Design'],
        profileViews: 112
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@tcs.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2020,
        company: 'TCS Research',
        jobTitle: 'Data Scientist',
        industry: 'Data Science & AI',
        experience: 6,
        city: 'Pune',
        profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&auto=format&fit=crop&q=80',
        bio: 'Specializing in NLP, computer vision, and predictive modeling. Happy to guide aspiring data scientists with project roadmaps and interview practice.',
        linkedInUrl: 'https://linkedin.com/in/neha-gupta-demo',
        mentorshipAvailable: true,
        mentorshipTopics: ['Career Guidance', 'Higher Studies', 'Placement Preparation'],
        verificationStatus: 'VERIFIED',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Data Analytics', 'Pandas'],
        profileViews: 89
      },
      {
        name: 'Siddharth Rao',
        email: 'siddharth.rao@infosys.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Electrical & Electronics',
        degree: 'B.Tech',
        graduationYear: 2019,
        company: 'Infosys',
        jobTitle: 'DevOps & Cloud Engineer',
        industry: 'IT Services & Cloud',
        experience: 7,
        city: 'Chennai',
        profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
        bio: 'Cloud architect working with multi-region Kubernetes deployments, Terraform, and CI/CD automation.',
        linkedInUrl: 'https://linkedin.com/in/siddharth-rao-demo',
        mentorshipAvailable: true,
        mentorshipTopics: ['Career Guidance', 'Resume Review', 'Higher Studies'],
        verificationStatus: 'VERIFIED',
        skills: ['Java', 'Linux', 'DevOps', 'Kubernetes', 'Docker', 'AWS'],
        profileViews: 65
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@google.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2020,
        company: 'Google',
        jobTitle: 'Software Engineer III',
        industry: 'Cloud & Infrastructure',
        experience: 6,
        city: 'Bengaluru',
        profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
        bio: 'Working on core infrastructure and network reliability at Google. NIT alumnus eager to support students preparing for top-tier product company interviews.',
        linkedInUrl: 'https://linkedin.com/in/rahul-sharma-demo',
        mentorshipAvailable: true,
        mentorshipTopics: ['Placement Preparation', 'DSA & Coding Interviews', 'Startup Guidance'],
        verificationStatus: 'VERIFIED',
        skills: ['Go', 'C++', 'Distributed Systems', 'GCP', 'Algorithms'],
        profileViews: 230
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@amazon.com',
        passwordHash: alumniPassword,
        role: 'ALUMNI',
        college: 'National Institute of Technology',
        department: 'Mechanical Engineering',
        degree: 'B.Tech',
        graduationYear: 2021,
        company: 'Amazon',
        jobTitle: 'Operations & Data Analyst',
        industry: 'E-commerce & Logistics',
        experience: 5,
        city: 'Hyderabad',
        profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
        bio: 'Transitioned from Mechanical Engineering to Big Tech analytics. Can help students with career pivots and supply chain analytics.',
        linkedInUrl: 'https://linkedin.com/in/vikram-singh-demo',
        mentorshipAvailable: false,
        mentorshipTopics: ['Career Guidance', 'Resume Review'],
        verificationStatus: 'PENDING',
        skills: ['SQL', 'Tableau', 'Python', 'Supply Chain', 'Statistics'],
        profileViews: 42
      }
    ];

    const alumni = await User.insertMany(alumniData);
    console.log(`👤 Created ${alumni.length} alumni accounts.`);

    // 3. Create Students
    const studentData = [
      {
        name: 'Rohan Sharma',
        email: 'rohan.student@college.edu',
        passwordHash: studentPassword,
        role: 'STUDENT',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2026,
        academicYear: '3rd Year',
        city: 'Bengaluru',
        bio: '3rd year CSE student interested in Full Stack Development and Distributed Systems. Actively seeking summer internship opportunities.',
        skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Python', 'DSA'],
        interests: ['Full Stack Development', 'Product Companies', 'Open Source'],
        verificationStatus: 'VERIFIED'
      },
      {
        name: 'Sneha Patil',
        email: 'sneha.student@college.edu',
        passwordHash: studentPassword,
        role: 'STUDENT',
        college: 'National Institute of Technology',
        department: 'Computer Science & Engineering',
        degree: 'B.Tech',
        graduationYear: 2026,
        academicYear: '3rd Year',
        city: 'Pune',
        bio: 'Passionate about Data Structures, Competitive Programming, and AI. Looking for mentorship regarding placement prep.',
        skills: ['C++', 'Python', 'DSA', 'SQL'],
        interests: ['Competitive Programming', 'Machine Learning', 'Big Tech Placement'],
        verificationStatus: 'VERIFIED'
      },
      {
        name: 'Ananya Reddy',
        email: 'ananya.student@college.edu',
        passwordHash: studentPassword,
        role: 'STUDENT',
        college: 'National Institute of Technology',
        department: 'Electronics & Communication',
        degree: 'B.Tech',
        graduationYear: 2025,
        academicYear: 'Final Year',
        city: 'Hyderabad',
        bio: 'Final year ECE student focused on IoT and embedded platforms. Looking for graduate guidance.',
        skills: ['C', 'C++', 'Microcontrollers', 'Python'],
        interests: ['Semiconductors', 'Core Engineering', 'Higher Studies'],
        verificationStatus: 'VERIFIED'
      }
    ];

    const students = await User.insertMany(studentData);
    console.log(`🎓 Created ${students.length} student accounts.`);

    // 4. Create Jobs & Internships
    const priya = alumni[0];
    const amit = alumni[1];
    const neha = alumni[2];
    const rahul = alumni[4];

    const jobsData = [
      {
        title: 'Software Development Intern',
        company: 'Google',
        description: 'Join Google as a Software Engineering Intern. You will work on real engineering challenges across search, cloud, and core systems under senior mentorship. Open to 3rd and final year undergraduate students.',
        opportunityType: 'Internship',
        workMode: 'Hybrid',
        location: 'Bengaluru, Karnataka',
        skillsRequired: ['Data Structures', 'Algorithms', 'C++', 'Java', 'Python'],
        experienceLevel: 'Intern',
        salaryRange: '₹50,000 / month',
        applicationUrl: 'https://careers.google.com/students',
        applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        postedBy: rahul._id,
        approvalStatus: 'APPROVED'
      },
      {
        title: 'SDE - 1 (New Graduate 2026)',
        company: 'Microsoft',
        description: 'We are hiring entry-level Software Engineers for Azure Core and Office 365 engineering divisions. Candidates should have a strong foundation in OOP, problem solving, and API design.',
        opportunityType: 'Full-time',
        workMode: 'On-site',
        location: 'Hyderabad, Telangana',
        skillsRequired: ['C#', 'Java', 'Data Structures', 'System Design', 'Cloud Computing'],
        experienceLevel: 'Entry Level (0-1 yrs)',
        salaryRange: '₹14 - 18 LPA',
        applicationUrl: 'https://careers.microsoft.com',
        applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        postedBy: priya._id,
        approvalStatus: 'APPROVED'
      },
      {
        title: 'Data Analyst Intern',
        company: 'TCS Research',
        description: 'Opportunity to work with research teams on exploratory data analysis, business metric forecasting, and visualization dashboards using Python and Tableau.',
        opportunityType: 'Internship',
        workMode: 'Hybrid',
        location: 'Pune, Maharashtra',
        skillsRequired: ['Python', 'SQL', 'Tableau', 'Excel', 'Pandas'],
        experienceLevel: 'Intern',
        salaryRange: '₹30,000 / month',
        applicationUrl: 'https://www.tcs.com/careers',
        applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        postedBy: neha._id,
        approvalStatus: 'APPROVED'
      },
      {
        title: 'Full Stack Engineer (Node.js & React)',
        company: 'Zomato',
        description: 'Building high-performance food delivery order dispatch systems. Requires strong JavaScript/TypeScript skills and experience with caching layers like Redis.',
        opportunityType: 'Full-time',
        workMode: 'Hybrid',
        location: 'Gurugram, Haryana',
        skillsRequired: ['Node.js', 'React', 'MongoDB', 'Redis', 'Docker'],
        experienceLevel: '1-3 Years',
        salaryRange: '₹16 - 22 LPA',
        applicationUrl: 'https://www.zomato.com/careers',
        applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        postedBy: amit._id,
        approvalStatus: 'APPROVED'
      },
      {
        title: 'Graduate Engineer Trainee (GET)',
        company: 'Tata Motors',
        description: 'Recruiting for powertrain engineering, EV telemetry, and manufacturing automation. Open to Mechanical, Electrical, and Automobile engineering graduates.',
        opportunityType: 'Full-time',
        workMode: 'On-site',
        location: 'Pune, Maharashtra',
        skillsRequired: ['CAD', 'MATLAB', 'Automotive Systems', 'Thermodynamics'],
        experienceLevel: 'Entry Level',
        salaryRange: '₹6.5 - 8.5 LPA',
        applicationUrl: 'https://tatamotors.com/careers',
        applicationDeadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        postedBy: alumni[5]._id,
        approvalStatus: 'PENDING'
      }
    ];

    const jobs = await Job.insertMany(jobsData);
    console.log(`💼 Created ${jobs.length} job postings.`);

    // 5. Create Events
    const eventsData = [
      {
        title: 'Annual Alumni Homecoming & Networking Meet 2026',
        description: 'Reunite with your classmates, faculty, and industry leaders. Keynote sessions on emerging technology trends, interactive student roundtables, and formal dinner.',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        startTime: '09:30 AM',
        endTime: '05:00 PM',
        location: 'College Main Auditorium & Campus Lawns',
        eventMode: 'Hybrid',
        meetingUrl: 'https://meet.google.com/alm-meet-2026',
        organizer: 'College Alumni Association & TPO',
        registrationDeadline: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        capacity: 350,
        approvalStatus: 'APPROVED',
        createdBy: admin._id
      },
      {
        title: 'Cracking Product Company Placements: Roadmap & Mock Interviews',
        description: 'Interactive webinar hosted by alumni at Microsoft, Google, and Amazon. Learn high-frequency DSA patterns, behavioral framing with the STAR technique, and resume optimization.',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        startTime: '06:00 PM',
        endTime: '08:00 PM',
        location: 'Virtual Video Conference',
        eventMode: 'Online',
        meetingUrl: 'https://meet.google.com/prd-plac-guid',
        organizer: 'CSE Alumni Network Chapter',
        registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000),
        capacity: 500,
        approvalStatus: 'APPROVED',
        createdBy: priya._id
      },
      {
        title: 'Tech Talk: System Architecture & Large-Scale Microservices',
        description: 'Deep dive into event-driven architecture, database sharding, and fault tolerance at scale. Followed by a 30-minute open Q&A with tech leads.',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        startTime: '04:00 PM',
        endTime: '06:00 PM',
        location: 'Seminar Hall 2 & Live Stream',
        eventMode: 'Hybrid',
        meetingUrl: 'https://meet.google.com/sys-arch-live',
        organizer: 'Alumni Tech Forum',
        registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        capacity: 200,
        approvalStatus: 'APPROVED',
        createdBy: amit._id
      }
    ];

    const events = await Event.insertMany(eventsData);
    console.log(`📅 Created ${events.length} campus networking events.`);

    // 6. Create Mentorship Requests
    const rohan = students[0];
    const sneha = students[1];

    await MentorshipRequest.create({
      studentId: rohan._id,
      alumniId: priya._id,
      topic: 'Placement Preparation',
      message: 'Hi Priya Ma\'am, I am a third-year CSE student preparing for summer placements. Would love to get your guidance on DSA roadmap and resume feedback. Thank you!',
      preferredMode: 'Online',
      preferredTime: 'Saturday Evenings (IST)',
      status: 'ACCEPTED',
      responseNote: 'Happy to connect! Let us review your resume and practice a 45-min coding interview round on Google Meet.'
    });

    await MentorshipRequest.create({
      studentId: sneha._id,
      alumniId: amit._id,
      topic: 'DSA & Coding Interviews',
      message: 'Hello Amit Sir, I am preparing for product company rounds and would appreciate pointers on Graph and DP problem solving strategies.',
      preferredMode: 'Online',
      preferredTime: 'Sunday 11:00 AM',
      status: 'PENDING'
    });

    // 7. Event Registrations
    await EventRegistration.create({
      eventId: events[0]._id,
      userId: rohan._id,
      status: 'REGISTERED'
    });

    await EventRegistration.create({
      eventId: events[1]._id,
      userId: rohan._id,
      status: 'REGISTERED'
    });

    // 8. Bookmarks
    await Bookmark.create({
      userId: rohan._id,
      jobId: jobs[0]._id
    });
    await Bookmark.create({
      userId: rohan._id,
      jobId: jobs[1]._id
    });

    // 9. Notifications
    await Notification.create({
      userId: rohan._id,
      title: 'Mentorship Request Accepted! 🎉',
      message: 'Priya Sharma accepted your request for "Placement Preparation". Check mentorship section for response details.',
      type: 'MENTORSHIP_ACCEPTED',
      link: '/mentorship'
    });

    await Notification.create({
      userId: priya._id,
      title: 'New Mentorship Request',
      message: 'Rohan Sharma sent you a mentorship request for Placement Preparation.',
      type: 'MENTORSHIP_RECEIVED',
      link: '/mentorship'
    });

    await Notification.create({
      userId: rohan._id,
      title: 'Event Registration Confirmed',
      message: 'You are registered for "Annual Alumni Homecoming & Networking Meet 2026".',
      type: 'EVENT_REGISTERED',
      link: '/events'
    });

    // 10. Sample Contact Message
    await ContactMessage.create({
      name: 'Dr. Anita Deshmukh',
      email: 'anita.deshmukh@partnercollege.ac.in',
      subject: 'Alumni Network Partnership & Faculty Exchange',
      message: 'We are keen to integrate our annual tech symposium with the alumni directory network. Looking forward to connecting with the admin team.'
    });

    console.log('✅ Seed completed successfully with realistic Indian college alumni, students, events, and jobs!');
    console.log('\n======================================================');
    console.log('🔑 SAMPLE DEMO CREDENTIALS (FOR DEVELOPMENT/TESTING):');
    console.log('   Admin   : admin@college.edu       / Admin@123456');
    console.log('   Alumni  : priya.sharma@microsoft.com / Alumni@123');
    console.log('   Student : rohan.student@college.edu / Student@123');
    console.log('======================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error while seeding database:', error);
    process.exit(1);
  }
};

// If executed directly from CLI: node server/services/seedService.js
if (process.argv[1]?.endsWith('seedService.js')) {
  seedDatabase();
}
