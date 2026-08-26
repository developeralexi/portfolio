/**
 * INTERACTIVE TERMINAL & CODE SIMULATOR
 * Alexi Dhungel, Er. — High-Tech Hero Engineering Visualizer
 */

const terminalScripts = {
  banking: [
    { type: "prompt", text: "alexi@switch-core:~$ ./run_payment_switch.sh --service=DynamicQR --env=prod" },
    { type: "output", text: "[2026-08-26 15:04:02.112 UTC] [INIT] Initializing Banking Switch Gateway v4.2..." },
    { type: "output", text: "[SEC-KEY] Cryptographic HSM key exchange verified (AES-256-GCM / TLS 1.3)" },
    { type: "output", text: "[SOCKET] TCP Connection Established with National Clearing Switch (Latency: 11ms)" },
    { type: "highlight", text: "[ISO-8583] Ingesting MT-0200 Financial Transaction Request (Amount: NPR 15,000.00)" },
    { type: "output", text: "[CORE-CBS] Validating Account Balance & Risk Velocity Parameters... [PASSED]" },
    { type: "success", text: "✔ [SUCCESS] 200 OK | Settlement Confirmed | Ref: #TXN-20260826-9921 | Ack: 14ms" }
  ],
  java: [
    { type: "prompt", text: "alexi@edu-cluster:~$ javac -d ./bin -cp ./lib/* BankingAccountDao.java" },
    { type: "output", text: "[2026-08-26 15:04:10.420 UTC] [COMPILE] Compiling Java OOP Enterprise Architecture..." },
    { type: "output", text: "[THREAD-POOL] HikariCP Connection Pool Initialized (Min: 5, Max: 25, Timeout: 30000ms)" },
    { type: "output", text: "[JDBC] Executing PreparedStatement with Transaction Isolation: SERIALIZABLE" },
    { type: "success", text: "✔ [TEST-SUITE] 16/16 JUnit & Mockito Test Suites Passed (100% Branch Coverage)" },
    { type: "highlight", text: "[CLASSROOM] Java Enterprise, Spring Boot & Distributed Architecture: Lab Live" }
  ],
  csharp: [
    { type: "prompt", text: "alexi@dotnet-core:~$ dotnet run --project PaymentSwitch.Gateway.csproj" },
    { type: "output", text: "[2026-08-26 15:04:14.050 UTC] [DOTNET] Building .NET 8.0 High-Throughput Microservice..." },
    { type: "output", text: "[KESTREL] Listening on: https://0.0.0.0:5001 [HTTP/2, TLS 1.3]" },
    { type: "output", text: "[PIPELINE] MediatR Command Handlers Registered | MassTransit RabbitMQ Consumer Connected" },
    { type: "highlight", text: "[BENCHMARK] Sustained 45,000 Req/sec @ P99 Latency = 8.4ms" },
    { type: "success", text: "✔ [HEALTH] Readiness Probe: HEALTHY | FinTech Core Switch Online" }
  ],
  audit: [
    { type: "prompt", text: "alexi@automation:~$ sqlcmd -S PROD_FINTECH_CBS -Q 'EXEC sp_AutomateDailyAudit'" },
    { type: "output", text: "[2026-08-26 15:04:18.890 UTC] [INGEST] Ingesting 350,000+ End-Of-Day Transaction Ledger Records..." },
    { type: "output", text: "[RECON-ENGINE] Cross-matching Core CBS Ledger vs Switch Clearing Journal..." },
    { type: "highlight", text: "[AUDIT-CHECK] Reconciliation Status: 100% Balanced (Zero Unmatched Discrepancies)" },
    { type: "success", text: "✔ [COMPLETE] Automated Audit PDF Dossier Generated & Dispatched to Compliance Team" }
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
        cursorLine.innerHTML = `<span class="term-prompt">engine@alexidhungel:~$</span><span class="term-cursor"></span>`;
        terminalBody.appendChild(cursorLine);
        terminalBody.scrollTop = terminalBody.scrollHeight;
        return;
      }

      const item = lines[currentLineIndex];
      const lineDiv = document.createElement("div");
      lineDiv.className = "term-line";

      if (item.type === "prompt") {
        lineDiv.innerHTML = `<span class="term-prompt">⚡</span><span class="term-cmd">${item.text}</span>`;
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
      terminalInterval = setTimeout(printNextLine, 320);
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
