import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from '../App';
import { sanitizeInput } from '../utils/sanitize';

/**
 * Ticket: ENG-84718
 * Title: Stretch Assignment: Performance Optimization for News Blog
 * Assignee: Aman Saini (PDIT-INT-1252)
 * Tech Lead: Deepika Kumari
 * Reporter: Amit Sharma
 * 
 * TDD Phase 1: Comprehensive Failing Test Suite
 */

describe('ENG-84718: Performance Optimization for News Blog', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('Happy Path', () => {
    it('renders the Performance Optimization interface clearly and displays structured article performance metrics', () => {
      render(<App />);

      // Verify the interface header
      expect(
        screen.getByRole('heading', { name: /performance optimization/i })
      ).toBeInTheDocument();

      // Verify structured News Blog article performance metrics table/headers
      expect(screen.getByText(/Headline/i)).toBeInTheDocument();
      expect(screen.getByText(/Slug/i)).toBeInTheDocument();
      expect(screen.getByText(/Category/i)).toBeInTheDocument();
      expect(screen.getByText(/Payload KB/i)).toBeInTheDocument();
      expect(screen.getByText(/Load Time ms/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();

      // Verify at least one initial article metric row is rendered
      const statusBadges = screen.getAllByTestId('article-status');
      expect(statusBadges.length).toBeGreaterThan(0);
    });

    it('responds immediately to search and filter inputs', async () => {
      const user = userEvent.setup();
      render(<App />);

      const searchInput = screen.getByLabelText(/search articles/i);
      const categoryFilter = screen.getByLabelText(/filter by category/i);

      expect(searchInput).toBeInTheDocument();
      expect(categoryFilter).toBeInTheDocument();

      // Type in search query
      await user.type(searchInput, 'Tech');

      // Check that matching articles remain visible
      const rows = screen.getAllByTestId('article-row');
      expect(rows.length).toBeGreaterThan(0);

      // Select category filter
      await user.selectOptions(categoryFilter, 'Technology');
      const filteredRows = screen.getAllByTestId('article-row');
      expect(filteredRows.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State (Unhappy Path)', () => {
    it('displays the exact text "No data found" when a search query matches zero articles', async () => {
      const user = userEvent.setup();
      render(<App />);

      const searchInput = screen.getByLabelText(/search articles/i);
      await user.type(searchInput, 'XYZNonExistentArticle99999');

      // Must display the exact text "No data found" (never a blank screen)
      const emptyStateMsg = screen.getByText('No data found');
      expect(emptyStateMsg).toBeInTheDocument();
      expect(screen.queryByTestId('article-row')).not.toBeInTheDocument();
    });

    it('displays the exact text "No data found" when category filter matches zero articles', async () => {
      const user = userEvent.setup();
      render(<App />);

      const categoryFilter = screen.getByLabelText(/filter by category/i);
      await user.selectOptions(categoryFilter, 'EmptyCategory');

      expect(screen.getByText('No data found')).toBeInTheDocument();
    });
  });

  describe('Bad Connectivity (Unhappy Path)', () => {
    it('shows an accessible visual loading indicator (role="status" and aria-busy="true") during slow 3G async operations', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Find an optimize button or audit trigger
      const optimizeButtons = screen.getAllByRole('button', { name: /optimize article/i });
      expect(optimizeButtons.length).toBeGreaterThan(0);

      await user.click(optimizeButtons[0]);

      // Loading indicator must have role="status" and aria-busy="true"
      const loadingIndicator = screen.getByRole('status');
      expect(loadingIndicator).toBeInTheDocument();
      expect(loadingIndicator).toHaveAttribute('aria-busy', 'true');
    });
  });

  describe('Invalid Inputs (Unhappy Path)', () => {
    it('prevents form submission when required fields are empty or malformed, sets aria-invalid="true", and highlights fields with border-red-600', async () => {
      const user = userEvent.setup();
      render(<App />);

      const headlineInput = screen.getByLabelText(/article headline/i);
      const payloadInput = screen.getByLabelText(/payload in kb/i);
      const loadTimeInput = screen.getByLabelText(/load time in ms/i);
      const submitButton = screen.getByRole('button', { name: /submit audit|add article/i });

      // Provide invalid inputs: empty headline, negative payload, negative load time
      await user.clear(headlineInput);
      await user.type(payloadInput, '-150');
      await user.type(loadTimeInput, '-300');

      await user.click(submitButton);

      // Verify aria-invalid is set to true on offending inputs
      expect(headlineInput).toHaveAttribute('aria-invalid', 'true');
      expect(payloadInput).toHaveAttribute('aria-invalid', 'true');
      expect(loadTimeInput).toHaveAttribute('aria-invalid', 'true');

      // Verify offending input fields are highlighted in red (border-red-600)
      expect(headlineInput.className).toContain('border-red-600');
      expect(payloadInput.className).toContain('border-red-600');
      expect(loadTimeInput.className).toContain('border-red-600');
    });
  });

  describe('Accessibility (a11y NFR)', () => {
    it('ensures all interactive elements have explicit aria-label attributes and are keyboard accessible', () => {
      const { container } = render(<App />);

      const interactiveElements = container.querySelectorAll('input, select, button, textarea');
      expect(interactiveElements.length).toBeGreaterThan(0);

      interactiveElements.forEach((el) => {
        const ariaLabel = el.getAttribute('aria-label');
        const hasAriaLabelledBy = el.getAttribute('aria-labelledby');
        const hasAccessibleLabel = Boolean(
          (ariaLabel && ariaLabel.trim().length > 0) ||
          (hasAriaLabelledBy && hasAriaLabelledBy.trim().length > 0)
        );

        expect(hasAccessibleLabel).toBe(true);

        // Verify keyboard accessibility (not disabled from tab navigation unexpectedly)
        expect(el.getAttribute('tabindex')).not.toBe('-1');
      });
    });
  });

  describe('Telemetry Simulation (NFR)', () => {
    it('calls console.log containing "[Analytics] User interacted with Performance Optimization" whenever a primary action completes', async () => {
      const user = userEvent.setup();
      render(<App />);

      const searchInput = screen.getByLabelText(/search articles/i);
      await user.type(searchInput, 'a');

      // Verify telemetry message was logged
      const telemetryCalls = consoleSpy.mock.calls.filter((callArgs) =>
        callArgs.some(
          (arg) =>
            typeof arg === 'string' &&
            arg.includes('[Analytics] User interacted with Performance Optimization')
        )
      );

      expect(telemetryCalls.length).toBeGreaterThan(0);
    });
  });

  describe('Security (XSS NFR)', () => {
    it('strips <script> tags and malicious HTML attributes from text inputs before saving to state', () => {
      const maliciousPayload = '<script>alert("xss")</script><img src="x" onerror="alert(1)">Breaking News';
      const sanitized = sanitizeInput(maliciousPayload);

      expect(sanitized).not.toContain('<script>');
      expect(sanitized).not.toContain('</script>');
      expect(sanitized).not.toContain('onerror=');
      expect(sanitized).toContain('Breaking News');
    });

    it('sanitizes headline input upon form submission to prevent stored XSS attacks in UI', async () => {
      const user = userEvent.setup();
      render(<App />);

      const headlineInput = screen.getByLabelText(/article headline/i);
      const slugInput = screen.getByLabelText(/article slug/i);
      const payloadInput = screen.getByLabelText(/payload in kb/i);
      const loadTimeInput = screen.getByLabelText(/load time in ms/i);
      const categorySelect = screen.getByLabelText(/article category/i);
      const submitButton = screen.getByRole('button', { name: /submit audit|add article/i });

      const maliciousHeadline = '<script>evil()</script><b onmouseover="evil()">Safe Title</b>';
      await user.type(headlineInput, maliciousHeadline);
      await user.type(slugInput, 'safe-title');
      await user.type(payloadInput, '120');
      await user.type(loadTimeInput, '450');
      await user.selectOptions(categorySelect, 'Technology');

      await user.click(submitButton);

      // Verify no script tags or inline handlers exist in rendered DOM
      const renderedHeadlines = screen.queryAllByText(/Safe Title/i);
      expect(renderedHeadlines.length).toBeGreaterThan(0);
      expect(document.querySelector('script:not([type="module"])')).toBeNull();
      expect(document.body.innerHTML).not.toContain('<script>evil()');
      expect(document.body.innerHTML).not.toContain('onmouseover');
    });
  });
});

