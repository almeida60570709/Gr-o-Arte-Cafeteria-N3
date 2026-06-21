/* ======================================================
   GRÃO & ARTE — main.js
   JavaScript vanilla único, compartilhado por todas as páginas.
   Cada bloco verifica a existência do elemento antes de agir,
   já que cada página HTML só tem alguns dos elementos referenciados.
   ====================================================== */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------------------------------------
     1. Marcar link ativo no menu (desktop + mobile)
     --------------------------------------------- */
  (function setActiveNav() {
    var path = window.location.pathname.split('/').pop() || 'index.html';
    var links = document.querySelectorAll('.nav-links a, .nav-mobile a');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (href === path) {
        link.classList.add('active');
      }
    });
  })();

  /* ---------------------------------------------
     2. Menu hamburguer (mobile)
     --------------------------------------------- */
  var ham = document.getElementById('ham');
  var navMobile = document.getElementById('navMobile');
  if (ham && navMobile) {
    ham.addEventListener('click', function () {
      var isOpen = navMobile.classList.toggle('open');
      ham.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    navMobile.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navMobile.classList.remove('open');
        ham.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------
     3. Scroll reveal (IntersectionObserver)
     --------------------------------------------- */
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------------------------------------------
     4. Botão "voltar ao topo"
     --------------------------------------------- */
  var stt = document.getElementById('stt');
  if (stt) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) stt.classList.add('show');
      else stt.classList.remove('show');
    });
    stt.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------------------------------------
     5. Cardápio — filtro de categorias
     --------------------------------------------- */
  var filterBtns = document.querySelectorAll('.fbtn');
  var menuCats = document.querySelectorAll('.menu-cat');
  if (filterBtns.length && menuCats.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');

        var filter = btn.getAttribute('data-filter');
        menuCats.forEach(function (cat) {
          var show = filter === 'all' || cat.getAttribute('data-cat') === filter;
          cat.style.display = show ? '' : 'none';
        });
      });
    });
  }

  /* ---------------------------------------------
     6. Cardápio — modal de detalhe do item
     --------------------------------------------- */
  var modalBg = document.getElementById('modalBg');
  var mItems = document.querySelectorAll('.mitem');
  if (modalBg && mItems.length) {
    var mIcon = document.getElementById('mIcon');
    var mName = document.getElementById('mName');
    var mDesc = document.getElementById('mDesc');
    var mPrice = document.getElementById('mPrice');
    var mTags = document.getElementById('mTags');
    var modalClose = document.getElementById('modalClose');
    var lastFocused = null;

    function openModal(item) {
      lastFocused = document.activeElement;
      if (mIcon) mIcon.textContent = item.getAttribute('data-icon') || '☕';
      if (mName) mName.textContent = item.getAttribute('data-name') || '';
      if (mDesc) mDesc.textContent = item.getAttribute('data-desc') || '';
      if (mPrice) mPrice.textContent = item.getAttribute('data-price') || '';
      if (mTags) {
        mTags.innerHTML = '';
        var tags = (item.getAttribute('data-tags') || '').split(',').filter(Boolean);
        tags.forEach(function (t) {
          var span = document.createElement('span');
          span.textContent = t.trim();
          mTags.appendChild(span);
        });
      }
      modalBg.classList.add('open');
      if (modalClose) modalClose.focus();
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modalBg.classList.remove('open');
      document.body.style.overflow = '';
      if (lastFocused) lastFocused.focus();
    }

    mItems.forEach(function (item) {
      item.addEventListener('click', function () { openModal(item); });
      item.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(item);
        }
      });
    });

    if (modalClose) modalClose.addEventListener('click', closeModal);
    modalBg.addEventListener('click', function (e) {
      if (e.target === modalBg) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        if (modalBg.classList.contains('open')) closeModal();
        if (navMobile && navMobile.classList.contains('open')) {
          navMobile.classList.remove('open');
          if (ham) ham.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  /* ---------------------------------------------
     7. Contato — validação de formulário
     --------------------------------------------- */
  var form = document.getElementById('contactForm');
  if (form) {
    var fNome = document.getElementById('fnome');
    var fEmail = document.getElementById('femail');
    var fTel = document.getElementById('ftel');
    var fAssunto = document.getElementById('fassunto');
    var fMsg = document.getElementById('fmsg');
    var fbOk = document.getElementById('fbOk');
    var charCount = document.getElementById('charCount');

    var RE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var RE_NOME = /^[A-Za-zÀ-ÖØ-öø-ÿ\s']{3,}$/;

    function setError(input, errId, message) {
      var errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = message || '';
      if (input) input.classList.toggle('invalid', !!message);
    }

    /* Máscara de telefone em tempo real */
    if (fTel) {
      fTel.addEventListener('input', function () {
        var digits = fTel.value.replace(/\D/g, '').slice(0, 11);
        var out = digits;
        if (digits.length > 10) {
          out = digits.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        } else if (digits.length > 6) {
          out = digits.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (digits.length > 2) {
          out = digits.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (digits.length > 0) {
          out = digits.replace(/(\d{0,2})/, '($1');
        }
        fTel.value = out.trim();
      });
    }

    /* Contador de caracteres da mensagem */
    if (fMsg && charCount) {
      fMsg.addEventListener('input', function () {
        var len = fMsg.value.length;
        charCount.textContent = len + ' / 500 caracteres';
      });
    }

    function validateNome() {
      var v = fNome.value.trim();
      if (!v) { setError(fNome, 'fnome-err', 'Por favor, informe seu nome.'); return false; }
      if (!RE_NOME.test(v)) { setError(fNome, 'fnome-err', 'Use apenas letras, mínimo 3 caracteres.'); return false; }
      setError(fNome, 'fnome-err', ''); return true;
    }

    function validateEmail() {
      var v = fEmail.value.trim();
      if (!v) { setError(fEmail, 'femail-err', 'Por favor, informe seu e-mail.'); return false; }
      if (!RE_EMAIL.test(v)) { setError(fEmail, 'femail-err', 'Informe um e-mail válido.'); return false; }
      setError(fEmail, 'femail-err', ''); return true;
    }

    function validateTel() {
      var digits = fTel.value.replace(/\D/g, '');
      if (digits.length === 0) { setError(fTel, 'ftel-err', ''); return true; } /* opcional */
      if (digits.length < 10 || digits.length > 11) {
        setError(fTel, 'ftel-err', 'Telefone deve ter 10 ou 11 dígitos.'); return false;
      }
      setError(fTel, 'ftel-err', ''); return true;
    }

    function validateAssunto() {
      if (!fAssunto.value) { setError(fAssunto, 'fassunto-err', 'Selecione um assunto.'); return false; }
      setError(fAssunto, 'fassunto-err', ''); return true;
    }

    function validateMsg() {
      var v = fMsg.value.trim();
      if (v.length < 20) {
        setError(fMsg, 'fmsg-err', 'Escreva pelo menos 20 caracteres (' + v.length + '/20).');
        return false;
      }
      setError(fMsg, 'fmsg-err', ''); return true;
    }

    if (fNome) fNome.addEventListener('blur', validateNome);
    if (fEmail) fEmail.addEventListener('blur', validateEmail);
    if (fTel) fTel.addEventListener('blur', validateTel);
    if (fAssunto) fAssunto.addEventListener('blur', validateAssunto);
    if (fMsg) fMsg.addEventListener('blur', validateMsg);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (fbOk) fbOk.classList.remove('show');

      var okNome = validateNome();
      var okEmail = validateEmail();
      var okTel = validateTel();
      var okAssunto = validateAssunto();
      var okMsg = validateMsg();

      if (okNome && okEmail && okTel && okAssunto && okMsg) {
        if (fbOk) {
          fbOk.classList.add('show');
          fbOk.focus();
        }
        form.reset();
        if (charCount) charCount.textContent = '0 / 500 caracteres';
      } else {
        var firstInvalid = form.querySelector('.invalid');
        if (firstInvalid) firstInvalid.focus();
      }
    });
  }

});
