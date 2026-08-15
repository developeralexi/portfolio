/**
 * PORTFOLIO STRUCTURED DATA
 * Alexi Dhungel, Er. — "Code With Alexi"
 */

const portfolioData = {
  personal: {
    name: "Alexi Dhungel, Er.",
    titles: [
      "Computer Engineer",
      "Software Developer",
      "Digital Banking & FinTech Professional",
      "Java Instructor",
      "API & System Integration Developer"
    ],
    brandName: "Code With Alexi",
    experienceYears: "8+",
    email: "ingr.alexi@gmail.com",
    linkedin: "https://www.linkedin.com/in/alexi-dhungel-01b65b146/",
    github: "https://github.com/",
    youtube: "https://youtube.com/",
    bioShort: "Building reliable software, digital banking solutions, APIs, integrations and practical technology knowledge.",
    bioLong: "Alexi Dhungel is an experienced Computer Engineer with more than 8 years of hands-on expertise in software development, Java programming, digital financial services, enterprise banking systems, API integrations, automation, and academic instruction. Operating at the nexus of high-security banking infrastructure and modern software engineering, he architects resilient systems while empowering the next generation of engineers through rigorous mentorship."
  },

  stats: [
    {
      value: "8+",
      label: "Years Engineering Experience",
      icon: "code"
    },
    {
      value: "15+",
      label: "Banking & Payment Integrations",
      icon: "bank"
    },
    {
      value: "3+",
      label: "Instruction Domains & Curriculums",
      icon: "graduation"
    },
    {
      value: "100%",
      label: "Enterprise Reliability Focus",
      icon: "shield"
    }
  ],

  whatIBuild: [
    {
      id: "enterprise-apps",
      title: "Enterprise Applications",
      description: "Scalable, mission-critical software architectures designed for complex real-world business operations and regulatory compliance.",
      icon: "layers",
      tags: [".NET", "C#", "SQL Server", "Architecture"]
    },
    {
      id: "banking-technology",
      title: "Banking Technology",
      description: "High-security digital banking switches, loan management workflows, merchant POS systems, and dynamic payment settlement solutions.",
      icon: "landmark",
      tags: ["Dynamic QR", "Switch Integrations", "Security", "FinTech"]
    },
    {
      id: "api-integrations",
      title: "API & System Integration",
      description: "Resilient RESTful APIs and secure third-party connectors linking banking backends to government, utility, and switch networks.",
      icon: "network",
      tags: ["REST APIs", "OAuth2", "Webhooks", "JSON/XML"]
    },
    {
      id: "system-automation",
      title: "System Automation",
      description: "Transforming manual, repetitive business processes and compliance audits into efficient, event-driven digital workflows.",
      icon: "cpu",
      tags: ["Audit Automation", "Workflow Engines", "ETL", "Cron Services"]
    },
    {
      id: "java-applications",
      title: "Java Applications",
      description: "Core Java, Advanced Java, multi-tier enterprise systems, JDBC data layers, Servlets, and modular object-oriented components.",
      icon: "coffee",
      tags: ["Core Java", "JDBC", "Design Patterns", "JavaFX"]
    },
    {
      id: "technical-education",
      title: "Technical Education",
      description: "Demystifying complex software engineering concepts, OOP, and data access through practical real-world lab demonstrations.",
      icon: "book-open",
      tags: ["OOP", "Mentoring", "Clean Code", "Workshops"]
    }
  ],

  experience: [
    {
      role: "Officer – Digital Transformation / Internal Developer",
      period: "June 2020 – Present",
      location: "Kathmandu, Nepal",
      technologies: [".NET", "C#", "SQL Server", "REST APIs", "Banking Integration", "Automation", "Dynamic QR"],
      highlights: [
        "Architected and delivered core Loan Management Systems streamlining credit approval workflows and compliance verification across nationwide branches.",
        "Engineered Audit Automation & Internal Banking Automations, significantly reducing manual verification turnaround time.",
        "Integrated high-volume Payment Switches & Merchant Systems including Unified GCM, SSA, Smart QR, POS/QR Merchant networks, and Dynamic QR.",
        "Implemented Government Revenue Payment and Social Security Payment integrations for automated citizen fund settlements.",
        "Integrated CIC (Credit Information Bureau) Blacklisting automation and dynamic risk check pipelines.",
        "Engineered Eservice/Iserve self-service banking automations and internal customer-facing chatbot engines."
      ],
      tags: ["Digital Banking", "Payment Gateway", "Core Switch", "Audit Automation", "Government Revenue"]
    },
    {
      role: "Senior ASP.NET Developer / Team Leader",
      period: "2017 – 2020",
      location: "Kathmandu, Nepal",
      technologies: ["ASP.NET", "C#", "SQL Server", "Xamarin", "SQLite", "Web APIs"],
      highlights: [
        "Led engineering team through full software lifecycle: solution design, technical research, development documentation, and sprint delivery.",
        "Architected Microfinance Banking Solutions, delivering complete loan origination, ledger accounting, and branch reconciliation modules.",
        "Engineered Enterprise 2FA (Two-Factor Authentication) security system to safeguard enterprise transactions.",
        "Developed Customer Banking & Branchless Banking (BLB) mobile applications using Xamarin and SQLite local caching.",
        "Engineered scalable Web APIs connecting distributed mobile field devices to centralized SQL Server databases."
      ],
      tags: ["Microfinance", "Team Leadership", "2FA Security", "Mobile Banking", "Branchless Banking"]
    }
  ],

  teaching: [
    {
      expertise: "Java Enterprise & Component Architecture",
      subject: "Object & Component Technology (JavaBeans / GUI / Multi-Tier)",
      period: "Specialized Instruction",
      badge: "Enterprise Focus",
      topics: [
        "Reusable Software Components & JavaBeans Architecture",
        "Swing & JavaFX Desktop Component Engineering",
        "Multi-Tier Enterprise Application Models",
        "Event Delegation Models & Component Lifecycle",
        "Enterprise System Patterns & Industry Best Practices"
      ]
    },
    {
      expertise: "Core Java & Object-Oriented Architecture",
      subject: "OOP Design Principles, JDBC Transactions & Servlets",
      period: "Engineering Instruction",
      badge: "Core Engineering",
      topics: [
        "Object-Oriented Design, Polymorphism & Abstraction",
        "JDBC & Database Transaction Management",
        "Java Servlets & Web Container Execution Models",
        "Software Design Patterns (Factory, Singleton, DAO)",
        "Production-Grade Java Component Implementation"
      ]
    },
    {
      expertise: "Advanced Java & Systems Concurrency",
      subject: "Multi-Threading, Streams, Network & Robust Systems",
      period: "Advanced Instruction",
      badge: "Advanced Systems",
      topics: [
        "Advanced Multi-Threading, Concurrency & Thread Pooling",
        "Java Collections Framework, Generics & Functional Streams",
        "Socket Programming & Network Communications",
        "Clean Architecture & Defensive Coding Standards",
        "Automated Unit Testing & Robust Exception Handling"
      ]
    }
  ],

  skills: [
    // Programming
    { name: "Java", category: "programming", level: "Senior / Instructor", icon: "coffee" },
    { name: "C#", category: "programming", level: "Senior / 8+ Yrs", icon: "code" },
    { name: ".NET Framework / Core", category: "programming", level: "Senior", icon: "layers" },
    { name: "JavaScript (ES6+)", category: "programming", level: "Proficient", icon: "terminal" },
    
    // Web Development
    { name: "ASP.NET & MVC", category: "web", level: "Senior", icon: "globe" },
    { name: "Web API / RESTful Services", category: "web", level: "Expert", icon: "network" },
    { name: "HTML5 & CSS3", category: "web", level: "Proficient", icon: "layout" },
    { name: "Modern Vanilla JS", category: "web", level: "Proficient", icon: "code" },
    
    // Database
    { name: "Microsoft SQL Server", category: "database", level: "Senior / DBA Level", icon: "database" },
    { name: "MySQL", category: "database", level: "Proficient", icon: "database" },
    { name: "SQLite", category: "database", level: "Proficient", icon: "database" },
    { name: "T-SQL / Stored Procedures / Indexes", category: "database", level: "Expert", icon: "database" },

    // Enterprise & Integration
    { name: "Banking System Integration", category: "enterprise", level: "Specialist", icon: "landmark" },
    { name: "Payment Switch & Dynamic QR", category: "enterprise", level: "Specialist", icon: "qr-code" },
    { name: "Third-party API Integration", category: "enterprise", level: "Expert", icon: "cpu" },
    { name: "Authentication & Authorization (OAuth2/JWT)", category: "enterprise", level: "Expert", icon: "shield" },
    { name: "Cryptography & Data Encryption", category: "enterprise", level: "Senior", icon: "lock" },
    { name: "Government Revenue / SSA Integrations", category: "enterprise", level: "Specialist", icon: "check-circle" },

    // Development Practices
    { name: "Git Version Control", category: "practices", level: "Proficient", icon: "git-branch" },
    { name: "SVN (Subversion)", category: "practices", level: "Experienced", icon: "folder" },
    { name: "Agile & Scrum Methodology", category: "practices", level: "Team Lead", icon: "users" },
    { name: "Software Architecture & Design Patterns", category: "practices", level: "Architect", icon: "box" },
    { name: "System Automation & ETL", category: "practices", level: "Senior", icon: "zap" }
  ],

  projects: [
    {
      id: "sol-digital-banking",
      title: "Digital Banking & Payment Switch Solutions",
      category: "banking",
      domain: "FinTech Architecture",
      shortDesc: "Resilient middleware and payment switch integration architecture for secure high-concurrency transaction processing and automated reconciliation.",
      fullDesc: "Enterprise-grade digital banking middleware engineered for high-availability transaction processing. Incorporates ISO 8583 and REST switch communication, hardware-backed payload encryption, automated multi-ledger reconciliation, and real-time audit logging.",
      technologies: [".NET Core", "C#", "MS SQL Server", "REST APIs", "ISO 8583", "Dynamic QR", "AES-256", "OAuth2"],
      highlights: [
        "Engineered mission-critical transaction flows with end-to-end cryptographic integrity",
        "Automated multi-system settlement reconciliation and anomaly detection",
        "High-throughput microservices layer connecting banking core to external payment switches"
      ]
    },
    {
      id: "sol-loan-automation",
      title: "Enterprise Workflow & Loan Management Solutions",
      category: "enterprise",
      domain: "Process Automation",
      shortDesc: "End-to-end digital appraisal, configurable multi-tier approval hierarchies, and automated credit bureau inquiry pipelines.",
      fullDesc: "A generalized enterprise workflow and credit lifecycle automation platform. Features configurable role-based approval matrices, credit scoring calculation engines, document verification audit trails, and automated collateral tracking.",
      technologies: [".NET", "C#", "MS SQL Server", "Web API", "Workflow Engines", "ETL Services"],
      highlights: [
        "Streamlined credit origination and approval workflows across nationwide networks",
        "Configurable role-based approval matrices adhering to central bank regulatory standards",
        "Integrated real-time credit bureau and automated risk screening connectors"
      ]
    },
    {
      id: "sol-dynamic-qr",
      title: "Dynamic QR & Merchant Settlement Infrastructure",
      category: "banking",
      domain: "Payment Gateway",
      shortDesc: "Payload-driven Dynamic QR generation, asynchronous webhook listeners, and merchant POS settlement integrations.",
      fullDesc: "High-security backend APIs for instant generation and validation of EMVCo-compliant Dynamic QR codes. Supports dynamic invoice binding, cryptographic HMAC signature verification, zero-drop webhook listener queues, and automated batch settlements.",
      technologies: ["C#", "ASP.NET Web API", "EMVCo Standard", "Webhooks", "SHA-256", "MS SQL Server"],
      highlights: [
        "Sub-200ms QR payload generation with SHA-256 digital signature validation",
        "Zero-drop webhook listener architecture with automated exponential retry queues",
        "Direct integration with merchant billing systems and national payment rails"
      ]
    },
    {
      id: "sol-audit-recon",
      title: "Automated Audit & Compliance Reconciliation Engines",
      category: "enterprise",
      domain: "System Automation",
      shortDesc: "Automated scheduled ingestion, rule-based verification, and zero-discrepancy compliance reporting pipelines.",
      fullDesc: "High-volume data reconciliation architecture engineered to eliminate manual financial auditing. Ingests end-of-day transaction logs from disparate banking subsystems, executes deterministic matching rules, and generates instant compliance dossiers.",
      technologies: ["T-SQL", "MS SQL Server", "C#", "Scheduled Background Services", "ETL Pipelines"],
      highlights: [
        "100% automated audit coverage replacing manual sampling procedures",
        "Sub-minute execution across hundreds of thousands of daily financial records",
        "Automated discrepancy exception routing and compliance audit trails"
      ]
    },
    {
      id: "sol-security-2fa",
      title: "Enterprise 2FA & Identity Security Microservices",
      category: "fintech",
      domain: "Identity & Cryptography",
      shortDesc: "Time-based token verification (TOTP), SMS gateways, encryption at rest, and audit tracing to safeguard sensitive operations.",
      fullDesc: "A dedicated authentication and cryptographic security microservice providing multi-factor authentication, time-window validation, rate limiting, and replay attack prevention for mission-critical financial transactions.",
      technologies: ["ASP.NET", "C#", "MS SQL Server", "TOTP / SMS Gateway", "OAuth2", "JWT", "AES-256"],
      highlights: [
        "Time-window token validation with cryptographic replay prevention",
        "Multi-channel authentication delivery with fallback mechanisms",
        "Comprehensive security audit logging satisfying regulatory standards"
      ]
    },
    {
      id: "sol-mobile-fintech",
      title: "Mobile FinTech & Offline Data Sync Architecture",
      category: "fintech",
      domain: "Mobile Systems",
      shortDesc: "Distributed field client applications featuring local SQLite caching, offline transactional queuing, and secure API sync.",
      fullDesc: "Cross-platform mobile client architecture enabling field operations with offline transaction caching, local database synchronization, biometric security, and portable hardware device integration.",
      technologies: ["Xamarin / Cross-Platform", "C#", "SQLite Local DB", "RESTful Web APIs", "Bluetooth Hardware"],
      highlights: [
        "Offline transaction caching with automatic conflict-free synchronization on reconnect",
        "Thermal printer hardware integration for immediate physical receipts",
        "Optimized resource footprint with robust local SQLite database encryption"
      ]
    },
    {
      id: "sol-financial-ledger",
      title: "Core Financial Accounting & Double-Entry Ledger Systems",
      category: "fintech",
      domain: "Ledger Architecture",
      shortDesc: "High-integrity multi-branch financial accounting engines supporting real-time transaction reconciliation and balance sheet reporting.",
      fullDesc: "Comprehensive financial accounting core engineered for strict double-entry bookkeeping, multi-branch ledger synchronization, compulsory savings accounting, and automated generation of statutory balance sheets and profit/loss statements.",
      technologies: ["ASP.NET", "C#", "MS SQL Server", "Stored Procedures", "T-SQL", "Data Replication"],
      highlights: [
        "Strict double-entry ledger architecture with transactional consistency guarantees",
        "Automated generation of statutory balance sheets and trial balances",
        "Multi-branch replication handling low-bandwidth network environments"
      ]
    },
    {
      id: "sol-java-enterprise",
      title: "Java Enterprise & Component Application Systems",
      category: "enterprise",
      domain: "Java Architecture",
      shortDesc: "Multi-tier enterprise systems utilizing DAO design patterns, JDBC connection pooling, and multi-threaded event handlers.",
      fullDesc: "Modular Java architectures built on clean object-oriented design principles. Implements data access abstraction layers (DAO pattern), high-performance connection pooling, robust concurrency controls, and modular component technology.",
      technologies: ["Core Java", "Advanced Java", "JDBC", "Design Patterns (DAO/Factory)", "JavaFX / Swing", "Servlets"],
      highlights: [
        "Decoupled data access layers using DAO and Abstract Factory patterns",
        "High-performance database connection pooling and atomic transaction control",
        "Multi-threaded socket communication and event handling models"
      ]
    }
  ],

  articles: [
    {
      id: "art-java-design-patterns",
      title: "Practical Design Patterns in Enterprise Java Applications",
      category: "Java",
      readTime: "6 min read",
      summary: "Explore how Singleton, Factory, and DAO patterns establish maintainable database abstraction layers in production Java systems.",
      content: `### Why Design Patterns Matter in Production Java

In enterprise software engineering, code is written once but maintained for decades. When building multi-tier architectures with Java, applying established software design patterns is not an academic exercise—it is essential for code maintainability, testability, and decoupling.

#### 1. The Data Access Object (DAO) Pattern
The DAO pattern separates low-level data accessing operations from high-level business services.

\`\`\`java
public interface AccountDao {
    Account findById(long accountId) throws SQLException;
    boolean transferFunds(long sourceId, long destId, BigDecimal amount);
}
\`\`\`

#### 2. Connection Pooling & PreparedStatements
Always avoid string concatenation in SQL queries to prevent SQL Injection vulnerabilities:

\`\`\`java
String query = "SELECT * FROM Accounts WHERE AccountNumber = ? AND Status = ?";
try (PreparedStatement pstmt = connection.prepareStatement(query)) {
    pstmt.setString(1, accNumber);
    pstmt.setString(2, "ACTIVE");
    ResultSet rs = pstmt.executeQuery();
    // Process resultSet
}
\`\`\`

#### Key Takeaway
By combining DAO abstractions with connection pooling and atomic transactions, we ensure our banking data layer remains bulletproof and scalable.`
    },
    {
      id: "art-banking-api-security",
      title: "Architecting Resilient & Secure Banking APIs",
      category: "Banking Tech",
      readTime: "8 min read",
      summary: "A deep dive into payload encryption, HMAC signatures, idempotent transactions, and zero-trust authentication in financial switches.",
      content: `### Principles of Financial-Grade API Security

When exposing endpoints that execute monetary debits and credits, standard web security is insufficient. Every request must be strictly validated, signed, authenticated, and guarded against replay attacks.

#### Core Pillars:
1. **Idempotency Keys**: Guaranteeing that duplicate network requests (e.g. from network timeouts) never result in double debits.
2. **HMAC-SHA256 Payload Signing**: Ensuring request data cannot be tampered with in transit between client and payment switch.
3. **Mutual TLS (mTLS)**: Enforcing certificate validation at both ends of the transport socket.
4. **Sub-second Timeout Deadlines**: Preventing cascading thread starvation in high-throughput banking gateways.

\`\`\`csharp
// Example Idempotency Guard in .NET C#
public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request, [FromHeader] string IdempotencyKey)
{
    if (await _cache.ExistsAsync(IdempotencyKey))
    {
        return Ok(await _cache.GetPreviousResultAsync(IdempotencyKey));
    }
    
    var result = await _switchService.ExecuteDebitAsync(request);
    await _cache.SaveResultAsync(IdempotencyKey, result);
    return Ok(result);
}
\`\`\``
    },
    {
      id: "art-sql-optimization",
      title: "SQL Server Performance Tuning for High-Volume Ledgers",
      category: "DBMS",
      readTime: "7 min read",
      summary: "Indexing strategies, execution plan analysis, and stored procedure optimization for tables handling millions of financial entries.",
      content: `### High-Throughput Ledger Optimization in SQL Server

Financial ledgers grow by millions of rows monthly. Without careful indexing and query tuning, end-of-day reconciliation queries can choke the entire database engine.

#### 1. Clustered Index Key Selection
Never use GUIDs (UUIDs) as clustered index keys on write-heavy transaction tables due to page splitting. Prefer sequential \`BIGINT IDENTITY\` keys.

#### 2. Covering Non-Clustered Indexes with INCLUDE Columns
\`\`\`sql
CREATE NONCLUSTERED INDEX IX_Transactions_AccountDate
ON dbo.AccountTransactions (AccountId, TransactionDate DESC)
INCLUDE (Amount, BalanceAfter, ReferenceNumber);
\`\`\`

#### 3. Avoiding Non-SARGable Queries
Avoid wrapping indexed columns inside functions in the WHERE clause:
- **Bad**: \`WHERE YEAR(TransactionDate) = 2026\`
- **Good**: \`WHERE TransactionDate >= '2026-01-01' AND TransactionDate < '2027-01-01'\``
    },
    {
      id: "art-dynamic-qr-standards",
      title: "Demystifying Dynamic QR Codes in Digital Payments",
      category: "Payment Integration",
      readTime: "5 min read",
      summary: "Understanding EMVCo QR specifications, CRC16 checksum verification, and webhook callback lifecycles.",
      content: `### How Dynamic QR Codes Work Under the Hood

Unlike static QR codes that merely encode a static merchant ID, Dynamic QR codes encapsulate invoice details, unique reference tokens, expiration timestamps, and cryptographic checksums.

#### EMVCo TLV Format
Dynamic QR codes use a Tag-Length-Value (TLV) structure:
- **Tag 00**: Payload Format Indicator (e.g. \`01\`)
- **Tag 01**: Point of Initiation Method (\`12\` for Dynamic QR)
- **Tag 54**: Transaction Amount (e.g. \`1500.00\`)
- **Tag 58**: Country Code (\`NP\`)
- **Tag 63**: CRC Checksum (4 hex characters)

When scanned, the payer app parses the TLV string, confirms the CRC16 hash, and initiates a verified debit request directly to the switch.`
    },
    {
      id: "art-oop-teaching-philosophy",
      title: "Teaching Object-Oriented Concepts: From Syntax to System Design",
      category: "Teaching & Mentoring",
      readTime: "5 min read",
      summary: "How hands-on project-based pedagogy bridges the gap between academic theory and real-world engineering careers.",
      content: `### The Bridge from Syntax to Software Engineering

In academic classrooms, students often learn Java syntax—loops, classes, methods—without understanding *why* encapsulation, polymorphism, and modular architectures matter in industry.

#### The 3-Stage Teaching Framework:
1. **The Problem First**: Introduce a messy, monolithic snippet and show how changing one feature breaks unrelated modules.
2. **The Refactor**: Introduce OOP principles (Inheritance, Polymorphism, Dependency Injection) as the mathematical solution to reduce complexity.
3. **The Production Simulation**: Build mini-banking systems or ticket engines with realistic constraints (data persistence, exception handling, clean logs).`
    },
    {
      id: "art-automation-audit",
      title: "Automating Banking Compliance and Internal Audit Workflows",
      category: "Automation",
      readTime: "6 min read",
      summary: "Transforming manual multi-spreadsheet audit verification into automated scheduled reconciliation pipelines.",
      content: `### Eliminating Human Error in Banking Audit

Internal banking compliance requires verifying thousands of daily transactions across disparate subsystems: core banking (CBS), card switches, merchant settlement accounts, and clearing houses.

#### The Automation Architecture:
- **Scheduled Ingestion Service**: Pulls EOD transaction logs from various data sources.
- **Rules & Validation Engine**: Runs deterministic validation checks (e.g. CBS debit == Switch credit).
- **Discrepancy Exception Router**: Flags unmatched entries and automatically generates audit report dossiers for immediate review.

By automating these processes, banks achieve 100% audit coverage rather than relying on periodic sample inspections.`
    }
  ],

  education: [
    {
      degree: "Master's in Business Administration (MBA)",
      field: "Strategic Management & Technology Leadership",
      period: "Postgraduate Degree",
      badge: "Executive Leadership",
      description: "Specialization in strategic management, technology leadership, business analytics, and enterprise decision-making."
    },
    {
      degree: "Bachelor's Degree in Computer Engineering (B.E.)",
      field: "Software Engineering & Computer Systems",
      period: "Engineering Degree",
      badge: "Core Engineering",
      description: "Specialized engineering curriculum covering software development, computer architecture, database management systems, algorithms, and secure network engineering."
    },
    {
      degree: "Registered Computer Engineer",
      field: "Nepal Engineering Council (NEC) Professional License",
      period: "Licensed Professional — 2017",
      badge: "Professional License",
      description: "Official governmental professional engineering licensure credential (Er. title) recognizing technical competence and professional software practice."
    }
  ]
};

if (typeof module !== "undefined") {
  module.exports = portfolioData;
}
