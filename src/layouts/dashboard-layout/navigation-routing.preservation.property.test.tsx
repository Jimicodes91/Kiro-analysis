import { topNavData, UserType } from '@/lib/constants';
import { fc, test } from '@fast-check/vitest';
import { describe, expect, it } from 'vitest';

/**
 * Property-Based Tests for Navigation and Routing Preservation
 *
 * **Validates: Requirements 3.4**
 *
 * These tests capture baseline navigation behavior BEFORE implementing
 * role-based UI restrictions (BUG-7). They verify that navigation links
 * work correctly for authorized users, routing to pages functions properly,
 * and sidebar/top navigation render correctly.
 *
 * Property 2: Preservation - Navigation and Routing
 * Tests MUST PASS on UNFIXED code to establish preserved behavior.
 */

// Arbitrary for generating valid user types
const arbUserType = fc.constantFrom<UserType>('CLIENT', 'CONSULTANT', 'ADMIN', 'SUPER_ADMIN');

describe('Navigation Routing Preservation Property Tests (BUG-7)', () => {
  describe('Property 2: Preservation - topNavData defines routes for all user types', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * Property: topNavData SHALL define a non-empty array of navigation routes
     * for every supported user type (CLIENT, CONSULTANT, ADMIN, SUPER_ADMIN).
     */
    test.prop([arbUserType])('topNavData has navigation routes for every user type', (role) => {
      const navLinks = topNavData[role];

      expect(navLinks).toBeDefined();
      expect(Array.isArray(navLinks)).toBe(true);
      expect(navLinks.length).toBeGreaterThan(0);
    });

    it('topNavData contains exactly 4 user type keys', () => {
      const keys = Object.keys(topNavData);
      expect(keys).toHaveLength(4);
      expect(keys).toContain('CLIENT');
      expect(keys).toContain('CONSULTANT');
      expect(keys).toContain('ADMIN');
      expect(keys).toContain('SUPER_ADMIN');
    });
  });

  describe('Property 2: Preservation - Each user type has correct route paths', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * Property: CLIENT routes SHALL include Home, Journey, Tasks, Documents
     */
    it('CLIENT has Home, Journey, Tasks, Documents routes', () => {
      const clientNav = topNavData.CLIENT;
      const titles = clientNav.map((link) => link.title);
      const paths = clientNav.map((link) => link.path);

      expect(clientNav).toHaveLength(5);
      expect(titles).toEqual(['Home', 'Journey', 'Tasks', 'Documents', 'Ask Pylott']);
      expect(paths).toEqual(['/home', '/journey', '/tasks', '/documents', '/ask-pylott']);
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: CONSULTANT routes SHALL include universal routes (Home, Projects, Tasks, Contact, Billing)
     */
    it('CONSULTANT has universal routes (Home, Projects, Tasks, Contact, Billing)', () => {
      const consultantNav = topNavData.CONSULTANT;
      const titles = consultantNav.map((link) => link.title);
      const paths = consultantNav.map((link) => link.path);

      expect(consultantNav).toHaveLength(5);
      expect(titles).toEqual(['Home', 'Projects', 'Tasks', 'Contact', 'Billing']);
      expect(paths).toEqual(['/home', '/projects', '/task', '/contact', '/finance']);
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: ADMIN routes SHALL include universal routes + Admin
     */
    it('ADMIN has universal routes plus Admin', () => {
      const adminNav = topNavData.ADMIN;
      const titles = adminNav.map((link) => link.title);
      const paths = adminNav.map((link) => link.path);

      expect(adminNav).toHaveLength(6);
      // Admin sits third, between Projects and Tasks (matches the sidebar order in the deploy checklist).
      expect(titles).toEqual(['Home', 'Projects', 'Admin', 'Tasks', 'Contact', 'Billing']);
      expect(paths).toEqual(['/home', '/projects', '/admin', '/task', '/contact', '/finance']);
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: SUPER_ADMIN gets the same sidebar as ADMIN. This was a deliberate product
     * decision (commit c1fdea7, "SUPER_ADMIN gets same UI as ADMIN"), which replaced the old
     * separate sysadmin menu (Home, Users, Subscription).
     */
    it('SUPER_ADMIN has the same navigation as ADMIN', () => {
      const superAdminNav = topNavData.SUPER_ADMIN;
      const adminNav = topNavData.ADMIN;

      expect(superAdminNav.map((link) => link.title)).toEqual(adminNav.map((link) => link.title));
      expect(superAdminNav.map((link) => link.path)).toEqual(adminNav.map((link) => link.path));
      expect(superAdminNav.map((link) => link.title)).not.toContain('Users');
    });
  });

  describe('Property 2: Preservation - Route paths are valid', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * Property: For any user type, all route paths SHALL start with '/',
     * contain no whitespace, and not have trailing slashes.
     */
    test.prop([arbUserType])('all route paths start with / and contain no whitespace', (role) => {
      const navLinks = topNavData[role];

      navLinks.forEach((link) => {
        // Path must start with /
        expect(link.path.startsWith('/')).toBe(true);

        // Path must not contain whitespace
        expect(link.path).not.toMatch(/\s/);

        // Path must not end with / (except root /)
        if (link.path.length > 1) {
          expect(link.path.endsWith('/')).toBe(false);
        }

        // Path must be non-empty
        expect(link.path.length).toBeGreaterThan(0);
      });
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: All route paths SHALL contain only valid URL path characters
     * (lowercase letters, digits, hyphens, slashes).
     */
    test.prop([arbUserType])('all route paths contain only valid URL characters', (role) => {
      const navLinks = topNavData[role];

      navLinks.forEach((link) => {
        // Path should only contain lowercase letters, digits, hyphens, underscores, and slashes
        expect(link.path).toMatch(/^[a-z0-9\-_/]+$/);
      });
    });
  });

  describe('Property 2: Preservation - Navigation data structure is consistent', () => {
    /**
     * **Validates: Requirements 3.4**
     *
     * Property: For any user type, every navigation item SHALL have a string title,
     * a defined icon, and a string path field.
     */
    test.prop([arbUserType])('every nav item has title (string), icon (defined), and path (string)', (role) => {
      const navLinks = topNavData[role];

      navLinks.forEach((link) => {
        // title must be a non-empty string
        expect(typeof link.title).toBe('string');
        expect(link.title.length).toBeGreaterThan(0);
        expect(link.title.trim()).not.toBe('');

        // icon must be defined (function or component)
        expect(link.icon).toBeDefined();

        // path must be a non-empty string
        expect(typeof link.path).toBe('string');
        expect(link.path.length).toBeGreaterThan(0);
      });
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: Navigation titles SHALL be human-readable (capitalized, no special chars).
     */
    test.prop([arbUserType])('navigation titles are capitalized and human-readable', (role) => {
      const navLinks = topNavData[role];

      navLinks.forEach((link) => {
        // Title should start with an uppercase letter
        expect(link.title[0]).toBe(link.title[0].toUpperCase());

        // Title should not contain special characters (only letters and spaces)
        expect(link.title).toMatch(/^[A-Za-z\s]+$/);
      });
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: Each user type SHALL have unique paths (no duplicate paths within a role).
     */
    test.prop([arbUserType])('no duplicate paths within a user role', (role) => {
      const navLinks = topNavData[role];
      const paths = navLinks.map((link) => link.path);
      const uniquePaths = new Set(paths);

      expect(uniquePaths.size).toBe(paths.length);
    });

    /**
     * **Validates: Requirements 3.4**
     *
     * Property: Each user type SHALL have unique titles (no duplicate titles within a role).
     */
    test.prop([arbUserType])('no duplicate titles within a user role', (role) => {
      const navLinks = topNavData[role];
      const titles = navLinks.map((link) => link.title);
      const uniqueTitles = new Set(titles);

      expect(uniqueTitles.size).toBe(titles.length);
    });
  });
});
