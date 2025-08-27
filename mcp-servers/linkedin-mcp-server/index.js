#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';

class LinkedInMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'linkedin-mcp-server-local',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.browser = null;
    this.page = null;
    this.isAuthenticated = false;

    this.setupToolHandlers();
  }

  async initializeBrowser() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: process.env.LINKEDIN_HEADLESS !== 'false',
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });
    }

    if (!this.page) {
      this.page = await this.browser.newPage();
      await this.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
      
      // Set cookies if provided
      const cookieString = process.env.LINKEDIN_COOKIE;
      if (cookieString && cookieString !== 'PLACEHOLDER_COOKIE_VALUE') {
        await this.setCookiesFromString(cookieString);
      }
    }
  }

  async setCookiesFromString(cookieString) {
    const cookies = cookieString.split(';').map(cookie => {
      const [name, ...valueParts] = cookie.trim().split('=');
      return {
        name: name.trim(),
        value: valueParts.join('=').trim(),
        domain: '.linkedin.com',
        path: '/'
      };
    }).filter(cookie => cookie.name && cookie.value);

    if (cookies.length > 0) {
      await this.page.setCookie(...cookies);
      this.isAuthenticated = true;
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_profiles',
            description: 'Search for LinkedIn profiles by keywords and filters',
            inputSchema: {
              type: 'object',
              properties: {
                keywords: { type: 'string', description: 'Search keywords' },
                location: { type: 'string', description: 'Location filter' },
                industry: { type: 'string', description: 'Industry filter' },
                current_company: { type: 'string', description: 'Current company filter' },
                limit: { type: 'number', description: 'Maximum results to return', default: 10, maximum: 50 }
              },
              required: ['keywords']
            }
          },
          {
            name: 'get_profile',
            description: 'Get detailed information about a specific LinkedIn profile',
            inputSchema: {
              type: 'object',
              properties: {
                profile_url: { type: 'string', description: 'LinkedIn profile URL' },
                include_posts: { type: 'boolean', description: 'Include recent posts', default: false }
              },
              required: ['profile_url']
            }
          },
          {
            name: 'search_companies',
            description: 'Search for LinkedIn company pages',
            inputSchema: {
              type: 'object',
              properties: {
                keywords: { type: 'string', description: 'Company search keywords' },
                industry: { type: 'string', description: 'Industry filter' },
                location: { type: 'string', description: 'Location filter' },
                size: { type: 'string', description: 'Company size filter' },
                limit: { type: 'number', description: 'Maximum results', default: 10, maximum: 50 }
              },
              required: ['keywords']
            }
          },
          {
            name: 'get_company',
            description: 'Get detailed information about a specific company',
            inputSchema: {
              type: 'object',
              properties: {
                company_url: { type: 'string', description: 'LinkedIn company page URL' },
                include_posts: { type: 'boolean', description: 'Include recent posts', default: false }
              },
              required: ['company_url']
            }
          },
          {
            name: 'get_job_postings',
            description: 'Search for job postings on LinkedIn',
            inputSchema: {
              type: 'object',
              properties: {
                keywords: { type: 'string', description: 'Job search keywords' },
                location: { type: 'string', description: 'Location filter' },
                company: { type: 'string', description: 'Company filter' },
                experience_level: { 
                  type: 'string', 
                  enum: ['internship', 'entry_level', 'associate', 'mid_senior', 'director', 'executive'],
                  description: 'Experience level filter' 
                },
                job_type: {
                  type: 'string',
                  enum: ['full_time', 'part_time', 'contract', 'temporary', 'volunteer', 'internship'],
                  description: 'Job type filter'
                },
                limit: { type: 'number', description: 'Maximum results', default: 10, maximum: 50 }
              },
              required: ['keywords']
            }
          },
          {
            name: 'send_connection_request',
            description: 'Send a connection request to a LinkedIn profile',
            inputSchema: {
              type: 'object',
              properties: {
                profile_url: { type: 'string', description: 'LinkedIn profile URL' },
                message: { type: 'string', description: 'Personal message (optional)' }
              },
              required: ['profile_url']
            }
          },
          {
            name: 'get_feed_posts',
            description: 'Get recent posts from LinkedIn feed',
            inputSchema: {
              type: 'object',
              properties: {
                limit: { type: 'number', description: 'Maximum posts to retrieve', default: 20, maximum: 100 }
              }
            }
          },
          {
            name: 'check_authentication',
            description: 'Check if LinkedIn authentication is working',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        await this.initializeBrowser();

        switch (request.params.name) {
          case 'search_profiles':
            return await this.searchProfiles(request.params.arguments);
          
          case 'get_profile':
            return await this.getProfile(request.params.arguments);
          
          case 'search_companies':
            return await this.searchCompanies(request.params.arguments);
          
          case 'get_company':
            return await this.getCompany(request.params.arguments);
          
          case 'get_job_postings':
            return await this.getJobPostings(request.params.arguments);
          
          case 'send_connection_request':
            return await this.sendConnectionRequest(request.params.arguments);
          
          case 'get_feed_posts':
            return await this.getFeedPosts(request.params.arguments);
          
          case 'check_authentication':
            return await this.checkAuthentication(request.params.arguments);
          
          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof McpError) {
          throw error;
        }
        
        throw new McpError(
          ErrorCode.InternalError,
          `LinkedIn error: ${error.message}`
        );
      }
    });
  }

  async checkAuthentication(args) {
    await this.page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle0' });
    
    const currentUrl = this.page.url();
    const isLoggedIn = !currentUrl.includes('/login') && !currentUrl.includes('/checkpoint');
    
    if (isLoggedIn) {
      this.isAuthenticated = true;
      
      // Try to get user info
      const userInfo = await this.page.evaluate(() => {
        const nameElement = document.querySelector('.feed-identity-module__member-photo img');
        const name = nameElement ? nameElement.alt : null;
        return { name, authenticated: true };
      });
      
      return {
        content: [{
          type: 'text',
          text: `LinkedIn authentication successful!\nUser: ${userInfo.name || 'Unknown'}\nStatus: Authenticated`
        }]
      };
    } else {
      this.isAuthenticated = false;
      return {
        content: [{
          type: 'text',
          text: 'LinkedIn authentication failed. Please check your LINKEDIN_COOKIE environment variable.'
        }]
      };
    }
  }

  async searchProfiles(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { keywords, location, industry, current_company, limit = 10 } = args;
    
    let searchUrl = `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}`;
    
    if (location) {
      searchUrl += `&geoUrn=${encodeURIComponent(location)}`;
    }
    if (industry) {
      searchUrl += `&industryCompany=${encodeURIComponent(industry)}`;
    }
    if (current_company) {
      searchUrl += `&currentCompany=${encodeURIComponent(current_company)}`;
    }

    await this.page.goto(searchUrl, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    const profiles = await this.page.evaluate((maxResults) => {
      const results = [];
      const profileElements = document.querySelectorAll('.search-result__wrapper');
      
      for (let i = 0; i < Math.min(profileElements.length, maxResults); i++) {
        const element = profileElements[i];
        
        const nameEl = element.querySelector('.search-result__result-link');
        const titleEl = element.querySelector('.subline-level-1');
        const locationEl = element.querySelector('.subline-level-2');
        const linkEl = element.querySelector('a[href*="/in/"]');
        
        if (nameEl && linkEl) {
          results.push({
            name: nameEl.textContent?.trim() || '',
            title: titleEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            profile_url: linkEl.href || ''
          });
        }
      }
      
      return results;
    }, limit);

    return {
      content: [{
        type: 'text',
        text: `Found ${profiles.length} profiles:\n\n${JSON.stringify(profiles, null, 2)}`
      }]
    };
  }

  async getProfile(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { profile_url, include_posts = false } = args;
    
    await this.page.goto(profile_url, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    const profileData = await this.page.evaluate((includePosts) => {
      const data = {};
      
      // Basic info
      const nameEl = document.querySelector('.text-heading-xlarge');
      const titleEl = document.querySelector('.text-body-medium.break-words');
      const locationEl = document.querySelector('.text-body-small.inline.t-black--light.break-words');
      const aboutEl = document.querySelector('.display-flex.full-width [data-generated-suggestion-target]');
      
      data.name = nameEl?.textContent?.trim() || '';
      data.title = titleEl?.textContent?.trim() || '';
      data.location = locationEl?.textContent?.trim() || '';
      data.about = aboutEl?.textContent?.trim() || '';
      
      // Experience
      const experienceElements = document.querySelectorAll('.pvs-list__paged-list-item');
      data.experience = [];
      
      experienceElements.forEach(exp => {
        const titleEl = exp.querySelector('.mr1.hoverable-link-text.t-bold span[aria-hidden="true"]');
        const companyEl = exp.querySelector('.t-14.t-normal span[aria-hidden="true"]');
        const durationEl = exp.querySelector('.pvs-entity__caption-wrapper span[aria-hidden="true"]');
        
        if (titleEl) {
          data.experience.push({
            title: titleEl.textContent?.trim() || '',
            company: companyEl?.textContent?.trim() || '',
            duration: durationEl?.textContent?.trim() || ''
          });
        }
      });
      
      if (includePosts) {
        // Recent posts (if visible)
        const postElements = document.querySelectorAll('.feed-shared-update-v2');
        data.recent_posts = [];
        
        postElements.forEach(post => {
          const contentEl = post.querySelector('.feed-shared-text span[dir="ltr"]');
          const timeEl = post.querySelector('.feed-shared-actor__sub-description');
          
          if (contentEl) {
            data.recent_posts.push({
              content: contentEl.textContent?.trim() || '',
              time: timeEl?.textContent?.trim() || ''
            });
          }
        });
      }
      
      return data;
    }, include_posts);

    return {
      content: [{
        type: 'text',
        text: `Profile data retrieved:\n\n${JSON.stringify(profileData, null, 2)}`
      }]
    };
  }

  async searchCompanies(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { keywords, industry, location, size, limit = 10 } = args;
    
    let searchUrl = `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(keywords)}`;
    
    if (industry) {
      searchUrl += `&companyIndustry=${encodeURIComponent(industry)}`;
    }
    if (location) {
      searchUrl += `&companyHqGeo=${encodeURIComponent(location)}`;
    }
    if (size) {
      searchUrl += `&companySize=${encodeURIComponent(size)}`;
    }

    await this.page.goto(searchUrl, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    const companies = await this.page.evaluate((maxResults) => {
      const results = [];
      const companyElements = document.querySelectorAll('.search-result__wrapper');
      
      for (let i = 0; i < Math.min(companyElements.length, maxResults); i++) {
        const element = companyElements[i];
        
        const nameEl = element.querySelector('.search-result__result-link');
        const industryEl = element.querySelector('.subline-level-1');
        const locationEl = element.querySelector('.subline-level-2');
        const linkEl = element.querySelector('a[href*="/company/"]');
        
        if (nameEl && linkEl) {
          results.push({
            name: nameEl.textContent?.trim() || '',
            industry: industryEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            company_url: linkEl.href || ''
          });
        }
      }
      
      return results;
    }, limit);

    return {
      content: [{
        type: 'text',
        text: `Found ${companies.length} companies:\n\n${JSON.stringify(companies, null, 2)}`
      }]
    };
  }

  async getCompany(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { company_url, include_posts = false } = args;
    
    await this.page.goto(company_url, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    const companyData = await this.page.evaluate((includePosts) => {
      const data = {};
      
      // Basic company info
      const nameEl = document.querySelector('.org-top-card-summary__title');
      const industryEl = document.querySelector('.org-top-card-summary__industry');
      const sizeEl = document.querySelector('.org-top-card-summary__company-size');
      const locationEl = document.querySelector('.org-top-card-summary__headquarter');
      const aboutEl = document.querySelector('.org-about-us__description');
      
      data.name = nameEl?.textContent?.trim() || '';
      data.industry = industryEl?.textContent?.trim() || '';
      data.size = sizeEl?.textContent?.trim() || '';
      data.location = locationEl?.textContent?.trim() || '';
      data.about = aboutEl?.textContent?.trim() || '';
      
      if (includePosts) {
        // Recent posts
        const postElements = document.querySelectorAll('.feed-shared-update-v2');
        data.recent_posts = [];
        
        postElements.forEach(post => {
          const contentEl = post.querySelector('.feed-shared-text span[dir="ltr"]');
          const timeEl = post.querySelector('.feed-shared-actor__sub-description');
          
          if (contentEl) {
            data.recent_posts.push({
              content: contentEl.textContent?.trim() || '',
              time: timeEl?.textContent?.trim() || ''
            });
          }
        });
      }
      
      return data;
    }, include_posts);

    return {
      content: [{
        type: 'text',
        text: `Company data retrieved:\n\n${JSON.stringify(companyData, null, 2)}`
      }]
    };
  }

  async getJobPostings(args) {
    const { keywords, location, company, experience_level, job_type, limit = 10 } = args;
    
    let searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}`;
    
    if (location) {
      searchUrl += `&location=${encodeURIComponent(location)}`;
    }
    if (company) {
      searchUrl += `&f_C=${encodeURIComponent(company)}`;
    }
    if (experience_level) {
      const levelMap = {
        'internship': '1',
        'entry_level': '2',
        'associate': '3',
        'mid_senior': '4',
        'director': '5',
        'executive': '6'
      };
      searchUrl += `&f_E=${levelMap[experience_level]}`;
    }
    if (job_type) {
      const typeMap = {
        'full_time': 'F',
        'part_time': 'P',
        'contract': 'C',
        'temporary': 'T',
        'volunteer': 'V',
        'internship': 'I'
      };
      searchUrl += `&f_JT=${typeMap[job_type]}`;
    }

    await this.page.goto(searchUrl, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    const jobs = await this.page.evaluate((maxResults) => {
      const results = [];
      const jobElements = document.querySelectorAll('.job-search-card');
      
      for (let i = 0; i < Math.min(jobElements.length, maxResults); i++) {
        const element = jobElements[i];
        
        const titleEl = element.querySelector('.job-search-card__title a');
        const companyEl = element.querySelector('.job-search-card__subtitle-link');
        const locationEl = element.querySelector('.job-search-card__location');
        const timeEl = element.querySelector('.job-search-card__listdate');
        
        if (titleEl) {
          results.push({
            title: titleEl.textContent?.trim() || '',
            company: companyEl?.textContent?.trim() || '',
            location: locationEl?.textContent?.trim() || '',
            posted_time: timeEl?.textContent?.trim() || '',
            job_url: titleEl.href || ''
          });
        }
      }
      
      return results;
    }, limit);

    return {
      content: [{
        type: 'text',
        text: `Found ${jobs.length} job postings:\n\n${JSON.stringify(jobs, null, 2)}`
      }]
    };
  }

  async sendConnectionRequest(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { profile_url, message = '' } = args;
    
    await this.page.goto(profile_url, { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(2000);

    try {
      // Look for connect button
      const connectButton = await this.page.$('button[data-control-name="connect"]');
      
      if (!connectButton) {
        throw new Error('Connect button not found - user may already be connected or button is not visible');
      }

      await connectButton.click();
      await this.page.waitForTimeout(1000);

      // If there's a message option, add it
      if (message) {
        const addNoteButton = await this.page.$('button[aria-label="Add a note"]');
        if (addNoteButton) {
          await addNoteButton.click();
          await this.page.waitForTimeout(500);
          
          const messageTextarea = await this.page.$('#custom-message');
          if (messageTextarea) {
            await messageTextarea.type(message);
          }
        }
      }

      // Send the connection request
      const sendButton = await this.page.$('button[aria-label="Send invitation"], button[aria-label="Send"]');
      if (sendButton) {
        await sendButton.click();
        await this.page.waitForTimeout(2000);
        
        return {
          content: [{
            type: 'text',
            text: `Connection request sent successfully to ${profile_url}${message ? ' with personal message' : ''}`
          }]
        };
      } else {
        throw new Error('Send button not found');
      }
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `Failed to send connection request: ${error.message}`
        }]
      };
    }
  }

  async getFeedPosts(args) {
    if (!this.isAuthenticated) {
      await this.checkAuthentication({});
      if (!this.isAuthenticated) {
        throw new Error('LinkedIn authentication required');
      }
    }

    const { limit = 20 } = args;
    
    await this.page.goto('https://www.linkedin.com/feed/', { waitUntil: 'networkidle0' });
    await this.page.waitForTimeout(3000);

    // Scroll to load more posts
    for (let i = 0; i < 3; i++) {
      await this.page.evaluate(() => window.scrollBy(0, window.innerHeight));
      await this.page.waitForTimeout(1000);
    }

    const posts = await this.page.evaluate((maxPosts) => {
      const results = [];
      const postElements = document.querySelectorAll('.feed-shared-update-v2');
      
      for (let i = 0; i < Math.min(postElements.length, maxPosts); i++) {
        const element = postElements[i];
        
        const authorEl = element.querySelector('.feed-shared-actor__name');
        const titleEl = element.querySelector('.feed-shared-actor__description');
        const contentEl = element.querySelector('.feed-shared-text span[dir="ltr"]');
        const timeEl = element.querySelector('.feed-shared-actor__sub-description .visually-hidden');
        const likesEl = element.querySelector('.social-counts-reactions__count');
        const commentsEl = element.querySelector('[data-test-id="social-action-comment-text"]');
        
        if (authorEl) {
          results.push({
            author: authorEl.textContent?.trim() || '',
            title: titleEl?.textContent?.trim() || '',
            content: contentEl?.textContent?.trim() || '',
            time: timeEl?.textContent?.trim() || '',
            likes: likesEl?.textContent?.trim() || '0',
            comments: commentsEl?.textContent?.trim() || '0'
          });
        }
      }
      
      return results;
    }, limit);

    return {
      content: [{
        type: 'text',
        text: `Retrieved ${posts.length} feed posts:\n\n${JSON.stringify(posts, null, 2)}`
      }]
    };
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    
    // Handle cleanup on exit
    process.on('SIGINT', async () => {
      await this.cleanup();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      await this.cleanup();
      process.exit(0);
    });

    await this.server.connect(transport);
    console.error('LinkedIn MCP Server running on stdio');
  }
}

const server = new LinkedInMCPServer();
server.run().catch(console.error);