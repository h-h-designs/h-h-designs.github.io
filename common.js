// ページ遷移アニメーション
document.addEventListener('DOMContentLoaded', function() {
  const transition = document.getElementById('page-transition');
  
  // ページ読み込み時のアニメーション
  setTimeout(() => {
    transition.classList.remove('is-active');
  }, 100);

  // リンククリック時のアニメーション
  const links = document.querySelectorAll('a:not([target="_blank"])');
  links.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#' && !href.startsWith('javascript:')) {
        e.preventDefault();
        transition.classList.add('is-active');
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      }
    });
  });

  // サイドバー読み込み
  loadSidebar();

  // ヘッダースクロール制御
  initHeaderScroll();

  // メニュートグル
  initMenuToggle();

  // アコーディオン
  initAccordion();

});

// サイドバー読み込み & ハイライト
function loadSidebar() {
  const sidebarContainer = document.getElementById('sidebar-container');
  if (!sidebarContainer) return;

  // file://プロトコルでも動作するように変更
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'side.html', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200 || xhr.status === 0) { // status 0 はfile://用
        sidebarContainer.innerHTML = xhr.responseText;
        highlightCurrentPage();
      } else {
        console.error('サイドバー読み込みエラー:', xhr.status);
      }
    }
  };
  xhr.send();
}

function highlightCurrentPage() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  const links = document.querySelectorAll('.aside__link');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });
}

// ヘッダースクロール制御
function initHeaderScroll() {
  const header = document.getElementById('header');
  let lastScroll = 0;
  const scrollThreshold = 100;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > scrollThreshold) {
      if (currentScroll > lastScroll) {
        header.classList.add('is-hidden');
      } else {
        header.classList.remove('is-hidden');
      }
    } else {
      header.classList.remove('is-hidden');
    }
    
    lastScroll = currentScroll;
  });
}

// メニュートグル（スマートフォン）
function initMenuToggle() {
  const menuToggle = document.getElementById('menu-toggle');
  const aside = document.getElementById('sidebar-container');
  const overlay = document.getElementById('aside-overlay');

  if (!menuToggle || !aside || !overlay) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = aside.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active');
    overlay.classList.toggle('is-visible');
    
    // ボディスクロール制御
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  // オーバーレイクリックで閉じる
  overlay.addEventListener('click', () => {
    aside.classList.remove('is-open');
    menuToggle.classList.remove('is-active');
    overlay.classList.remove('is-visible');
    document.body.style.overflow = '';
  });

  // ウィンドウリサイズ時の処理
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768) {
      aside.classList.remove('is-open');
      menuToggle.classList.remove('is-active');
      overlay.classList.remove('is-visible');
      document.body.style.overflow = '';
    }
  });
}

// アコーディオン
function initAccordion() {
  const accordionHeaders = document.querySelectorAll('.accordion__header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const content = item.querySelector('.accordion__content');
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      
      // 現在の状態を切り替え
      header.setAttribute('aria-expanded', !isOpen);
      item.setAttribute('data-open', !isOpen);
      
      if (!isOpen) {
        content.style.maxHeight = content.scrollHeight + 'px';
      } else {
        content.style.maxHeight = '0';
      }
    });
  });
}


        // キーボードナビゲーション
        function initKeyboardNavigation() {
            document.addEventListener('keydown', (e) => {
                // Lightboxが開いている場合は矢印キーでナビゲート
                const lightbox = document.getElementById('lightbox');
                if (lightbox && lightbox.classList.contains('is-active')) {
                    if (e.key === 'ArrowLeft') {
                        e.preventDefault();
                        navigateLightbox(-1);
                    } else if (e.key === 'ArrowRight') {
                        e.preventDefault();
                        navigateLightbox(1);
                    }
                    return;
                }

                // 通常のページナビゲーション
                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
            });
        }

        // Lightbox（画像ナビゲーション対応）
        let currentImageIndex = 0;
        let allImages = [];

        function initLightbox() {
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightbox-image');
            const lightboxClose = document.getElementById('lightbox-close');
            const lightboxPrev = document.getElementById('lightbox-prev');
            const lightboxNext = document.getElementById('lightbox-next');
            const lightboxCaption = document.getElementById('lightbox-caption');
            const lightboxTriggers = document.querySelectorAll('[data-lightbox]');

            if (!lightbox || !lightboxImage || !lightboxClose) return;

            // すべての画像を配列に格納
            allImages = Array.from(lightboxTriggers).map(trigger => {
                const img = trigger.querySelector('img');
                return {
                    src: img.src,
                    alt: img.alt || '',
                    caption: trigger.getAttribute('data-caption-html')
                          || trigger.getAttribute('data-caption')
                          || ''
                };
            });

            // 画像クリックでLightbox表示
            lightboxTriggers.forEach((trigger, index) => {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    currentImageIndex = index;
                    openLightbox();
                });
            });

            // 閉じるボタン
            lightboxClose.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                closeLightbox();
            });

            // 前の画像ボタン
            lightboxPrev.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateLightbox(-1);
            });

            // 次の画像ボタン
            lightboxNext.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                navigateLightbox(1);
            });

            // 背景クリックで閉じる
            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            // ESCキーで閉じる
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('is-active')) {
                    closeLightbox();
                }
            });

            function openLightbox() {
                updateLightboxImage();
                lightbox.classList.add('is-active');
                document.body.style.overflow = 'hidden';
                
                // アニメーション用に少し遅延
                setTimeout(() => {
                    lightbox.classList.add('is-visible');
                }, 10);
            }

            function closeLightbox() {
                lightbox.classList.remove('is-visible');
                
                setTimeout(() => {
                    lightbox.classList.remove('is-active');
                    document.body.style.overflow = '';
                    lightboxImage.src = '';
                }, 400);
            }

            function updateLightboxImage() {
                const currentImage = allImages[currentImageIndex];
                lightboxImage.src = currentImage.src;
                lightboxImage.alt = currentImage.alt;
                
                // キャプション表示
                if (currentImage.caption) {
                    lightboxCaption.innerHTML = currentImage.caption;
                    lightboxCaption.style.display = 'block';
                } else {
                    lightboxCaption.style.display = 'none';
                }
            }

            // グローバルに公開（キーボードナビゲーション用）
            window.navigateLightbox = function(direction) {
                currentImageIndex += direction;
                
                // ループ処理
                if (currentImageIndex < 0) {
                    currentImageIndex = allImages.length - 1;
                } else if (currentImageIndex >= allImages.length) {
                    currentImageIndex = 0;
                }
                
                updateLightboxImage();
            };
        }

        // 初回訪問時のキーボードナビゲーション説明トースト（削除）
        function showKeyboardToast() {
            // ツールチップとして常に表示するため、この関数は不要
        }

        // 初期化
        document.addEventListener('DOMContentLoaded', function() {
            initKeyboardNavigation();
            initLightbox();
        });