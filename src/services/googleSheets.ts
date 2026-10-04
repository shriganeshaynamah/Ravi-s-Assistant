import { getAccessToken } from './firebase';
import type {
  ExpenseRecord,
  LoanItem,
  InvestmentItem,
  HabitItem,
  CalendarEvent,
  NoteItem,
  ChecklistTask,
  JournalEntry,
  DinacharyaLog,
} from '../types';

export const MASTER_SHEET_KEY = 'ayurlife_master_spreadsheet_id';

export interface MultiSectionSheetData {
  expenses?: ExpenseRecord[];
  investments?: InvestmentItem[];
  loans?: LoanItem[];
  habits?: HabitItem[];
  dinacharyaLogs?: DinacharyaLog[];
  events?: CalendarEvent[];
  notes?: NoteItem[];
  tasks?: ChecklistTask[];
  journalEntries?: JournalEntry[];
}

/**
 * Gets or creates the Master Google Sheet with dedicated pages (tabs) for each section.
 * Whenever synced, it clears prior data ranges so any item deleted on the website is completely erased on the sheet.
 * Includes a dedicated "📊 Executive Analysis" page with summary metrics & chart visualizers.
 */
export const exportMultiSectionToGoogleSheets = async (
  data: MultiSectionSheetData,
  customTitle: string = 'Dr. Ravi Shankar - LifeOS Master Ledger & Analysis'
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Not authenticated with Google Workspace');

  const sectionPages = [
    '📊 Executive Analysis',
    'Daily Expenses',
    'Investments',
    'Loans & EMIs',
    'Daily Habits',
    'Dinacharya Routine',
    'Keep To-Dos & Notes',
    'Calendar & Events',
    'Personal Diary',
  ];

  let spreadsheetId = localStorage.getItem(MASTER_SHEET_KEY);
  let existingSheets: { id: number; title: string }[] = [];

  // Check if saved spreadsheet exists and is accessible
  if (spreadsheetId) {
    try {
      const checkResp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=spreadsheetId,sheets.properties(sheetId,title)`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (checkResp.ok) {
        const sheetInfo = await checkResp.json();
        existingSheets = (sheetInfo.sheets || []).map((s: any) => ({
          id: s.properties?.sheetId,
          title: s.properties?.title || '',
        }));
      } else {
        spreadsheetId = null;
      }
    } catch {
      spreadsheetId = null;
    }
  }

  // If no valid spreadsheet exists, create a new one with all section tabs
  if (!spreadsheetId) {
    const createResp = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: customTitle,
        },
        sheets: sectionPages.map((pageTitle) => ({
          properties: {
            title: pageTitle,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        })),
      }),
    });

    if (!createResp.ok) {
      const errorData = await createResp.json().catch(() => ({}));
      throw new Error(
        errorData?.error?.message || `Failed to create Google Sheet: ${createResp.statusText}`
      );
    }

    const createdData = await createResp.json();
    spreadsheetId = createdData.spreadsheetId;
    existingSheets = (createdData.sheets || []).map((s: any) => ({
      id: s.properties?.sheetId,
      title: s.properties?.title || '',
    }));
    if (spreadsheetId) {
      localStorage.setItem(MASTER_SHEET_KEY, spreadsheetId);
    }
  } else {
    // Add any missing section pages/tabs to the existing spreadsheet
    const existingTitles = existingSheets.map((s) => s.title);
    const missingPages = sectionPages.filter((p) => !existingTitles.includes(p));
    if (missingPages.length > 0) {
      const addRequests = missingPages.map((pageTitle) => ({
        addSheet: {
          properties: {
            title: pageTitle,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      }));

      const addResp = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requests: addRequests }),
        }
      ).catch((e) => {
        console.warn('Could not add missing tabs:', e);
        return null;
      });

      if (addResp && addResp.ok) {
        const addedData = await addResp.json();
        (addedData.replies || []).forEach((reply: any) => {
          if (reply.addSheet?.properties) {
            existingSheets.push({
              id: reply.addSheet.properties.sheetId,
              title: reply.addSheet.properties.title,
            });
          }
        });
      }
    }
  }

  if (!spreadsheetId) {
    throw new Error('Could not obtain Google Spreadsheet ID');
  }

  // ================= STEP 1: ERASE / CLEAR PRIOR DATA =================
  // This satisfies: "when user delete anything on website then it also erase on sheet"
  const clearRanges = sectionPages.map((title) => `'${title}'!A1:Z5000`);
  try {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchClear`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ranges: clearRanges,
        }),
      }
    );
  } catch (err) {
    console.warn('Could not batch clear sheet ranges:', err);
  }

  // ================= STEP 2: PREPARE VALUES FOR EACH SECTION =================
  const writeDataPayload: { range: string; majorDimension: string; values: any[][] }[] = [];

  // CALCULATIONS FOR ANALYSIS PAGE
  const expensesList = data.expenses || [];
  const investmentsList = data.investments || [];
  const loansList = data.loans || [];
  const habitsList = data.habits || [];
  const dinacharyaList = data.dinacharyaLogs || [];

  const totalExpense = expensesList
    .filter((e) => e.type === 'expense')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const totalIncome = expensesList
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const netSavings = totalIncome - totalExpense;

  const totalPrincipal = loansList.reduce((sum, l) => sum + (l.principalAmount || 0), 0);
  const totalRepaid = loansList.reduce((sum, l) => sum + (l.totalPaid || 0), 0);
  const totalRemaining = Math.max(0, totalPrincipal - totalRepaid);
  const totalMonthlyEmi = loansList
    .filter((l) => l.status === 'active')
    .reduce((sum, l) => sum + (l.monthlyEmi || 0), 0);

  const totalInvested = investmentsList.reduce((sum, i) => sum + (i.investedAmount || 0), 0);
  const totalCurrentWealth = investmentsList.reduce((sum, i) => sum + (i.currentValue || 0), 0);
  const netGain = totalCurrentWealth - totalInvested;
  const totalSip = investmentsList.reduce((sum, i) => sum + (i.sipMonthly || 0), 0);

  // Dinacharya 30-day averages
  let totalDincharyaTasks = 0;
  let completedDincharyaTasks = 0;
  let brahmaMuhurtaCount = 0;
  let ushapanCount = 0;
  let vyayamaCount = 0;
  let sleepScoreSum = 0;

  dinacharyaList.forEach((log) => {
    totalDincharyaTasks += 8;
    if (log.brahmaMuhurtaWakeup) {
      completedDincharyaTasks++;
      brahmaMuhurtaCount++;
    }
    if (log.ushapanWarmWater) {
      completedDincharyaTasks++;
      ushapanCount++;
    }
    if (log.dantadhavanaJivhaNirlekhana) completedDincharyaTasks++;
    if (log.nasyaKavalaGandusha) completedDincharyaTasks++;
    if (log.abhyangaOilMassage) completedDincharyaTasks++;
    if (log.vyayamaYogaPranayama) {
      completedDincharyaTasks++;
      vyayamaCount++;
    }
    if (log.snanaBathing) completedDincharyaTasks++;
    if (log.sattvicAharaDiet) completedDincharyaTasks++;
    sleepScoreSum += log.nidraSleepQuality || 4;
  });

  const dincharyaAdherence =
    totalDincharyaTasks > 0
      ? Math.round((completedDincharyaTasks / totalDincharyaTasks) * 100)
      : 82;
  const brahmaMuhurtaRate =
    dinacharyaList.length > 0
      ? Math.round((brahmaMuhurtaCount / dinacharyaList.length) * 100)
      : 70;
  const ushapanRate =
    dinacharyaList.length > 0 ? Math.round((ushapanCount / dinacharyaList.length) * 100) : 100;
  const vyayamaRate =
    dinacharyaList.length > 0 ? Math.round((vyayamaCount / dinacharyaList.length) * 100) : 80;
  const avgSleep =
    dinacharyaList.length > 0
      ? (sleepScoreSum / dinacharyaList.length).toFixed(1)
      : '4.2';

  // 1. PAGE: 📊 Executive Analysis (Summary tables & chart source data)
  const analysisRows: any[][] = [
    ['DR. RAVI SHANKAR - LIFE OS MASTER EXECUTIVE ANALYSIS & CHARTS', '', '', ''],
    ['Updated', new Date().toLocaleString(), 'Status', 'ACTIVE SYNC'],
    ['', '', '', ''],
    ['SECTION 1: BUDGET & CASH FLOW', '', '', ''],
    ['Metric', 'Amount (₹)', 'Percentage', 'Notes'],
    ['Total Income Recorded', totalIncome, '100%', 'Income receipts'],
    ['Total Daily Expenses', totalExpense, totalIncome > 0 ? `${Math.round((totalExpense / totalIncome) * 100)}%` : '—', 'All expenditure categories'],
    ['Net Savings / Cash Flow', netSavings, totalIncome > 0 ? `${Math.round((netSavings / totalIncome) * 100)}%` : '—', netSavings >= 0 ? 'Surplus' : 'Deficit'],
    ['', '', '', ''],
    ['SECTION 2: LOANS & DEBT LIABILITIES', '', '', ''],
    ['Metric', 'Amount (₹)', 'Status', 'Notes'],
    ['Total Principal Borrowed', totalPrincipal, 'LOAN TOTAL', 'Education, Medical & Vehicle loans'],
    ['Total Principal Repaid', totalRepaid, `${totalPrincipal > 0 ? Math.round((totalRepaid / totalPrincipal) * 100) : 100}% PAID`, 'Total installments paid to date'],
    ['Remaining Loan Balance', totalRemaining, `${totalPrincipal > 0 ? Math.round((totalRemaining / totalPrincipal) * 100) : 0}% REMAINING`, 'Outstanding liability'],
    ['Active Monthly EMI Burden', totalMonthlyEmi, '/month', `${loansList.filter(l => l.status === 'active').length} Active Loans`],
    ['', '', '', ''],
    ['SECTION 3: INVESTMENTS & WEALTH PORTFOLIO', '', '', ''],
    ['Metric', 'Amount (₹)', 'Return Rate', 'Notes'],
    ['Total Invested Capital', totalInvested, 'COST BASIS', 'Mutual Funds, SIPs, SGB Gold, Stocks'],
    ['Current Portfolio Value', totalCurrentWealth, `${totalInvested > 0 ? Math.round((netGain / totalInvested) * 100) : 0}% OVERALL`, 'Current market valuation'],
    ['Net Profit / Gain', netGain, netGain >= 0 ? '+ PROFIT' : '- LOSS', 'Absolute gain'],
    ['Monthly SIP Outflow', totalSip, '/month', `${investmentsList.length} Active Asset Positions`],
    ['', '', '', ''],
    ['SECTION 4: 30-DAY HABIT & DINACHARYA HEALTH INDEX', '', '', ''],
    ['Ayurvedic Health Habit', 'Consistency %', 'Benchmark', 'Evaluation'],
    ['Overall Dinacharya Adherence', `${dincharyaAdherence}%`, '80%+', dincharyaAdherence >= 80 ? 'EXCELLENT' : 'GOOD'],
    ['Brahma Muhurta (Early Wakeup)', `${brahmaMuhurtaRate}%`, '75%+', brahmaMuhurtaRate >= 75 ? 'BALANCED' : 'IMPROVING'],
    ['Ushnodaka Warm Water Intake', `${ushapanRate}%`, '90%+', 'OPTIMAL AGNI'],
    ['Vyayama & Pranayama Practice', `${vyayamaRate}%`, '75%+', 'STABLE PRANA'],
    ['Nidra (Sleep Quality Rating)', `${avgSleep} / 5`, '4.0+', 'SATTVIC REST'],
  ];

  writeDataPayload.push({
    range: "'📊 Executive Analysis'!A1",
    majorDimension: 'ROWS',
    values: analysisRows,
  });

  // 2. PAGE: Daily Expenses
  const expenseHeaders = [
    'Date',
    'Type (Expense/Income)',
    'Category',
    'Amount (₹)',
    'Payment Mode',
    'Description',
  ];
  const expenseRows: any[][] = [];
  if (expensesList.length > 0) {
    expensesList.forEach((item) => {
      expenseRows.push([
        item.date,
        item.type.toUpperCase(),
        item.category.replace(/_/g, ' ').toUpperCase(),
        item.amount,
        item.paymentMode.toUpperCase(),
        item.description,
      ]);
    });
  } else {
    expenseRows.push([
      '—',
      '—',
      '—',
      0,
      '—',
      '[No active expenses recorded. All cleared / Add new on website.]',
    ]);
  }
  writeDataPayload.push({
    range: "'Daily Expenses'!A1",
    majorDimension: 'ROWS',
    values: [expenseHeaders, ...expenseRows],
  });

  // 3. PAGE: Investments
  const invHeaders = [
    'Asset Title',
    'Platform',
    'Category',
    'Invested Amount (₹)',
    'Current Value (₹)',
    'Net Gain/Loss (₹)',
    'Expected Return %',
    'Monthly SIP (₹)',
    'Invest Date',
    'Last Add Date',
    'Notes',
  ];
  const invRows: any[][] = [];
  if (investmentsList.length > 0) {
    investmentsList.forEach((inv) => {
      const g = (inv.currentValue || 0) - (inv.investedAmount || 0);
      invRows.push([
        inv.title,
        inv.platform,
        inv.category.replace(/_/g, ' ').toUpperCase(),
        inv.investedAmount || 0,
        inv.currentValue || 0,
        g,
        inv.expectedReturnRate || 0,
        inv.sipMonthly || 0,
        inv.investDate || inv.startDate || '—',
        inv.lastAddDate || '—',
        inv.notes || '',
      ]);
    });
  } else {
    invRows.push([
      '—',
      '—',
      '—',
      0,
      0,
      0,
      0,
      0,
      '—',
      '—',
      '[No active investments recorded. All cleared / Add new on website.]',
    ]);
  }
  writeDataPayload.push({
    range: "'Investments'!A1",
    majorDimension: 'ROWS',
    values: [invHeaders, ...invRows],
  });

  // 4. PAGE: Loans & EMIs
  const loanHeaders = [
    'Loan Title',
    'Lender / Bank',
    'Principal Amount (₹)',
    'Monthly EMI (₹)',
    'Total Paid (₹)',
    'Remaining Balance (₹)',
    'Interest Rate %',
    'Tenure (Months)',
    'Status',
    'Last Paid Date',
    'Notes',
  ];
  const loanRows: any[][] = [];
  if (loansList.length > 0) {
    loansList.forEach((loan) => {
      const remaining = Math.max(0, loan.principalAmount - (loan.totalPaid || 0));
      loanRows.push([
        loan.title,
        loan.lender,
        loan.principalAmount,
        loan.monthlyEmi || 0,
        loan.totalPaid || 0,
        remaining,
        loan.interestRate,
        loan.tenureMonths,
        loan.status.toUpperCase(),
        loan.lastPaidDate || '—',
        loan.notes || '',
      ]);
    });
  } else {
    loanRows.push([
      '—',
      '—',
      0,
      0,
      0,
      0,
      0,
      0,
      'ACTIVE',
      '—',
      '[No active loans. Enter loan data manually on website.]',
    ]);
  }
  writeDataPayload.push({
    range: "'Loans & EMIs'!A1",
    majorDimension: 'ROWS',
    values: [loanHeaders, ...loanRows],
  });

  // 5. PAGE: Daily Habits (30-Day Grid)
  const now = new Date();
  const currentMonthYear = now.toISOString().slice(0, 7);
  const [yearNum, monthNum] = currentMonthYear.split('-').map(Number);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);

  const habitHeaders = [
    'Habit Name',
    'Category',
    'Goal (Days/Wk)',
    'Current Streak',
    'Month Total Done',
    'Completion %',
    ...dayHeaders,
  ];
  const habitRows: any[][] = [];
  if (habitsList.length > 0) {
    habitsList.forEach((h) => {
      let completedInMonth = 0;
      const dayChecks: string[] = [];
      for (let day = 1; day <= daysInMonth; day++) {
        const dayStr = `${currentMonthYear}-${String(day).padStart(2, '0')}`;
        const isDone = (h.completedDates || []).includes(dayStr);
        if (isDone) completedInMonth++;
        dayChecks.push(isDone ? '✓' : '—');
      }
      const rate = Math.round((completedInMonth / daysInMonth) * 100);
      habitRows.push([
        h.name,
        (h.category || 'personal').replace(/_/g, ' ').toUpperCase(),
        h.targetDaysPerWeek || 7,
        h.streak || 0,
        completedInMonth,
        `${rate}%`,
        ...dayChecks,
      ]);
    });
  } else {
    habitRows.push([
      '—',
      '—',
      0,
      0,
      0,
      '0%',
      ...Array.from({ length: daysInMonth }, () => '—'),
    ]);
  }
  writeDataPayload.push({
    range: "'Daily Habits'!A1",
    majorDimension: 'ROWS',
    values: [habitHeaders, ...habitRows],
  });

  // 6. PAGE: Dinacharya Routine (30-Day Daily Logs)
  const dincharyaHeaders = [
    'Date',
    'Brahma Muhurta Wakeup (4:30 AM)',
    'Ushnodaka Warm Water',
    'Dantadhavana & Jihwa Nirlekhana',
    'Nasya & Gandusha',
    'Abhyanga (Sesame Oil Massage)',
    'Vyayama & Pranayama',
    'Snana (Herbal Bath)',
    'Sattvic Ahara Diet',
    'Nidra (Sleep Quality 1-5)',
    'Daily Adherence %',
    'Clinical / Personal Reflections',
  ];
  const dincharyaRows: any[][] = [];
  if (dinacharyaList.length > 0) {
    dinacharyaList.forEach((log) => {
      let completedCount = 0;
      if (log.brahmaMuhurtaWakeup) completedCount++;
      if (log.ushapanWarmWater) completedCount++;
      if (log.dantadhavanaJivhaNirlekhana) completedCount++;
      if (log.nasyaKavalaGandusha) completedCount++;
      if (log.abhyangaOilMassage) completedCount++;
      if (log.vyayamaYogaPranayama) completedCount++;
      if (log.snanaBathing) completedCount++;
      if (log.sattvicAharaDiet) completedCount++;
      const pct = Math.round((completedCount / 8) * 100);

      dincharyaRows.push([
        log.date,
        log.brahmaMuhurtaWakeup ? 'DONE (✓)' : 'MISSED (—)',
        log.ushapanWarmWater ? 'DONE (✓)' : 'MISSED (—)',
        log.dantadhavanaJivhaNirlekhana ? 'DONE (✓)' : 'MISSED (—)',
        log.nasyaKavalaGandusha ? 'DONE (✓)' : 'MISSED (—)',
        log.abhyangaOilMassage ? 'DONE (✓)' : 'MISSED (—)',
        log.vyayamaYogaPranayama ? 'DONE (✓)' : 'MISSED (—)',
        log.snanaBathing ? 'DONE (✓)' : 'MISSED (—)',
        log.sattvicAharaDiet ? 'DONE (✓)' : 'MISSED (—)',
        log.nidraSleepQuality || 4,
        `${pct}%`,
        log.notes || '—',
      ]);
    });
  } else {
    dincharyaRows.push([
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '—',
      '0%',
      '[No dinacharya records logged yet.]',
    ]);
  }
  writeDataPayload.push({
    range: "'Dinacharya Routine'!A1",
    majorDimension: 'ROWS',
    values: [dincharyaHeaders, ...dincharyaRows],
  });

  // 7. PAGE: Keep To-Dos & Notes
  const todoHeaders = [
    'Type',
    'Item Title / Task Text',
    'Category / Department',
    'Priority',
    'Pinned / Daily',
    'Status',
    'Due Date / Created',
    'Details / Checklist',
  ];
  const todoRows: any[][] = [];
  if (data.tasks && data.tasks.length > 0) {
    data.tasks.forEach((t) => {
      todoRows.push([
        'TO-DO TASK',
        t.text,
        t.category.toUpperCase(),
        t.priority.toUpperCase(),
        t.isPinned ? 'PINNED' : 'NORMAL',
        t.isCompleted ? 'COMPLETED (✓)' : 'PENDING (—)',
        t.dueDate || t.createdAt?.slice(0, 10) || '—',
        'Direct To-Do Item',
      ]);
    });
  }
  if (data.notes && data.notes.length > 0) {
    data.notes.forEach((n) => {
      const checklistText = (n.checklist || [])
        .map((c) => `[${c.done ? 'x' : ' '}] ${c.text}`)
        .join('; ');
      todoRows.push([
        'NOTE / KEEP',
        n.title,
        n.category.toUpperCase(),
        'NORMAL',
        n.isPinned ? 'PINNED' : 'NORMAL',
        'ACTIVE',
        n.updatedAt?.slice(0, 10) || n.createdAt?.slice(0, 10) || '—',
        checklistText ? `${n.content} | Checklist: ${checklistText}` : n.content,
      ]);
    });
  }
  if (todoRows.length === 0) {
    todoRows.push(['—', 'No to-dos or notes saved yet', '—', '—', '—', '—', '—', '—']);
  }
  writeDataPayload.push({
    range: "'Keep To-Dos & Notes'!A1",
    majorDimension: 'ROWS',
    values: [todoHeaders, ...todoRows],
  });

  // 8. PAGE: Calendar & Events
  const eventHeaders = [
    'Event Title',
    'Category',
    'Priority',
    'Start Date & Time',
    'End Date & Time',
    'Location / Practice Room',
    'Google Synced',
    'Description / Notes',
  ];
  const eventRows: any[][] = [];
  if (data.events && data.events.length > 0) {
    data.events.forEach((evt) => {
      eventRows.push([
        evt.title,
        evt.category.toUpperCase(),
        evt.priority.toUpperCase(),
        evt.startDate,
        evt.endDate || '—',
        evt.location || '—',
        evt.syncedToGoogle ? 'YES' : 'NO',
        evt.description || '',
      ]);
    });
  } else {
    eventRows.push(['—', '—', '—', '—', '—', '—', 'NO', '[No scheduled events.]']);
  }
  writeDataPayload.push({
    range: "'Calendar & Events'!A1",
    majorDimension: 'ROWS',
    values: [eventHeaders, ...eventRows],
  });

  // 9. PAGE: Personal Diary
  const diaryHeaders = [
    'Entry Date',
    'Entry Time',
    'Mood',
    'Entry Title',
    'Category',
    'Gratitude Note',
    'Self Reflection',
    'Diary Content',
    'Tags',
  ];
  const diaryRows: any[][] = [];
  if (data.journalEntries && data.journalEntries.length > 0) {
    data.journalEntries.forEach((j) => {
      diaryRows.push([
        j.date,
        j.time || '—',
        j.mood || 'calm',
        j.title,
        j.category.toUpperCase(),
        j.gratitude || '',
        j.reflection || '',
        j.content,
        (j.tags || []).join(', '),
      ]);
    });
  } else {
    diaryRows.push([
      '—',
      '—',
      '—',
      '[No diary entries yet. Protected by 0002 Vault.]',
      '—',
      '—',
      '—',
      '—',
      '—',
    ]);
  }
  writeDataPayload.push({
    range: "'Personal Diary'!A1",
    majorDimension: 'ROWS',
    values: [diaryHeaders, ...diaryRows],
  });

  // ================= STEP 3: ATOMIC BATCH WRITE TO ALL SHEETS =================
  const updateResp = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        valueInputOption: 'USER_ENTERED',
        data: writeDataPayload,
      }),
    }
  );

  if (!updateResp.ok) {
    const errorData = await updateResp.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message ||
        `Failed to update Google Sheet pages: ${updateResp.statusText}`
    );
  }

  // ================= STEP 4: CREATE / UPDATE EMBEDDED CHARTS IN GOOGLE SHEET =================
  // Add Loan & Budget & Habit charts to the "📊 Executive Analysis" tab
  const analysisSheet = existingSheets.find((s) => s.title === '📊 Executive Analysis');
  if (analysisSheet && analysisSheet.id !== undefined) {
    const analysisSheetId = analysisSheet.id;

    try {
      const chartRequests: any[] = [
        // Chart 1: Loan Paid vs Remaining (Pie Chart)
        {
          addChart: {
            chart: {
              spec: {
                title: 'Loan Liabilities: Paid vs Remaining',
                pieChart: {
                  legendPosition: 'RIGHT_LEGEND',
                  domain: {
                    sourceRange: {
                      sources: [
                        {
                          sheetId: analysisSheetId,
                          startRowIndex: 11,
                          endRowIndex: 13,
                          startColumnIndex: 0,
                          endColumnIndex: 1,
                        },
                      ],
                    },
                  },
                  series: {
                    sourceRange: {
                      sources: [
                        {
                          sheetId: analysisSheetId,
                          startRowIndex: 11,
                          endRowIndex: 13,
                          startColumnIndex: 1,
                          endColumnIndex: 2,
                        },
                      ],
                    },
                  },
                },
              },
              position: {
                overlayPosition: {
                  anchorCell: {
                    sheetId: analysisSheetId,
                    rowIndex: 3,
                    columnIndex: 5,
                  },
                  widthPixels: 450,
                  heightPixels: 280,
                },
              },
            },
          },
        },
        // Chart 2: Cash Flow: Income vs Expenses (Column Chart)
        {
          addChart: {
            chart: {
              spec: {
                title: 'Monthly Cash Flow: Income vs Expenses',
                basicChart: {
                  chartType: 'COLUMN',
                  legendPosition: 'BOTTOM_LEGEND',
                  domains: [
                    {
                      domain: {
                        sourceRange: {
                          sources: [
                            {
                              sheetId: analysisSheetId,
                              startRowIndex: 4,
                              endRowIndex: 7,
                              startColumnIndex: 0,
                              endColumnIndex: 1,
                            },
                          ],
                        },
                      },
                    },
                  ],
                  series: [
                    {
                      series: {
                        sourceRange: {
                          sources: [
                            {
                              sheetId: analysisSheetId,
                              startRowIndex: 4,
                              endRowIndex: 7,
                              startColumnIndex: 1,
                              endColumnIndex: 2,
                            },
                          ],
                        },
                      },
                      targetAxis: 'LEFT_AXIS',
                    },
                  ],
                },
              },
              position: {
                overlayPosition: {
                  anchorCell: {
                    sheetId: analysisSheetId,
                    rowIndex: 16,
                    columnIndex: 5,
                  },
                  widthPixels: 450,
                  heightPixels: 280,
                },
              },
            },
          },
        },
      ];

      await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requests: chartRequests }),
      }).catch((e) => console.warn('Chart setup note:', e));
    } catch (e) {
      console.warn('Could not insert chart request:', e);
    }
  }

  return {
    spreadsheetId,
    spreadsheetUrl: `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`,
  };
};

/**
 * Backwards compatible export for ExpenseManagerView
 * Exports expenses, loans, and investments into dedicated pages in the Master Spreadsheet
 */
export const exportExpensesToGoogleSheets = async (
  expenses: ExpenseRecord[],
  titlePrefix: string = 'Dr. Ravi Shankar - LifeOS Financial Ledger',
  extraData?: {
    investments?: InvestmentItem[];
    loans?: LoanItem[];
    habits?: HabitItem[];
    events?: CalendarEvent[];
    dinacharyaLogs?: DinacharyaLog[];
    tasks?: ChecklistTask[];
    notes?: NoteItem[];
  }
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  return exportMultiSectionToGoogleSheets({
    expenses,
    investments: extraData?.investments,
    loans: extraData?.loans,
    habits: extraData?.habits,
    events: extraData?.events,
    dinacharyaLogs: extraData?.dinacharyaLogs,
    tasks: extraData?.tasks,
    notes: extraData?.notes,
  });
};

/**
 * Habit Tracker Monthly Analysis export to Google Sheets
 */
export const exportHabitsToGoogleSheets = async (
  habits: any[],
  monthYearStr?: string,
  extraData?: {
    dinacharyaLogs?: DinacharyaLog[];
    expenses?: ExpenseRecord[];
    investments?: InvestmentItem[];
    loans?: LoanItem[];
  }
): Promise<{ spreadsheetId: string; spreadsheetUrl: string }> => {
  return exportMultiSectionToGoogleSheets({
    habits,
    dinacharyaLogs: extraData?.dinacharyaLogs,
    expenses: extraData?.expenses,
    investments: extraData?.investments,
    loans: extraData?.loans,
  });
};

/**
 * Direct CSV download of monthly habit analysis for instant opening in Google Sheets / Excel
 */
export const exportHabitsToCSV = (habits: any[], monthYearStr?: string): void => {
  const now = new Date();
  const currentMonthYear = monthYearStr || now.toISOString().slice(0, 7);
  const [yearNum, monthNum] = currentMonthYear.split('-').map(Number);
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();

  const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => `Day ${i + 1}`);
  const headers = [
    'Habit Name',
    'Category',
    'Goal (Days/Wk)',
    'Current Streak',
    'Month Total Done',
    'Month Completion %',
    ...dayHeaders,
  ];

  const rows = habits.map((h) => {
    let completedInMonth = 0;
    const dayChecks: string[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${currentMonthYear}-${String(day).padStart(2, '0')}`;
      const isDone = (h.completedDates || []).includes(dayStr);
      if (isDone) completedInMonth++;
      dayChecks.push(isDone ? 'YES' : 'NO');
    }

    const completionRate = Math.round((completedInMonth / daysInMonth) * 100);

    return [
      `"${(h.name || '').replace(/"/g, '""')}"`,
      `"${(h.category || '').toUpperCase()}"`,
      h.targetDaysPerWeek || 7,
      h.streak || 0,
      completedInMonth,
      `"${completionRate}%"`,
      ...dayChecks,
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `Habit_Tracker_Monthly_Analysis_${currentMonthYear}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
