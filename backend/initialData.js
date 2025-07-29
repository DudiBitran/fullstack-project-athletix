const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { User } = require('./model/user');
const { Trainer } = require('./model/trainer');
const { Exercise } = require('./model/exercise');
const { Program } = require('./model/program');

// Sample data for initial population
const initialData = {
  admins: [
    {
      firstName: 'Admin',
      lastName: 'Johnson',
      email: 'admin.johnson@athletix.com',
      password: 'Admin1234!',
      role: 'admin',
      age: 35,
      gender: 'male',
      image: null
    },
    {
      firstName: 'Sarah',
      lastName: 'Admin',
      email: 'sarah.admin@athletix.com',
      password: 'Admin1234!',
      role: 'admin',
      age: 32,
      gender: 'female',
      image: null
    }
  ],
  
  trainers: [
    {
      user: {
        firstName: 'Mike',
        lastName: 'Thompson',
        email: 'mike.thompson@athletix.com',
        password: 'Trainer1234!',
        role: 'trainer',
        age: 28,
        gender: 'male',
        image: null
      },
      trainer: {
        specialization: 'Strength Training & Bodybuilding',
        experience: 8,
        bio: 'Certified personal trainer with 8 years of experience in strength training and bodybuilding. Specializes in helping clients build muscle mass and improve overall strength.'
      }
    },
    {
      user: {
        firstName: 'Lisa',
        lastName: 'Chen',
        email: 'lisa.chen@athletix.com',
        password: 'Trainer1234!',
        role: 'trainer',
        age: 26,
        gender: 'female',
        image: null
      },
      trainer: {
        specialization: 'Cardio & Weight Loss',
        experience: 6,
        bio: 'Fitness expert specializing in cardiovascular training and weight loss programs. Passionate about helping clients achieve their fitness goals through sustainable lifestyle changes.'
      }
    },
    {
      user: {
        firstName: 'David',
        lastName: 'Martinez',
        email: 'david.martinez@athletix.com',
        password: 'Trainer1234!',
        role: 'trainer',
        age: 30,
        gender: 'male',
        image: null
      },
      trainer: {
        specialization: 'Functional Training & Sports Performance',
        experience: 10,
        bio: 'Former professional athlete turned trainer with 10 years of experience in functional training and sports performance. Focuses on improving athletic performance and injury prevention.'
      }
    }
  ],

  users: [
    {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@email.com',
      password: 'User1234!',
      role: 'user',
      age: 25,
      gender: 'male'
    },
    {
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.wilson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 23,
      gender: 'female'
    },
    {
      firstName: 'Michael',
      lastName: 'Brown',
      email: 'michael.brown@email.com',
      password: 'User1234!',
      role: 'user',
      age: 29,
      gender: 'male'
    },
    {
      firstName: 'Jessica',
      lastName: 'Davis',
      email: 'jessica.davis@email.com',
      password: 'User1234!',
      role: 'user',
      age: 27,
      gender: 'female'
    },
    {
      firstName: 'Christopher',
      lastName: 'Miller',
      email: 'christopher.miller@email.com',
      password: 'User1234!',
      role: 'user',
      age: 31,
      gender: 'male'
    },
    {
      firstName: 'Amanda',
      lastName: 'Garcia',
      email: 'amanda.garcia@email.com',
      password: 'User1234!',
      role: 'user',
      age: 24,
      gender: 'female'
    },
    {
      firstName: 'Daniel',
      lastName: 'Rodriguez',
      email: 'daniel.rodriguez@email.com',
      password: 'User1234!',
      role: 'user',
      age: 26,
      gender: 'male'
    },
    {
      firstName: 'Sophia',
      lastName: 'Anderson',
      email: 'sophia.anderson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 22,
      gender: 'female'
    },
    {
      firstName: 'Matthew',
      lastName: 'Taylor',
      email: 'matthew.taylor@email.com',
      password: 'User1234!',
      role: 'user',
      age: 28,
      gender: 'male'
    },
    {
      firstName: 'Olivia',
      lastName: 'Thomas',
      email: 'olivia.thomas@email.com',
      password: 'User1234!',
      role: 'user',
      age: 25,
      gender: 'female'
    },
    // Additional available users
    {
      firstName: 'Alex',
      lastName: 'Johnson',
      email: 'alex.johnson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 30,
      gender: 'male'
    },
    {
      firstName: 'Sarah',
      lastName: 'Williams',
      email: 'sarah.williams@email.com',
      password: 'User1234!',
      role: 'user',
      age: 26,
      gender: 'female'
    },
    {
      firstName: 'David',
      lastName: 'Jones',
      email: 'david.jones@email.com',
      password: 'User1234!',
      role: 'user',
      age: 33,
      gender: 'male'
    },
    {
      firstName: 'Emily',
      lastName: 'Brown',
      email: 'emily.brown@email.com',
      password: 'User1234!',
      role: 'user',
      age: 24,
      gender: 'female'
    },
    {
      firstName: 'James',
      lastName: 'Davis',
      email: 'james.davis@email.com',
      password: 'User1234!',
      role: 'user',
      age: 27,
      gender: 'male'
    },
    {
      firstName: 'Lisa',
      lastName: 'Miller',
      email: 'lisa.miller@email.com',
      password: 'User1234!',
      role: 'user',
      age: 29,
      gender: 'female'
    },
    {
      firstName: 'Robert',
      lastName: 'Wilson',
      email: 'robert.wilson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 35,
      gender: 'male'
    },
    {
      firstName: 'Jennifer',
      lastName: 'Moore',
      email: 'jennifer.moore@email.com',
      password: 'User1234!',
      role: 'user',
      age: 28,
      gender: 'female'
    },
    {
      firstName: 'William',
      lastName: 'Taylor',
      email: 'william.taylor@email.com',
      password: 'User1234!',
      role: 'user',
      age: 32,
      gender: 'male'
    },
    {
      firstName: 'Ashley',
      lastName: 'Anderson',
      email: 'ashley.anderson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 25,
      gender: 'female'
    },
    {
      firstName: 'Thomas',
      lastName: 'Thomas',
      email: 'thomas.thomas@email.com',
      password: 'User1234!',
      role: 'user',
      age: 31,
      gender: 'male'
    },
    {
      firstName: 'Nicole',
      lastName: 'Jackson',
      email: 'nicole.jackson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 26,
      gender: 'female'
    },
    {
      firstName: 'Charles',
      lastName: 'Martin',
      email: 'charles.martin@email.com',
      password: 'User1234!',
      role: 'user',
      age: 34,
      gender: 'male'
    },
    {
      firstName: 'Amanda',
      lastName: 'Lee',
      email: 'amanda.lee@email.com',
      password: 'User1234!',
      role: 'user',
      age: 23,
      gender: 'female'
    },
    {
      firstName: 'Joseph',
      lastName: 'Perez',
      email: 'joseph.perez@email.com',
      password: 'User1234!',
      role: 'user',
      age: 29,
      gender: 'male'
    },
    {
      firstName: 'Stephanie',
      lastName: 'Thompson',
      email: 'stephanie.thompson@email.com',
      password: 'User1234!',
      role: 'user',
      age: 27,
      gender: 'female'
    },
    {
      firstName: 'Andrew',
      lastName: 'White',
      email: 'andrew.white@email.com',
      password: 'User1234!',
      role: 'user',
      age: 30,
      gender: 'male'
    },
    {
      firstName: 'Laura',
      lastName: 'Harris',
      email: 'laura.harris@email.com',
      password: 'User1234!',
      role: 'user',
      age: 24,
      gender: 'female'
    },
    {
      firstName: 'Ryan',
      lastName: 'Clark',
      email: 'ryan.clark@email.com',
      password: 'User1234!',
      role: 'user',
      age: 28,
      gender: 'male'
    },
    {
      firstName: 'Michelle',
      lastName: 'Lewis',
      email: 'michelle.lewis@email.com',
      password: 'User1234!',
      role: 'user',
      age: 26,
      gender: 'female'
    }
  ],

  exercises: {
         // Mike Thompson's exercises (Strength Training)
     mike: [
       {
         name: 'Barbell Squat',
         description: 'Compound lower body exercise targeting quadriceps, hamstrings, and glutes',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 8,
         restSeconds: 120,
         notes: 'Focus on proper form and depth'
       },
             {
         name: 'Deadlift',
         description: 'Full body compound exercise for building strength and muscle',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 5,
         restSeconds: 180,
         notes: 'Keep back straight, drive through heels'
       },
             {
         name: 'Bench Press',
         description: 'Classic upper body pushing exercise for chest development',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 8,
         restSeconds: 120,
         notes: 'Control the descent, explode on the press'
       },
       {
         name: 'Overhead Press',
         description: 'Shoulder press exercise for building upper body strength',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 8,
         restSeconds: 90,
         notes: 'Keep core tight, avoid arching back'
       },
       {
         name: 'Bent Over Row',
         description: 'Back exercise for building thickness and strength',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 10,
         restSeconds: 90,
         notes: 'Squeeze shoulder blades together'
       },
       {
         name: 'Pull-ups',
         description: 'Bodyweight exercise for upper back and biceps',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 8,
         restSeconds: 120,
         notes: 'Full range of motion, control the descent'
       },
       {
         name: 'Dumbbell Curls',
         description: 'Isolation exercise for biceps development',
         category: 'Strength',
         difficulty: 'Beginner',
         sets: 3,
         reps: 12,
         restSeconds: 60,
         notes: 'Keep elbows at sides, avoid swinging'
       },
       {
         name: 'Tricep Dips',
         description: 'Bodyweight exercise for triceps and chest',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 10,
         restSeconds: 90,
         notes: 'Keep body close to bars'
       },
       {
         name: 'Leg Press',
         description: 'Machine exercise for quadriceps and glutes',
         category: 'Strength',
         difficulty: 'Beginner',
         sets: 3,
         reps: 12,
         restSeconds: 120,
         notes: 'Full range of motion, don\'t lock knees'
       },
       {
         name: 'Calf Raises',
         description: 'Isolation exercise for calf development',
         category: 'Strength',
         difficulty: 'Beginner',
         sets: 3,
         reps: 15,
         restSeconds: 60,
         notes: 'Full stretch and contraction'
       }
    ],

         // Lisa Chen's exercises (Cardio & Weight Loss)
     lisa: [
       {
         name: 'Burpees',
         description: 'Full body cardio exercise for burning calories',
         category: 'Cardio',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 10,
         restSeconds: 60,
         notes: 'Maintain good form throughout'
       },
             {
         name: 'Mountain Climbers',
         description: 'Dynamic cardio exercise for core and legs',
         category: 'Cardio',
         difficulty: 'Beginner',
         sets: 3,
         reps: 20,
         restSeconds: 45,
         notes: 'Keep core engaged throughout'
       },
       {
         name: 'Jumping Jacks',
         description: 'Classic cardio exercise for warming up',
         category: 'Cardio',
         difficulty: 'Beginner',
         sets: 3,
         reps: 30,
         restSeconds: 30,
         notes: 'Good warm-up exercise'
       },
       {
         name: 'High Knees',
         description: 'Running in place with high knee lift',
         category: 'Cardio',
         difficulty: 'Beginner',
         sets: 3,
         reps: 30,
         restSeconds: 45,
         notes: 'Lift knees as high as possible'
       },
       {
         name: 'Plank',
         description: 'Core stability exercise',
         category: 'Balance',
         difficulty: 'Beginner',
         sets: 3,
         reps: 1,
         restSeconds: 60,
         notes: 'Hold for 30-60 seconds per set'
       },
       {
         name: 'Russian Twists',
         description: 'Rotational core exercise',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 20,
         restSeconds: 45,
         notes: 'Rotate fully from side to side'
       },
       {
         name: 'Lunges',
         description: 'Unilateral leg exercise for balance and strength',
         category: 'Strength',
         difficulty: 'Beginner',
         sets: 3,
         reps: 12,
         restSeconds: 60,
         notes: 'Alternate legs, keep chest up'
       },
       {
         name: 'Push-ups',
         description: 'Bodyweight chest and triceps exercise',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 10,
         restSeconds: 60,
         notes: 'Full body tension, proper form'
       },
       {
         name: 'Squats',
         description: 'Bodyweight leg exercise',
         category: 'Strength',
         difficulty: 'Beginner',
         sets: 3,
         reps: 15,
         restSeconds: 60,
         notes: 'Sit back as if sitting in a chair'
       },
       {
         name: 'Jump Rope',
         description: 'Cardio exercise for coordination and endurance',
         category: 'Cardio',
         difficulty: 'Beginner',
         sets: 3,
         reps: 1,
         restSeconds: 60,
         notes: 'Jump for 2-3 minutes per set'
       }
    ],

         // David Martinez's exercises (Functional Training)
     david: [
       {
         name: 'Kettlebell Swing',
         description: 'Explosive hip hinge movement for power development',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 15,
         restSeconds: 90,
         notes: 'Focus on hip hinge, not squat'
       },
             {
         name: 'Turkish Get-up',
         description: 'Complex movement for mobility and stability',
         category: 'Balance',
         difficulty: 'Advanced',
         sets: 3,
         reps: 5,
         restSeconds: 120,
         notes: 'Slow and controlled movement'
       },
       {
         name: 'Box Jumps',
         description: 'Plyometric exercise for power and explosiveness',
         category: 'Cardio',
         difficulty: 'Advanced',
         sets: 3,
         reps: 8,
         restSeconds: 120,
         notes: 'Land softly, step down don\'t jump'
       },
       {
         name: 'Medicine Ball Slams',
         description: 'Explosive throwing exercise for power',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 12,
         restSeconds: 90,
         notes: 'Full extension, explosive movement'
       },
       {
         name: 'Battle Ropes',
         description: 'Cardio and strength exercise using heavy ropes',
         category: 'Cardio',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 1,
         restSeconds: 90,
         notes: '30-60 seconds per set'
       },
       {
         name: 'TRX Rows',
         description: 'Suspension training for back strength',
         category: 'Strength',
         difficulty: 'Intermediate',
         sets: 3,
         reps: 12,
         restSeconds: 90,
         notes: 'Keep body straight, squeeze shoulder blades'
       },
       {
         name: 'Pistol Squats',
         description: 'Single-leg squat for balance and strength',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 6,
         restSeconds: 120,
         notes: 'Keep extended leg off ground'
       },
       {
         name: 'Handstand Push-ups',
         description: 'Advanced shoulder exercise against wall',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 5,
         restSeconds: 120,
         notes: 'Practice handstand holds first'
       },
       {
         name: 'Muscle-ups',
         description: 'Advanced pull-up to dip transition',
         category: 'Strength',
         difficulty: 'Advanced',
         sets: 3,
         reps: 3,
         restSeconds: 180,
         notes: 'Master pull-ups and dips first'
       },
       {
         name: 'L-sit',
         description: 'Static hold for core and shoulder strength',
         category: 'Balance',
         difficulty: 'Advanced',
         sets: 3,
         reps: 1,
         restSeconds: 120,
         notes: 'Hold for 10-30 seconds per set'
       }
    ]
  },

     programs: {
     // Mike Thompson's programs (Strength Training)
     mike: [
       {
         title: 'Beginner Strength Foundation',
         description: 'Perfect for those new to strength training. Focuses on learning proper form and building basic strength.',
         difficulty: 'beginner',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
             {
         title: 'Intermediate Bodybuilding',
         description: 'Designed for intermediate lifters looking to build muscle mass and improve overall physique.',
         difficulty: 'intermediate',
         durationWeeks: 12,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Advanced Powerlifting',
         description: 'Advanced program focusing on the three main lifts: squat, bench press, and deadlift.',
         difficulty: 'advanced',
         durationWeeks: 16,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Upper Body Focus',
         description: 'Specialized program targeting chest, back, shoulders, and arms for upper body development.',
         difficulty: 'intermediate',
         durationWeeks: 10,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Lower Body Power',
         description: 'Intensive lower body program for building leg strength and power.',
         difficulty: 'intermediate',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Full Body Strength',
         description: 'Comprehensive full body program for overall strength development.',
         difficulty: 'beginner',
         durationWeeks: 6,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       }
    ],

         // Lisa Chen's programs (Cardio & Weight Loss)
     lisa: [
       {
         title: 'Weight Loss Kickstart',
         description: 'High-intensity cardio program designed for maximum calorie burn and weight loss.',
         difficulty: 'intermediate',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
             {
         title: 'Cardio Endurance',
         description: 'Build cardiovascular endurance and stamina with this progressive cardio program.',
         difficulty: 'intermediate',
         durationWeeks: 10,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'HIIT Fat Burner',
         description: 'High-Intensity Interval Training program for maximum fat burning and metabolic boost.',
         difficulty: 'advanced',
         durationWeeks: 6,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Core & Cardio',
         description: 'Combination program focusing on core strength and cardiovascular fitness.',
         difficulty: 'beginner',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Beginner Fitness',
         description: 'Perfect for fitness beginners looking to establish healthy exercise habits.',
         difficulty: 'beginner',
         durationWeeks: 4,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Active Recovery',
         description: 'Low-impact program focused on recovery, flexibility, and maintaining fitness.',
         difficulty: 'beginner',
         durationWeeks: 6,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       }
    ],

         // David Martinez's programs (Functional Training)
     david: [
       {
         title: 'Athletic Performance',
         description: 'Advanced program designed to improve athletic performance, power, and explosiveness.',
         difficulty: 'advanced',
         durationWeeks: 12,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
             {
         title: 'Functional Strength',
         description: 'Movement-based program focusing on real-world strength and mobility.',
         difficulty: 'intermediate',
         durationWeeks: 10,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'CrossFit Style',
         description: 'High-intensity functional fitness program inspired by CrossFit methodology.',
         difficulty: 'advanced',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Mobility & Movement',
         description: 'Focus on improving mobility, flexibility, and movement quality.',
         difficulty: 'beginner',
         durationWeeks: 6,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Power Development',
         description: 'Explosive training program for developing power and speed.',
         difficulty: 'advanced',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       },
       {
         title: 'Injury Prevention',
         description: 'Preventive program focusing on stability, balance, and injury prevention.',
         difficulty: 'beginner',
         durationWeeks: 8,
         days: [
           { day: 'Monday', exercises: [] },
           { day: 'Tuesday', exercises: [] },
           { day: 'Wednesday', exercises: [] },
           { day: 'Thursday', exercises: [] },
           { day: 'Friday', exercises: [] },
           { day: 'Saturday', exercises: [] },
           { day: 'Sunday', exercises: [] }
         ]
       }
    ]
  }
};

// Function to populate database with initial data
async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Clear existing data
    await User.deleteMany({});
    await Trainer.deleteMany({});
    await Exercise.deleteMany({});
    await Program.deleteMany({});

    console.log('Cleared existing data');

    // Create admins
    const adminUsers = [];
    for (const adminData of initialData.admins) {
      const hashedPassword = await bcrypt.hash(adminData.password, 14);
      const admin = new User({
        ...adminData,
        password: hashedPassword
      });
      await admin.save();
      adminUsers.push(admin);
      console.log(`Created admin: ${admin.firstName} ${admin.lastName}`);
    }

    // Create trainers and their profiles
    const trainerUsers = [];
    for (const trainerData of initialData.trainers) {
      const hashedPassword = await bcrypt.hash(trainerData.user.password, 14);
      const trainerUser = new User({
        ...trainerData.user,
        password: hashedPassword
      });
      await trainerUser.save();
      
      const trainerProfile = new Trainer({
        ...trainerData.trainer,
        userId: trainerUser._id
      });
      await trainerProfile.save();
      
      trainerUsers.push(trainerUser);
      console.log(`Created trainer: ${trainerUser.firstName} ${trainerUser.lastName}`);
    }

    // Create regular users
    const regularUsers = [];
    for (const userData of initialData.users) {
      const hashedPassword = await bcrypt.hash(userData.password, 14);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      await user.save();
      regularUsers.push(user);
      console.log(`Created user: ${user.firstName} ${user.lastName}`);
    }

    // Create exercises for each trainer
    const trainerExerciseMap = {
      mike: trainerUsers[0],
      lisa: trainerUsers[1],
      david: trainerUsers[2]
    };

         const allExercises = [];
     for (const [trainerKey, trainerUser] of Object.entries(trainerExerciseMap)) {
       const exercises = initialData.exercises[trainerKey];
       for (const exerciseData of exercises) {
         const exercise = new Exercise({
           ...exerciseData,
           createdBy: trainerUser._id,
           updatedBy: trainerUser._id
         });
         await exercise.save();
         allExercises.push(exercise);
         console.log(`Created exercise: ${exercise.name} for ${trainerUser.firstName}`);
       }
     }

    // Create programs for each trainer
    const trainerProgramMap = {
      mike: trainerUsers[0],
      lisa: trainerUsers[1],
      david: trainerUsers[2]
    };

    const allPrograms = [];
    for (const [trainerKey, trainerUser] of Object.entries(trainerProgramMap)) {
      const programs = initialData.programs[trainerKey];
      for (const programData of programs) {
        const program = new Program({
          ...programData,
          trainer: trainerUser._id
        });
        await program.save();
        allPrograms.push(program);
                 console.log(`Created program: ${program.title} for ${trainerUser.firstName}`);
      }
    }

         // Assign some users to trainers and programs
     // Assign first 3 users to Mike (strength training)
     for (let i = 0; i < 3; i++) {
       if (regularUsers[i] && trainerUsers[0]) {
         regularUsers[i].assignedTrainerId = trainerUsers[0]._id;
         await regularUsers[i].save();
         
         // Assign to a program
         const program = allPrograms[i];
         if (program) {
           regularUsers[i].programs.push(program._id);
           await regularUsers[i].save();
           
           program.assignedTo = regularUsers[i]._id;
           await program.save();
         }
       }
     }

         // Assign next 3 users to Lisa (cardio)
     for (let i = 3; i < 6; i++) {
       if (regularUsers[i] && trainerUsers[1]) {
         regularUsers[i].assignedTrainerId = trainerUsers[1]._id;
         await regularUsers[i].save();
         
         const program = allPrograms[i + 6]; // Lisa's programs start at index 6
         if (program) {
           regularUsers[i].programs.push(program._id);
           await regularUsers[i].save();
           
           program.assignedTo = regularUsers[i]._id;
           await program.save();
         }
       }
     }

         // Assign last 4 users to David (functional training)
     for (let i = 6; i < 10; i++) {
       if (regularUsers[i] && trainerUsers[2]) {
         regularUsers[i].assignedTrainerId = trainerUsers[2]._id;
         await regularUsers[i].save();
         
         const program = allPrograms[i + 12]; // David's programs start at index 12
         if (program) {
           regularUsers[i].programs.push(program._id);
           await regularUsers[i].save();
           
           program.assignedTo = regularUsers[i]._id;
           await program.save();
         }
       }
     }

         // Update trainer profiles with client assignments
     for (let i = 0; i < trainerUsers.length; i++) {
       const trainerProfile = await Trainer.findOne({ userId: trainerUsers[i]._id });
       if (trainerProfile) {
         const assignedUsers = regularUsers.filter(user => user.assignedTrainerId?.equals(trainerUsers[i]._id));
         trainerProfile.clients = assignedUsers.map(user => user._id);
         await trainerProfile.save();
       }
     }

    console.log('\n=== Database Population Complete ===');
    console.log(`Created ${adminUsers.length} admins`);
    console.log(`Created ${trainerUsers.length} trainers`);
    console.log(`Created ${regularUsers.length} users`);
    console.log(`Created ${allExercises.length} exercises`);
    console.log(`Created ${allPrograms.length} programs`);
         console.log('\n=== Sample Login Credentials ===');
     console.log('Admin: admin.johnson@athletix.com / Admin1234!');
     console.log('Trainer: mike.thompson@athletix.com / Trainer1234!');
     console.log('User: john.smith@email.com / User1234!');

  } catch (error) {
    console.error('Error populating database:', error);
    throw error;
  }
}

// Export the function for use in other files
module.exports = { populateDatabase, initialData };

// If this file is run directly, populate the database
if (require.main === module) {
  // Connect to MongoDB (you'll need to set up your connection string)
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/athletix';
  
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('Connected to MongoDB');
      return populateDatabase();
    })
    .then(() => {
      console.log('Database population completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Failed to populate database:', error);
      process.exit(1);
    });
} 