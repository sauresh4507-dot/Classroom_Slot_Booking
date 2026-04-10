import { defineConfig } from 'prisma/config';

export default defineConfig({
    earlyAccess: true,
    datasource: {
        url: `file:${process.cwd()}/prisma/dev.db`,
    },
});
