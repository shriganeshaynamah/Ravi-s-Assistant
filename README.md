# 🌿 Dr. Ravi Shankar — LifeOS & Ayurveez Healthcare Clinical Suite

A complete **Personal Life Operating System (LifeOS)** and **BAMS Clinical Therapeutics & Prescription Suite** built for **Dr. Ravi Shankar Kumar, BAMS (U.A.U, U.K)** — **Ayurveez Healthcare, Gaya, Bihar**.

This application works seamlessly across **Web (Vercel)** and **Android APK**, with **dual-layer offline persistence (`localStorage` + `IndexedDB`)** and **2-Way Live Google Sheets / Google Drive / Google Calendar Synchronization**.

---

## 📌 Table of Contents
1. [How Data Saving & Sync Works (Offline + 2-Way Google Cloud)](#1-how-data-saving--sync-works-offline--2-way-google-cloud)
2. [Home & Explore Dashboard](#2-home--explore-dashboard)
3. [Finance & Expense Manager (Expenses, Loans, Investments)](#3-finance--expense-manager-expenses-loans-investments)
4. [Ravi’s Assistant — LifeOS Problem Solver & Medicos Clinical Engine](#4-ravis-assistant--lifeos-problem-solver--medicos-clinical-engine)
5. [Official Ayurveez Healthcare Prescription Pad](#5-official-ayurveez-healthcare-prescription-pad)
6. [BAMS Academic & Career Roadmap (2026–2028+)](#6-bams-academic--career-roadmap-20262028)
7. [Habit Tracker & Classical Dinacharya Routine](#7-habit-tracker--classical-dinacharya-routine)
8. [Keep To-Do Tasks, Keep Notes, Calendar & Personal Diary](#8-keep-to-do-tasks-keep-notes-calendar--personal-diary)
9. [Clinical & Financial Calculators (Tools)](#9-clinical--financial-calculators-tools)
10. [How Code Updates Work with GitHub → Vercel → Android APK](#10-how-code-updates-work-with-github--vercel--android-apk)

---

## 1. How Data Saving & Sync Works (Offline + 2-Way Google Cloud)

### A. Automatic Local Device Saving (No Login Required)
- **Instant Save on Every Action:** Whenever you add, edit, or delete any expense, loan payment, investment, habit, note, task, or patient detail, the app immediately saves it to **both**:
  1. `localStorage` (instant synchronous storage)
  2. `IndexedDB` (`AyurLifePersistentDB` — permanent browser/APK database that survives WebView cache cleanups)
- **Zero Re-Entry Needed:** Even if you close the APK without exporting to a sheet or backing up, all your changes remain saved when you reopen the app.

### B. Permanent Email Login
- Once you sign in with Google or save your email (`rk867000@gmail.com`) in **Google Cloud Sync Central**, your login is saved permanently across app restarts so you don't need to log in repeatedly.

### C. 2-Way Master Google Sheet Sync (`Dr. Ravi Shankar - LifeOS Master Ledger`)
- **Single Master Spreadsheet (Never Creates Duplicate Files):**
  - The app stores your Master Spreadsheet ID and also searches your Google Drive by name (`Dr. Ravi Shankar - LifeOS Master Ledger`) so it always updates the **exact same Google Sheet**.
- **App → Google Sheet (Live Auto-Save):**
  - Every change you make inside the app automatically syncs to your Master Google Sheet in the background (after a 1.2-second debounce).
  - If a new month begins, the app automatically creates a new monthly tab (e.g., `Expenses - Oct 2026`) **inside that same spreadsheet**.
  - **5th of Every Month Auto-Update:** On or after the 5th of every month, the app automatically updates your Master Google Sheet with all previous and current months' archived expenses and executive charts.
- **Google Sheet → App (Auto-Fetch on Login & Manual Pull):**
  - When you sign in with Gmail (or click **Fetch Sheet / Pull Sheet**), the app reads your Master Google Sheet (`Daily Expenses`, `Loans & EMIs`, `Investments`, `Daily Habits`, `Calendar & Events`, `Keep To-Dos & Notes`, and `🔄 App Sync State`) and updates the app UI immediately.

---

## 2. Home & Explore Dashboard
- **Quick Navigation Grid:** One-tap tiles to open **Daily Expenses**, **Loans**, **Investments**, **BAMS Roadmap**, **Keep To-Do**, **Keep Notes**, **Calendar & OPD**, **Habit Tracker**, **Life Corners (Diary)**, **Calculators**, **Ravi’s Assistant**, and **Cloud Sync**.
- **Live Snapshot Cards:** Displays your active academic milestone, monthly financial overview, pending tasks, and quick actions.
- **Day / Night Theme:** Switch between Light Mode and Dark Mode anytime from the side drawer.

---

## 3. Finance & Expense Manager (Expenses, Loans, Investments)

### A. Daily Expenses Tab
- **Current Month Summary Cards:**
  - **`{Month Name} Inflow`** (e.g., `October Inflow`): Total income recorded in the current month.
  - **`{Month Name} Outflow`** (e.g., `October Outflow`): Total expenses recorded in the current month.
  - **`Total Balance`**: Net balance (`Current Month Inflow - Current Month Outflow`).
- **Filter Toggle:** Switch between **Current Month (`October`)** transactions and **Today** transactions.
- **Monthly Historical Archive:** Every expense you add is permanently archived by month (`ayurlife_expenses_monthly_archive`) so past months' data is always preserved for analysis.
- **Expense Analysis & Visual Charts (Button):**
  - **Select Any Month or Custom Date Range:** Choose a month pill (e.g., `Oct 2026`, `Sep 2026`), pick a month from the month selector, or set custom `From` / `To` dates.
  - **Selected Period Summary:** Shows Inflow, Outflow, and Total Balance for that specific month/range.
  - **4 Visual Breakdowns:**
    1. **Category Donut / Circle Chart:** Shows which category (`Food & Dining`, `Books & Study`, `Rent & Mess`, etc.) consumed the highest percentage.
    2. **Day-of-Week Bar Chart (`Mon – Sun`):** Highlights which day of the week has peak spending.
    3. **Monthly Expense Comparison:** Compares Inflow, Outflow, and Balance across all stored months.
    4. **Transactions List:** Lists every transaction made during the selected month/range.

### B. Loans Tab (4:5 Interactive Card Slider)
- **4:5 Loan Cards:** Displays **Lender**, **Loan Title**, **Borrow Date**, **Auto-Fetched Last Payment Date**, **Total Loan Amount**, **Total Paid**, **Remaining Balance**, **Interest Rate (`% p.a.`)**, **Monthly EMI**, and **Paid % Progress Bar**.
- **Manual `0` EMI Support:**
  - If you enter `0` in **Monthly EMI (₹)** (or click **"Set 0 (No EMI)"**), auto-calculation is disabled and the loan stays at `₹0/mo` EMI (ideal for interest-free family/friend loans).
  - If you leave Monthly EMI blank, it auto-calculates from Principal, Interest Rate, and Tenure.
- **Repayment Breakdown & Auto Last Payment Date:**
  - Tap any Loan Card to view its **Repayment Breakdown & History** below.
  - Add, edit, or delete individual repayment installments (`Amount`, `Payment Date`, `Note`).
  - **Automatic Sync:** Adding, editing, or deleting a repayment automatically recalculates **Total Paid**, **Remaining Balance**, **Loan Status (`Active` / `Partially Paid` / `Fully Paid`)**, and **Last Payment Date** (automatically fetched from the latest repayment date).

### C. Investments & SIP Tab
- Track Mutual Funds, Stocks, Gold (SGB), Fixed Deposits, and Clinic Capital Fund.
- Record **Add / Deposit (SIP)** or **Withdraw** installments with automatic updates to Total Invested and Current Value.

---

## 4. Ravi’s Assistant — LifeOS Problem Solver & Medicos Clinical Engine

### Tab 1: LifeOS Problem Solver
- Analyzes 6 core modules (**Loans & EMIs**, **Income & Expenses**, **Investments**, **Works/To-Do**, **Roadmap Milestones**, and **Habits/Dinacharya** — *strictly excluding private Life Journals*).
- Includes your **2-Tier Liquidity Buffer Rule**:
  - **Tier-1 Minor Shortfall (`₹1,000–₹2,000`):** 30-day interest-free bridge from a trusted friend, repaid first next month.
  - **Tier-2 Occasional Larger Shortfall (`up to ₹5,000`):** Non-regular support from your brother for major exam/clinical months rather than high-interest loan apps.

### Tab 2: Medicos Area (BAMS Clinical Therapeutics Engine)
- **60+ Alphabetical Disease Presets:** Select any classical Ayurvedic / Modern condition (`Amavata`, `Sandhivata`, `Gridhrasi`, `Amlapitta`, `Prameha`, `Kushtha`, `Tamaka Shwasa`, `Pandu`, `Kamala`, `Mutrashmari`, etc.) or type any custom disease.
- **Optional Patient Details (Before Age):**
  - **Patient Name** (Optional), **Address** (Optional), **Contact** (Optional), **Age** (Optional), **Gender**, **Prakriti**, **Agni**, and **Kostha**.
  - Includes an interactive **Prakriti, Agni & Kostha Pariksha (`i`)** questionnaire modal.
- **Acharya-Wise Classical Protocols:**
  - Switch between **Acharya Charaka**, **Acharya Sushruta**, **Acharya Vagbhata**, **Acharya Chakradatta**, and **Acharya Sharangadhara** to view authentic Sanskrit Shlokas, Chikitsa Sutra, Shamana Aushadhi, and Shodhana Panchakarma.
- **Interactive Differential Diagnosis (`Vyavacchedaka Nidana` & `Prashna Pariksha`):**
  - Opens a clinical popup with disease confirmation criteria, competing conditions ruled out, and patient inquiry questions with one-tap **Quick Fill** answers that dynamically refine the diagnosis.
- **Modern Pharmacotherapy & Lab Investigations:**
  - Lists supportive modern regimens and diagnostic investigations with clickable **Reference Range & Interpretation (`i`)** guides.

---

## 5. Official Ayurveez Healthcare Prescription Pad
- Click **"Save Prescription"** inside the Medicos Area to open the official A4 **Ayurveez Healthcare** prescription pad for **Dr. Ravi Shankar Kumar, BAMS (U.A.U, U.K)**.
- **Header & Vitals Bar:**
  - Displays Clinic Name, Address (`Vishnupuri Colony Near Bengali Ashram, Gaya`), Contact (`+91-8271890090`), and Doctor Credentials.
  - **Vitals Row:** Places **Patient Details**, **Prakriti**, **Agni & Kostha**, and **Date** (directly on the right side of Agni & Kostha), plus optional Contact & Address below.
- **High-Visibility Diagnosis Box:**
  - Clearly displays `DIAGNOSIS : <Clean Disease Name>` (with `Samprapti Evaluation for <Age> <Gender>` automatically removed) and classical Samhita reference.
- **Ticked Medicines & Investigations Only:**
  - Includes only the Ayurvedic Shamana formulations, Panchakarma Shodhana procedures, Supportive Modern medicines, Lab Investigations, and Pathya-Apathya rules that you kept ticked.
- **1-Click High-Resolution PNG Download, Share & Print:**
  - Generates a crisp A4 PNG image ready to download to your phone/PC, share on WhatsApp, or print.

---

## 6. BAMS Academic & Career Roadmap (2026–2028+)
Tracks 4 major career milestones with exam countdowns, checklists, and internship postings:
1. **Final Proff BAMS Student (`2026 - 2027`):** Kayachikitsa, Shalya Tantra, Shalakya Tantra, Panchakarma & Research Methodology exam dates and study checklists.
2. **Rotatory Internship (`Jan 2027 - Jan 2028`):** 6 Months Ayurvedic Teaching Hospital + 6 Months Modern Allopathic District Hospital department postings.
3. **Ayurvedic PG (`AIAPGET`) & State MO Exam (`2027 - 2028`):** Brihat Trayi revision and MCQ targets.
4. **Ayurvedic Clinical Setup & Practice (`2028 Onwards`):** Independent OPD & Panchakarma setup checklist.

---

## 7. Habit Tracker & Classical Dinacharya Routine
- **Custom Habit Tracker:** Track daily habits (`Study 2hr daily`, `Brahmacharya / Ojas Preservation`, `15min Pranayama`, `Clinical Case Study`, etc.) with 7-day and 30-day completion grids, streaks, and CSV/Google Sheet export.
- **Ashtanga Hridaya Dinacharya Log:** Daily 8-pillar Ayurvedic routine tracker (`Brahma Muhurta Wakeup`, `Ushnodaka`, `Dantadhavana`, `Nasya/Gandusha`, `Abhyanga`, `Vyayama`, `Snana`, `Sattvic Ahara`, and `Nidra Sleep Quality`) with weekly adherence charts.

---

## 8. Keep To-Do Tasks, Keep Notes, Calendar & Personal Diary
- **Keep To-Do:** Priority-tagged (`High`, `Medium`, `Low`) task checklists across Study, Clinical, Financial, and Personal categories.
- **Keep Notes:** Pin clinical notes, formulas, and checklists with quick search.
- **Calendar & OPD:** Schedule OPD consultations, university exams, and reminders with one-click **Google Calendar Sync**.
- **Journey Corners (Personal Diary):** Private mood and reflection journal (kept strictly private and excluded from AI solver metrics).

---

## 9. Clinical & Financial Calculators (Tools)
- **EMI Calculator:** Interactive sliders for Principal, Interest Rate, and Tenure.
- **SIP Wealth Calculator:** Projects Total Invested, Estimated Gain, and Future Wealth.
- **Sharngadhara Pediatric Dosage Calculator:** Calculates classical Ayurvedic child dose using `(Adult Dose × Age) / (Age + 12)`.
- **BMI & Dosha Tendency Calculator:** Computes BMI (`kg/m²`) with Vata / Sama / Kapha constitutional correlation.

---

## 10. How Code Updates Work with GitHub → Vercel → Android APK
1. **Edit in AI Studio → Push to GitHub:** Whenever you update code in AI Studio and push/sync to your GitHub repository, **Vercel** automatically builds and deploys the update to your live URL.
2. **No Need to Rebuild APK:** Because your Android APK loads your live Vercel URL, your existing APK automatically gets all new code and UI updates on next launch.
3. **Your Data Stays Safe:** Code updates never wipe your APK's `localStorage` or `IndexedDB`, and with **Gmail 2-Way Google Sheet Sync**, any data changed on the website or in the Google Sheet syncs seamlessly with your APK.
