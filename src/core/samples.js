export const DIFF_SAMPLES = [
  {
    id: 'json-api',
    name: 'JSON API Response',
    category: 'API & Data',
    description: 'Compare updated user payload schema, modified values, and added permissions.',
    original: `{
  "status": "success",
  "data": {
    "user": {
      "id": 10482,
      "name": "Sarah Connor",
      "email": "sarah.connor@cyberdyne.io",
      "role": "editor",
      "isActive": true,
      "quota": {
        "storageGB": 50,
        "bandwidthGB": 200
      },
      "preferences": {
        "theme": "light",
        "notifications": true,
        "twoFactorAuth": false
      },
      "tags": ["beta-tester", "internal"]
    }
  },
  "version": "1.4.0"
}`,
    modified: `{
  "status": "success",
  "data": {
    "user": {
      "id": 10482,
      "name": "Sarah J. Connor",
      "email": "sarah.connor@resistance.org",
      "role": "admin",
      "isActive": true,
      "quota": {
        "storageGB": 100,
        "bandwidthGB": 500,
        "apiCalls": 50000
      },
      "preferences": {
        "theme": "system",
        "notifications": false,
        "twoFactorAuth": true
      },
      "tags": ["leader", "vip", "verified"]
    }
  },
  "version": "2.0.0"
}`,
    language: 'json',
  },
  {
    id: 'js-refactor',
    name: 'JavaScript / Async Refactor',
    category: 'Frontend & Backend Code',
    description: 'Callback-based API fetcher refactored to modern async/await with error retry logic.',
    original: `// User Data Service
function fetchUserData(userId, callback) {
  var url = '/api/users/' + userId;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      var data = JSON.parse(xhr.responseText);
      callback(null, data);
    } else {
      callback(new Error('Failed with status: ' + xhr.status));
    }
  };
  
  xhr.onerror = function() {
    callback(new Error('Network error occurred'));
  };
  
  xhr.send();
}

module.exports = {
  fetchUserData: fetchUserData
};`,
    modified: `// User Data Service - Modern Async Implementation with Exponential Backoff
import { apiClient } from '../utils/client';
import { UserCache } from '../cache/userCache';

export async function fetchUserData(userId, options = {}) {
  const { retries = 3, useCache = true } = options;
  
  if (useCache) {
    const cached = await UserCache.get(userId);
    if (cached) return cached;
  }
  
  let attempt = 0;
  while (attempt < retries) {
    try {
      const response = await apiClient.get(\`/api/v2/users/\${userId}\`, {
        timeout: 5000,
      });
      
      const userData = response.data;
      if (useCache) {
        await UserCache.set(userId, userData, { ttl: 3600 });
      }
      return userData;
    } catch (error) {
      attempt++;
      if (attempt >= retries) {
        throw new Error(\`Failed to fetch user \${userId} after \${retries} attempts: \${error.message}\`);
      }
      await new Promise((res) => setTimeout(res, Math.pow(2, attempt) * 200));
    }
  }
}`,
    language: 'javascript',
  },
  {
    id: 'sql-query',
    name: 'SQL Query Optimization',
    category: 'Database',
    description: 'Unindexed slow subquery transformed into optimized CTE with window functions.',
    original: `-- Retrieve top spending customers for Q3
SELECT 
  c.customer_id,
  c.first_name,
  c.last_name,
  (SELECT SUM(o.total_amount) 
   FROM orders o 
   WHERE o.customer_id = c.customer_id 
     AND o.status = 'COMPLETED'
     AND o.created_at BETWEEN '2025-07-01' AND '2025-09-30') AS total_spent,
  (SELECT COUNT(*) 
   FROM orders o 
   WHERE o.customer_id = c.customer_id) AS total_orders
FROM customers c
WHERE c.country = 'US'
ORDER BY total_spent DESC
LIMIT 50;`,
    modified: `-- Retrieve top spending customers for Q3 (Optimized with CTE and Indexes)
WITH quarterly_orders AS (
  SELECT 
    customer_id,
    SUM(total_amount) AS total_spent,
    COUNT(order_id) AS total_orders
  FROM orders
  WHERE status = 'COMPLETED'
    AND created_at >= '2025-07-01'::DATE
    AND created_at < '2025-10-01'::DATE
  GROUP BY customer_id
)
SELECT 
  c.customer_id,
  c.first_name,
  c.last_name,
  c.email,
  COALESCE(qo.total_spent, 0) AS total_spent,
  COALESCE(qo.total_orders, 0) AS total_orders,
  DENSE_RANK() OVER (ORDER BY qo.total_spent DESC) AS spending_rank
FROM customers c
INNER JOIN quarterly_orders qo ON qo.customer_id = c.customer_id
WHERE c.country = 'US'
  AND c.is_active = TRUE
ORDER BY qo.total_spent DESC
LIMIT 50;`,
    language: 'sql',
  },
  {
    id: 'markdown-doc',
    name: 'Changelog / Release Notes',
    category: 'Documentation',
    description: 'Product release notes highlighting new features, breaking changes, and bug fixes.',
    original: `# Release v1.2.0

## Features
- Added dark mode support
- Improved CSV export speed by 20%
- Added basic search filter

## Bug Fixes
- Fixed memory leak in websocket reconnection
- Resolved issue where profile avatar failed to upload

## Contributors
- @john_doe
- @jane_smith`,
    modified: `# Release v2.0.0 - Major Architecture Upgrade 🚀

## Highlights & Breaking Changes ⚠️
- **New Core Engine**: Migrated state synchronization to WebAssembly for 10x throughput.
- **Breaking**: Deprecated legacy v1 authentication endpoints. Use OAuth2 / JWT.

## Features ✨
- Added complete Dark/Light mode theme system with custom CSS tokens.
- Ultra-fast live CSV & JSON diff comparison engine.
- Advanced multi-filter search with regex and whole-word matching.
- Native keyboard shortcuts dialog.

## Bug Fixes 🐛
- Resolved race condition in concurrent document edits.
- Fixed memory leak in persistent WebSocket heartbeat subscriptions.
- Fixed image aspect ratio distortion on mobile viewports.

## Contributors 🎉
- @john_doe
- @jane_smith
- @alex_coder
- @sarah_dev`,
    language: 'markdown',
  },
];
