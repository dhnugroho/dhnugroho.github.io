'use strict';
/* ============================================
   CHATBOT.JS — Smart Portfolio Assistant
   Pure Vanilla JS — Zero Dependencies
   Static rule-based chatbot for GitHub Pages
   ============================================ */

(function () {

  // =========================================
  // 1. KNOWLEDGE BASE
  // =========================================
  var KB = {

    owner: {
      name: 'Dhani Nugroho',
      role: 'Full-stack Engineer & Data Architect',
      location: 'Jakarta, Indonesia',
      email: 'dhnugroho.dev@gmail.com',
      linkedin: 'https://www.linkedin.com/in/dhnugroho/',
      philosophy: 'Pragmatic Programmer — understand the root cause first, find the right solution, then choose the best technology.'
    },

    greeting: [
      "Hi there! 👋 I'm Dhani's virtual assistant. How can I help you today?",
      "Hello! 👋 Welcome to Dhani's portfolio. What would you like to know?",
      "Hey! 👋 I'm here to help you learn more about Dhani's work. Ask me anything!"
    ],

    about: "Dhani Nugroho is a Full-stack Engineer & Data Architect based in Jakarta, Indonesia. With 10+ years of progressive experience spanning implementation, data engineering, software development, and data architecture — he brings a pragmatic, ethics-first approach to problem solving. His philosophy: understand the root cause first, find the right solution, then choose the best technology. Currently exploring AI integration while staying grounded in real-world problem solving.",

    experience: [
      { period: '2023 — Present', role: 'Full-stack Engineer & Data Architect', desc: 'Hybrid Full-stack + Data role — architecting data platforms, building analytics engineering pipelines, and designing end-to-end data infrastructure.', tags: ['dbt', 'Snowflake', 'Airflow', 'Data Modeling', 'React', 'Node.js'] },
      { period: '2020 — 2023', role: 'Software Engineer', desc: 'Software architecture, frontend & backend development. Led full-stack development across multiple enterprise web applications including CSR platform, Big Data Uploader, and Travel Management System.', tags: ['ASP.NET', 'JavaScript', 'SQL Server', 'REST API', 'System Architecture'] },
      { period: '2016 — 2020', role: 'Data Engineer', desc: 'Designed and maintained data pipelines, ETL processes, database optimization. Built enterprise data warehousing solutions using SSIS, Pentaho, and Denodo.', tags: ['SSIS', 'Pentaho', 'Denodo', 'Power BI', 'Tableau', 'Data Warehouse'] },
      { period: '2015 — 2016', role: 'Implementor', desc: 'System deployment, client onboarding, and user training. Foundation of enterprise software delivery.', tags: ['System Deployment', 'Client Onboarding', 'User Training'] }
    ],

    skills: {
      'Software Engineering': ['Frontend Development (90%)', 'Backend Development (85%)', 'ASP.NET / .NET Framework (82%)', 'System Architecture (80%)'],
      'Data & Analytics': ['Data Pipeline / ETL (88%)', 'SQL & Database Design (90%)', 'Business Intelligence (82%)', 'Data Warehousing (80%)'],
      'Tools & Platforms': ['Git & Version Control (85%)', 'Cloud Platforms (75%)', 'CI/CD Pipelines (72%)', 'Docker / Containers (70%)'],
      'Leadership & Delivery': ['Project Management (85%)', 'Technical Lead (82%)', 'Client Onboarding (85%)', 'Team Collaboration (90%)'],
      'Data Integration': ['SSIS ETL', 'Pentaho (Kettle)', 'Talend Studio', 'Azure Data Factory', 'BI Data Preparation', 'Data Virtualization (Denodo)', 'Migration & Cleansing', 'Data Warehousing']
    },

    projects: [
      { name: 'CSR Web Application', role: 'Individual Contributor — Full-Stack Engineer', desc: 'End-to-end CSR & Budget Management System with interactive geospatial mapping across Indonesia, dynamic priority scoring, and multi-level approval workflows.', tags: ['Full-Stack', 'Budget Management', 'OpenStreetMap', 'Approval Flow', 'Dashboard'] },
      { name: 'Big Data Platform', role: 'Project Manager & Technical Lead', desc: 'Centralized data platform enabling enterprise-wide data virtualization. Integrated Salesforce via background API sync plus a multi-dataset web uploader (.NET) feeding BI dashboards.', tags: ['Big Data', 'Salesforce API', '.NET', 'Denodo', 'Power BI', 'ETL'] },
      { name: 'Travel Management System', role: 'Team — Full-Stack Developer', desc: 'Enterprise travel management covering the complete trip lifecycle — from request and multi-level approval to self-reservation of flights, hotels & trains, plus settlement and SAP vendor payment integration.', tags: ['Full-Stack', 'SAP', 'HR System', 'Self-Reservation', 'Settlement'] },
      { name: 'Front End Development', role: 'Front-End Developer — 3 Clients', desc: 'Frontend across three enterprise clients: CRM door-prize golden ticket system (Fortune, Philippines), mobile employee rewards portal, and hotel reservation web app.', tags: ['CRM', 'Responsive', '.NET Backend', 'Hotel Booking', 'Golden Ticket'] }
    ],

    portfolio: [
      { name: 'Vector Illustration', desc: 'Vector illustrations and silhouette designs built with Corel Draw.', tags: ['Corel Draw', 'Vector', 'Design'] },
      { name: 'Travel Web Application', desc: 'Mockup-to-code implementation with HTML, CSS & JS frontend and ASP.NET backend.', tags: ['HTML/CSS', 'JavaScript', 'ASP.NET'] },
      { name: 'Digital Portfolio', desc: 'Personal portfolio website built with customized Bootstrap template.', tags: ['Bootstrap', 'HTML', 'CSS'] },
      { name: 'CRM Mobile', desc: 'Mobile-optimized web CRM application built with jQuery.', tags: ['jQuery', 'Mobile', 'CRM'] },
      { name: 'Hotel Reservation', desc: 'Hotel booking page built from scratch with HTML & CSS.', tags: ['HTML', 'CSS', 'Web Design'] },
      { name: 'Custom CRM & CMS', desc: 'Tailored CRM solution with complete UI/UX revamp for Philippine market.', tags: ['UI/UX', 'CMS', 'Backend', 'CRM'] }
    ],

    contact: "You can reach Dhani via:\n• 📧 Email: dhnugroho.dev@gmail.com\n• 💼 LinkedIn: linkedin.com/in/dhnugroho\n• 📍 Based in: Jakarta, Indonesia\n\nFeel free to say hello!",

    fallback: [
      "I'm not sure I understand that. Try asking about Dhani's **skills**, **experience**, **projects**, or **contact info**!",
      "Hmm, I don't have info on that. I can tell you about Dhani's **career**, **portfolio**, **skills**, or how to **get in touch**!",
      "I didn't catch that. Here are some things I can help with: **skills**, **projects**, **experience**, **about**, or **contact**."
    ]
  };


  // =========================================
  // 2. INTENT MATCHING ENGINE
  // =========================================
  var intents = [
    { id: 'greeting',    keywords: ['hi', 'hello', 'hey', 'halo', 'yo', 'sup', 'good morning', 'good evening', 'good afternoon', 'howdy', 'what\'s up', 'greetings'] },
    { id: 'about',       keywords: ['about', 'who', 'tell me', 'introduce', 'yourself', 'dhani', 'background', 'bio', 'profile', 'siapa'] },
    { id: 'experience',  keywords: ['experience', 'career', 'work', 'job', 'timeline', 'history', 'role', 'position', 'years', 'pengalaman', 'karir'] },
    { id: 'skills',      keywords: ['skill', 'skills', 'tech', 'technology', 'stack', 'tools', 'capability', 'capabilities', 'programming', 'language', 'framework', 'keahlian'] },
    { id: 'projects',    keywords: ['project', 'projects', 'showcase', 'built', 'develop', 'application', 'app', 'system', 'proyek'] },
    { id: 'portfolio',   keywords: ['portfolio', 'design', 'work', 'gallery', 'vector', 'illustration', 'crm', 'hotel', 'portofolio'] },
    { id: 'contact',     keywords: ['contact', 'email', 'reach', 'connect', 'linkedin', 'hire', 'message', 'mail', 'hubungi', 'kontak'] },
    { id: 'location',    keywords: ['where', 'location', 'based', 'city', 'country', 'live', 'lokasi', 'dimana'] },
    { id: 'philosophy',  keywords: ['philosophy', 'pragmatic', 'approach', 'principle', 'belief', 'value', 'ethics', 'prinsip', 'filosofi'] },
    { id: 'ai',          keywords: ['ai', 'artificial intelligence', 'machine learning', 'llm', 'gpt', 'prompt', 'rag', 'mcp'] },
    { id: 'thanks',      keywords: ['thank', 'thanks', 'thx', 'appreciate', 'terima kasih', 'makasih'] },
    { id: 'help',        keywords: ['help', 'what can you', 'options', 'menu', 'bantuan'] },
    { id: 'navigation',  keywords: ['navigate', 'go to', 'show me', 'jump', 'scroll', 'section'] }
  ];

  function matchIntent(input) {
    var lower = input.toLowerCase().trim();
    if (!lower) return 'help';

    var bestMatch = null;
    var bestScore = 0;

    for (var i = 0; i < intents.length; i++) {
      var intent = intents[i];
      var score = 0;
      for (var j = 0; j < intent.keywords.length; j++) {
        if (lower.indexOf(intent.keywords[j]) !== -1) {
          // Longer keyword matches score higher
          score += intent.keywords[j].length;
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = intent.id;
      }
    }

    return bestMatch || 'fallback';
  }


  // =========================================
  // 3. RESPONSE FORMATTER
  // =========================================
  function getResponse(intentId) {
    var text = '';
    var chips = [];

    switch (intentId) {

      case 'greeting':
        text = KB.greeting[Math.floor(Math.random() * KB.greeting.length)];
        chips = ['About Dhani', 'Skills', 'Projects', 'Contact'];
        break;

      case 'about':
        text = KB.about;
        chips = ['Experience', 'Skills', 'Contact'];
        break;

      case 'experience':
        text = "📋 **Dhani's Career Timeline** (10+ years):\n\n";
        for (var i = 0; i < KB.experience.length; i++) {
          var exp = KB.experience[i];
          text += '**' + exp.period + '** — ' + exp.role + '\n';
          text += exp.desc + '\n\n';
        }
        text += "_Currently exploring AI integration as an AI-Augmented Problem Solver (2025–Now)._";
        chips = ['Skills', 'Projects', 'About'];
        break;

      case 'skills':
        text = "🛠️ **Dhani's Technical Skills**:\n\n";
        var groups = Object.keys(KB.skills);
        for (var g = 0; g < groups.length; g++) {
          text += '**' + groups[g] + ':**\n';
          var items = KB.skills[groups[g]];
          for (var s = 0; s < items.length; s++) {
            text += '• ' + items[s] + '\n';
          }
          text += '\n';
        }
        chips = ['Projects', 'Experience', 'Contact'];
        break;

      case 'projects':
        text = "🚀 **Project Showcase**:\n\n";
        for (var p = 0; p < KB.projects.length; p++) {
          var proj = KB.projects[p];
          text += '**' + proj.name + '**\n';
          text += '_' + proj.role + '_\n';
          text += proj.desc + '\n';
          text += 'Tags: ' + proj.tags.join(', ') + '\n\n';
        }
        chips = ['Portfolio', 'Skills', 'Contact'];
        break;

      case 'portfolio':
        text = "🎨 **Portfolio Collection**:\n\n";
        for (var w = 0; w < KB.portfolio.length; w++) {
          var work = KB.portfolio[w];
          text += '**' + work.name + '** — ' + work.desc + '\n';
          text += 'Tags: ' + work.tags.join(', ') + '\n\n';
        }
        text += "Click any portfolio card on the page to see full details!";
        chips = ['Projects', 'Skills', 'About'];
        break;

      case 'contact':
        text = KB.contact;
        chips = ['About Dhani', 'Skills', 'Projects'];
        break;

      case 'location':
        text = "📍 Dhani is based in **Jakarta, Indonesia**. He's open to remote collaborations worldwide!";
        chips = ['Contact', 'About Dhani'];
        break;

      case 'philosophy':
        text = "💡 **Dhani's Philosophy:**\n\n\"" + KB.owner.philosophy + "\"\n\nIn the AI era, the advantage isn't in who adopts the latest tools fastest — it's in who is wise enough to understand the real problem before choosing a solution.\n\n_Garbage in = garbage out — applies to data, prompts, and business decisions._";
        chips = ['Experience', 'Skills', 'About'];
        break;

      case 'ai':
        text = "🤖 **AI & Future Direction:**\n\nDhani is currently exploring AI integration as an **AI-Augmented Problem Solver** (2025–Now), focusing on:\n\n• LLM Integration\n• AI Pipelines\n• RAG (Retrieval-Augmented Generation)\n• Prompt Engineering\n• MCP (Model Context Protocol)\n\nHis guiding principles:\n• Always ask: _what real problem is this solving?_\n• Deep dive to root cause before deploying models\n• AI as an amplifier, not a replacement for critical thinking\n• Deliver concrete solutions — not just proof of concepts";
        chips = ['Skills', 'Experience', 'Philosophy'];
        break;

      case 'thanks':
        var thanksResponses = [
          "You're welcome! 😊 Let me know if there's anything else I can help with.",
          "Happy to help! 🙌 Feel free to ask more questions anytime.",
          "Glad I could help! Don't hesitate to reach out if you need anything else. 😊"
        ];
        text = thanksResponses[Math.floor(Math.random() * thanksResponses.length)];
        chips = ['About Dhani', 'Contact'];
        break;

      case 'help':
        text = "I can help you learn more about Dhani! Here's what I know about:\n\n• **About** — Who is Dhani?\n• **Experience** — 10+ year career timeline\n• **Skills** — Technical capabilities\n• **Projects** — Major project showcase\n• **Portfolio** — Design & development work\n• **Contact** — How to reach Dhani\n• **Philosophy** — Pragmatic approach\n• **AI** — Future direction & AI exploration\n\nJust ask or tap a suggestion below! 👇";
        chips = ['About Dhani', 'Skills', 'Projects', 'Contact'];
        break;

      case 'navigation':
        text = "📌 **Quick Navigation:**\n\nYou can jump to any section:\n• Portfolio — design & dev work\n• Projects — deep-dive showcase\n• Experience — career timeline\n• Skills — technical capabilities\n• Notes — personal reflections\n• About — background info\n• Contact — get in touch\n\nOr just scroll through the page! 😊";
        chips = ['About Dhani', 'Contact'];
        break;

      default:
        text = KB.fallback[Math.floor(Math.random() * KB.fallback.length)];
        chips = ['About Dhani', 'Skills', 'Projects', 'Contact', 'Help'];
        break;
    }

    return { text: text, chips: chips };
  }


  // =========================================
  // 4. RICH TEXT RENDERER
  //    Converts markdown-lite to safe HTML
  // =========================================
  function renderMarkdown(text) {
    // Escape HTML first
    var escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Bold: **text**
    escaped = escaped.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: _text_
    escaped = escaped.replace(/\_(.+?)\_/g, '<em>$1</em>');
    // Line breaks
    escaped = escaped.replace(/\n/g, '<br>');

    return escaped;
  }


  // =========================================
  // 5. CHAT UI CONTROLLER
  // =========================================
  document.addEventListener('DOMContentLoaded', function () {

    var chatFab = document.getElementById('chatbotFab');
    var chatPanel = document.getElementById('chatbotPanel');
    var chatClose = document.getElementById('chatbotClose');
    var chatMessages = document.getElementById('chatbotMessages');
    var chatInput = document.getElementById('chatbotInput');
    var chatSend = document.getElementById('chatbotSend');

    if (!chatFab || !chatPanel) return;

    var isOpen = false;
    var hasGreeted = false;

    // --- Open / Close ---
    function toggleChat() {
      isOpen = !isOpen;
      chatPanel.classList.toggle('chatbot-open', isOpen);
      chatFab.classList.toggle('chatbot-fab-hidden', isOpen);

      if (isOpen) {
        chatFab.setAttribute('aria-expanded', 'true');
        if (!hasGreeted) {
          hasGreeted = true;
          var greeting = getResponse('greeting');
          appendBotMessage(greeting.text, greeting.chips);
        }
        setTimeout(function () {
          if (chatInput) chatInput.focus();
        }, 300);
      } else {
        chatFab.setAttribute('aria-expanded', 'false');
      }
    }

    chatFab.addEventListener('click', toggleChat);

    if (chatClose) {
      chatClose.addEventListener('click', function () {
        if (isOpen) toggleChat();
      });
    }

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) toggleChat();
    });

    // --- Message Rendering ---
    function appendBotMessage(text, chips) {
      // Typing indicator
      var typing = document.createElement('div');
      typing.className = 'chatbot-msg chatbot-msg-bot chatbot-typing';
      typing.innerHTML = '<span class="chatbot-dot"></span><span class="chatbot-dot"></span><span class="chatbot-dot"></span>';
      chatMessages.appendChild(typing);
      scrollToBottom();

      var delay = 400 + Math.floor(Math.random() * 500);

      setTimeout(function () {
        // Remove typing indicator
        if (typing.parentNode) typing.parentNode.removeChild(typing);

        // Bot message
        var msg = document.createElement('div');
        msg.className = 'chatbot-msg chatbot-msg-bot';
        msg.innerHTML = renderMarkdown(text);
        chatMessages.appendChild(msg);

        // Chips
        if (chips && chips.length > 0) {
          var chipWrap = document.createElement('div');
          chipWrap.className = 'chatbot-chips';
          for (var c = 0; c < chips.length; c++) {
            var chip = document.createElement('button');
            chip.className = 'chatbot-chip';
            chip.textContent = chips[c];
            chip.setAttribute('type', 'button');
            (function (label) {
              chip.addEventListener('click', function () {
                handleUserInput(label);
              });
            })(chips[c]);
            chipWrap.appendChild(chip);
          }
          chatMessages.appendChild(chipWrap);
        }

        scrollToBottom();
      }, delay);
    }

    function appendUserMessage(text) {
      var msg = document.createElement('div');
      msg.className = 'chatbot-msg chatbot-msg-user';
      // Use textContent for XSS safety
      msg.textContent = text;
      chatMessages.appendChild(msg);
      scrollToBottom();
    }

    function scrollToBottom() {
      setTimeout(function () {
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }, 50);
    }

    // --- Input Handling ---
    function handleUserInput(text) {
      if (!text || !text.trim()) return;
      var trimmed = text.trim();

      appendUserMessage(trimmed);

      var intentId = matchIntent(trimmed);
      var response = getResponse(intentId);
      appendBotMessage(response.text, response.chips);

      if (chatInput) chatInput.value = '';
    }

    if (chatSend) {
      chatSend.addEventListener('click', function () {
        handleUserInput(chatInput ? chatInput.value : '');
      });
    }

    if (chatInput) {
      chatInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleUserInput(chatInput.value);
        }
      });
    }

    // --- Notification badge pulse after 3s ---
    setTimeout(function () {
      var badge = chatFab.querySelector('.chatbot-fab-badge');
      if (badge) badge.classList.add('chatbot-badge-show');
    }, 3000);

  }); // end DOMContentLoaded

}()); // end IIFE
