import os
import json
import base64

def generate_motion_html():
    rfm_logo_path = 'C:/Users/ADVAN/Documents/antigravity/rfm-store/public/logo-rfm.png'
    with open(rfm_logo_path, 'rb') as f:
        rfm_b64 = base64.b64encode(f.read()).decode('ascii')

    logos = {}
    logo_files = {
        'netflix': 'netflix-icon.svg',
        'spotify': 'spotify-icon.svg',
        'youtube': 'youtube-icon.svg',
        'openai': 'openai-icon.svg',
        'whatsapp': 'whatsapp.svg',
        'google': 'google-icon.svg',
        'telegram': 'telegram.svg'
    }
    for k, v in logo_files.items():
        with open(f'C:/Users/ADVAN/Documents/antigravity/rfm-store/public/logos/{v}', 'r', encoding='utf-8') as f:
            logos[k] = f.read()

    html = f"""<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<title>RFMstore Commercial Motion Animation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&display=swap');

  * {{
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    user-select: none;
  }}

  body {{
    background-color: #0b0d08;
    color: #e9ede0;
    font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
    overflow: hidden;
    width: 1920px;
    height: 1080px;
    position: relative;
  }}

  #canvas-container {{
    width: 1920px;
    height: 1080px;
    position: absolute;
    top: 0;
    left: 0;
    background: #0b0d08;
    overflow: hidden;
  }}

  /* Ambient Cyber Grids & Glows */
  .grid-bg {{
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(201, 241, 88, 0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201, 241, 88, 0.04) 1px, transparent 1px);
    background-size: 64px 64px;
    pointer-events: none;
  }}

  .ambient-glow-1 {{
    position: absolute;
    width: 1000px;
    height: 1000px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201, 241, 88, 0.13) 0%, transparent 68%);
    filter: blur(140px);
    pointer-events: none;
    top: -300px;
    left: -300px;
  }}

  .ambient-glow-2 {{
    position: absolute;
    width: 900px;
    height: 900px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 214, 143, 0.09) 0%, transparent 70%);
    filter: blur(130px);
    pointer-events: none;
    bottom: -250px;
    right: -250px;
  }}

  /* Top Bar Branding Indicator */
  .hud-header {{
    position: absolute;
    top: 42px;
    left: 64px;
    right: 64px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    letter-spacing: 0.15em;
    color: #8b937f;
    z-index: 100;
  }}

  .hud-badge {{
    display: inline-flex;
    align-items: center;
    gap: 12px;
    background: rgba(18, 22, 14, 0.9);
    border: 1px solid #283020;
    padding: 9px 20px;
    border-radius: 8px;
    color: #c9f158;
    box-shadow: 0 4px 20px rgba(0,0,0,0.6);
  }}

  .hud-dot {{
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #c9f158;
    box-shadow: 0 0 12px #c9f158;
  }}

  /* Master Stage */
  .scene {{
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    opacity: 0;
    pointer-events: none;
    transform: scale(0.96);
  }}

  /* SCENE 1: Brand Reveal */
  .s1-logo-box {{
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px;
  }}
  .s1-logo-img {{
    width: 175px;
    height: 175px;
    object-fit: contain;
    filter: drop-shadow(0 0 40px rgba(201, 241, 88, 0.5));
  }}
  .s1-title {{
    font-size: 84px;
    font-weight: 900;
    letter-spacing: -0.04em;
    color: #e9ede0;
    display: flex;
    align-items: center;
    gap: 6px;
  }}
  .s1-title span {{
    color: #c9f158;
    text-shadow: 0 0 30px rgba(201, 241, 88, 0.6);
  }}
  .s1-sub {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 21px;
    color: #8b937f;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    background: rgba(201, 241, 88, 0.08);
    border: 1px solid rgba(201, 241, 88, 0.25);
    padding: 12px 32px;
    border-radius: 999px;
  }}

  /* SCENE 2: The Dilemma & Solution */
  .s2-container {{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 1250px;
  }}
  .s2-tag {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 16px;
    color: #c9f158;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }}
  .s2-heading {{
    font-size: 70px;
    font-weight: 800;
    line-height: 1.14;
    letter-spacing: -0.03em;
    margin-bottom: 52px;
  }}
  .s2-heading .lime-accent {{
    color: #c9f158;
    text-shadow: 0 0 28px rgba(201, 241, 88, 0.65);
  }}
  .s2-compare-cards {{
    display: flex;
    gap: 44px;
    width: 100%;
    justify-content: center;
  }}
  .compare-card {{
    background: #13170f;
    border: 1px solid #283020;
    border-radius: 20px;
    padding: 38px 48px;
    width: 500px;
    text-align: left;
    box-shadow: 0 20px 45px rgba(0,0,0,0.5);
    position: relative;
  }}
  .compare-card.good {{
    border-color: #c9f158;
    background: linear-gradient(180deg, #161c11 0%, #10140c 100%);
    box-shadow: 0 0 45px rgba(201, 241, 88, 0.18);
  }}
  .card-label {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 15px;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 16px;
    color: #8b937f;
  }}
  .card-price {{
    font-size: 52px;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    margin-bottom: 14px;
  }}
  .card-desc {{
    font-size: 18px;
    color: #8b937f;
    line-height: 1.55;
  }}

  /* SCENE 3: Product Showcase Grid */
  .s3-container {{
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1440px;
  }}
  .s3-title {{
    font-size: 60px;
    font-weight: 800;
    margin-bottom: 50px;
    letter-spacing: -0.03em;
    text-align: center;
  }}
  .product-grid {{
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
    width: 100%;
  }}
  .product-card {{
    background: #13170f;
    border: 1px solid #283020;
    border-radius: 18px;
    padding: 30px;
    display: flex;
    align-items: center;
    gap: 24px;
    box-shadow: 0 12px 35px rgba(0,0,0,0.35);
  }}
  .product-card .app-icon-wrap {{
    width: 68px;
    height: 68px;
    background: #192014;
    border: 1px solid #303a23;
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }}
  .product-card svg {{
    width: 40px;
    height: 40px;
  }}
  .app-details {{
    flex: 1;
  }}
  .app-name {{
    font-size: 24px;
    font-weight: 700;
    color: #e9ede0;
    margin-bottom: 6px;
  }}
  .app-cat {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px;
    color: #8b937f;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 10px;
  }}
  .app-price-tag {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 20px;
    font-weight: 700;
    color: #c9f158;
  }}

  /* SCENE 4: Terminal Simulation & Value Pillars */
  .s4-container {{
    display: flex;
    gap: 64px;
    align-items: center;
    width: 1440px;
  }}
  .s4-terminal {{
    flex: 1.15;
    background: #0d1009;
    border: 1px solid #39412c;
    border-radius: 18px;
    overflow: hidden;
    font-family: 'JetBrains Mono', monospace;
    box-shadow: 0 25px 65px rgba(0,0,0,0.65), 0 0 40px rgba(201, 241, 88, 0.09);
  }}
  .term-bar {{
    background: #14180f;
    border-bottom: 1px solid #283020;
    padding: 16px 24px;
    display: flex;
    align-items: center;
    gap: 10px;
  }}
  .term-dots {{
    display: flex;
    gap: 8px;
  }}
  .t-dot {{
    width: 12px;
    height: 12px;
    border-radius: 50%;
  }}
  .t-red {{ background: #ff5f57; }}
  .t-yellow {{ background: #febc2e; }}
  .t-green {{ background: #28c840; }}
  .term-title {{
    margin-left: auto;
    font-size: 14px;
    color: #8b937f;
    letter-spacing: 0.05em;
  }}
  .term-body {{
    padding: 34px;
    font-size: 19px;
    line-height: 1.95;
  }}
  .term-lime {{ color: #c9f158; }}
  .term-cyan {{ color: #00d68f; }}
  .term-muted {{ color: #727a67; }}
  .cursor-box {{
    display: inline-block;
    width: 10px;
    height: 1.15em;
    background: #c9f158;
    vertical-align: middle;
    box-shadow: 0 0 10px #c9f158;
  }}

  .s4-pillars {{
    flex: 0.85;
    display: flex;
    flex-direction: column;
    gap: 26px;
  }}
  .pillar-card {{
    background: #13170f;
    border: 1px solid #283020;
    border-radius: 18px;
    padding: 26px 32px;
    display: flex;
    align-items: flex-start;
    gap: 22px;
  }}
  .pillar-icon {{
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: rgba(201, 241, 88, 0.1);
    border: 1px solid rgba(201, 241, 88, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    color: #c9f158;
    flex-shrink: 0;
  }}
  .pillar-title {{
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 6px;
  }}
  .pillar-desc {{
    font-size: 16px;
    color: #8b937f;
    line-height: 1.55;
  }}

  /* SCENE 5: Call To Action & Official Outro */
  .s5-container {{
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }}
  .s5-logo {{
    width: 145px;
    height: 145px;
    object-fit: contain;
    margin-bottom: 26px;
    filter: drop-shadow(0 0 45px rgba(201, 241, 88, 0.55));
  }}
  .s5-h {{
    font-size: 68px;
    font-weight: 900;
    letter-spacing: -0.03em;
    margin-bottom: 16px;
  }}
  .s5-domain {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 34px;
    font-weight: 700;
    color: #c9f158;
    margin-bottom: 44px;
    letter-spacing: 0.08em;
    text-shadow: 0 0 25px rgba(201, 241, 88, 0.45);
  }}
  .s5-buttons {{
    display: flex;
    gap: 26px;
  }}
  .s5-btn-primary {{
    background: #c9f158;
    color: #171b08;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 800;
    font-size: 19px;
    padding: 19px 44px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 12px 35px rgba(201, 241, 88, 0.4);
  }}
  .s5-btn-secondary {{
    background: transparent;
    border: 1px solid #39412c;
    color: #e9ede0;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 19px;
    padding: 19px 44px;
    border-radius: 12px;
  }}

  /* Bottom Progress Timeline */
  .hud-footer {{
    position: absolute;
    bottom: 42px;
    left: 64px;
    right: 64px;
    display: flex;
    align-items: center;
    gap: 30px;
    z-index: 100;
  }}
  .progress-bar-bg {{
    flex: 1;
    height: 4px;
    background: #1c2216;
    border-radius: 999px;
    overflow: hidden;
  }}
  .progress-bar-fill {{
    height: 100%;
    width: 0%;
    background: #c9f158;
    box-shadow: 0 0 12px #c9f158;
  }}
  .hud-timecode {{
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    color: #8b937f;
    letter-spacing: 0.1em;
  }}
</style>
</head>
<body>

<div id="canvas-container">
  <div class="grid-bg"></div>
  <div class="ambient-glow-1"></div>
  <div class="ambient-glow-2"></div>

  <!-- HUD Header -->
  <div class="hud-header">
    <div class="hud-badge">
      <div class="hud-dot" id="hud-dot"></div>
      <span>RFMSTORE // OFFICIAL PROMO</span>
    </div>
    <div>WWW.RYUUKA.WEB.ID</div>
  </div>

  <!-- SCENE 1: Brand Reveal (0s - 4.5s) -->
  <div id="scene-1" class="scene">
    <div class="s1-logo-box">
      <img class="s1-logo-img" src="data:image/png;base64,{rfm_b64}" alt="RFMstore Logo">
      <h1 class="s1-title">RFM<span>store</span></h1>
      <div class="s1-sub">Aplikasi Premium Termurah & Terpercaya</div>
    </div>
  </div>

  <!-- SCENE 2: Problem & Solution (4.5s - 9.0s) -->
  <div id="scene-2" class="scene">
    <div class="s2-container">
      <div class="s2-tag">
        <span>●</span> MAHAL LANGGANAN RESMI? KAMI PUNYA SOLUSINYA
      </div>
      <h2 class="s2-heading">
        Nonton & Kerja Maksimal <br>
        <span class="lime-accent">Harga Mulai Rp1.000-an.</span>
      </h2>
      <div class="s2-compare-cards">
        <div class="compare-card">
          <div class="card-label">Langganan Resmi Normal</div>
          <div class="card-price" style="color: #ff5f57;">Rp186.000<span style="font-size: 20px;">/bln</span></div>
          <div class="card-desc">Biaya bulanan membengkak, harus kartu kredit, langganan terikat otomatis.</div>
        </div>
        <div class="compare-card good">
          <div class="card-label" style="color: #c9f158;">Di RFMstore</div>
          <div class="card-price" style="color: #c9f158;">Rp7.000<span style="font-size: 20px;">-an</span></div>
          <div class="card-desc">100% Bergaransi penuh. Tinggal pakai, bebas pilih durasi harian sampai tahunan!</div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 3: Product Showcase Grid (9.0s - 14.0s) -->
  <div id="scene-3" class="scene">
    <div class="s3-container">
      <h2 class="s3-title">Katalog Lengkap Siap Pakai</h2>
      <div class="product-grid">
        <!-- Netflix -->
        <div class="product-card" id="card-netflix">
          <div class="app-icon-wrap">{logos['netflix']}</div>
          <div class="app-details">
            <div class="app-name">Netflix Premium</div>
            <div class="app-cat">Streaming 4K Ultra HD</div>
            <div class="app-price-tag">Mulai Rp6.000</div>
          </div>
        </div>
        <!-- Spotify -->
        <div class="product-card" id="card-spotify">
          <div class="app-icon-wrap">{logos['spotify']}</div>
          <div class="app-details">
            <div class="app-name">Spotify Premium</div>
            <div class="app-cat">Musik Tanpa Iklan & Download</div>
            <div class="app-price-tag">Mulai Rp15.000</div>
          </div>
        </div>
        <!-- YouTube -->
        <div class="product-card" id="card-youtube">
          <div class="app-icon-wrap">{logos['youtube']}</div>
          <div class="app-details">
            <div class="app-name">YouTube Premium</div>
            <div class="app-cat">No Ads + YT Music HQ</div>
            <div class="app-price-tag">Mulai Rp15.000</div>
          </div>
        </div>
        <!-- Gemini AI -->
        <div class="product-card" id="card-gemini">
          <div class="app-icon-wrap">{logos['google']}</div>
          <div class="app-details">
            <div class="app-name">Gemini Advanced AI</div>
            <div class="app-cat">Model Pro + 5TB Drive</div>
            <div class="app-price-tag">18 Bulan Rp25.000</div>
          </div>
        </div>
        <!-- ChatGPT -->
        <div class="product-card" id="card-chatgpt">
          <div class="app-icon-wrap">{logos['openai']}</div>
          <div class="app-details">
            <div class="app-name">ChatGPT Plus</div>
            <div class="app-cat">GPT-4o & DALL·E 3</div>
            <div class="app-price-tag">Akun Siap Pakai</div>
          </div>
        </div>
        <!-- Telegram -->
        <div class="product-card" id="card-telegram">
          <div class="app-icon-wrap">{logos['telegram']}</div>
          <div class="app-details">
            <div class="app-name">Telegram Premium</div>
            <div class="app-cat">Upload 4GB & Badge</div>
            <div class="app-price-tag">Akun Siap Pakai</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 4: Terminal Transaction & Value Pillars (14.0s - 19.5s) -->
  <div id="scene-4" class="scene">
    <div class="s4-container">
      <div class="s4-terminal">
        <div class="term-bar">
          <div class="term-dots">
            <span class="t-dot t-red"></span>
            <span class="t-dot t-yellow"></span>
            <span class="t-dot t-green"></span>
          </div>
          <div class="term-title">order.log — alur instan</div>
        </div>
        <div class="term-body">
          <p><span class="term-lime">$</span> chat admin whatsapp</p>
          <p class="term-muted">&gt; &quot;bang, netflix 3 bulan ready?&quot;</p>
          <p>&lt; &quot;ready kak, proses sekarang ya!&quot;</p>
          <p class="term-cyan" style="margin-top: 8px;">✓ QRIS / Dana / Transfer terkonfirmasi</p>
          <p>&lt; &quot;akun terkirim, langsung aktif!&quot;</p>
          <p class="term-muted">● order selesai <span class="term-lime">— garansi penuh penggantian</span></p>
          <p style="margin-top: 10px;"><span class="term-lime">$</span> <span class="cursor-box" id="term-cursor"></span></p>
        </div>
      </div>

      <div class="s4-pillars">
        <div class="pillar-card">
          <div class="pillar-icon">⚡</div>
          <div>
            <div class="pillar-title">Proses Kilat 5 Menit</div>
            <div class="pillar-desc">Cukup chat via WhatsApp, tanpa ribet daftar akun di web. Bayar dan langsung terima akun.</div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon">🛡️</div>
          <div>
            <div class="pillar-title">Garansi Penggantian Penuh</div>
            <div class="pillar-desc">Semua produk dilindungi garansi resmi. Jika bermasalah langsung diganti oleh admin.</div>
          </div>
        </div>
        <div class="pillar-card">
          <div class="pillar-icon">🤝</div>
          <div>
            <div class="pillar-title">Terpercaya Sejak 2021</div>
            <div class="pillar-desc">Ribuan transaksi sukses di grup komunitas WhatsApp kami yang aktif.</div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- SCENE 5: Call To Action & Outro (19.5s - 24.0s) -->
  <div id="scene-5" class="scene">
    <div class="s5-container">
      <img class="s5-logo" src="data:image/png;base64,{rfm_b64}" alt="RFMstore Outro">
      <h2 class="s5-h">Dapatkan Akun Premium Kamu Sekarang</h2>
      <div class="s5-domain">WWW.RYUUKA.WEB.ID</div>
      <div class="s5-buttons">
        <div class="s5-btn-primary">
          <span>💬 CHAT ADMIN SEKARANG</span>
        </div>
        <div class="s5-btn-secondary">
          <span>👥 JOIN GRUP WHATSAPP</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Timeline -->
  <div class="hud-footer">
    <div class="hud-timecode" id="hud-tc">00:00 / 00:24</div>
    <div class="progress-bar-bg">
      <div class="progress-bar-fill" id="hud-progress"></div>
    </div>
    <div class="hud-timecode">30 FPS // FULL HD 1080P</div>
  </div>
</div>

<script>
  // Animation Engine for Frame-by-Frame Rendering
  // Total Duration: 24 seconds @ 30 FPS = 720 frames
  const TOTAL_FRAMES = 720;
  const FPS = 30;

  function easeInOutCubic(t) {{
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }}

  function easeOutBack(t) {{
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }}

  function clamp(val, min, max) {{
    return Math.max(min, Math.min(max, val));
  }}

  window.seekFrame = function(frame) {{
    const time = frame / FPS;
    const progress = clamp(frame / TOTAL_FRAMES, 0, 1);

    // Update HUD Progress
    const tcMin = String(Math.floor(time / 60)).padStart(2, '0');
    const tcSec = String(Math.floor(time % 60)).padStart(2, '0');
    document.getElementById('hud-tc').innerText = tcMin + ':' + tcSec + ' / 00:24';
    document.getElementById('hud-progress').style.width = (progress * 100) + '%';

    // Blinking cursor toggle
    const cursor = document.getElementById('term-cursor');
    if (cursor) {{
      cursor.style.opacity = (Math.floor(frame / 12) % 2 === 0) ? '1' : '0';
    }}

    const s1 = document.getElementById('scene-1');
    const s2 = document.getElementById('scene-2');
    const s3 = document.getElementById('scene-3');
    const s4 = document.getElementById('scene-4');
    const s5 = document.getElementById('scene-5');

    // Reset all scenes
    [s1, s2, s3, s4, s5].forEach(s => {{
      s.style.opacity = '0';
      s.style.transform = 'scale(0.96) translateY(20px)';
    }});

    // SCENE 1: 0.0s -> 4.5s (Frames 0 - 135)
    if (time < 4.5) {{
      let tIn = clamp(time / 1.0, 0, 1);
      let tOut = clamp((time - 3.7) / 0.8, 0, 1);
      let opacity = easeInOutCubic(tIn) * (1 - easeInOutCubic(tOut));
      let scale = 0.94 + 0.06 * easeOutBack(tIn) + 0.04 * (time / 4.5);
      s1.style.opacity = opacity;
      s1.style.transform = `scale(${{scale}}) translateY(0px)`;
    }}
    // SCENE 2: 4.5s -> 9.0s (Frames 135 - 270)
    else if (time >= 4.5 && time < 9.0) {{
      let localT = time - 4.5;
      let tIn = clamp(localT / 0.9, 0, 1);
      let tOut = clamp((localT - 3.7) / 0.8, 0, 1);
      let opacity = easeInOutCubic(tIn) * (1 - easeInOutCubic(tOut));
      let scale = 0.95 + 0.05 * easeOutBack(tIn);
      let translateY = (1 - easeInOutCubic(tIn)) * 30;
      s2.style.opacity = opacity;
      s2.style.transform = `scale(${{scale}}) translateY(${{translateY}}px)`;
    }}
    // SCENE 3: 9.0s -> 14.0s (Frames 270 - 420)
    else if (time >= 9.0 && time < 14.0) {{
      let localT = time - 9.0;
      let tIn = clamp(localT / 0.9, 0, 1);
      let tOut = clamp((localT - 4.2) / 0.8, 0, 1);
      let opacity = easeInOutCubic(tIn) * (1 - easeInOutCubic(tOut));
      let scale = 0.95 + 0.05 * easeOutBack(tIn);
      s3.style.opacity = opacity;
      s3.style.transform = `scale(${{scale}}) translateY(0px)`;

      // Stagger products in Scene 3
      const cards = s3.querySelectorAll('.product-card');
      cards.forEach((c, idx) => {{
        let cardDelay = 0.2 + idx * 0.12;
        let cardT = clamp((localT - cardDelay) / 0.5, 0, 1);
        c.style.opacity = easeInOutCubic(cardT);
        c.style.transform = `translateY(${{(1 - easeOutBack(cardT)) * 25}}px)`;
      }});
    }}
    // SCENE 4: 14.0s -> 19.5s (Frames 420 - 585)
    else if (time >= 14.0 && time < 19.5) {{
      let localT = time - 14.0;
      let tIn = clamp(localT / 0.9, 0, 1);
      let tOut = clamp((localT - 4.7) / 0.8, 0, 1);
      let opacity = easeInOutCubic(tIn) * (1 - easeInOutCubic(tOut));
      let scale = 0.95 + 0.05 * easeOutBack(tIn);
      s4.style.opacity = opacity;
      s4.style.transform = `scale(${{scale}}) translateY(0px)`;
    }}
    // SCENE 5: 19.5s -> 24.0s (Frames 585 - 720)
    else {{
      let localT = time - 19.5;
      let tIn = clamp(localT / 1.0, 0, 1);
      let opacity = easeInOutCubic(tIn);
      let scale = 0.94 + 0.06 * easeOutBack(tIn);
      s5.style.opacity = opacity;
      s5.style.transform = `scale(${{scale}}) translateY(0px)`;
    }}
  }};

  seekFrame(0);
</script>
</body>
</html>
"""
    with open('C:/Users/ADVAN/Documents/antigravity/rfm-store/video-motion/index.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print("Updated Motion HTML with Telegram & 30fps clock!")

if __name__ == '__main__':
    generate_motion_html()
