/**
 * INTERACTIVE TERMINAL & CODE SIMULATOR
 * Alexi Dhungel, Er. — Hero Visualizer
 */

const terminalScripts = {
  banking: [
    { type: "prompt", text: "alexi@switch-core:~$ ./run_payment_switch.sh --service=DynamicQR" },
    { type: "output", text: "[INFO] Initializing Banking Switch Gateway v4.2..." },
    { type: "output", text: "[SEC] Cryptographic HSM key exchange verified (AES-256-GCM)" },
    { type: "output", text: "[NET] Connected to Central Payment Switch (Latency: 12ms)" },
    { type: "highlight", text: "[TXN:98241] Incoming Dynamic QR Request: Amount NPR 12,500.00" },
    { type: "output", text: "[RULE] Validating Account Balance & Risk Profile..." },
    { type: "success", text: "✔ [SUCCESS] 200 OK | Settlement Confirmed | Ref: #TXN-20260814-8841" }
  ],
  java: [
    { type: "prompt", text: "alexi@edu-cluster:~$ javac -d ./bin BankingAccountDao.java" },
    { type: "output", text: "[COMPILE] Compiling Java OOP Enterprise Architecture..." },
    { type: "output", text: "[THREAD] Initializing HikariCP Database Connection Pool (Max: 20)" },
    { type: "output", text: "[INFO] Executing PreparedStatement with Transaction Isolation level: SERIALIZABLE" },
    { type: "success", text: "✔ [PASS] 14/14 JUnit Test Suites Passed (100% Code Coverage)" },
    { type: "highlight", text: "[CLASS] Java Enterprise & OOP Specialization: Practical Lab Ready" }
  ],
  audit: [
    { type: "prompt", text: "alexi@automation:~$ sqlcmd -S PROD_CBS -Q 'EXEC sp_AutomateDailyAudit'" },
    { type: "output", text: "[CBS] Ingesting 248,500 End-Of-Day transaction records..." },
    { type: "output", text: "[RECON] Comparing CBS ledger entries against Switch clearing log..." },
    { type: "highlight", text: "[AUDIT] Zero Unmatched Discrepancies Detected." },
    { type: "success", text: "✔ [COMPLETE] Audit Dossier PDF Generated & Dispatched to Compliance" }
  ]
};

let currentTab = "banking";
let terminalInterval = null;
let currentLineIndex = 0;

function initTerminal() {
  const terminalBody = document.getElementById("terminal-body");
  const tabButtons = document.querySelectorAll(".term-tab-btn");

  if (!terminalBody) return;

  function renderTerminalOutput(tabKey) {
    if (terminalInterval) clearTimeout(terminalInterval);
    terminalBody.innerHTML = "";
    currentLineIndex = 0;
    const lines = terminalScripts[tabKey] || terminalScripts.banking;

    function printNextLine() {
      if (currentLineIndex >= lines.length) {
        const cursorLine = document.createElement("div");
        cursorLine.className = "term-line";
        cursorLine.innerHTML = `<span class="term-prompt">alexi@code-with-alexi:~$</span><span class="term-cursor"></span>`;
        terminalBody.appendChild(cursorLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
      }

      const item = lines[currentLineIndex];
      const lineDiv = document.createElement("div");
      lineDiv.className = "term-line";

      if (item.type === "prompt") {
        lineDiv.innerHTML = `<span class="term-prompt">▶</span><span class="term-cmd">${item.text}</span>`;
      } else if (item.type === "success") {
        lineDiv.innerHTML = `<span class="term-output term-success">${item.text}</span>`;
      } else if (item.type === "highlight") {
        lineDiv.innerHTML = `<span class="term-output term-highlight">${item.text}</span>`;
      } else {
        lineDiv.innerHTML = `<span class="term-output">${item.text}</span>`;
      }

      terminalBody.appendChild(lineDiv);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      currentLineIndex++;
      terminalInterval = setTimeout(printNextLine, 350);
    }

    printNextLine();
  }

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      tabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const tab = btn.getAttribute("data-tab");
      currentTab = tab;
      renderTerminalOutput(tab);
    });
  });

  // Initial render
  renderTerminalOutput("banking");
}

document.addEventListener("DOMContentLoaded", initTerminal);
