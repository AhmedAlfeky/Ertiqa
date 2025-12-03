# 🌱 Database Seeding Instructions

This guide will help you populate your database with 30 sample courses, complete with units, video lessons, and quizzes.

## Prerequisites

1. **Supabase Service Role Key** (required for seeding)
2. **Instructor account** (must be logged in)
3. **tsx** package (already installed)

## Step 1: Get Your Service Role Key

1. Go to **Supabase Dashboard**
2. Navigate to **Settings** → **API**
3. Copy your **service_role key** (under "Project API keys")
   - ⚠️ **Keep this secret!** Don't commit to git

## Step 2: Set Environment Variables

Add to your `.env.local`:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## Step 3: Login as Instructor

Before running the seed script, you must be logged in:

1. Go to `http://localhost:3000/en/login`
2. Login with an **instructor account**
3. The script will use your logged-in session

## Step 4: Run the Seed Script

```bash
npm run seed
```

## What Gets Created:

### 📚 **25 Courses** covering:
- Web Development
- Data Science
- UI/UX Design
- Mobile Apps
- Digital Marketing
- Cloud Computing
- AI & Machine Learning
- Game Development
- And more...

### Each Course Includes:

#### **3 Units** per course:
1. Introduction and Getting Started
2. Core Concepts (with quiz)
3. Practical Projects

#### **Lessons** per unit:
- **2-3 video lessons** per unit
- **1 quiz** in Unit 2
- **Bilingual content** (Arabic & English)
- **Video duration** between 5-45 minutes
- **Free preview** lessons in Unit 1

#### **Quizzes** include:
- **2 questions** per quiz
- **4 options** per question
- **1 correct answer** marked
- **Passing score** of 70%

### Course Details:

- ✅ **Titles** in Arabic and English
- ✅ **Subtitles** in both languages
- ✅ **Descriptions** in both languages
- ✅ **Real cover images** from Unsplash
- ✅ **Prices** ranging from FREE to $199.99
- ✅ **Different levels** (Beginner, Intermediate, Advanced)
- ✅ **Categories** rotated
- ✅ **Published status** (every 3rd course is published)

## Expected Output:

```bash
🌱 Starting course seeding...
👤 Using instructor: noordragon2004@gmail.com

📚 Creating course 1: Complete Web Development Bootcamp
✅ Course created: 1
  📦 Unit 1 created
    🎥 Video lesson created: Welcome to the Course
    🎥 Video lesson created: Installation and Setup
  📦 Unit 2 created
    🎥 Video lesson created: Basic Principles
    🎥 Video lesson created: Advanced Concepts
    📝 Quiz lesson created
  📦 Unit 3 created
    🎥 Video lesson created: Project 1: Beginner Level
    🎥 Video lesson created: Project 2: Intermediate Level
✅ Course 1/25 complete with 3 units

... (continues for 25 courses)

🎉 Seeding completed!
```

## Verify in Database:

After seeding, check your Supabase dashboard:

```sql
-- Check courses
SELECT COUNT(*) FROM courses;
-- Should show 25

-- Check units
SELECT COUNT(*) FROM course_units;
-- Should show 75 (25 courses × 3 units)

-- Check lessons
SELECT COUNT(*) FROM lessons;
-- Should show 150+ (video lessons + quizzes)

-- Check quiz questions
SELECT COUNT(*) FROM quiz_questions;
-- Should show 50 (25 courses × 1 quiz × 2 questions)
```

## Clean Up (Optional):

To remove all seeded data:

```sql
-- Delete all courses (cascades to units, lessons, quizzes)
DELETE FROM courses WHERE instructor_id = 'your-instructor-id';
```

## Troubleshooting:

### "No authenticated user"
- Make sure you're logged in to the app first
- The script uses your session to create courses

### "User is not an instructor"
- Your account needs `is_instructor = true` in `user_profiles`
- Run the `FIX_SIGNUP_TRIGGER.sql` script

### Permission errors
- Make sure `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check RLS policies on tables

## Notes:

- Video URLs are placeholders (won't actually play)
- To use real videos, replace URLs in the script
- Cover images are from Unsplash (free to use)
- All data is bilingual (Arabic/English)
- Courses are spread across different levels and categories

Enjoy your populated database! 🚀

