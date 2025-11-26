import { test } from './fixtures/auth';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

test.describe('Admin dashboard - inventory grid', () => {
  test('should display expected column headers', async ({ loggedInPage }) => {
    const adminDashboard = new AdminDashboardPage(loggedInPage);

    await adminDashboard.expectDashboardVisible();

    const expectedLabels = ['Category:', 'Color:', 'Sizes:', 'Price/Day:'];
    await adminDashboard.expectInventoryHeaders(expectedLabels);
  });
});
