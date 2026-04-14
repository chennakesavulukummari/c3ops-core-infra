# Managing Multiple GitHub Profiles on macOS

This guide explains how to set up and manage two GitHub profiles on the same machine.

## Overview

You have 2 GitHub profiles:
1. **Personal Account**: `chennakesavulukummari`
2. **Organization Account**: `c3ops`

Each account needs its own SSH key and Git configuration.

---

## Step 1: Generate SSH Keys (If Not Already Done)

### 1.1 Generate SSH Key for Personal Account (chennakesavulukummari)
```bash
ssh-keygen -t ed25519 -C "your-personal-email@example.com" -f ~/.ssh/id_github_personal
```
- Press Enter twice (no passphrase recommended for CI/CD)
- Creates: `~/.ssh/id_github_personal` (private key)
- Creates: `~/.ssh/id_github_personal.pub` (public key)

### 1.2 Generate SSH Key for c3ops Organization
```bash
ssh-keygen -t ed25519 -C "info@c3ops.io" -f ~/.ssh/id_github_c3ops
```
- Press Enter twice (no passphrase)
- Creates: `~/.ssh/id_github_c3ops` (private key)
- Creates: `~/.ssh/id_github_c3ops.pub` (public key)

### 1.3 Verify SSH Keys
```bash
ls -la ~/.ssh/id_github_*
```
Should show:
```
id_github_c3ops
id_github_c3ops.pub
id_github_personal
id_github_personal.pub
```

---

## Step 2: Add SSH Public Keys to GitHub

### 2.1 Add Personal Account Key
```bash
# Copy personal public key
cat ~/.ssh/id_github_personal.pub

# Go to https://github.com/settings/keys
# Click "New SSH key"
# Paste the public key
# Title: "MacBook Personal"
# Key type: Authentication Key
# Click "Add SSH key"
```

### 2.2 Add c3ops Organization Key
```bash
# Copy c3ops public key
cat ~/.ssh/id_github_c3ops.pub

# Go to https://github.com/organizations/c3ops/settings/keys
# (or ask organization admin if you don't have access)
# Click "New SSH key"
# Paste the public key
# Title: "MacBook c3ops"
# Key type: Authentication Key
# Click "Add SSH key"
```

---

## Step 3: Configure SSH Config File

### 3.1 Edit SSH Config
```bash
nano ~/.ssh/config
```

### 3.2 Add Configuration for Both Profiles
```
# Personal GitHub Account
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_github_personal
    IdentitiesOnly yes

# C3OPS GitHub Organization
Host github.com-c3ops
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_github_c3ops
    IdentitiesOnly yes
```

### 3.3 Save and Exit
- Press `Ctrl + X`
- Press `Y` to confirm
- Press `Enter` to save

### 3.4 Set Proper Permissions
```bash
chmod 600 ~/.ssh/config
```

---

## Step 4: Configure Git Global Settings

### 4.1 Set Default User (Optional)
```bash
# This is your default account
git config --global user.name "Kesav"
git config --global user.email "your-personal-email@example.com"
```

---

## Step 5: Clone or Update Repositories

### 5.1 Clone Personal Repository
```bash
# Use github.com-personal alias
git clone git@github.com-personal:chennakesavulukummari/your-repo.git
cd your-repo
```

### 5.2 Clone c3ops Repository
```bash
# Use github.com-c3ops alias
git clone git@github.com-c3ops:c3ops/c3ops-website.git
cd c3ops-website
```

---

## Step 6: Set Per-Repository Git Config (Optional)

For extra safety, you can set Git user per repository:

### 6.1 For Personal Repository
```bash
cd ~/path/to/personal-repo
git config user.name "Kesav"
git config user.email "your-personal-email@example.com"
```

### 6.2 For c3ops Repository
```bash
cd ~/path/to/c3ops-website
git config user.name "c3ops"
git config user.email "info@c3ops.io"
```

### 6.3 Verify Per-Repository Config
```bash
git config user.name
git config user.email
```

---

## Step 7: Test SSH Connections

### 7.1 Test Personal Account
```bash
ssh -T git@github.com-personal
```
Expected output:
```
Hi chennakesavulukummari! You've successfully authenticated, but GitHub does not provide shell access.
```

### 7.2 Test c3ops Organization
```bash
ssh -T git@github.com-c3ops
```
Expected output:
```
Hi c3ops! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## Step 8: Update Existing Repository Remote URLs

If you already have a repo cloned with the wrong remote URL:

### 8.1 Check Current Remote
```bash
git remote -v
```

### 8.2 Update Remote for Personal Account
```bash
git remote set-url origin git@github.com-personal:chennakesavulukummari/repo-name.git
```

### 8.3 Update Remote for c3ops Organization
```bash
git remote set-url origin git@github.com-c3ops:c3ops/c3ops-website.git
```

### 8.4 Verify Remote Updated
```bash
git remote -v
```

---

## Step 9: Push/Pull from Both Accounts

### 9.1 Push to Personal Account
```bash
cd ~/path/to/personal-repo
git push origin main
# Uses id_github_personal SSH key automatically
```

### 9.2 Push to c3ops Organization
```bash
cd ~/path/to/c3ops-website
git push origin live
# Uses id_github_c3ops SSH key automatically
```

---

## Troubleshooting

### Problem: "Permission denied (publickey)"

**Solution 1: Check SSH key is added to ssh-agent**
```bash
# Start ssh-agent
eval "$(ssh-agent -s)"

# Add personal key
ssh-add ~/.ssh/id_github_personal

# Add c3ops key
ssh-add ~/.ssh/id_github_c3ops

# Verify keys are loaded
ssh-add -l
```

**Solution 2: Check SSH config syntax**
```bash
# Verify config file is valid
ssh -v git@github.com-personal
# Look for errors in output
```

**Solution 3: Check public keys are on GitHub**
```bash
# Check personal account keys
curl https://api.github.com/users/chennakesavulukummari/keys

# Check c3ops organization keys
curl https://api.github.com/orgs/c3ops/teams
```

### Problem: Wrong Account Being Used

**Solution: Force specific SSH key**
```bash
# Test with verbose output
ssh -vT git@github.com-c3ops
# Should show "Trying private key ~/.ssh/id_github_c3ops"
```

### Problem: Git Commits Show Wrong Name

**Solution: Check repository config**
```bash
# Check global config
git config --global user.name
git config --global user.email

# Check repository config
cd /path/to/repo
git config user.name
git config user.email

# If wrong, update:
git config user.name "c3ops"
git config user.email "info@c3ops.io"
```

---

## Quick Reference

### SSH Hosts Configured
```
github.com-personal  → Uses id_github_personal key
github.com-c3ops     → Uses id_github_c3ops key
```

### Clone Commands
```bash
# Personal repository
git clone git@github.com-personal:USERNAME/REPO.git

# c3ops repository
git clone git@github.com-c3ops:c3ops/REPO.git
```

### Test Commands
```bash
# Test personal connection
ssh -T git@github.com-personal

# Test c3ops connection
ssh -T git@github.com-c3ops
```

### Update Existing Repository
```bash
# For personal repo
git remote set-url origin git@github.com-personal:USERNAME/REPO.git

# For c3ops repo
git remote set-url origin git@github.com-c3ops:c3ops/REPO.git
```

---

## Your Current Setup (As of March 19, 2026)

### SSH Keys Available
```
~/.ssh/id_github_personal      (your personal account)
~/.ssh/id_github_c3ops         (c3ops organization account)
```

### SSH Config Configured
```
Host github.com-personal
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_github_personal
    IdentitiesOnly yes

Host github.com-c3ops
    HostName github.com
    User git
    IdentityFile ~/.ssh/id_github_c3ops
    IdentitiesOnly yes
```

### Repository Configuration
```
/Users/ck/c3ops-repos/c3ops-website
├── Remote: git@github.com-c3ops:c3ops/c3ops-website.git
├── User: c3ops
└── Email: info@c3ops.io
```

---

## Tips & Best Practices

### ✅ DO:
- Use different SSH keys for different accounts
- Test SSH connection after setup
- Set per-repository Git user config
- Use meaningful host aliases (github.com-personal, github.com-c3ops)
- Keep SSH keys in ~/.ssh with 600 permissions
- Document your setup for team members

### ❌ DON'T:
- Share private SSH keys
- Use same key for multiple accounts
- Store passwords in git config
- Commit SSH keys to repositories
- Use generic SSH key names (hard to remember which is which)

---

## Additional Resources

- GitHub SSH Documentation: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- SSH Config Manual: `man ssh_config`
- GitHub SSH Key Types: https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent

---

**Last Updated**: March 19, 2026  
**Status**: ✅ Working (Both profiles configured and tested)
