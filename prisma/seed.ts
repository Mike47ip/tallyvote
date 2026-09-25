import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')
  const hash = await bcrypt.hash('Admin@1234', 10)

  // Superadmin
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@tallyvote.app' },
    update: {},
    create: {
      email: 'superadmin@tallyvote.app',
      passwordHash: hash,
      profile: { create: { role: 'superadmin', fullName: 'TallyVote Super Admin' } },
    },
  })

  // Test org admin user
  const orgAdmin = await prisma.user.upsert({
    where: { email: 'admin@testorg.com' },
    update: {},
    create: { email: 'admin@testorg.com', passwordHash: hash },
  })

  // Test org
  const org = await prisma.organization.upsert({
    where: { slug: 'test-org' },
    update: {},
    create: {
      name: 'Test Organization', slug: 'test-org',
      email: 'admin@testorg.com', plan: 'free',
      isActive: true, ownerId: orgAdmin.id,
    },
  })

  // Org admin profile
  await prisma.profile.upsert({
    where: { id: orgAdmin.id },
    update: {},
    create: { id: orgAdmin.id, role: 'org_admin', orgId: org.id, fullName: 'Test Org Admin' },
  })

  // Voting methods
  const allMethods  = ['qr','shortcode','link','email','sms','ussd'] as const
  const freeMethods = ['qr','shortcode','link']
  for (const method of allMethods) {
    await prisma.orgVotingMethod.upsert({
      where: { orgId_method: { orgId: org.id, method } },
      update: {},
      create: { orgId: org.id, method, enabled: freeMethods.includes(method) },
    })
  }

  // Test election
  const election = await prisma.election.upsert({
    where: { shortCode: 'PRES25' },
    update: {},
    create: {
      orgId: org.id, title: 'Presidential Election 2025',
      status: 'live', anonymous: true, shortCode: 'PRES25',
      startsAt: new Date(),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  // Candidates
  const candidates = [
    { name: 'Ama Owusu',    bio: 'Lead Organizer',    position: 1 },
    { name: 'Kofi Mensah',  bio: 'Community Rep',     position: 2 },
    { name: 'Abena Asante', bio: 'Secretary General', position: 3 },
  ]
  for (const c of candidates) {
    await prisma.candidate.upsert({
      where: { id: `seed-${c.position}` },
      update: {},
      create: { id: `seed-${c.position}`, electionId: election.id, ...c },
    })
  }

  console.log('✅ Superadmin:', superAdmin.email)
  console.log('✅ Test org:', org.name)
  console.log('✅ Test election:', election.title)
  console.log('')
  console.log('🔑 Superadmin  → superadmin@tallyvote.app / Admin@1234')
  console.log('🔑 Test Org    → admin@testorg.com / Admin@1234')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
