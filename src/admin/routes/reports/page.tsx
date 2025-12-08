import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Button } from "@medusajs/ui";
import { ChartBar, ArrowDownTray, DocumentText } from "@medusajs/icons";
import { useState, useEffect } from "react";

interface ReportsStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  recentActivity: Array<{
    id: string;
    display_id: string;
    email: string;
    total: number;
    status: string;
    created_at: string;
    currency_code: string;
  }>;
}

const ReportsPage = () => {
  const [stats, setStats] = useState<ReportsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/admin/reports/stats");
      if (!response.ok) {
        throw new Error("Failed to fetch stats");
      }
      const data = await response.json();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
      console.error("Error fetching stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (
    amount: number | null | undefined,
    currencyCode: string = "usd"
  ) => {
    if (amount == null || isNaN(Number(amount))) {
      return "N/A";
    }
    const numAmount = Number(amount);
    // Check if amount is already in decimal format (less than 10000) or in cents (needs division)
    const formattedAmount = numAmount > 10000 ? numAmount / 100 : numAmount;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: (currencyCode || "usd").toUpperCase(),
    }).format(formattedAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleExportData = async () => {
    setActionLoading("export");
    try {
      // Create CSV content
      if (!stats) return;

      const csvContent = [
        ["Metric", "Value"],
        ["Total Orders", stats.totalOrders],
        ["Total Revenue", formatCurrency(stats.totalRevenue)],
        ["Total Customers", stats.totalCustomers],
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reports-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error exporting data:", err);
      alert("Failed to export data");
    } finally {
      setActionLoading(null);
    }
  };

  const handleGenerateReport = async () => {
    if (!stats) return;

    setActionLoading("report");
    try {
      // Generate HTML report
      const reportDate = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const reportHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sales Report - ${reportDate}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 20px;
    }
    .report-container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      border-radius: 8px;
    }
    .report-header {
      border-bottom: 3px solid #2563eb;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .report-header h1 {
      color: #1e40af;
      font-size: 32px;
      margin-bottom: 10px;
    }
    .report-header .date {
      color: #6b7280;
      font-size: 14px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }
    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 24px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .stat-card:nth-child(2) {
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    }
    .stat-card:nth-child(3) {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
    .stat-label {
      font-size: 14px;
      opacity: 0.9;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
    }
    .section-title {
      font-size: 24px;
      color: #1e40af;
      margin: 40px 0 20px 0;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .activity-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      background: white;
    }
    .activity-table thead {
      background: #f9fafb;
    }
    .activity-table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border-bottom: 2px solid #e5e7eb;
    }
    .activity-table td {
      padding: 12px;
      border-bottom: 1px solid #e5e7eb;
    }
    .activity-table tbody tr:hover {
      background: #f9fafb;
    }
    .status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-completed {
      background: #d1fae5;
      color: #065f46;
    }
    .status-pending {
      background: #fed7aa;
      color: #92400e;
    }
    .status-draft {
      background: #dbeafe;
      color: #1e40af;
    }
    .status-canceled {
      background: #fee2e2;
      color: #991b1b;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #6b7280;
      font-size: 12px;
    }
    @media print {
      body {
        background: white;
        padding: 0;
      }
      .report-container {
        box-shadow: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="report-container">
    <div class="report-header">
      <h1>Sales Report</h1>
      <div class="date">Generated on ${reportDate}</div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-label">Total Orders</div>
        <div class="stat-value">${stats.totalOrders.toLocaleString()}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Revenue</div>
        <div class="stat-value">${formatCurrency(stats.totalRevenue)}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Total Customers</div>
        <div class="stat-value">${stats.totalCustomers.toLocaleString()}</div>
      </div>
    </div>

    <h2 class="section-title">Recent Activity</h2>
    <table class="activity-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Email</th>
          <th>Status</th>
          <th>Total</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${
          stats.recentActivity.length > 0
            ? stats.recentActivity
                .map(
                  (activity) => `
          <tr>
            <td>#${activity.display_id || activity.id.slice(0, 8)}</td>
            <td>${activity.email || "N/A"}</td>
            <td>
              <span class="status-badge status-${activity.status}">
                ${activity.status}
              </span>
            </td>
            <td><strong>${formatCurrency(
              activity.total,
              activity.currency_code
            )}</strong></td>
            <td>${formatDate(activity.created_at)}</td>
          </tr>
        `
                )
                .join("")
            : '<tr><td colspan="5" style="text-align: center; padding: 40px; color: #6b7280;">No recent activity to display</td></tr>'
        }
      </tbody>
    </table>

    <div class="footer">
      <p>This report was generated automatically by the Medusa Admin Dashboard</p>
      <p>For questions or support, please contact your system administrator</p>
    </div>
  </div>
</body>
</html>
      `;

      // Create blob and download
      const blob = new Blob([reportHTML], { type: "text/html" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `sales-report-${
        new Date().toISOString().split("T")[0]
      }.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      // Also open in new window for preview
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(reportHTML);
        printWindow.document.close();
      }
    } catch (err) {
      console.error("Error generating report:", err);
      alert("Failed to generate report. Please try again.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <Container className="divide-y p-0">
        <div className="flex items-center justify-center px-6 py-12">
          <Text className="text-ui-fg-subtle">Loading...</Text>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="divide-y p-0">
        <div className="flex flex-col items-center justify-center px-6 py-12 gap-4">
          <Text className="text-ui-fg-danger">{error}</Text>
          <Button onClick={fetchStats} variant="secondary">
            Retry
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-y-1">
          <Heading level="h1">Reports</Heading>
          <Text className="text-ui-fg-subtle">
            Get an overview of your store’s performance, including key metrics,
            quick actions, and recent activity.
          </Text>
        </div>
        <Button onClick={fetchStats} variant="secondary" size="small">
          Refresh
        </Button>
      </div>

      <div className="px-6 py-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Stats Card 1 */}
          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-ui-fg-subtle text-sm font-medium">
                  Total Orders
                </Text>
                <Heading level="h2" className="mt-2">
                  {stats?.totalOrders.toLocaleString() || "0"}
                </Heading>
              </div>
              <div className="rounded-full bg-ui-bg-subtle-hover p-3">
                <ChartBar className="h-5 w-5 text-ui-fg-base" />
              </div>
            </div>
          </div>

          {/* Stats Card 2 */}
          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-ui-fg-subtle text-sm font-medium">
                  Revenue
                </Text>
                <Heading level="h2" className="mt-2">
                  {stats?.totalRevenue
                    ? formatCurrency(stats.totalRevenue)
                    : "$0.00"}
                </Heading>
              </div>
              <div className="rounded-full bg-ui-bg-subtle-hover p-3">
                <ChartBar className="h-5 w-5 text-ui-fg-base" />
              </div>
            </div>
          </div>

          {/* Stats Card 3 */}
          <div className="rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
            <div className="flex items-center justify-between">
              <div>
                <Text className="text-ui-fg-subtle text-sm font-medium">
                  Customers
                </Text>
                <Heading level="h2" className="mt-2">
                  {stats?.totalCustomers.toLocaleString() || "0"}
                </Heading>
              </div>
              <div className="rounded-full bg-ui-bg-subtle-hover p-3">
                <ChartBar className="h-5 w-5 text-ui-fg-base" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className="mt-6 rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
          <Heading level="h2" className="mb-4">
            Quick Actions
          </Heading>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="secondary"
              onClick={handleExportData}
              disabled={actionLoading === "export" || !stats}
            >
              {actionLoading === "export" ? (
                "Exporting..."
              ) : (
                <>
                  <ArrowDownTray className="mr-2 h-4 w-4" />
                  Export Data
                </>
              )}
            </Button>
            <Button
              variant="secondary"
              onClick={handleGenerateReport}
              disabled={actionLoading === "report"}
            >
              {actionLoading === "report" ? (
                "Generating..."
              ) : (
                <>
                  <DocumentText className="mr-2 h-4 w-4" />
                  Generate HTML Report
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-6 rounded-lg border border-ui-border-base bg-ui-bg-base p-6">
          <Heading level="h2" className="mb-4">
            Recent Activity
          </Heading>
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            <div className="divide-y divide-ui-border-base">
              {stats.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                >
                  <div className="flex flex-col gap-y-1">
                    <div className="flex items-center gap-2">
                      <Text className="font-medium">
                        Order #{activity.display_id || activity.id.slice(0, 8)}
                      </Text>
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          activity.status === "completed"
                            ? "bg-ui-tag-green-bg text-ui-tag-green-text"
                            : activity.status === "pending"
                            ? "bg-ui-tag-orange-bg text-ui-tag-orange-text"
                            : "bg-ui-tag-blue-bg text-ui-tag-blue-text"
                        }`}
                      >
                        {activity.status}
                      </span>
                    </div>
                    <Text className="text-ui-fg-subtle text-sm">
                      {activity.email || "No email"}
                    </Text>
                    <Text className="text-ui-fg-subtle text-xs">
                      {formatDate(activity.created_at)}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text className="font-medium">
                      {formatCurrency(activity.total, activity.currency_code)}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Text className="text-ui-fg-subtle">
              No recent activity to display.
            </Text>
          )}
        </div>
      </div>
    </Container>
  );
};

// The widget's configurations
export const config = defineRouteConfig({
  label: "Reports",
  icon: ChartBar,
});

export default ReportsPage;
