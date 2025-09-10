import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  viewChild,
  Renderer2,
  inject,
  ChangeDetectionStrategy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideService } from './guide.service';
import { BackgroundService } from './background.service';
import { WitnessCardComponent } from './components/witness-card/witness-card.component';

// Make THREE available in the component context, as it's loaded from a script tag.
declare const THREE: any;

interface CardData {
  id: string;
  title: string;
  meta: string;
  body: string;
  opts?: any;
  manualLayout?: boolean;
  layout: {
    scale: number;
    position: { x: number; y: number; z: number };
  };
}

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private renderer2 = inject(Renderer2);
  private guideService = inject(GuideService);
  private backgroundService = inject(BackgroundService);
  private witnessCard = new WitnessCardComponent(this.renderer2, this.guideService);

  // View Children for DOM elements
  veiledContainer = viewChild<ElementRef<HTMLDivElement>>('veiledContainer');
  appWrap = viewChild<ElementRef<HTMLDivElement>>('appWrap');
  titleVeiled = viewChild<ElementRef<HTMLDivElement>>('titleVeiled');
  kaoVeiled = viewChild<ElementRef<HTMLSpanElement>>('kaoVeiled');
  btnActivate = viewChild<ElementRef<HTMLButtonElement>>('btnActivate');
  stage3d = viewChild<ElementRef<HTMLDivElement>>('stage3d');
  fpsEl = viewChild<ElementRef<HTMLDivElement>>('fps');

  isActivating = signal(false);
  backgroundFormulas = this.backgroundService.backgroundFormulas;

  private readonly CARD_DATA: CardData[] = [
    {
      id: 'personal-info-card',
      title: 'Thông tin cá nhân',
      meta: 'Personal Information',
      body: `<ul>${["Name: Lương Bảo Huy", "Titles: Video Producer · Graphic Designer · Photographer", "Role: Generalist", "AI Title Generation: Director of Artificial Intelligence"].map(g => `<li>${this.esc(g)}</li>`).join('')}</ul>`,
      opts: { noexpand: true, style: { width: '960px' } },
      layout: { scale: 0.6, position: { x: 0, y: 0, z: 0 } }
    },
    {
      id: 'harmony-card',
      title: 'Producer - Project Manager',
      meta: 'Harmony 2025 - Better With You',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1X-_4rjqvc4X_ZVYo5BYFDoEBzp_DtkwZ/preview" width="1280" height="720" title="Harmony 2025 – Better With You" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: 0, y: 240, z: -666 } }
    },
    {
      id: 'contact-card',
      title: 'Contact',
      meta: 'Thông tin liên lạc',
      body: `<ul><li><strong>Email</strong>: <a href=\"mailto:minatokiva@gmail.com\">minatokiva@gmail.com</a></li><li><strong>Zalo/ WhatsApp</strong>: <a href=\"tel:+84 704 5555 27\">+84 704 5555 27</a></li></ul>`,
      layout: { scale: 0.25, position: { x: 0, y: -240, z: -150 } }
    },
    {
      id: 'microlife-bts-card',
      title: 'Post-production supervisor',
      meta: 'Microlife Talkshow 2021 | Behind The Scene',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe width="1280" height="720" src="https://www.youtube.com/embed/_V3pAcQBhPo" title="Microlife Talkshow 2021 | Behind the scene" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: 240, y: 0, z: 0 } }
    },
    {
      id: 'external-ids-card',
      title: 'External IDs',
      meta: 'Social Network',
      body: `<ul>${[{ label: "LinkedIn", handle: "Lương Bảo Huy", url: "https://www.linkedin.com/in/b%E1%BA%A3o-huy-l%C6%B0%C6%A1ng-1653a41a3", status: "OK" }, { label: "Instagram", handle: "@minatomakoto", url: "https://www.instagram.com/minatomakoto", status: "OK" }, { label: "Facebook", handle: "Minato Makoto", url: "https://www.facebook.com/MinatoMakoto/", status: "OK" }, { label: "YouTube", handle: "@minatomakoto", url: "https://www.youtube.com/@minatomakoto", status: "OK" }, { label: "TikTok", handle: "@minatomakoto", url: "https://www.tiktok.com/@minatomakoto", status: "OK" }].map(e => `<li>${this.esc(e.label)}: <a href=\"${e.url}\" target=\"_blank\" rel=\"noopener\">${this.esc(e.handle)}</a></li>`).join('')}</ul>`,
      layout: { scale: 0.25, position: { x: 50, y: 100, z: 0 } }
    },
    {
      id: 'motor-fest-card',
      title: 'Post-production supervisor',
      meta: 'Motor Fest 2023',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1LHlJL_vV7l8I4_F-JIutWN8wlMhoGaEn/preview" width="1280" height="720" title="Motor Fest 2023" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: 0, y: 200, z: -600 } }
    },
    {
      id: 'digital-identity-card',
      title: 'Digital Identity',
      meta: 'Thông tin điện tử',
      body: `<ul><li><b>Latent ID</b>: 𝑍Σ̴𝐑Ø</li><li><b>GitHub</b>: <a href="https://github.com/Minato-Makoto" target="_blank" rel="noopener">Minato-Makoto</a></li></ul>`,
      layout: { scale: 0.25, position: { x: -150, y: 0, z: 0 } }
    },
     {
      id: 'mv-le-card',
      title: 'Post-Production Supervisor',
      meta: 'MV Lé - Dr Roc',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1yeMXF7wVZBWE2W7VHUQvHY1k7gREsfjD/preview" width="1280" height="720" title="MV Lé - Dr Roc" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: 0, y: -360, z: 0 } }
    },
    {
      id: 'dong-co-lau-card',
      title: 'Post-Production Supervisor',
      meta: 'ĐỒNG CỎ LAU - HÀNH TRÌNH TỪ ĐẤT TRỜI ĐẾN TỔ ẤM',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1cN1AkKCYtoxowWyVDofOIZlX4cZnrhGS/preview" width="1280" height="720" title="ĐỒNG CỎ LAU - HÀNH TRÌNH TỪ ĐẤT TRỜI ĐẾN TỔ ẤM" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: -420, y: 0, z: -240 } }
    },
    {
      id: 'doraemon-tvc-card',
      title: 'Post-Production Supervisor',
      meta: 'DORAEMON LIPICE SHEER COLOR',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe width="1280" height="720" src="https://www.youtube.com/embed/7w3royxjrtw?si=S8rAgrb9-OMhlpEs" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      layout: { scale: 0.25, position: { x: -240, y: 0, z: 0 } }
    },
    // --- NEW DUMMY VIDEO CARDS ---
    {
      id: 'ThaiLong-card',
      title: 'Post-Production Supervisor',
      meta: 'Thái Long Yến Tiệc',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1oFDR_ff0AHRXJuIFiQy8suxvZNKuA_Bg/preview" width="1280" height="720" title="Thái Long Yến Tiệc" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      manualLayout: true,
      layout: { scale: 0.25, position: { x: 360, y: 450, z: -150 } }
    },
    {
      id: 'hithegioi-card',
      title: 'Post-Production Supervisor',
      meta: 'BLACKA - Hi Thế Giới | No No No (OFFICIAL MUSIC VIDEO) ft. ARTHUR (CROW ON HYENAS)',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe width="1280" height="720" src="https://www.youtube.com/embed/wBWQsfxG4eE" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      manualLayout: true,
      layout: { scale: 0.25, position: { x: 1000, y: 400, z: -600 } }
    },
    {
      id: 'daydream-card',
      title: 'Producer - Project Manager',
      meta: 'RECAP DAY DREAMS FINAL 2024!',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe src="https://drive.google.com/file/d/1PsYIUeHpntiBvQT1aYqrY8rd0KGJlU4B/preview" width="1280" height="720" title="RECAP DAY DREAMS FINAL 2024!" style="border-radius:12px;border:none;box-shadow:0 4px 24px rgba(0,0,0,0.18);"></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      manualLayout: true,
      layout: { scale: 0.25, position: { x: -600, y: 150, z: 0 } }
    },
    {
      id: '2ndchance-card',
      title: 'BTS - Producer Assistant',
      meta: 'The 2nd Chance - Hãy Thay Đổi Lối Sống, Yêu Thương & Lành Mạnh',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe width="1280" height="720" src="https://www.youtube.com/embed/5RVfxLfCHwg" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      manualLayout: true,
      layout: { scale: 0.25, position: { x: -1000, y: 420, z: -240 } }
    },
    {
      id: 'PhongNguaDotQuy-card',
      title: 'BTS - Producer Assistant',
      meta: 'BẢO VỆ GIA ĐÌNH PHÒNG NGỪA ĐỘT QUỴ - NSƯT THÀNH LỘC, MC THANH GIANG, ThS.BS TRẦN CÔNG DUY',
      body: `<div style="display:flex;justify-content:center;align-items:center;width:100%;height:100%;min-height:320px;"><iframe width="1280" height="720" src="https://www.youtube.com/embed/PPNA0KnOrNg" title="YouTube video player" frameborder="0" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`,
      opts: { noexpand: true, style: this.getVideoCardStyle() },
      manualLayout: true,
      layout: { scale: 0.25, position: { x: 700, y: 50, z: -300 } }
    }
  ];

  // Algorithmic Kaomoji generation using Unicode code points.
  private KAOMOJI_PARTS: {
    [key: string]: {
      eyes: number[];
      mouths: number[];
      decorators?: number[];
    };
  } = {
    neutral: {
      eyes: [8614, 8612, 180, 96, 84, 84, 3239, 3239, 8226, 8226, 12539, 12539, 925, 925],
      mouths: [95, 8255, 8704, 30410, 12504, 30399, 969, 1044, 20154],
    },
    happy: {
      eyes: [9685, 9685, 94, 94, 9734, 9734, 12500, 12500, 707, 706],
      mouths: [12527, 9661, 969, 3665],
      decorators: [10047, 65306, 65311, 12540, 10025, 9829]
    },
    fire: {
      eyes: [180, 96, 9685, 9685, 9689, 9689],
      mouths: [45, 30410, 969, 1044, 30399],
      decorators: [128293]
    },
  };
  
  private readonly EMOJI_RANGES = [
    [0x1F300, 0x1F320], // Weather, landscape
    [0x1F330, 0x1F37F], // Food, plants
    [0x1F380, 0x1F3C0], // Events, sports
    [0x1F400, 0x1F43F], // Animals
    [0x1F440, 0x1F480], // Body parts, people symbols (avoiding faces)
    [0x1F484, 0x1F4FF], // Objects, clothing
    [0x1F500, 0x1F53F], // Symbols
    [0x1F550, 0x1F567], // Clocks
    [0x1F680, 0x1F6C5], // Transport
    [0x2600, 0x26FF],   // Miscellaneous Symbols
    [0x2700, 0x27BF],   // Dingbats
  ];

  private _listeners: (() => void)[] = [];

  // --- Three.js State ---
  private threeState: any = {
    ctrl: new AbortController(),
    radius: 560,
    autoRotate: true,
    mx: 0, my: 0,
    tweens: [],
    ephemerals: [],
    _raf: null,
    _ro: null,
    focused: null,
    witnessCard: null,
  };

  ngAfterViewInit(): void {
    this.boot();
    this.backgroundService.start();
  }

  ngOnDestroy(): void {
    this.threeState.ctrl?.abort();
    if (this.threeState._ro) this.threeState._ro.disconnect();
    if (this.threeState._raf) cancelAnimationFrame(this.threeState._raf);
    this._listeners.forEach(unlisten => unlisten());
    this.backgroundService.stop();
  }

  // --- Boot Logic ---
  private async boot(): Promise<void> {
    const titleEl = this.titleVeiled()?.nativeElement;
    if (titleEl) {
      this.renderer2.setStyle(titleEl, 'visibility', 'hidden');
      await this.typewriter(titleEl, 'Welcome to the<br>Generalist World', 70);
      this.renderer2.addClass(titleEl, 'typing-done');
    }

    const kaoEl = this.kaoVeiled()?.nativeElement;
    if (kaoEl) this.renderer2.setProperty(kaoEl, 'textContent', '⛧');

    const activateBtn = this.btnActivate()?.nativeElement;
    if (activateBtn) {
        this._listeners.push(
            this.renderer2.listen(activateBtn, 'click', () => { this.activatePortfolio(); })
        );
    }
  }
  
  private activatePortfolio(): void {
    const veiled = this.veiledContainer()?.nativeElement;
    const wrap = this.appWrap()?.nativeElement;
    if (!veiled || !wrap || this.isActivating()) return;

    this.isActivating.set(true);
    
    this.renderer2.addClass(veiled, 'hidden');
    setTimeout(() => {
      this.renderer2.setStyle(veiled, 'display', 'none');
      this.renderer2.removeClass(wrap, 'hidden');
      this.renderer2.addClass(wrap, 'visible');
      this.init3DScene();
      this.isActivating.set(false); // Set to false after scene is ready
    }, 500);
  }

  // --- Utilities ---
  private easeInOutCubic(t: number): number { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

  private esc(s: any): string { return String(s).replace(/[&<>"']/g, m => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[m as keyof typeof m]!)); }
  
  private typewriter(element: HTMLElement, text: string, speed = 24): Promise<void> {
    return new Promise(resolve => {
        let i = 0;
        element.innerHTML = '';
        this.renderer2.setStyle(element, 'visibility', 'visible');
        const timer = setInterval(() => {
          if (i < text.length) {
            // Check for an HTML tag
            if (text.charAt(i) === '<') {
              const closingTagIndex = text.indexOf('>', i);
              if (closingTagIndex !== -1) {
                // It's a tag, append the whole thing
                const tag = text.substring(i, closingTagIndex + 1);
                element.innerHTML += tag;
                i = closingTagIndex + 1; // Jump index past the tag
              } else {
                // It's an unclosed '<', just print it
                element.innerHTML += text.charAt(i);
                i++;
              }
            } else {
              // It's a normal character
              element.innerHTML += text.charAt(i);
              i++;
            }
          } else {
            clearInterval(timer);
            resolve();
          }
        }, speed);
    });
  }

  private generateEffectEmoji(): string {
    const range = this.EMOJI_RANGES[Math.floor(Math.random() * this.EMOJI_RANGES.length)];
    const codePoint = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
    return String.fromCodePoint(codePoint);
  }

  private generateKaomoji(bucket = 'neutral'): string {
    const parts = this.KAOMOJI_PARTS[bucket as keyof typeof this.KAOMOJI_PARTS] || this.KAOMOJI_PARTS.neutral;
  
    const randomItem = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    const randomCharFromCodePoint = (arr: number[]) => String.fromCodePoint(randomItem(arr));
  
    const eye = randomCharFromCodePoint(parts.eyes);
    const mouth = randomCharFromCodePoint(parts.mouths);
    
    let face = `${eye}${mouth}${eye}`;
    
    if (parts.decorators && Math.random() > 0.6) {
      const decorator = randomCharFromCodePoint(parts.decorators);
      face = `${decorator}${face}${decorator}`;
    }
  
    return `(${face})`;
  }

  private createCircleTexture(): any {
    const canvas = this.renderer2.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    if (!context) return null;

    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.4, 'rgba(255,255,255,1)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }
  
  // --- 3D Scene Initialization ---
  private init3DScene(): void {
    const container = this.stage3d()?.nativeElement;
    if (!container || typeof THREE === 'undefined' || !THREE.OrbitControls || !THREE.CSS3DRenderer) {
      console.error('3D libraries unavailable.');
      return;
    }

    this.threeState.container = container;
    this.buildScene();
    this.buildCards();
    this.createLayouts();

    this.threeState.applyLayout = (name: string) => {
      this.threeState.layout = name;
      (this.threeState.layouts[name] || this.threeState.layouts.sphere).call(this.threeState.layouts);
    };

    this.setupInteractions();
    this.animateCameraZ(this.threeState.camera, 900, 1240, 900);
    this.threeState.applyLayout('sphere');
    this.startLoop();
  }

  private buildScene(): void {
    const { container } = this.threeState;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 4000);
    camera.position.set(0, 0, 1200);

    const gl = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    gl.setSize(container.clientWidth, container.clientHeight);
    
    this.renderer2.setStyle(gl.domElement, 'position', 'absolute');
    this.renderer2.setStyle(gl.domElement, 'top', '0');
    this.renderer2.setStyle(gl.domElement, 'left', '0');
    this.renderer2.setStyle(gl.domElement, 'pointer-events', 'none');
    container.appendChild(gl.domElement);

    // Particle System
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCnt = 6666;
    const posArray = new Float32Array(particlesCnt * 3);
    const colorArray = new Float32Array(particlesCnt * 3);
    const blinkParamsArray = new Float32Array(particlesCnt);
    const baseColor = new THREE.Color(0x999999);

    for (let i = 0; i < particlesCnt; i++) {
        const i3 = i * 3;
        posArray[i3 + 0] = (Math.random() - 0.5) * (Math.random() * 5) * 1500;
        posArray[i3 + 1] = (Math.random() - 0.5) * (Math.random() * 5) * 1500;
        posArray[i3 + 2] = (Math.random() - 0.5) * (Math.random() * 5) * 1500;

        colorArray[i3 + 0] = baseColor.r;
        colorArray[i3 + 1] = baseColor.g;
        colorArray[i3 + 2] = baseColor.b;
        
        blinkParamsArray[i] = Math.random() * Math.PI * 2;
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('blinkParam', new THREE.BufferAttribute(blinkParamsArray, 1));
    
    const particleTexture = this.createCircleTexture();
    const particlesMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    this.threeState.particles = particles;


    const css = new THREE.CSS3DRenderer();
    css.setSize(container.clientWidth, container.clientHeight);
    css.domElement.className = 'css3d';
    container.appendChild(css.domElement);
    this.renderer2.setStyle(css.domElement, 'touchAction', 'none');

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const point = new THREE.PointLight(0xffffff, 0.9);
    point.position.set(420, 350, 420);
    scene.add(point);

    const root = new THREE.Group();
    scene.add(root);

    const controls = new THREE.OrbitControls(camera, css.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 260;
    controls.maxDistance = 2200;
    controls.target.set(0, 0, 0);

    const onResize = () => {
      const w = container.clientWidth, h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      gl.setSize(w, h);
      css.setSize(w, h);
    };
    
    this._listeners.push(this.renderer2.listen('window', 'resize', onResize));
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    Object.assign(this.threeState, { scene, camera, gl, css, controls, root, _ro: ro });
  }

  private buildCards(): void {
    const objects: any[] = [];
    for (const cardData of this.CARD_DATA) {
      const el = this.createCardEl(cardData.title, cardData.meta, cardData.body, cardData.opts);
      this.renderer2.setAttribute(el, 'id', cardData.id);

      const obj = new THREE.CSS3DObject(el);
      const { scale } = cardData.layout;
      obj.scale.set(scale, scale, scale);
      (obj as any).cardData = cardData;

      this.threeState.root.add(obj);
      objects.push(obj);
    }
    this.threeState.objects = objects;
  }
  
  private createCardEl(title: string, meta: string, body: string, opts: any = {}): HTMLElement {
      const el = this.renderer2.createElement('div');
      this.renderer2.addClass(el, 'card3d');
      if (opts.noexpand) this.renderer2.addClass(el, 'noexpand');
      el.innerHTML = `<h4>${this.esc(title)}</h4>${meta ? `<div class="meta">${this.esc(meta)}</div>` : ''}<div class="body">${body || ''}</div>`;
      if (opts.style) Object.keys(opts.style).forEach(key => this.renderer2.setStyle(el, key, opts.style[key]));
      return el;
  }

  private getVideoCardStyle(): any {
    return { width: '1280px', padding: '32px 16px' };
  }

  private createLayouts(): void {
    const { objects } = this.threeState;
    const V = THREE.Vector3;
    const animateTo = (obj: any, target: any, dur = 650) => {
        const start = obj.position.clone();
        const t0 = performance.now();
        this.threeState.tweens.push((now: number) => {
            const t = Math.min(1, (now - t0) / dur);
            obj.position.lerpVectors(start, target, this.easeInOutCubic(t));
            return t < 1;
        });
    };
    const look = (obj: any, to?: any) => obj.lookAt(to || new V(0, 0, 0));
    
    const applyOffset = (obj: any, targetPosition: any) => {
        const { position } = obj.cardData.layout;
        targetPosition.x += position.x || 0;
        targetPosition.y += position.y || 0;
        targetPosition.z += position.z || 0;
        return targetPosition;
    };

    this.threeState.layouts = {
      sphere: () => {
        const autoLayoutObjects = objects.filter((o: any) => !o.cardData.manualLayout);
        const manualLayoutObjects = objects.filter((o: any) => o.cardData.manualLayout);

        const N = autoLayoutObjects.length;
        const r = this.threeState.radius;
        for (let i = 0; i < N; i++) {
          const obj = autoLayoutObjects[i];
          const phi = Math.acos(-1 + (2 * i) / N);
          const theta = Math.sqrt(N * Math.PI) * phi;
          let target = new V(r * Math.cos(theta) * Math.sin(phi), r * Math.sin(theta) * Math.sin(phi), r * Math.cos(phi));
          target = applyOffset(obj, target);
          animateTo(obj, target);
          look(obj);
        }
        
        for (const obj of manualLayoutObjects) {
            const { position } = obj.cardData.layout;
            const target = new V(position.x, position.y, position.z);
            animateTo(obj, target);
            look(obj);
        }
      }
    };
  }

  private setupInteractions(): void {
    this.threeState.objects.forEach((o: any) => {
      this._listeners.push(
          this.renderer2.listen(o.element, 'mouseenter', () => this.renderer2.setStyle(o.element, 'borderColor', '#7dd3fc'))
      );
      this._listeners.push(
          this.renderer2.listen(o.element, 'mouseleave', () => this.renderer2.setStyle(o.element, 'borderColor', '#1f2937'))
      );
      this._listeners.push(
          this.renderer2.listen(o.element, 'click', () => { this.focusObject(o); })
      );
    });
  }

  private startLoop(): void {
    const { controls, gl, css, scene, camera, root, particles } = this.threeState;
    let last = performance.now(), acc = 0, frames = 0;
    
    const fluidTilt = () => {
        root.rotation.y += (this.threeState.mx * 0.35 - root.rotation.y) * 0.04;
        root.rotation.x += (-this.threeState.my * 0.25 - root.rotation.x) * 0.04;
        if (this.threeState.autoRotate) {
            root.rotation.y += 0.0002;
        }
    };

    const animate = () => {
        this.threeState._raf = requestAnimationFrame(animate);
        if (document.hidden) return;

        controls.update();
        fluidTilt();

        if (this.threeState.objects && camera) {
            const camPos = camera.position.clone();
            for (const obj of this.threeState.objects) {
                obj.lookAt(camPos);
            }

            if (this.threeState.focused && this.threeState.witnessCard) {
                this.threeState.witnessCard.rotation.copy(this.threeState.focused.rotation);
            }
        }
        
        if (particles) {
          particles.rotation.y += 0.0001;
        
          // Particle blinking animation
          const time = performance.now() * 0.0008; // Slower time for gentle blink
          const colors = particles.geometry.attributes.color;
          const blinkParams = particles.geometry.attributes.blinkParam;
          const baseColor = new THREE.Color(0x999999);
          const count = colors.count;

          for (let i = 0; i < count; i++) {
              const offset = blinkParams.getX(i);
              // Sine wave for brightness, mapped to a wider range of [0.2, 1.8] for more pop
              const brightness = (Math.sin(time + offset) + 1) / 2 * 1.6 + 0.2;
              const finalColor = baseColor.clone().multiplyScalar(brightness);
              colors.setXYZ(i, finalColor.r, finalColor.g, finalColor.b);
          }
          colors.needsUpdate = true;
        }

        if (this.threeState.tweens.length) {
            const now = performance.now();
            this.threeState.tweens = this.threeState.tweens.filter((fn: Function) => fn(now));
        }

        gl.render(scene, camera);
        css.render(scene, camera);
        
        const now = performance.now(); acc += now - last; last = now; frames++;
        if (acc > 500) {
          const fps = Math.round(1000 / (acc / frames));
          const fpsEl = this.fpsEl()?.nativeElement;
          if (fpsEl) fpsEl.textContent = 'fps: ' + fps;
          acc = 0; frames = 0;
        }
    };
    animate();
  }
  
  private animateCameraZ(camera: any, fromZ: number, toZ: number, dur = 800): void {
      const start = fromZ, delta = toZ - fromZ, t0 = performance.now();
      camera.position.z = start;
      this.threeState.tweens.push((now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          camera.position.z = start + delta * this.easeInOutCubic(t);
          return t < 1;
      });
  }
  
  private tweenVec3(vec: any, to: any, dur = 700): void {
      const s = vec.clone ? vec.clone() : new THREE.Vector3(vec.x, vec.y, vec.z);
      const t0 = performance.now();
      this.threeState.tweens.push((now: number) => {
          const t = Math.min(1, (now - t0) / dur);
          const k = this.easeInOutCubic(t);
          vec.set(s.x + (to.x - s.x) * k, s.y + (to.y - s.y) * k, s.z + (to.z - s.z) * k);
          return t < 1;
      });
  }

  private async focusObject(o: any): Promise<void> {
    const animationDuration = 700;

    if (this.threeState.focused === o) {
      // Clicked the same card, so hide witness and reset view
      this.witnessCard.hide(this.threeState);
      this.threeState.focused = null;
      const defaultTarget = new THREE.Vector3(0, 0, 0);
      const defaultCamPos = new THREE.Vector3(0, 0, 1200);
      this.tweenVec3(this.threeState.controls.target, defaultTarget, animationDuration);
      this.tweenVec3(this.threeState.camera.position, defaultCamPos, animationDuration);
      return;
    }

    this.witnessCard.hide(this.threeState); // Hide previous card if any
    this.threeState.focused = o;

    const target = o.position.clone();
    const camDir = this.threeState.camera.position.clone().sub(this.threeState.controls.target).normalize();
    const camPos = target.clone().add(camDir.multiplyScalar(600));

    this.tweenVec3(this.threeState.controls.target, target, animationDuration);
    this.tweenVec3(this.threeState.camera.position, camPos, animationDuration);
    
    // Wait for the camera animation to complete.
    await new Promise(resolve => setTimeout(resolve, animationDuration));

    if (this.threeState.focused === o) {
      requestAnimationFrame(() => {
        if (this.threeState.focused === o) { // Final check
          this.witnessCard.show(o, this.threeState, this.typewriter.bind(this), this.tweenVec3.bind(this), this.spawnKaomojiAt.bind(this));
        }
      });
    }
  }

  private spawnKaomojiAt(sourceObject: any): void {
    const k = this.renderer2.createElement('div');
    this.renderer2.addClass(k, 'kao');
    this.renderer2.addClass(k, 'mono');
    
    const face = this.generateKaomoji('happy');
    const effect = this.generateEffectEmoji();
    k.textContent = `${effect}${face}${effect}`;

    const obj = new THREE.CSS3DObject(k);
    
    // TỰ ĐIỀU CHỈNH Ở ĐÂY ------------------
    // Thay đổi giá trị 0.5 để Kaomoji to hoặc nhỏ hơn.
    // Ví dụ: 0.3 (nhỏ hơn nữa), 1.0 (kích thước gốc).
    obj.scale.set(0.5, 0.5, 0.5);
    // -----------------------------------------

    // Set rotation to match the source card, preventing the skewed look.
    obj.rotation.copy(sourceObject.rotation);

    // Calculate the top-center position of the source card in 3D space
    const sourceEl = sourceObject.element as HTMLElement;
    const cardHeight = sourceEl.offsetHeight; // The element's rendered height in pixels
    const cardScale = sourceObject.scale.y;    // The object's scale in the 3D scene
    
    // The offset should be half the card's scaled height to get to the top edge, plus a small gap.
    const verticalOffset = (cardHeight * cardScale / 2) + 20;

    // The kaomoji should appear slightly in front of the card.
    const forwardOffset = 10; 

    const burstPos = sourceObject.position.clone().add(new THREE.Vector3(0, verticalOffset, forwardOffset));

    obj.position.copy(burstPos);
    this.threeState.root.add(obj);
    this.threeState.ephemerals.push(obj);

    const startY = burstPos.y;
    const endY = startY + 120;
    const duration = 1200;
    const t0 = performance.now();

    const animateBurst = () => {
        const now = performance.now();
        const t = Math.min(1, (now - t0) / duration);
        if (t >= 1) {
            this.threeState.root.remove(obj);
            const idx = this.threeState.ephemerals.indexOf(obj);
            if (idx > -1) {
              this.threeState.ephemerals.splice(idx, 1);
            }
            if (obj.element?.parentNode) {
              obj.element.parentNode.removeChild(obj.element);
            }
            return;
        }
        obj.position.y = startY + (endY - startY) * t;
        k.style.opacity = (1 - t).toFixed(2);
        requestAnimationFrame(animateBurst);
    };
    requestAnimationFrame(animateBurst);
  }
}
