import { topNavData } from '@/lib/constants';
import { UserType } from '@/types/api.types';
import { fc, test } from '@fast-check/vitest';
import { describe, expect, it } from 'vitest';

/**
 * Property-Based Tests for Navigation Routing Preservation
 * 
 * **Validates: Requirements 3.4**
 * 
 * These tests verify that existing navigation routing functionality is preserved
 * across the bugfix implementation. Tests are expected to PASS on UNFIXED code
 * to establish a baseline of correct behavior.
 * 
 * Property 2: Preservation - Navigation Routing
 */

describe('Navigation Preservation Property Tests', () => {
  describe('Property 2: Preservation - Navigation Routing Structure', () => {
    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For any user role, the system SHALL continue to provide the correct
     * set of navigation routes defined in topNavData.
     */
    test.prop([
      fc.constantFrom<UserType>('CLIENT', 'CONSULTANT', 'ADMIN', 'SUPER_ADMIN'),
    ])('provides correct navigation links for each user role', (role) => {
      const navLinks = topNavData[role];
      
      // Verify navigation data exists for the role
      expect(navLinks).toBeDefined();
      expect(Array.isArray(navLinks)).toBe(true);
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Verify each link has required properties
      navLinks.forEach((link) => {
        expect(link).toHaveProperty('title');
        expect(link).toHaveProperty('icon');
        expect(link).toHaveProperty('path');
        expect(typeof link.title).toBe('string');
        expect(typeof link.path).toBe('string');
        expect(link.title.length).toBeGreaterThan(0);
        expect(link.path.length).toBeGreaterThan(0);
        expect(link.path.startsWith('/')).toBe(true);
      });
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For CLIENT role, the system SHALL continue to provide exactly
     * the expected navigation routes (Home, Journey, Tasks, Documents, Ask Pylott) without
     * admin or consultant-specific routes.
     */
    it('CLIENT role has correct navigation routes', () => {
      const clientNav = topNavData.CLIENT;
      
      expect(clientNav).toBeDefined();
      expect(clientNav.length).toBe(5);
      
      const titles = clientNav.map(link => link.title);
      expect(titles).toContain('Home');
      expect(titles).toContain('Journey');
      expect(titles).toContain('Tasks');
      expect(titles).toContain('Documents');
      expect(titles).toContain('Ask Pylott');
      
      // Verify CLIENT does not have Admin route
      expect(titles).not.toContain('Admin');
      
      const paths = clientNav.map(link => link.path);
      expect(paths).toContain('/home');
      expect(paths).toContain('/journey');
      expect(paths).toContain('/tasks');
      expect(paths).toContain('/documents');
      expect(paths).toContain('/ask-pylott');
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For ADMIN role, the system SHALL continue to include all universal
     * routes plus the Admin-specific route.
     */
    it('ADMIN role includes admin navigation route', () => {
      const adminNav = topNavData.ADMIN;
      
      expect(adminNav).toBeDefined();
      expect(adminNav.length).toBeGreaterThan(0);
      
      const titles = adminNav.map(link => link.title);
      const paths = adminNav.map(link => link.path);
      
      // Verify Admin has the Admin route
      expect(titles).toContain('Admin');
      expect(paths).toContain('/admin');
      
      // Verify Admin has universal routes
      expect(titles).toContain('Home');
      expect(titles).toContain('Projects');
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For CONSULTANT role, the system SHALL continue to include all
     * universal routes without the Admin route.
     */
    it('CONSULTANT role has universal routes without admin access', () => {
      const consultantNav = topNavData.CONSULTANT;
      
      expect(consultantNav).toBeDefined();
      expect(consultantNav.length).toBeGreaterThan(0);
      
      const titles = consultantNav.map(link => link.title);
      const paths = consultantNav.map(link => link.path);
      
      // Verify Consultant does not have Admin route
      expect(titles).not.toContain('Admin');
      expect(paths).not.toContain('/admin');
      
      // Verify Consultant has universal routes
      expect(titles).toContain('Home');
      expect(titles).toContain('Projects');
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: SUPER_ADMIN gets the same navigation as ADMIN (deliberate product decision,
     * commit c1fdea7 "SUPER_ADMIN gets same UI as ADMIN"; the old separate sysadmin menu was removed).
     */
    it('SUPER_ADMIN role has the same navigation as ADMIN', () => {
      const superAdminNav = topNavData.SUPER_ADMIN;
      
      expect(superAdminNav).toBeDefined();
      expect(superAdminNav.length).toBe(topNavData.ADMIN.length);
      
      const titles = superAdminNav.map(link => link.title);
      const paths = superAdminNav.map(link => link.path);
      
      expect(titles).toContain('Home');
      expect(titles).toContain('Admin');
      expect(titles).not.toContain('Users');
      expect(titles).not.toContain('Subscription');
      
      expect(paths).toContain('/admin');
      expect(paths).not.toContain('/sysadmin');
    });
  });

  describe('Property 2: Preservation - Navigation Path Validity', () => {
    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For any navigation link across all roles, the system SHALL continue
     * to define valid route paths (starting with /, non-empty strings).
     */
    test.prop([
      fc.constantFrom<UserType>('CLIENT', 'CONSULTANT', 'ADMIN', 'SUPER_ADMIN'),
    ])('all navigation paths are valid routes', (role) => {
      const navLinks = topNavData[role];
      
      navLinks.forEach((link) => {
        // Path must be a non-empty string
        expect(link.path).toBeTruthy();
        expect(typeof link.path).toBe('string');
        expect(link.path.length).toBeGreaterThan(0);
        
        // Path must start with /
        expect(link.path.startsWith('/')).toBe(true);
        
        // Path should not have trailing slash (unless it's root)
        if (link.path.length > 1) {
          expect(link.path.endsWith('/')).toBe(false);
        }
        
        // Path should not contain spaces
        expect(link.path).not.toMatch(/\s/);
      });
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For any navigation link across all roles, the system SHALL continue
     * to provide non-empty title strings for display.
     */
    test.prop([
      fc.constantFrom<UserType>('CLIENT', 'CONSULTANT', 'ADMIN', 'SUPER_ADMIN'),
    ])('all navigation titles are valid display strings', (role) => {
      const navLinks = topNavData[role];
      
      navLinks.forEach((link) => {
        // Title must be a non-empty string
        expect(link.title).toBeTruthy();
        expect(typeof link.title).toBe('string');
        expect(link.title.length).toBeGreaterThan(0);
        
        // Title should not be just whitespace
        expect(link.title.trim().length).toBeGreaterThan(0);
      });
    });
  });

  describe('Property 2: Preservation - Role-Based Navigation Separation', () => {
    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For any pair of distinct roles (excluding SUPER_ADMIN), the system
     * SHALL continue to maintain role-appropriate navigation separation where
     * CLIENT has a distinct set from ADMIN/CONSULTANT.
     */
    it('CLIENT navigation is distinct from ADMIN navigation', () => {
      const clientPaths = topNavData.CLIENT.map(link => link.path);
      const adminPaths = topNavData.ADMIN.map(link => link.path);
      
      // CLIENT should not have /admin path
      expect(clientPaths).not.toContain('/admin');
      
      // ADMIN should have /admin path
      expect(adminPaths).toContain('/admin');
      
      // CLIENT has different paths than ADMIN
      const clientUniquePaths = clientPaths.filter(path => !adminPaths.includes(path));
      expect(clientUniquePaths.length).toBeGreaterThan(0);
      
      // Verify CLIENT-specific paths exist
      expect(clientPaths).toContain('/journey');
      expect(adminPaths).not.toContain('/journey');
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: For CONSULTANT and ADMIN roles, the system SHALL continue to
     * maintain that CONSULTANT does not have access to admin-specific routes.
     */
    it('CONSULTANT navigation excludes admin-specific routes', () => {
      const consultantPaths = topNavData.CONSULTANT.map(link => link.path);
      const adminPaths = topNavData.ADMIN.map(link => link.path);
      
      // CONSULTANT should not have /admin path
      expect(consultantPaths).not.toContain('/admin');
      
      // ADMIN should have /admin path
      expect(adminPaths).toContain('/admin');
      
      // CONSULTANT should have universal routes
      expect(consultantPaths).toContain('/home');
      expect(consultantPaths).toContain('/projects');
    });

    /**
     * **Validates: Requirements 3.4**
     * 
     * Property: SUPER_ADMIN uses the staff navigation (same as ADMIN, commit c1fdea7), so it
     * shares none of the customer portal's links and no role has a separate sysadmin menu.
     */
    it('SUPER_ADMIN navigation is the staff menu, separate from the customer menu', () => {
      const superAdminPaths = topNavData.SUPER_ADMIN.map(link => link.path);
      const adminPaths = topNavData.ADMIN.map(link => link.path);
      const clientPaths = topNavData.CLIENT.map(link => link.path);
      
      // Same staff menu as ADMIN.
      expect(superAdminPaths).toEqual(adminPaths);
      
      // None of the customer-portal-only links (Home is shared by every role).
      const customerOnly = clientPaths.filter(path => path !== '/home');
      customerOnly.forEach(path => expect(superAdminPaths).not.toContain(path));
      
      // No role has the old separate sysadmin menu.
      [superAdminPaths, adminPaths, clientPaths].forEach(paths =>
        expect(paths).not.toContain('/sysadmin')
      );
    });
  });
});
