# MIGRATION GUIDE: Moving to Monorepo Structure

This guide explains how to move your existing ARYA Design System files into the monorepo structure.

## Step 1: Understanding the Current Layout

Your current structure has all files in the root directory. We need to move them into `packages/arya-design-system/`.

## Step 2: What to Move

### Source Files
```
FROM: /src/*                    → TO: /packages/arya-design-system/src/*
FROM: /public/*                 → TO: /packages/arya-design-system/public/*
FROM: /index.html               → TO: /packages/arya-design-system/index.html
FROM: /.eslintrc.cjs            → TO: /packages/arya-design-system/.eslintrc.cjs
```

### Configuration Files
```
FROM: /vite.config.ts                   → TO: /packages/arya-design-system/vite.config.ts
FROM: /tsconfig.json                    → TO: /packages/arya-design-system/tsconfig.json
FROM: /tsconfig.node.json               → TO: /packages/arya-design-system/tsconfig.node.json
```

### Docker Files (Keep in Root, but symlink for arya)
```
/Dockerfile                     (Update to use packages/arya-design-system context)
/Dockerfile.prod                (Update to use packages/arya-design-system context)
/nginx.conf                     (Stays in root)
/docker-compose.yml             (Update for both services)
/docker-compose.prod.yml        (Update for both services)
```

## Step 3: Manual Steps Required

Since moving files via command-line tools is complex, you have these options:

### Option A: Using VS Code (Recommended)
1. Create the directory structure in VS Code
2. Select files/folders in the root (src/, public/, etc.)
3. Drag and drop to `packages/arya-design-system/`
4. Update imports in moved files

### Option B: Using Terminal
```bash
# Navigate to workspace root
cd /Users/keyur/AI\ Projects/ARYA\ Design\ System

# Copy source files
cp -r src packages/arya-design-system/
cp -r public packages/arya-design-system/
cp index.html packages/arya-design-system/
cp vite.config.ts packages/arya-design-system/
cp tsconfig.json packages/arya-design-system/
cp tsconfig.node.json packages/arya-design-system/
cp .eslintrc.cjs packages/arya-design-system/

# Optionally remove from root (keep backup first!)
# rm -rf src public index.html vite.config.ts tsconfig.json tsconfig.node.json
```

### Option C: Keep Files in Root with Symlinks
If you prefer not to move files:
```bash
cd packages/arya-design-system
ln -s ../../src src
ln -s ../../public public
ln -s ../../index.html index.html
# etc...
```

## Step 4: Copy .gitignore and Config Files to packages

```bash
cp .eslintrc.cjs packages/empsurvey/
cp .gitignore packages/arya-design-system/
cp .gitignore packages/empsurvey/
```

## Step 5: Update package-lock.json

After moving files, clean reinstall dependencies:
```bash
# Remove old lock file
rm package-lock.json

# Reinstall with workspace support
npm install
```

## Verification Steps

After migrating:

1. **Check structure:**
   ```bash
   ls -la packages/arya-design-system/src
   ls -la packages/empsurvey/src
   ```

2. **Verify packages are linked:**
   ```bash
   npm ls
   ```

3. **Test dev servers:**
   ```bash
   npm run dev:arya   # Should start on :5173
   npm run dev:survey # Should start on :5174
   ```

4. **Test Docker build:**
   ```bash
   docker build -f Dockerfile -t arya-design-system:latest ./packages/arya-design-system
   ```

## Troubleshooting

### "Cannot find module" errors
- Verify all imports use correct relative paths from new location
- Update path aliases in each package's tsconfig.json

### Docker build fails
- Update COPY command in Dockerfile to reference `packages/arya-design-system/`
- Verify nginx.conf path references are correct

### Dev server won't start
- Ensure vite.config.ts is in the correct package directory
- Check that index.html points to correct main.tsx location
- Verify port assignments (5173 for arya, 5174 for survey)

## Final Check

Your repository should look like this after migration:

```
ARYA-Monorepo/
├── packages/
│   ├── arya-design-system/
│   │   ├── src/               ← MOVED FILES
│   │   ├── public/            ← MOVED FILES
│   │   ├── index.html         ← MOVED FILE
│   │   ├── vite.config.ts     ← MOVED FILE
│   │   ├── tsconfig.json      ← MOVED FILE
│   │   ├── package.json       ← CREATED
│   │   └── ...
│   └── empsurvey/
│       ├── src/               ← NEW
│       ├── index.html         ← CREATED
│       └── ...
├── db/
│   └── init/
│       └── 01-schema.sql
├── Dockerfile                 ← UPDATE CONTEXT
├── Dockerfile.prod            ← UPDATE CONTEXT
├── docker-compose.yml         ← UPDATE FOR BOTH SERVICES
├── docker-compose.prod.yml    ← UPDATE FOR BOTH SERVICES
├── package.json               ← UPDATED
└── MONOREPO.md               ← THIS FILE
```

Once complete, both apps share the same database but run independently!
