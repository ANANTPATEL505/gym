import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.booking.deleteMany()
  await prisma.schedule.deleteMany()
  await prisma.gymClass.deleteMany()
  await prisma.trainer.deleteMany()
  await prisma.member.deleteMany()
  await prisma.contact.deleteMany()

  // ─── Trainers ───
  const trainers = await Promise.all([
    prisma.trainer.create({
      data: {
        name: 'Jake Morrison',
        email: 'jake@ironpeak.com',
        phone: '+1-555-0201',
        specialty: ['Powerlifting', 'Strength', 'Olympic Lifting'],
        bio: 'Former Division I athlete and NSCA-certified coach with 12 years of experience.',
        experience: 12,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80',
      },
    }),
    prisma.trainer.create({
      data: {
        name: 'Maya Patel',
        email: 'maya@ironpeak.com',
        phone: '+1-555-0202',
        specialty: ['HIIT', 'Metabolic Conditioning', 'Sprint Training'],
        bio: 'High-energy coach with a background in competitive athletics.',
        experience: 8,
        rating: 4.8,
        image: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=600&q=80',
      },
    }),
    prisma.trainer.create({
      data: {
        name: 'Sarah Kim',
        email: 'sarah@ironpeak.com',
        phone: '+1-555-0203',
        specialty: ['Vinyasa Yoga', 'Mindfulness', 'Flexibility'],
        bio: 'With 10 years of yoga teaching and a 500hr RYT certification.',
        experience: 10,
        rating: 5.0,
        image: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=600&q=80',
      },
    }),
    prisma.trainer.create({
      data: {
        name: 'Carlos Rivera',
        email: 'carlos@ironpeak.com',
        specialty: ['CrossFit', 'Functional Fitness', 'Kettlebell'],
        bio: 'CrossFit Level 3 coach and former competitive CrossFit athlete.',
        experience: 9,
        rating: 4.9,
        image: 'https://images.unsplash.com/photo-1567013127542-490d757e6349?w=600&q=80',
      },
    }),
  ])

  const [jake, maya, sarah, carlos] = trainers

  // ─── Classes ───
  const classes = await Promise.all([
    prisma.gymClass.create({
      data: {
        name: 'Strength Training',
        description: 'Progressive overload-based strength program targeting all major muscle groups.',
        trainerId: jake.id,
        maxSpots: 12,
        duration: 60,
        category: 'STRENGTH',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
      },
    }),
    prisma.gymClass.create({
      data: {
        name: 'HIIT Cardio Blast',
        description: 'High-intensity interval training that torches calories.',
        trainerId: maya.id,
        maxSpots: 15,
        duration: 45,
        category: 'CARDIO',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
      },
    }),
    prisma.gymClass.create({
      data: {
        name: 'Yoga & Flexibility',
        description: 'A blend of power yoga and deep stretching.',
        trainerId: sarah.id,
        maxSpots: 20,
        duration: 75,
        category: 'YOGA',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
      },
    }),
    prisma.gymClass.create({
      data: {
        name: 'CrossFit WOD',
        description: 'Daily Workout of the Day featuring functional movements at high intensity.',
        trainerId: carlos.id,
        maxSpots: 10,
        duration: 60,
        category: 'CROSSFIT',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80',
      },
    }),
  ])

  const [strengthClass, hiitClass, yogaClass, crossfitClass] = classes

  // ─── Schedules ───
  await Promise.all([
    // Strength: Mon, Wed, Fri 6am
    prisma.schedule.create({ data: { classId: strengthClass.id, dayOfWeek: 1, startTime: '06:00', endTime: '07:00' } }),
    prisma.schedule.create({ data: { classId: strengthClass.id, dayOfWeek: 3, startTime: '06:00', endTime: '07:00' } }),
    prisma.schedule.create({ data: { classId: strengthClass.id, dayOfWeek: 5, startTime: '06:00', endTime: '07:00' } }),
    // HIIT: Tue, Thu 7am
    prisma.schedule.create({ data: { classId: hiitClass.id, dayOfWeek: 2, startTime: '07:00', endTime: '07:45' } }),
    prisma.schedule.create({ data: { classId: hiitClass.id, dayOfWeek: 4, startTime: '07:00', endTime: '07:45' } }),
    // Yoga: Daily 8am
    ...([0, 1, 2, 3, 4, 5, 6].map(d =>
      prisma.schedule.create({ data: { classId: yogaClass.id, dayOfWeek: d, startTime: '08:00', endTime: '09:15' } })
    )),
    // CrossFit: Mon-Sat 5pm
    ...([1, 2, 3, 4, 5, 6].map(d =>
      prisma.schedule.create({ data: { classId: crossfitClass.id, dayOfWeek: d, startTime: '17:00', endTime: '18:00' } })
    )),
  ])

  // ─── Members ───
  const members = await Promise.all([
    prisma.member.create({ data: { name: 'Alex Turner', email: 'alex@example.com', phone: '+1-555-0101', plan: 'PRO', status: 'ACTIVE' } }),
    prisma.member.create({ data: { name: 'Lisa Park', email: 'lisa@example.com', phone: '+1-555-0102', plan: 'ELITE', status: 'ACTIVE' } }),
    prisma.member.create({ data: { name: 'David Wilson', email: 'david@example.com', plan: 'STARTER', status: 'ACTIVE' } }),
    prisma.member.create({ data: { name: 'Emma Stone', email: 'emma@example.com', plan: 'PRO', status: 'ACTIVE' } }),
    prisma.member.create({ data: { name: 'James Lee', email: 'james@example.com', plan: 'STARTER', status: 'ACTIVE' } }),
    prisma.member.create({ data: { name: 'Maria Garcia', email: 'maria@example.com', plan: 'ELITE', status: 'ACTIVE' } }),
  ])

  // ─── Bookings ───
  await Promise.all([
    prisma.booking.create({ data: { classId: strengthClass.id, memberId: members[0].id, date: new Date(), status: 'CONFIRMED' } }),
    prisma.booking.create({ data: { classId: yogaClass.id, memberId: members[1].id, date: new Date(), status: 'CONFIRMED' } }),
    prisma.booking.create({ data: { classId: crossfitClass.id, guestName: 'John Guest', guestEmail: 'guest@example.com', date: new Date(), status: 'CONFIRMED' } }),
    prisma.booking.create({ data: { classId: hiitClass.id, memberId: members[2].id, date: new Date(), status: 'WAITLISTED' } }),
  ])

  // ─── Contacts ───
  await Promise.all([
    prisma.contact.create({ data: { name: 'Sarah Connor', email: 'sarah.c@example.com', message: 'Interested in Elite membership. Can I get a tour?', status: 'UNREAD' } }),
    prisma.contact.create({ data: { name: 'John Matrix', email: 'john.m@example.com', message: 'Do you offer corporate wellness packages for teams of 20+?', status: 'READ' } }),
    prisma.contact.create({ data: { name: 'Kyle Reese', email: 'kyle@example.com', message: 'What are the personal training rates for Pro members?', status: 'REPLIED' } }),
  ])

  console.log('✅ Seeding complete!')
  console.log(`  → ${trainers.length} trainers`)
  console.log(`  → ${classes.length} classes`)
  console.log(`  → ${members.length} members`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())