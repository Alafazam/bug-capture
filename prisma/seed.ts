import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'alafazam@gmail.com' },
    update: {},
    create: {
      email: 'alafazam@gmail.com',
      name: 'alafazam',
      password: await bcrypt.hash('alafazam', 12),
      role: 'ADMIN',
      bio: 'AI prodcut Manager',
      company: 'Increff',
      jobTitle: 'AI prodcut Manager',
    },
  });

  // Create regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'user',
      password: await bcrypt.hash('user123', 12),
      role: 'USER',
      bio: 'Regular user account',
      company: 'Example Corp',
      jobTitle: 'Developer',
    },
  });

  // Create sample posts
  const posts = await Promise.all([
    prisma.post.upsert({
      where: { id: 'post-1' },
      update: {},
      create: {
        id: 'post-1',
        title: 'Welcome to Bug Capture Platform',
        content: 'This is a sample post created during database seeding for the bug capture platform.',
        published: true,
        authorId: adminUser.id,
      },
    }),
    prisma.post.upsert({
      where: { id: 'post-2' },
      update: {},
      create: {
        id: 'post-2',
        title: 'Getting Started with Bug Capture',
        content: 'Learn how to use the bug capture platform effectively for testing and reporting.',
        published: true,
        authorId: regularUser.id,
      },
    }),
  ]);

  // Create sample files
  const files = await Promise.all([
    prisma.file.upsert({
      where: { id: 'file-1' },
      update: {},
      create: {
        id: 'file-1',
        name: 'sample-document.pdf',
        url: '/uploads/sample-document.pdf',
        size: 1024000, // 1MB
        type: 'application/pdf',
        uploadedBy: adminUser.id,
      },
    }),
    prisma.file.upsert({
      where: { id: 'file-2' },
      update: {},
      create: {
        id: 'file-2',
        name: 'sample-image.jpg',
        url: '/uploads/sample-image.jpg',
        size: 512000, // 512KB
        type: 'image/jpeg',
        uploadedBy: regularUser.id,
      },
    }),
  ]);

  console.log('✅ Database seeded successfully!');
  console.log(`Created ${posts.length} posts`);
  console.log(`Created ${files.length} files`);
  console.log(`Created users: ${adminUser.email}, ${regularUser.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
