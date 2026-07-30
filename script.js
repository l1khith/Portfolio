/* ==========================================================================
   LIKHITH - HARDCORE ANDROID / RUST / AI INTERACTIVE SCRIPTS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMouseGlow();
  initAutoFlowSimulator();
  initTerminal();
  initBibtexCopy();
});

/* --------------------------------------------------------------------------
   1. Mouse Spotlight Tracker
   -------------------------------------------------------------------------- */
function initMouseGlow() {
  const glow = document.querySelector('.mouse-glow');
  if (!glow) return;

  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
  });
}

/* --------------------------------------------------------------------------
   2. Interactive Android/Rust/AI Live Logcat & Sandbox Simulator
   -------------------------------------------------------------------------- */
const SIMULATOR_PRESETS = {
  geofence: {
    title: "📍 Location Geofence Trigger (Android Native)",
    code: `// AutoFlow Android Geofence Intent Receiver (Kotlin)
class GeofenceBroadcastReceiver : BroadcastReceiver() {
    override onReceive(context: Context, intent: Intent) {
        val event = GeofencingEvent.fromIntent(intent)
        if (event.geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER) {
            // Invoke Sandboxed Rhino Engine & 7-layer firewall
            AutoFlowSandbox.executeWorkflow("campus_silence_profile")
        }
    }
}`,
    logs: [
      { tag: "D/FusedLocation", msg: "Geofence event triggered: TRANSITION_ENTER (Campus Zone)", type: "normal" },
      { tag: "I/AutoFlowService", msg: "Waking up WorkManager task from dormant state", type: "normal" },
      { tag: "D/RhinoSandbox", msg: "Evaluating 7-Layer Permission Firewall rules...", type: "normal" },
      { tag: "I/PermissionFirewall", msg: "Rule #4 PASSED: ACCESS_FINE_LOCATION & AUDIO_SETTINGS", type: "success" },
      { tag: "D/AudioControl", msg: "AudioManager.setRingerMode(RINGER_MODE_SILENT) executed", type: "success" },
      { tag: "I/SystemHealth", msg: "Battery optimization vs continuous GPS: +43.75% saved", type: "success" }
    ]
  },
  rust: {
    title: "🦀 FocusFlow Rust Core & JNI FFI",
    code: `// FocusFlow Native Rust Core (src/lib.rs)
#[no_mangle]
pub extern "C" fn Java_com_focusflow_native_ActivityMonitor_processBuffer(
    env: JNIEnv,
    _class: JClass,
    buffer_ptr: jlong,
) -> jboolean {
    // Zero-allocation buffer traversal in native memory
    let monitor = unsafe { &*(buffer_ptr as *const NativeMonitor) };
    monitor.check_app_restrictions()
}`,
    logs: [
      { tag: "I/RustNativeCore", msg: "FocusFlow JNI libfocusflow_core.so initialized", type: "rust" },
      { tag: "D/ZeroAllocMem", msg: "Native heap allocation: 0 bytes JVM overhead", type: "rust" },
      { tag: "I/ActivityBlocker", msg: "Intercepted foreground package: com.distraction.app", type: "warning" },
      { tag: "I/RustNativeCore", msg: "Sent intent ACTION_BLOCK_OVERLAY via JNI callback", type: "success" },
      { tag: "D/PerfStats", msg: "Blocker evaluation overhead: 0.8ms (Zero-GC pressure)", type: "success" }
    ]
  },
  ai: {
    title: "🧠 On-Device AI & Heuristic Sandbox",
    code: `// AutoFlow On-Device Context Engine
function analyzeContextHeuristics(sensorData) {
  var confidence = AIModel.predictUserActivity(sensorData);
  if (confidence > 0.85 && sensorData.isStudyHours) {
    log("High confidence focus state detected: " + confidence);
    AutoFlow.enableFocusProfile();
  }
}`,
    logs: [
      { tag: "I/OnDeviceAI", msg: "Loading quantized heuristic model into memory", type: "normal" },
      { tag: "D/SensorFusion", msg: "Evaluating accelerometer + Wi-Fi beacon vectors", type: "normal" },
      { tag: "I/HeuristicModel", msg: "Classification confidence: 0.94 (DEEP_WORK)", type: "success" },
      { tag: "D/RhinoSandbox", msg: "Executing AI-driven automation rule #12", type: "success" },
      { tag: "I/FirewallCheck", msg: "No outbound telemetry required (100% On-Device)", type: "success" }
    ]
  },
  alarm: {
    title: "⏰ Android AlarmManager Exact Timer",
    code: `// AlarmManager Exact Schedule
val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
alarmManager.setExactAndAllowWhileIdle(
    AlarmManager.RTC_WAKEUP,
    triggerAtMillis,
    pendingIntent
)`,
    logs: [
      { tag: "D/AlarmManagerService", msg: "RTC_WAKEUP exact alarm fired while idle", type: "normal" },
      { tag: "I/AutoFlowWorker", msg: "Executing background sync task", type: "normal" },
      { tag: "D/RhinoSandbox", msg: "HTTP relay sandbox request: api.open-meteo.com", type: "normal" },
      { tag: "I/NotificationMgr", msg: "Dispatched status report to notification channel", type: "success" }
    ]
  }
};

function initAutoFlowSimulator() {
  const codeEditor = document.getElementById('sim-code-editor');
  const consoleOutput = document.getElementById('sim-console-output');
  const triggerBtns = document.querySelectorAll('.trigger-btn');
  const runBtn = document.getElementById('sim-run-btn');

  if (!codeEditor || !consoleOutput) return;

  // Set default preset
  loadPreset('geofence');

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const type = btn.getAttribute('data-trigger');
      loadPreset(type);
    });
  });

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      simulateExecution();
    });
  }

  function loadPreset(type) {
    const preset = SIMULATOR_PRESETS[type];
    if (!preset) return;
    codeEditor.value = preset.code;
    appendLogs(preset.logs, true);
  }

  function appendLogs(logList, clear = false) {
    if (clear) consoleOutput.innerHTML = '';
    
    logList.forEach((item, index) => {
      setTimeout(() => {
        const timeStr = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const line = document.createElement('div');
        line.className = 'log-line';
        line.innerHTML = `<span class="log-time">[${timeStr}]</span> <span class="log-tag">${item.tag}:</span> <span class="log-msg ${item.type}">${item.msg}</span>`;
        consoleOutput.appendChild(line);
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      }, index * 110);
    });
  }

  function simulateExecution() {
    const customLogs = [
      { tag: "D/LogcatNative", msg: "Manual trigger execution sequence initiated by dev", type: "normal" },
      { tag: "I/RustJniBridge", msg: "Native memory buffer integrity: OK (0 leaks)", type: "rust" },
      { tag: "D/StaticAnalysis", msg: "7-Layer Firewall scan complete. Zero vulnerabilities.", type: "success" },
      { tag: "I/RuntimeStats", msg: "Workflow completed in 24ms under zero-alloc constraints.", type: "success" }
    ];
    appendLogs(customLogs, false);
  }
}

/* --------------------------------------------------------------------------
   3. Interactive Developer CLI Terminal Engine
   -------------------------------------------------------------------------- */
function initTerminal() {
  const terminalModal = document.getElementById('terminal-modal');
  const terminalBtn = document.getElementById('terminal-toggle-btn');
  const closeBtn = document.getElementById('terminal-close-btn');
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');

  if (!terminalModal || !terminalInput) return;

  function toggleTerminal() {
    terminalModal.classList.toggle('open');
    if (terminalModal.classList.contains('open')) {
      terminalInput.focus();
    }
  }

  if (terminalBtn) terminalBtn.addEventListener('click', toggleTerminal);
  if (closeBtn) closeBtn.addEventListener('click', toggleTerminal);

  // Global Keyboard Shortcut: Ctrl + K or Cmd + K
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      toggleTerminal();
    }
    if (e.key === 'Escape' && terminalModal.classList.contains('open')) {
      toggleTerminal();
    }
  });

  const COMMANDS = {
    help: "Hardcore Developer Console Commands:\n - android   : Android NDK, Compose, Services & System details\n - rust      : Zero-alloc native engine & JNI details\n - ai        : On-device intelligence & machine informatics\n - papers    : Published IEEE & IJCA research papers\n - projects  : AutoFlow, FocusFlow, Reader source repositories\n - stats     : Hardware performance & battery metrics\n - contact   : Email & LinkedIn details\n - whoami    : Engineering bio & focus areas\n - clear     : Clear terminal screen",
    whoami: "Likhith — Android Systems Engineer, Native Rust Developer & Security Researcher.\nFocus: Mobile NDK runtimes, zero-alloc JNI memory engines, 7-layer JS sandboxes, and on-device AI.",
    contact: "Email: ailikhith2116@gmail.com\nLinkedIn: https://www.linkedin.com/in/ailikhith/\nGitHub: https://github.com/l1khith",
    android: "Android Systems Architecture:\n - NDK (C/C++), JNI C-bindings, Linux Binder IPC\n - Jetpack Compose, Material 3, Room, WorkManager, AlarmManager\n - Fused Location Geofencing, BLE Scanners, Accessibility Services",
    rust: "Rust Systems & Native Engines:\n - Zero-allocation memory safety for Android native bridges\n - FocusFlow high-performance activity blocker engine\n - Low-overhead background processing & cross-compilation (aarch64-linux-android)",
    ai: "On-Device AI & Intelligence:\n - IEEE ECMI 2026 Machine Informatics publication author\n - Sandboxed JS rule engine & on-device heuristic inference\n - Privacy-preserving local execution (0 cloud telemetry required)",
    papers: "1. [IEEE ECMI 2026] AutoFlow: A Secure Automation Framework for Android\n   DOI: 10.1109/ECMI68341.2026.11602819\n2. [IJCA 2025] Task Assign: A Role-Based Task Management System Using Django\n   DOI: 10.26808/RS.2025.37gf79",
    projects: "1. AutoFlow (Kotlin/Java) : https://github.com/l1khith/AutoFlow\n2. FocusFlow (Rust/Android): https://github.com/l1khith/FocusFlow\n3. Reader (Kotlin)         : https://github.com/l1khith/Reader",
    stats: "⚡ 43.75% Battery life gain over continuous GPS\n🛡️ 98.7% Attack detection & firewall block rate\n⏱️ < 2 second workflow execution speed\n🦀 Zero-Alloc Rust memory management for FocusFlow",
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      if (!inputVal) return;

      appendOutput(`likhith@android-kernel:~$ ${inputVal}`, 'cmd-line');

      if (inputVal === 'clear') {
        terminalBody.querySelectorAll('.out-line, .cmd-line').forEach(el => el.remove());
        return;
      }

      if (COMMANDS[inputVal]) {
        appendOutput(COMMANDS[inputVal], 'out-line');
      } else {
        appendOutput(`Command not found: '${inputVal}'. Type 'help' for available commands.`, 'out-line err');
      }

      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  function appendOutput(text, className) {
    const div = document.createElement('div');
    div.className = className;
    div.innerText = text;
    terminalBody.insertBefore(div, terminalInput.parentElement);
  }
}

/* --------------------------------------------------------------------------
   4. BibTeX Citation Exporter & Toast Notifications
   -------------------------------------------------------------------------- */
const BIBTEX_CITATIONS = {
  ieee: `@inproceedings{likhith2026autoflow,
  title={AutoFlow: A Secure Automation Framework for Android},
  author={Yamini G and Likhith and Bhushan, Bharat and M.G., Chiranjeevi and Kharvi, Dhanush},
  booktitle={2026 International Conference on Emerging Research in Smart Electronics and Machine Informatics (ECMI)},
  pages={1--9},
  year={2026},
  organization={IEEE},
  doi={10.1109/ECMI68341.2026.11602819}
}`,
  ijca: `@article{likhith2025taskassign,
  title={Task Assign: A Role-Based Task Management System Using Django},
  author={Likhith and Bhushan, Bharat and Kharvi, Dhanush and M.G., Chiranjeevi},
  journal={International Journal of Computer Application (IJCA)},
  volume={15},
  number={3},
  pages={85--95},
  year={2025},
  publisher={RS Publication},
  doi={10.26808/RS.2025.37gf79}
}`
};

function initBibtexCopy() {
  document.querySelectorAll('.btn-bibtex').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-bibtex');
      const citation = BIBTEX_CITATIONS[key];
      if (citation) {
        navigator.clipboard.writeText(citation).then(() => {
          showToast("BibTeX citation copied to clipboard!");
        });
      }
    });
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<i class="fas fa-check-circle" style="color: #10b981;"></i> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
