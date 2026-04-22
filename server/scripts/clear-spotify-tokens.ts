import { prisma } from "../src/lib/prisma";

async function main() {
  const result = await prisma.user.updateMany({
    data: { spotifyAccessToken: null },
  });
  console.log(`Cleared spotifyAccessToken for ${result.count} user(s).`);
  console.log("Users must now re-click 'Connect Spotify' to get a fresh token with updated scopes.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
