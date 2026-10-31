const navigation = document.querySelector('#primary-navigation');

navigation?.querySelectorAll('.nav-link').forEach((link) => {
	link.addEventListener('click', () => {
		if (window.matchMedia('(max-width: 1399.98px)').matches && window.bootstrap) {
			window.bootstrap.Collapse.getOrCreateInstance(navigation).hide();
		}
	});
});

document.querySelectorAll('.project-gallery').forEach((gallery, index) => {
	const track = gallery.querySelector('.project-drawings');
	const slides = track ? [...track.querySelectorAll('.project-drawing')] : [];
	const previous = gallery.querySelector('[data-gallery-direction="-1"]');
	const next = gallery.querySelector('[data-gallery-direction="1"]');

	if (!track || slides.length === 0 || !previous || !next) return;

	const carouselId = `project-gallery-${index + 1}`;
	const regionLabel = track.getAttribute('aria-label') || 'Project drawing gallery';

	gallery.id = carouselId;
	gallery.classList.add('carousel', 'slide');
	gallery.setAttribute('role', 'region');
	gallery.setAttribute('aria-roledescription', 'carousel');
	gallery.setAttribute('aria-label', regionLabel);
	gallery.setAttribute('data-bs-touch', 'true');
	gallery.setAttribute('data-bs-wrap', 'false');
	track.classList.add('carousel-inner');
	track.classList.remove('project-drawings-two');
	track.removeAttribute('tabindex');
	track.removeAttribute('role');
	track.removeAttribute('aria-label');

	slides.forEach((slide, slideIndex) => {
		slide.classList.add('carousel-item');
		if (slideIndex === 0) slide.classList.add('active');
	});

	[[previous, 'prev'], [next, 'next']].forEach(([button, direction]) => {
		button.classList.add('btn', 'btn-outline-success');
		button.setAttribute('data-bs-target', `#${carouselId}`);
		button.setAttribute('data-bs-slide', direction);
		button.setAttribute('aria-controls', carouselId);
	});

	gallery.addEventListener('slide.bs.carousel', (event) => {
		previous.disabled = event.to === 0;
		next.disabled = event.to === slides.length - 1;
	});

	const updateControls = () => {
		const activeIndex = slides.findIndex((slide) => slide.classList.contains('active'));
		previous.disabled = activeIndex <= 0;
		next.disabled = activeIndex >= slides.length - 1;
	};

	gallery.addEventListener('slid.bs.carousel', updateControls);
	updateControls();
});

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	const revealTargets = document.querySelectorAll('main > section:not(.hero), .service-item, .tool-item');
	document.documentElement.classList.add('motion-ready');

	revealTargets.forEach((element, index) => {
		element.classList.add('scroll-reveal');
		element.style.setProperty('--reveal-delay', `${(index % 4) * 60}ms`);
	});
	const rootMargin = '0px 0px -8% 0px';
	const revealObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('is-visible');
				revealObserver.unobserve(entry.target);
			}
		});
	}, { threshold: 0.12, rootMargin });

	revealTargets.forEach((element) => revealObserver.observe(element));

	// Reveal already-visible targets immediately
	revealTargets.forEach((element) => {
		if (element.getBoundingClientRect().top < window.innerHeight * 0.92) {
			element.classList.add('is-visible');
		}
	});

	// Hero parallax
	const heroVisualImg = document.querySelector('.hero-visual > img');
	if (heroVisualImg) {
		let ticking = false;
		const updateParallax = () => {
			const y = window.scrollY || window.pageYOffset;
			const offset = Math.min(y * 0.28, 120);
			heroVisualImg.style.transform = `translate3d(0, ${offset}px, 0) scale(1.06)`;
			ticking = false;
		};
		window.addEventListener('scroll', () => {
			if (!ticking) {
				ticking = true;
				window.requestAnimationFrame(updateParallax);
			}
		}, { passive: true });
		updateParallax();
	}

	// Navbar shadow on scroll
	const navbar = document.querySelector('.site-navbar');
	if (navbar) {
		const updateNavbar = () => {
			navbar.classList.toggle('is-scrolled', (window.scrollY || 0) > 12);
		};
		window.addEventListener('scroll', updateNavbar, { passive: true });
		updateNavbar();
	}
	}

// Show an animated, keyboard-accessible return-to-top control after scrolling.
const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
	const updateBackToTop = () => {
		const visible = (window.scrollY || window.pageYOffset) > 420;
		backToTop.classList.toggle('is-visible', visible);
		backToTop.setAttribute('aria-hidden', String(!visible));
		backToTop.tabIndex = visible ? 0 : -1;
	};

	window.addEventListener('scroll', updateBackToTop, { passive: true });
	updateBackToTop();
}

document.querySelectorAll('.back-to-top, .footer-back-to-top').forEach((control) => {
	control.addEventListener('click', () => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		control.classList.remove('is-activating');
		void control.offsetWidth;
		control.classList.add('is-activating');
		window.setTimeout(() => control.classList.remove('is-activating'), 700);
	});
});


// Tab pane fade-in support
document.querySelectorAll('.tab-pane').forEach((pane) => pane.classList.add('fade'));
document.querySelectorAll('.tab-pane.active').forEach((pane) => pane.classList.add('show'));

// Scrollspy: highlight nav link for the section in view
const navLinks = [...document.querySelectorAll('.site-navbar .nav-link[href^="#"]')];
const sectionIds = navLinks.map((link) => link.getAttribute('href').slice(1)).filter(Boolean);
const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
if (sections.length && navLinks.length) {
	const spyObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const id = entry.target.id;
				navLinks.forEach((link) => {
					link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
				});
			}
		});
	}, { threshold: 0.35, rootMargin: '-20% 0px -55% 0px' });
	sections.forEach((section) => spyObserver.observe(section));
}

// Smooth anchor scroll with offset for navbar height
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener('click', (event) => {
		const href = anchor.getAttribute('href');
		if (!href || href === '#') return;
		const target = document.querySelector(href);
		if (!target) return;
		event.preventDefault();
		if (target.classList.contains('tab-pane')) {
			const tab = document.querySelector(`[data-bs-target="#${target.id}"]`);
			if (tab) tab.click();
			const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
			target.closest('.planswift-projects-section, .autocad-projects-section')?.scrollIntoView({ behavior });
			return;
		}
		const top = target.getBoundingClientRect().top + window.scrollY;
		const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
		window.scrollTo({ top, behavior });
	});
});
