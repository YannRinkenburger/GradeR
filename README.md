# GradeR

A lightweight, browser-based GPA tracker for the **Business Informatics B.Sc.** programme at [DHBW](https://www.dhbw.de). Enter your grades, lock confirmed results, and watch your ECTS-weighted average update in real time — no server, no sign-up, no build step required.

## Getting Started

### Use online

[Website](https://grade-r.vercel.app/)

### Run locally

No build tools or dependencies are needed.

```bash
git clone https://github.com/YannRinkenburger/GradeR.git
cd GradeR
open index.html        # macOS
# xdg-open index.html  # Linux
# start index.html     # Windows
```

That's it. The app runs entirely in the browser using `localStorage` for persistence.

---

## Usage

1. **Enter a grade** — click the input field next to any module and type a grade between `1,0` and `4,0` (comma or dot accepted). The weighted points column updates live.
2. **Confirm a grade** — press **Enter** or click away. The grade is automatically locked (shown with a lock icon). Locked grades count as *confirmed* in the GPA summary.
3. **Unlock a grade** — click the lock icon next to a module to switch it back to *forecast* mode and make it editable again.
4. **Filter by year** — use the tab bar at the top of the module table to focus on a specific study year or elective modules.
5. **Copy your summary** — click **Copy summary** to copy a formatted text overview to your clipboard for use in emails or documents.
6. **Reset** — click **Clear all grades** to wipe everything and start fresh (a confirmation dialog is shown first).
