🌿 Dr. Ravi Shankar — LifeOS & Ayurveez Healthcare Guide

1. How Data Saving & Cloud Sync Work

A. Automatic Local Device Saving (Works Offline & Without Login)
How it works: Every time you add, edit, or delete anything (expenses, loan payments, investments, habits, notes, tasks, or patient details), the app immediately saves your data in two places on your phone/device:

localStorage (instant memory)

IndexedDB (AyurLifePersistentDB — deep permanent storage inside your APK/browser that survives cache clears)

Result: Even if you close the app without clicking backup or export, your changes are never lost.

B. Permanent Email Login
Once you sign in with Google or click "Save Email Permanently" in Cloud Sync Central, your email (rk867000@gmail.com) stays permanently logged in across every website and APK launch.

C. 2-Way Master Google Sheet Sync (Dr. Ravi Shankar - LifeOS Master Ledger)
Always Uses the Same Google Sheet: The app remembers your Master Sheet ID (and searches your Google Drive by name if needed) so it never creates duplicate sheets.

App → Google Sheet (Live Auto-Save):

Any change you make anywhere in the app is automatically saved to your Master Google Sheet in the background (1.2 seconds after you make the change).

When a new month starts, it automatically creates a new tab (e.g., Expenses - Oct 2026) inside that same sheet.

5th of Every Month Auto-Sync: On or after the 5th of every month, the app automatically updates your Master Google Sheet with all previous and current months' expenses.

Google Sheet → App (Auto-Fetch on Login & Pull Button):

When you log in with your Gmail (or click Fetch Sheet / Pull Sheet), the app reads your updated Google Sheet and loads the latest data into the app.

2. Finance & Expense Manager

A. Daily Expenses Page
Top 3 Cards:

{Current Month} Inflow (e.g., October Inflow): Total income added this month.

{Current Month} Outflow (e.g., October Outflow): Total expenses made this month.

Total Balance: Net balance for the current month (Inflow - Outflow).

Month / Today Toggle: Switch between viewing all transactions for the Current Month or only Today.

Permanent Monthly Archive: All previous months' expenses are permanently stored in your monthly archive so they are never lost when a new month starts.

B. Expense Analysis Page (Click "Analysis" Button)
Select Any Month or Date Range: Tap any stored month pill (e.g., Oct 2026, Sep 2026), pick a month from the month calendar, or choose custom From and To dates.

4 Visual Charts & Breakdowns:

Category Circle (Donut) Chart: Shows exact ₹ and % spent on each category (Food & Dining, Books & Study, Rent & Mess, etc.).

Day-of-Week Bar Chart (Mon – Sun): Shows which day of the week you spend the most.

Monthly Expense Comparison: Compares Inflow, Outflow, and Balance across every stored month.

Transactions in Selected Range: Lists all transactions from that selected month/range.

C. Loans Page (4:5 Card Slider)
What the Loan Card Shows:

Lender & Loan Title

Borrowed Date & Last Paid Date (auto-fetched from your latest repayment date)

Total Loan Amount, Total Paid, and Remaining Balance (all full digits visible)

Interest Rate (% p.a.) and Monthly EMI (₹/mo)

Progress Bar (% Paid) and Auto Status Badge (Active, Partially Paid, Fully Paid)

Manual 0 EMI Rule:

If you enter 0 in the Monthly EMI box (or tap "Set 0 (No EMI)"), the app will not auto-calculate EMI and will keep EMI at ₹0/mo.

It only auto-calculates EMI if you leave the Monthly EMI box blank.

Repayment Breakdown & History (Tap on Loan Card):

Add, edit, or delete individual repayment installments (Amount, Payment Date, Note).

Every repayment change automatically updates Total Paid, Remaining Balance, Loan Status, and Last Payment Date (using the latest repayment date).

D. Investments & SIP Page
Track Mutual Funds, Stocks, Gold, FDs, and Clinic Fund.

Add SIP deposits or withdrawals to automatically update Total Invested and Current Value.

3. Ravi’s Assistant (AI Solver & BAMS Medicos Engine)

Tab 1: LifeOS Problem Solver
Analyzes your Loans/EMIs, Income/Expenses, Investments, To-Do Tasks, Roadmap, and Habits/Dinacharya (private Life Journals are excluded).

Built-in 2-Tier Liquidity Rule for low-income months:

Shortfall of ₹1,000–₹2,000: Suggests a 1-month interest-free bridge from a friend, repaid first next month.

Larger Occasional Shortfall (up to ₹5,000): Suggests non-regular support from your brother instead of high-interest credit apps.

Tab 2: Medicos Area (BAMS Clinical Engine)
60+ Disease Presets (A–Z): Select any disease (Amavata, Sandhivata, Gridhrasi, Amlapitta, Prameha, Kushtha, etc.) or type any disease name.

Patient Details (Before Age):

Patient Name (Optional), Address (Optional), Contact (Optional), Age (Optional), Gender, Prakriti, Agni, and Kostha.

Click Pariksha (i) to open the interactive Prakriti, Agni & Kostha assessment tool.

Acharya Selector: Switch between Charaka, Sushruta, Vagbhata, Chakradatta, and Sharangadhara to get classical Sanskrit Shlokas, Chikitsa Sutra, Shamana medicines, and Panchakarma Shodhana.

Differential Diagnosis (Vyavacchedaka Nidana): Popup guide with competing diseases ruled out and Prashna Pariksha questions with one-tap Quick Fill answers that update the diagnosis.

Lab Investigations (i button): Click the info icon next to any lab test to see Normal Ranges and Low/Borderline/High clinical interpretations.

4. Official Ayurveez Healthcare Prescription Pad
Open by clicking "Save Prescription" inside the Medicos Area.

Layout:

Top Letterhead: Ayurveez Healthcare, Gaya + Dr. Ravi Shankar Kumar, BAMS (U.A.U, U.K).

Patient Vitals Row: Patient Details | Prakriti | Agni & Kostha | Date (placed directly on the right side of Agni & Kostha), with optional Contact & Address below.

Clear Diagnosis Box: High-contrast box showing DIAGNOSIS : <Disease Name> (without any "Samprapti Evaluation for..." text).

Rx Sections: Includes only the Ayurvedic Shamana medicines, Panchakarma procedures, Supportive Modern medicines, and Lab Investigations you kept ticked.

Save / Share / Print: Click "Save Prescription" to download a high-resolution A4 PNG image or share directly on WhatsApp/phone.

5. Other Modules
BAMS Roadmap (2026–2028+): Tracks Final Proff BAMS (2026–2027), 1-Year Rotatory Internship (6m Ayurveda + 6m Modern Hospital), AIAPGET / MO Exam Prep, and Ayurvedic Clinic Setup.

Habit Tracker & Dinacharya: Daily habit grid + 8-pillar Ashtanga Hridaya Dinacharya checklist with weekly charts.

Keep To-Do & Keep Notes: Task checklists and pinned clinical/personal notes.

Calendar & OPD: Schedule appointments and exams with Google Calendar Sync.

Calculators (Tools): Standalone EMI, SIP, Sharngadhara Pediatric Dosage, and BMI & Dosha calculators.
