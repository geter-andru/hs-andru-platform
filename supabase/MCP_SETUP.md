# Supabase MCP Server Setup

## Step 1: Get Your Supabase Personal Access Token

1. Go to https://supabase.com/dashboard/account/tokens
2. Click **Generate new token**
3. Give it a name like "MCP Server"
4. Copy the token (you won't see it again!)

## Step 2: Update MCP Configuration

### For Project-Specific Setup (.mcp.json)
Update the `.mcp.json` file in this project root with your token:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=molcqjsqtjbfclasynpg"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
      }
    }
  }
}
```

### For Global Claude Code Setup
Add to `~/.config/claude-code/mcp_servers.json`:

```json
{
  "supabase": {
    "command": "npx",
    "args": [
      "-y", 
      "@supabase/mcp-server-supabase@latest",
      "--project-ref=molcqjsqtjbfclasynpg"
    ],
    "env": {
      "SUPABASE_ACCESS_TOKEN": "YOUR_TOKEN_HERE"
    }
  }
}
```

## Step 3: Test the MCP Server

After restarting Claude Code, you should have access to these Supabase tools:

### Database Operations
- `supabase_list_tables` - List all tables
- `supabase_query` - Execute SQL queries
- `supabase_insert` - Insert data
- `supabase_update` - Update records
- `supabase_delete` - Delete records
- `supabase_select` - Query data

### Storage Operations
- `supabase_list_buckets` - List storage buckets
- `supabase_upload_file` - Upload files
- `supabase_download_file` - Download files
- `supabase_delete_file` - Delete files

### Auth Operations
- `supabase_list_users` - List auth users
- `supabase_create_user` - Create new user
- `supabase_update_user` - Update user
- `supabase_delete_user` - Delete user

### Functions
- `supabase_invoke_function` - Call Edge Functions
- `supabase_list_functions` - List Edge Functions

## Available MCP Commands After Setup

```bash
# List all tables
supabase_list_tables()

# Query profiles table
supabase_query("SELECT * FROM profiles WHERE waitlist_status = 'pending'")

# Update user status
supabase_update(
  table="profiles",
  match={"email": "user@example.com"},
  data={"waitlist_status": "approved"}
)

# Insert new profile
supabase_insert(
  table="profiles",
  data={
    "email": "newuser@example.com",
    "full_name": "New User",
    "waitlist_status": "pending"
  }
)
```

## Security Notes

⚠️ **IMPORTANT**: 
- Never commit your personal access token to git
- Add `.mcp.json` to `.gitignore` if it contains your token
- Consider using environment variables for the token

## Alternative: Environment Variable Setup

Instead of hardcoding the token, use an environment variable:

1. Add to your shell profile (`~/.zshrc` or `~/.bashrc`):
```bash
export SUPABASE_ACCESS_TOKEN="your-token-here"
```

2. Update `.mcp.json` to use the environment variable:
```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase@latest",
        "--project-ref=molcqjsqtjbfclasynpg"
      ]
    }
  }
}
```

The MCP server will automatically use the `SUPABASE_ACCESS_TOKEN` from your environment.

## Project Details

- **Project Reference**: `molcqjsqtjbfclasynpg`
- **Project URL**: https://molcqjsqtjbfclasynpg.supabase.co
- **Dashboard**: https://supabase.com/dashboard/project/molcqjsqtjbfclasynpg