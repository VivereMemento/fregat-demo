'use strict';

(function () {
	'use strict';

	svg4everybody();

	var t;
	var btnUp = getElement('.btn-up');
	btnUp.addEventListener('click', up);
	function up() {

		var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		console.log(top);

		if (top > 0) {
			window.scrollBy(0, -50);
			t = setTimeout(up, 2);
		} else {
			clearTimeout(t);
		};

		return false;
	}
})();

function getElement(elem) {
	return document.querySelector(elem);
}

function getAllElements(elem) {
	return document.querySelectorAll(elem);
}
'use strict';

var addCoutnInput = function () {
	var init = function init() {
		if (wrapInput.length) {
			_setUpListners();
		}
	};
	var _setUpListners = function _setUpListners() {
		document.addEventListener('click', addCount);
	};

	var basketInput = document.querySelectorAll('.params-js');
	var countInput = document.querySelectorAll('.js-add-count');
	var wrapInput = basketInput.length === 0 ? countInput : basketInput;
	var basketTotalCount = getElement('.basket__total-count');

	function addCount(e) {
		Array.from(wrapInput).forEach(function (item) {
			var input = item.querySelector('input'),
			    count = parseFloat(input.value),
			    inputBtnUp = item.querySelector('.add-input__btn_up'),
			    inputBtnDown = item.querySelector('.add-input__btn_down'),
			    startPrice = void 0,
			    totalPrice = void 0,
			    startPriceValue = void 0,
			    totalPriceValue = void 0,
			    basketTotalCountValue = void 0,
			    basketDeleteBtn = void 0;

			if (item.classList.contains('series__table-product-params')) {
				startPrice = item.querySelector('.price-js > span');
				totalPrice = item.querySelector('.total-price-js > span');
				startPriceValue = parseFloat(startPrice.innerText);
				totalPriceValue = parseFloat(totalPrice.innerText);
				// basketTotalCountValue = parseFloat(basketTotalCount.innerText);
			}

			if (e.target === basketDeleteBtn) {
				setTimeout(function () {
					var inputs = document.getElementsByName('count');
					var count = 0;

					Array.from(inputs).forEach(function (input) {
						count += parseFloat(input.value);
					});
					basketTotalCount.innerText = count;
				});
			}

			if (isNaN(input.value) || input.value === '') {
				input.value = 1;
				// basketTotalCount.innerText = ++basketTotalCountValue;
				return;
			}

			if (e.target === inputBtnUp) {
				count++;
				input.value = count;

				if (totalPrice) {
					// basketTotalCount.innerText = ++basketTotalCountValue;
					totalPrice.innerText = (totalPriceValue + startPriceValue).toFixed(2);
				}
			}

			if (e.target === inputBtnDown) {
				if (count === 1) {
					return;
				}
				count--;
				input.value = count;
				if (totalPrice) {
					// basketTotalCount.innerText = --basketTotalCountValue;
					totalPrice.innerText = (totalPriceValue - startPriceValue).toFixed(2);
				}
			}

			if (totalPrice) {
				input.addEventListener('input', function () {
					var inputs = document.getElementsByName('count');
					var inputValue = parseFloat(input.value);
					var count = 0;

					Array.from(inputs).forEach(function (input) {
						if (isNaN(input.value) || input.value === '') {
							count += 0;
							inputValue = 1;
							return;
						};
						count += parseFloat(input.value);
					});
					totalPrice.innerText = (startPriceValue * inputValue).toFixed(2);
					basketTotalCount.innerText = count;
				});
			}
		});
	}

	return {
		init: init
	};
}();

addCoutnInput.init();
'use strict';

var menu = function () {

    var init = function init() {
        if (menu) {
            _setUpListners();
        }
    };
    var _setUpListners = function _setUpListners() {

        window.addEventListener('scroll', _checkSlide);
        window.addEventListener('resize', function () {
            if (window.innerWidth <= 580) {
                menuHeight = menu.clientHeight;
            }
            if (window.innerWidth >= 580) {
                window.addEventListener('scroll', _checkSlide);
            }
        });
        if (window.innerWidth <= 580) {
            window.removeEventListener('scroll', _checkSlide);
        }
        menuBtn.addEventListener('click', _openMenu);
        menuList.addEventListener('click', _openSubMenu);
    };

    var menu = getElement('.menu__inner');
    var menuHeight = menu ? menu.clientHeight : null;
    var menuOfSetTop = menu ? menu.offsetTop : null;
    var menuList = getElement('.menu__list');
    var menuBtn = getElement('.menu__title');
    var footer = getElement('footer');

    function _checkSlide() {

        var footerOffSetTop = footer.offsetTop;

        if (window.scrollY >= menuOfSetTop) {
            menu.classList.add('sticked');
        } else {
            menu.classList.remove('sticked');
        }

        if (window.scrollY + menu.clientHeight >= footerOffSetTop + 15) {
            menu.classList.add('unsticked');
        } else {
            menu.classList.remove('unsticked');
        };
    }

    function _openMenu() {
        var menuList = menu.querySelector('.menu__list');
        var menuListHeight = menuList.clientHeight;

        this.classList.toggle('active');

        if (menu.clientHeight < menuListHeight) {
            menu.style.height = menuHeight + menuListHeight + 'px';

            if (window.innerWidth <= 580) {
                menu.style.overflow = 'visible';
            }
        } else {
            menu.style.height = menuHeight + 'px';

            if (window.innerWidth <= 580) {
                menu.style.overflow = 'hidden';
            }
        }
    }

    function _reverseAnimation(func) {
        func();
    }

    function _openSubMenu(e) {

        var tl = new TimelineMax({
            onComplete: function onComplete() {
                menuList.addEventListener('click', _openSubMenu);
            },
            onUpdate: function onUpdate() {
                menuList.removeEventListener('click', _openSubMenu);
            }
        });
        var items = menuList.querySelectorAll('.menu__item');
        var closeBtns = menuList.querySelectorAll('.submenu__close');
        var activeItem = Array.from(items).filter(function (item) {
            return item.classList.contains('active');
        });

        closeBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var submenu = btn.parentElement;

                _reverseAnimation(tl.reverse.bind(tl));
                setTimeout(function () {
                    submenu.parentElement.classList.remove('active');
                    menuList.addEventListener('click', _openSubMenu);
                }, 1000);
            });
        });

        if (e.target.closest('.submenu')) {
            return;
        }

        if (e.target.closest('.menu__item')) {
            var activeSubmenu = e.target.closest('.menu__item').querySelector('.submenu');
            var subTitle = activeSubmenu.querySelectorAll('.submenu__title span');
            var subItems = activeSubmenu.querySelectorAll('.submenu__img-wrap');

            if (activeItem.length && e.target.closest('.menu__item') !== activeItem[0]) {
                activeItem[0].classList.remove('active');
            }

            if (activeItem.length && e.target.closest('.menu__item') === activeItem[0]) {
                _reverseAnimation(tl.reverse.bind(tl));

                setTimeout(function () {
                    activeItem[0].classList.remove('active');
                    menuList.addEventListener('click', _openSubMenu);
                }, 1000);
            }

            tl.fromTo(activeSubmenu, 0.8, { x: -20, autoAlpha: 0 }, { x: 0, autoAlpha: 1 }).fromTo(subTitle, 0.5, { rotationX: -90 }, { rotationX: 0, transformOrigin: '50% 100%' }, '-=0.5').staggerFromTo(subItems, 0.1, { rotationY: 90 }, { rotationY: 0, ease: Power1.easeIn }, 0, '-=0.5');

            e.target.closest('.menu__item').classList.add('active');
        }
    }

    return { init: init };
}();

menu.init();
'use strict';

var mobNav = function () {
    var init = function init() {
        _setUpListeners();
    };

    var _setUpListeners = function _setUpListeners() {
        navBtn.addEventListener('click', _toggleNav);
        navWrap.addEventListener('click', _action);
        window.addEventListener('resize', function () {
            if (window.outerWidth < 580) {
                loginBtn.style.right = 0;
                navBtn.classList.remove('active');
                navWrap.style.left = -100 + '%';
            }
            if (window.outerWidth > 580) {
                navBtn.classList.remove('active');
                netbookMenu.classList.remove('active');
                loginBtn.style.right = 0;
            }
        });
    };

    var partOne = document.querySelector('.header__part-one');
    var navWrap = document.querySelector('.header__part-two');
    var partThree = document.querySelector('.header__part-three');
    var navBtn = document.querySelector('.menu-trigger');
    var navLinks = document.querySelectorAll(".nav__link_arrow");
    var loginBtn = document.querySelector('.header__login-btn');
    var netbookMenu = document.querySelector('.netbook-menu-wrap');

    function _toggleNav() {
        var stylesNavWrap = getComputedStyle(navWrap);
        var stylesLoginBtn = getComputedStyle(loginBtn);
        var posOfNavWrap = parseFloat(stylesNavWrap.left);
        var posOfLoginBtn = parseFloat(stylesLoginBtn.right);
        var widthOfLoginBtn = loginBtn.offsetWidth;

        posOfNavWrap === 0 ? navWrap.style.left = -100 + '%' : navWrap.style.left = 0;
        posOfLoginBtn === 0 ? loginBtn.style.right = widthOfLoginBtn + 'px' : loginBtn.style.right = 0;
        navBtn.classList.toggle('active');
        partOne.classList.toggle('passive');
        partThree.classList.toggle('active');

        if (window.outerWidth > 580) {
            netbookMenu.classList.toggle('active');
        }
    }

    function _action(e) {

        if (e.target.nextElementSibling.style.maxHeight) {
            e.target.nextElementSibling.style.maxHeight = null;
            e.target.classList.remove('active');
            return;
        }
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            link.nextElementSibling.style.maxHeight = null;

            if (e.target === link) {
                var panel = e.target.nextElementSibling;
                panel.style.maxHeight = panel.scrollHeight + "px";
                link.classList.add('active');
            }
        });
    }

    return {
        init: init
    };
}();
mobNav.init();
'use strict';

var owlSlider = function () {

    var init = function init() {
        _setUpListeners();
    };

    var _setUpListeners = function _setUpListeners() {
        window.addEventListener('load', function () {
            if (window.outerWidth <= 480) {
                _owlInitialization();
            }

            if (window.outerWidth <= 780) {
                _initializeSlider();
            }
        });

        window.addEventListener('resize', function () {
            window.outerWidth > 480 ? $('.products__list').trigger('destroy.owl.carousel') : _owlInitialization();
            window.outerWidth > 780 ? $('.slider__list').trigger('destroy.owl.carousel') : _initializeSlider();
        });
    };

    function _initializeSlider() {
        $('.slider__list').addClass('owl-carousel owl-theme');
        $('.slider__list').owlCarousel({
            loop: true,
            nav: false,
            dots: true,
            items: 1,
            autoplay: true,
            autoplayTimeout: 3000,
            autoplayHoverPause: true,
            responsive: {
                0: {
                    items: 1
                }
            }
        });
    }

    function _owlInitialization() {
        $('.products__list').addClass('owl-carousel owl-theme');
        $('.products__list').owlCarousel({
            loop: true,
            nav: true,
            dots: true,
            items: 1,
            responsive: {
                0: {
                    items: 1
                }
            }
        });
    }

    return {
        init: init
    };
}();
owlSlider.init();
'use strict';

var search = function () {

	var init = function init() {
		_setUpListners();
	};
	var _setUpListners = function _setUpListners() {
		searchBnt.addEventListener('click', toggleSearch);
	};

	var searchBnt = getElement('#search-btn');
	var searchBlock = getElement('.search');
	var searchWrap = getElement('.search__wrap');

	function toggleSearch() {

		if (searchBlock.style.display === 'block') {
			var transitionEnd = function transitionEnd() {
				searchBlock.style.display = 'none';
				searchWrap.removeEventListener('transitionend', transitionEnd);
			};

			searchWrap.addEventListener('transitionend', transitionEnd);
		} else {
			searchBlock.style.display = 'block';
		}

		setTimeout(function () {
			searchWrap.classList.toggle('opened');
		});
	}

	return {
		init: init
	};
}();

search.init();
'use strict';

var showPhoto = function () {

    function init() {
        if (wrapper) {
            _setListeners();
        }
    }

    function _setListeners() {
        wrapper.addEventListener('mouseover', _showPhotos);
    }

    var wrapper = document.querySelector('.series__table');
    var img = new Image();

    var _createElement = function _createElement() {
        var imgWrapper = document.createElement('div');
        var preloader = '<div class="preloader">\n                            <div class="preloader__circle"></div>\n                        </div>';
        imgWrapper.className = 'series__table-code-img-wrap';
        imgWrapper.insertAdjacentHTML('beforeEnd', preloader);
        return imgWrapper;
    };

    var _promise = function _promise(url) {
        img.src = url;
        return new Promise(function (resolve, reject) {
            img.addEventListener('load', function () {
                resolve();
            });

            img.addEventListener('error', function () {
                reject();
            });
        });
    };

    function _showPhotos(e) {
        var imgWrapper = _createElement();
        var targets = wrapper.querySelectorAll('.series__table-code-link');
        var isLoaded = false;
        var tl = new TimelineMax({
            onUpdate: function onUpdate() {
                wrapper.removeEventListener('mouseover', _showPhotos);
            },
            onComplete: function onComplete() {
                wrapper.addEventListener('mouseover', _showPhotos);
            }
        });

        targets.forEach(function (target) {

            if (e.target === target) {
                target.parentElement.appendChild(imgWrapper);
                var url = target.dataset.url;
                var preloader = document.querySelector('.preloader');

                tl.fromTo(imgWrapper, 0.5, { opacity: 0 }, { opacity: 1 });

                _promise(url).then(function () {

                    isLoaded = true;

                    if (isLoaded) {
                        imgWrapper.removeChild(preloader);
                        imgWrapper.appendChild(img);
                    }
                }, function () {
                    imgWrapper.innerText = 'sorry, image is not exist';
                });

                target.addEventListener('mouseout', function hidePhotos() {
                    target.parentElement.removeChild(imgWrapper);
                    target.removeEventListener('mouseout', hidePhotos);
                });
            }
        });
    }

    return { init: init };
}();
showPhoto.init();
'use strict';

var mySlideshow = function () {

	var slides = getAllElements('.slider__item');
	var dotsContainer = getElement('.dots');
	var dots = getAllElements('.dot');
	var slideIndex = 0;

	var init = function init() {
		if (window.innerWidth <= 780) {
			// _setUpListners();
		}
	};

	var _setUpListners = function _setUpListners() {
		dotsContainer.addEventListener('click', _currentSlide);
		_showSlides();
		setInterval(_showSlides, 5000); // Change image every 2 seconds
	};

	function _currentSlide(e) {
		var i = 0;

		dots.forEach(function (item, index) {
			if (e.target === item) {
				i = index;
			}
		});

		_showSlides(slideIndex = i);
	}

	function _showSlides() {

		slides.forEach(function (item) {
			item.classList.remove('fade');
			item.style.display = "none";
		});

		dots.forEach(function (item) {
			item.className = item.className.replace(" active fade", "");
		});

		slideIndex++;

		if (slideIndex > slides.length) {
			slideIndex = 1;
		};

		slides[slideIndex - 1].style.display = "flex";
		slides[slideIndex - 1].classList.add('fade');
		dots[slideIndex - 1].className += " active fade";
	}

	return {
		init: init
	};
}();

mySlideshow.init();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsIl9hZGQtY291bnQtaW5wdXQuanMiLCJfbWVudS5qcyIsIl9tb2JpbGUtbmF2LmpzIiwiX293bC1jYXJvdXNlbC5qcyIsIl9zZWFyY2guanMiLCJfc2hvdy1waG90by5qcyIsIl9zbGlkZXIuanMiXSwibmFtZXMiOlsic3ZnNGV2ZXJ5Ym9keSIsInQiLCJidG5VcCIsImdldEVsZW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwidXAiLCJ0b3AiLCJNYXRoIiwibWF4IiwiZG9jdW1lbnQiLCJib2R5Iiwic2Nyb2xsVG9wIiwiZG9jdW1lbnRFbGVtZW50IiwiY29uc29sZSIsImxvZyIsIndpbmRvdyIsInNjcm9sbEJ5Iiwic2V0VGltZW91dCIsImNsZWFyVGltZW91dCIsImVsZW0iLCJxdWVyeVNlbGVjdG9yIiwiZ2V0QWxsRWxlbWVudHMiLCJxdWVyeVNlbGVjdG9yQWxsIiwiYWRkQ291dG5JbnB1dCIsImluaXQiLCJ3cmFwSW5wdXQiLCJsZW5ndGgiLCJfc2V0VXBMaXN0bmVycyIsImFkZENvdW50IiwiYmFza2V0SW5wdXQiLCJjb3VudElucHV0IiwiYmFza2V0VG90YWxDb3VudCIsImUiLCJBcnJheSIsImZyb20iLCJmb3JFYWNoIiwiaW5wdXQiLCJpdGVtIiwiY291bnQiLCJwYXJzZUZsb2F0IiwidmFsdWUiLCJpbnB1dEJ0blVwIiwiaW5wdXRCdG5Eb3duIiwic3RhcnRQcmljZSIsInRvdGFsUHJpY2UiLCJzdGFydFByaWNlVmFsdWUiLCJ0b3RhbFByaWNlVmFsdWUiLCJiYXNrZXRUb3RhbENvdW50VmFsdWUiLCJiYXNrZXREZWxldGVCdG4iLCJjbGFzc0xpc3QiLCJjb250YWlucyIsImlubmVyVGV4dCIsInRhcmdldCIsImlucHV0cyIsImdldEVsZW1lbnRzQnlOYW1lIiwiaXNOYU4iLCJ0b0ZpeGVkIiwiaW5wdXRWYWx1ZSIsIm1lbnUiLCJfY2hlY2tTbGlkZSIsImlubmVyV2lkdGgiLCJtZW51SGVpZ2h0IiwiY2xpZW50SGVpZ2h0IiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsIm1lbnVCdG4iLCJfb3Blbk1lbnUiLCJtZW51TGlzdCIsIl9vcGVuU3ViTWVudSIsIm1lbnVPZlNldFRvcCIsIm9mZnNldFRvcCIsImZvb3RlciIsImZvb3Rlck9mZlNldFRvcCIsInNjcm9sbFkiLCJhZGQiLCJyZW1vdmUiLCJtZW51TGlzdEhlaWdodCIsInRvZ2dsZSIsInN0eWxlIiwiaGVpZ2h0Iiwib3ZlcmZsb3ciLCJfcmV2ZXJzZUFuaW1hdGlvbiIsImZ1bmMiLCJ0bCIsIlRpbWVsaW5lTWF4Iiwib25Db21wbGV0ZSIsIm9uVXBkYXRlIiwiaXRlbXMiLCJjbG9zZUJ0bnMiLCJhY3RpdmVJdGVtIiwiZmlsdGVyIiwiYnRuIiwic3VibWVudSIsInBhcmVudEVsZW1lbnQiLCJyZXZlcnNlIiwiYmluZCIsImNsb3Nlc3QiLCJhY3RpdmVTdWJtZW51Iiwic3ViVGl0bGUiLCJzdWJJdGVtcyIsImZyb21UbyIsIngiLCJhdXRvQWxwaGEiLCJyb3RhdGlvblgiLCJ0cmFuc2Zvcm1PcmlnaW4iLCJzdGFnZ2VyRnJvbVRvIiwicm90YXRpb25ZIiwiZWFzZSIsIlBvd2VyMSIsImVhc2VJbiIsIm1vYk5hdiIsIl9zZXRVcExpc3RlbmVycyIsIm5hdkJ0biIsIl90b2dnbGVOYXYiLCJuYXZXcmFwIiwiX2FjdGlvbiIsIm91dGVyV2lkdGgiLCJsb2dpbkJ0biIsInJpZ2h0IiwibGVmdCIsIm5ldGJvb2tNZW51IiwicGFydE9uZSIsInBhcnRUaHJlZSIsIm5hdkxpbmtzIiwic3R5bGVzTmF2V3JhcCIsImdldENvbXB1dGVkU3R5bGUiLCJzdHlsZXNMb2dpbkJ0biIsInBvc09mTmF2V3JhcCIsInBvc09mTG9naW5CdG4iLCJ3aWR0aE9mTG9naW5CdG4iLCJvZmZzZXRXaWR0aCIsIm5leHRFbGVtZW50U2libGluZyIsIm1heEhlaWdodCIsImxpbmsiLCJwYW5lbCIsInNjcm9sbEhlaWdodCIsIm93bFNsaWRlciIsIl9vd2xJbml0aWFsaXphdGlvbiIsIl9pbml0aWFsaXplU2xpZGVyIiwiJCIsInRyaWdnZXIiLCJhZGRDbGFzcyIsIm93bENhcm91c2VsIiwibG9vcCIsIm5hdiIsImRvdHMiLCJhdXRvcGxheSIsImF1dG9wbGF5VGltZW91dCIsImF1dG9wbGF5SG92ZXJQYXVzZSIsInJlc3BvbnNpdmUiLCJzZWFyY2giLCJzZWFyY2hCbnQiLCJ0b2dnbGVTZWFyY2giLCJzZWFyY2hCbG9jayIsInNlYXJjaFdyYXAiLCJkaXNwbGF5IiwidHJhbnNpdGlvbkVuZCIsInNob3dQaG90byIsIndyYXBwZXIiLCJfc2V0TGlzdGVuZXJzIiwiX3Nob3dQaG90b3MiLCJpbWciLCJJbWFnZSIsIl9jcmVhdGVFbGVtZW50IiwiaW1nV3JhcHBlciIsImNyZWF0ZUVsZW1lbnQiLCJwcmVsb2FkZXIiLCJjbGFzc05hbWUiLCJpbnNlcnRBZGphY2VudEhUTUwiLCJfcHJvbWlzZSIsInVybCIsInNyYyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwidGFyZ2V0cyIsImlzTG9hZGVkIiwiYXBwZW5kQ2hpbGQiLCJkYXRhc2V0Iiwib3BhY2l0eSIsInRoZW4iLCJyZW1vdmVDaGlsZCIsImhpZGVQaG90b3MiLCJteVNsaWRlc2hvdyIsInNsaWRlcyIsImRvdHNDb250YWluZXIiLCJzbGlkZUluZGV4IiwiX2N1cnJlbnRTbGlkZSIsIl9zaG93U2xpZGVzIiwic2V0SW50ZXJ2YWwiLCJpIiwiaW5kZXgiLCJyZXBsYWNlIl0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsWUFBVztBQUNWOztBQUVFQTs7QUFFSCxLQUFJQyxDQUFKO0FBQ0EsS0FBTUMsUUFBUUMsV0FBVyxTQUFYLENBQWQ7QUFDQUQsT0FBTUUsZ0JBQU4sQ0FBdUIsT0FBdkIsRUFBZ0NDLEVBQWhDO0FBQ0EsVUFBU0EsRUFBVCxHQUFjOztBQUViLE1BQUlDLE1BQU1DLEtBQUtDLEdBQUwsQ0FBU0MsU0FBU0MsSUFBVCxDQUFjQyxTQUF2QixFQUFpQ0YsU0FBU0csZUFBVCxDQUF5QkQsU0FBMUQsQ0FBVjtBQUNBRSxVQUFRQyxHQUFSLENB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ZTtBQUM3QkEsUUFBS1ksU0FBTCxDQUFleUIsTUFBZixDQUFzQixNQUF0QjtBQUNBckMsUUFBS3dDLEtBQUwsQ0FBVzZFLE9BQVgsR0FBcUIsTUFBckI7QUFDQSxHQUhEOztBQU1BVixPQUFLN0csT0FBTCxDQUFhLFVBQUNFLElBQUQsRUFBVTtBQUN0QkEsUUFBS2lJLFNBQUwsR0FBaUJqSSxLQUFLaUksU0FBTCxDQUFleUIsT0FBZixDQUF1QixjQUF2QixFQUF1QyxFQUF2QyxDQUFqQjtBQUNBLEdBRkQ7O0FBSUFOOztBQUVBLE1BQUlBLGFBQWFGLE9BQU83SixNQUF4QixFQUFnQztBQUFDK0osZ0JBQWEsQ0FBYjtBQUFlOztBQUVoREYsU0FBT0UsYUFBVyxDQUFsQixFQUFxQjVHLEtBQXJCLENBQTJCNkUsT0FBM0IsR0FBcUMsTUFBckM7QUFDQTZCLFNBQU9FLGFBQVcsQ0FBbEIsRUFBcUJ4SSxTQUFyQixDQUErQndCLEdBQS9CLENBQW1DLE1BQW5DO0FBQ0F1RSxPQUFLeUMsYUFBVyxDQUFoQixFQUFtQm5CLFNBQW5CLElBQWdDLGNBQWhDO0FBQ0E7O0FBSUQsUUFBTztBQUNMOUksUUFBTUE7QUFERCxFQUFQO0FBSUEsQ0ExRG1CLEVBQXBCOztBQTREQThKLFlBQVk5SixJQUFaIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcclxuICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgc3ZnNGV2ZXJ5Ym9keSgpO1xyXG5cclxuXHR2YXIgdDtcclxuXHRjb25zdCBidG5VcCA9IGdldEVsZW1lbnQoJy5idG4tdXAnKTtcclxuXHRidG5VcC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHVwKTtcclxuXHRmdW5jdGlvbiB1cCgpIHtcclxuXHJcblx0XHRsZXQgdG9wID0gTWF0aC5tYXgoZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AsZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcCk7XHJcblx0XHRjb25zb2xlLmxvZyh0b3ApO1xyXG5cclxuXHRcdGlmKHRvcCA+IDApIHtcclxuXHRcdFx0d2luZG93LnNjcm9sbEJ5KDAsIC01MCk7XHJcblx0XHRcdHQgPSBzZXRUaW1lb3V0KHVwLCAyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNsZWFyVGltZW91dCh0KVxyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fVxyXG5cdFxyXG59KSgpO1xyXG5cclxuZnVuY3Rpb24gZ2V0RWxlbWVudChlbGVtKSB7XHJcblx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoZWxlbSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEFsbEVsZW1lbnRzKGVsZW0pIHtcclxuXHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChlbGVtKTtcclxufVxyXG4iLCJjb25zdCBhZGRDb3V0bklucHV0ID0gKGZ1bmN0aW9uICgpIHtcclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYod3JhcElucHV0Lmxlbmd0aCkge1xyXG5cdFx0XHRfc2V0VXBMaXN0bmVycygpO1xyXG5cdFx0fVxyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgYWRkQ291bnQpO1xyXG5cdH07XHJcblxyXG5cdGNvbnN0IGJhc2tldElucHV0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnBhcmFtcy1qcycpO1xyXG5cdGNvbnN0IGNvdW50SW5wdXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuanMtYWRkLWNvdW50Jyk7XHJcblx0Y29uc3Qgd3JhcElucHV0ID0gYmFza2V0SW5wdXQubGVuZ3RoID09PSAwID8gY291bnRJbnB1dCA6IGJhc2tldElucHV0O1xyXG5cdGNvbnN0IGJhc2tldFRvdGFsQ291bnQgPSBnZXRFbGVtZW50KCcuYmFza2V0X190b3RhbC1jb3VudCcpO1xyXG5cclxuXHRmdW5jdGlvbiBhZGRDb3VudChlKSB7XHJcbiAgICAgICAgQXJyYXkuZnJvbSh3cmFwSW5wdXQpLmZvckVhY2goaXRlbSA9PiB7XHJcblx0XHRcdGxldCBpbnB1dCA9IGl0ZW0ucXVlcnlTZWxlY3RvcignaW5wdXQnKSxcclxuXHRcdFx0XHRjb3VudCA9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpLFxyXG5cdFx0XHRcdGlucHV0QnRuVXAgPSBpdGVtLnF1ZXJ5U2VsZWN0b3IoJy5hZGQtaW5wdXRfX2J0bl91cCcpLFxyXG5cdFx0XHRcdGlucHV0QnRuRG93biA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLmFkZC1pbnB1dF9fYnRuX2Rvd24nKSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0UHJpY2UsXHJcblx0XHRcdFx0dG90YWxQcmljZSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0UHJpY2VWYWx1ZSxcclxuXHRcdFx0XHR0b3RhbFByaWNlVmFsdWUsXHJcblx0XHRcdFx0YmFza2V0VG90YWxDb3VudFZhbHVlLFxyXG5cdFx0XHRcdGJhc2tldERlbGV0ZUJ0bjtcclxuXHJcblx0XHRcdGlmIChpdGVtLmNsYXNzTGlzdC5jb250YWlucygnc2VyaWVzX190YWJsZS1wcm9kdWN0LXBhcmFtcycpKSB7XHJcbiAgICAgICAgICAgICAgICBzdGFydFByaWNlID0gaXRlbS5xdWVyeVNlbGVjdG9yKCcucHJpY2UtanMgPiBzcGFuJyk7XHJcblx0XHRcdFx0dG90YWxQcmljZSA9IGl0ZW0ucXVlcnlTZWxlY3RvcignLnRvdGFsLXByaWNlLWpzID4gc3BhbicpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnRQcmljZVZhbHVlID0gcGFyc2VGbG9hdChzdGFydFByaWNlLmlubmVyVGV4dCk7XHJcblx0XHRcdFx0dG90YWxQcmljZVZhbHVlID0gcGFyc2VGbG9hdCh0b3RhbFByaWNlLmlubmVyVGV4dCk7XHJcbiAgICAgICAgICAgICAgICAvLyBiYXNrZXRUb3RhbENvdW50VmFsdWUgPSBwYXJzZUZsb2F0KGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKGUudGFyZ2V0ID09PSBiYXNrZXREZWxldGVCdG4pIHtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5TmFtZSgnY291bnQnKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgY291bnQgPSAwO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBBcnJheS5mcm9tKGlucHV0cykuZm9yRWFjaChpbnB1dCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IHBhcnNlRmxvYXQoaW5wdXQudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gY291bnQ7XHJcblx0XHRcdFx0fSlcclxuXHRcdFx0fVxyXG5cclxuICAgICAgICAgICAgaWYgKGlzTmFOKGlucHV0LnZhbHVlKSB8fCBpbnB1dC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgIC8vIGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gKytiYXNrZXRUb3RhbENvdW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChlLnRhcmdldCA9PT0gaW5wdXRCdG5VcCkge1xyXG4gICAgICAgICAgICAgICAgY291bnQrKztcclxuICAgICAgICAgICAgICAgIGlucHV0LnZhbHVlID0gY291bnQ7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYodG90YWxQcmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gKytiYXNrZXRUb3RhbENvdW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcmljZS5pbm5lclRleHQgPSAodG90YWxQcmljZVZhbHVlICsgc3RhcnRQcmljZVZhbHVlKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHRcdH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSBpbnB1dEJ0bkRvd24pIHtcclxuICAgICAgICAgICAgICAgIGlmIChjb3VudCA9PT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvdW50LS07XHJcbiAgICAgICAgICAgICAgICBpbnB1dC52YWx1ZSA9IGNvdW50O1xyXG4gICAgICAgICAgICAgICAgaWYodG90YWxQcmljZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJhc2tldFRvdGFsQ291bnQuaW5uZXJUZXh0ID0gLS1iYXNrZXRUb3RhbENvdW50VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdG90YWxQcmljZS5pbm5lclRleHQgPSAodG90YWxQcmljZVZhbHVlIC0gc3RhcnRQcmljZVZhbHVlKS50b0ZpeGVkKDIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG5cclxuXHRcdFx0aWYodG90YWxQcmljZSkge1xyXG5cdFx0XHRcdGlucHV0LmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgKCkgPT4ge1xyXG5cdFx0XHRcdFx0bGV0IGlucHV0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlOYW1lKCdjb3VudCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCBpbnB1dFZhbHVlID0gcGFyc2VGbG9hdChpbnB1dC52YWx1ZSk7XHJcblx0XHRcdFx0XHRsZXQgY291bnQgPSAwO1xyXG5cclxuXHRcdFx0XHRcdEFycmF5LmZyb20oaW5wdXRzKS5mb3JFYWNoKGlucHV0ID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKGlucHV0LnZhbHVlKSB8fCBpbnB1dC52YWx1ZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50ICs9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnB1dFZhbHVlID0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcclxuXHRcdFx0XHRcdFx0Y291bnQgKz0gcGFyc2VGbG9hdChpbnB1dC52YWx1ZSk7XHJcblx0XHRcdFx0XHR9KTtcclxuICAgICAgICAgICAgICAgICAgICB0b3RhbFByaWNlLmlubmVyVGV4dCA9IChzdGFydFByaWNlVmFsdWUgKiBpbnB1dFZhbHVlKS50b0ZpeGVkKDIpO1xyXG5cdFx0XHRcdFx0YmFza2V0VG90YWxDb3VudC5pbm5lclRleHQgPSBjb3VudDtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH0pO1xyXG5cdH0gXHJcblx0XHRcclxuXHRyZXR1cm4ge1xyXG5cdFx0aW5pdDogaW5pdFxyXG5cdH1cclxuXHJcbn0pKCk7XHJcblxyXG5hZGRDb3V0bklucHV0LmluaXQoKTsiLCJjb25zdCBtZW51ID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Y29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdGlmIChtZW51KSB7XHJcbiAgICAgICAgICAgIF9zZXRVcExpc3RuZXJzKCk7XHJcbiAgICAgICAgfVxyXG5cdH07XHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblxyXG5cdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIF9jaGVja1NsaWRlKTtcclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCAoKSA9PiB7XHJcblx0XHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA1ODApIHtcclxuICAgICAgICAgICAgICAgIG1lbnVIZWlnaHQgPSBtZW51LmNsaWVudEhlaWdodDtcclxuXHRcdFx0fVxyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPj0gNTgwKSB7XHJcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgX2NoZWNrU2xpZGUpO1xyXG4gICAgICAgICAgICB9XHJcblx0XHR9KTtcclxuXHRcdGlmICh3aW5kb3cuaW5uZXJXaWR0aCA8PSA1ODApIHtcclxuXHRcdFx0d2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIF9jaGVja1NsaWRlKTtcclxuXHRcdH1cclxuXHRcdG1lbnVCdG4uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfb3Blbk1lbnUpO1xyXG4gICAgICAgIG1lbnVMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29wZW5TdWJNZW51KTtcclxuXHR9O1xyXG5cclxuXHRjb25zdCBtZW51ID0gZ2V0RWxlbWVudCgnLm1lbnVfX2lubmVyJyk7XHJcblx0bGV0IG1lbnVIZWlnaHQgPSBtZW51ID8gbWVudS5jbGllbnRIZWlnaHQgOiBudWxsO1xyXG4gICAgbGV0IG1lbnVPZlNldFRvcCA9IG1lbnUgPyBtZW51Lm9mZnNldFRvcCA6IG51bGw7XHJcbiAgICBjb25zdCBtZW51TGlzdCA9IGdldEVsZW1lbnQoJy5tZW51X19saXN0Jyk7XHJcblx0Y29uc3QgbWVudUJ0biA9IGdldEVsZW1lbnQoJy5tZW51X190aXRsZScpO1xyXG5cdGNvbnN0IGZvb3RlciA9IGdldEVsZW1lbnQoJ2Zvb3RlcicpO1xyXG5cclxuXHJcblx0ZnVuY3Rpb24gX2NoZWNrU2xpZGUoKSB7XHJcblxyXG5cdFx0bGV0IGZvb3Rlck9mZlNldFRvcCA9IGZvb3Rlci5vZmZzZXRUb3A7XHJcblxyXG5cdFx0aWYgKHdpbmRvdy5zY3JvbGxZID49IG1lbnVPZlNldFRvcCkge1xyXG5cdFx0XHRtZW51LmNsYXNzTGlzdC5hZGQoJ3N0aWNrZWQnKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1lbnUuY2xhc3NMaXN0LnJlbW92ZSgnc3RpY2tlZCcpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICgod2luZG93LnNjcm9sbFkgKyBtZW51LmNsaWVudEhlaWdodCkgPj0gZm9vdGVyT2ZmU2V0VG9wICsgMTUpIHtcclxuXHRcdFx0bWVudS5jbGFzc0xpc3QuYWRkKCd1bnN0aWNrZWQnKVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bWVudS5jbGFzc0xpc3QucmVtb3ZlKCd1bnN0aWNrZWQnKVxyXG5cdFx0fTtcclxuXHR9XHJcblxyXG5cdGZ1bmN0aW9uIF9vcGVuTWVudSgpIHtcclxuICAgICAgICBjb25zdCBtZW51TGlzdCA9IG1lbnUucXVlcnlTZWxlY3RvcignLm1lbnVfX2xpc3QnKTtcclxuICAgICAgICBsZXQgbWVudUxpc3RIZWlnaHQgPSBtZW51TGlzdC5jbGllbnRIZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyk7XHJcblxyXG5cdFx0aWYgKG1lbnUuY2xpZW50SGVpZ2h0IDwgbWVudUxpc3RIZWlnaHQpIHtcclxuXHRcdFx0bWVudS5zdHlsZS5oZWlnaHQgPSBtZW51SGVpZ2h0ICsgbWVudUxpc3RIZWlnaHQgKyAncHgnO1xyXG5cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDU4MCkge1xyXG4gICAgICAgICAgICAgICAgbWVudS5zdHlsZS5vdmVyZmxvdyA9ICd2aXNpYmxlJztcclxuICAgICAgICAgICAgfVxyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG1lbnUuc3R5bGUuaGVpZ2h0ID0gbWVudUhlaWdodCArICdweCc7XHJcblxyXG4gICAgICAgICAgICBpZiAod2luZG93LmlubmVyV2lkdGggPD0gNTgwKSB7XHJcbiAgICAgICAgICAgICAgICBtZW51LnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblx0XHR9XHJcblx0fVxyXG5cclxuICAgIGZ1bmN0aW9uIF9yZXZlcnNlQW5pbWF0aW9uKGZ1bmMpIHtcclxuXHRcdGZ1bmMoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfb3BlblN1Yk1lbnUoZSkge1xyXG5cclxuXHRcdGNvbnN0IHRsID0gbmV3IFRpbWVsaW5lTWF4KHtcclxuICAgICAgICAgICAgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICAgICAgICAgIG1lbnVMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29wZW5TdWJNZW51KTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25VcGRhdGUoKSB7XHJcbiAgICAgICAgICAgICAgICBtZW51TGlzdC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIF9vcGVuU3ViTWVudSk7XHJcbiAgICAgICAgICAgIH1cclxuXHRcdH0pO1xyXG4gICAgICAgIGxldCBpdGVtcyA9IG1lbnVMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5tZW51X19pdGVtJyk7XHJcbiAgICAgICAgbGV0IGNsb3NlQnRucyA9IG1lbnVMaXN0LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWJtZW51X19jbG9zZScpO1xyXG4gICAgICAgIGxldCAgYWN0aXZlSXRlbSA9IEFycmF5LmZyb20oaXRlbXMpLmZpbHRlcihpdGVtID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW0uY2xhc3NMaXN0LmNvbnRhaW5zKCdhY3RpdmUnKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY2xvc2VCdG5zLmZvckVhY2goYnRuID0+IHtcclxuICAgICAgICAgICAgYnRuLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgbGV0IHN1Ym1lbnUgPSBidG4ucGFyZW50RWxlbWVudDtcclxuXHJcbiAgICAgICAgICAgICAgICBfcmV2ZXJzZUFuaW1hdGlvbih0bC5yZXZlcnNlLmJpbmQodGwpKTtcclxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHN1Ym1lbnUucGFyZW50RWxlbWVudC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgICAgICBtZW51TGlzdC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF9vcGVuU3ViTWVudSk7XHJcbiAgICAgICAgICAgICAgICB9LDEwMDApO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLnN1Ym1lbnUnKSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZS50YXJnZXQuY2xvc2VzdCgnLm1lbnVfX2l0ZW0nKSkge1xyXG4gICAgICAgICAgICBsZXQgYWN0aXZlU3VibWVudSA9IGUudGFyZ2V0LmNsb3Nlc3QoJy5tZW51X19pdGVtJykucXVlcnlTZWxlY3RvcignLnN1Ym1lbnUnKTtcclxuICAgICAgICAgICAgbGV0IHN1YlRpdGxlID0gYWN0aXZlU3VibWVudS5xdWVyeVNlbGVjdG9yQWxsKCcuc3VibWVudV9fdGl0bGUgc3BhbicpO1xyXG4gICAgICAgICAgICBsZXQgc3ViSXRlbXMgPSBhY3RpdmVTdWJtZW51LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdWJtZW51X19pbWctd3JhcCcpO1xyXG5cclxuICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0ubGVuZ3RoICYmIGUudGFyZ2V0LmNsb3Nlc3QoJy5tZW51X19pdGVtJykgIT09IGFjdGl2ZUl0ZW1bMF0pIHtcclxuICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW1bMF0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtLmxlbmd0aCAmJiBlLnRhcmdldC5jbG9zZXN0KCcubWVudV9faXRlbScpID09PSBhY3RpdmVJdGVtWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBfcmV2ZXJzZUFuaW1hdGlvbih0bC5yZXZlcnNlLmJpbmQodGwpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmVJdGVtWzBdLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIG1lbnVMaXN0LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX29wZW5TdWJNZW51KTtcclxuXHRcdFx0XHR9LDEwMDApO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGxcclxuXHRcdFx0XHQuZnJvbVRvKGFjdGl2ZVN1Ym1lbnUsIDAuOCwge3g6LTIwLCBhdXRvQWxwaGE6IDB9LCB7eDowLCBhdXRvQWxwaGE6IDF9KVxyXG4gICAgICAgICAgICAgICAgLmZyb21UbyhzdWJUaXRsZSwgMC41LCB7cm90YXRpb25YOiAtOTB9LCB7cm90YXRpb25YOiAwLCB0cmFuc2Zvcm1PcmlnaW46ICc1MCUgMTAwJSd9LCAnLT0wLjUnKVxyXG5cdFx0XHRcdC5zdGFnZ2VyRnJvbVRvKHN1Ykl0ZW1zLCAwLjEsIHtyb3RhdGlvblk6IDkwfSwge3JvdGF0aW9uWTogMCwgZWFzZTogUG93ZXIxLmVhc2VJbn0sIDAsICctPTAuNScpO1xyXG5cclxuICAgICAgICAgICAgZS50YXJnZXQuY2xvc2VzdCgnLm1lbnVfX2l0ZW0nKS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblx0XHRcclxuXHRyZXR1cm4geyBpbml0IH1cclxuXHJcbn0pKCk7XHJcblxyXG5tZW51LmluaXQoKTsiLCJjb25zdCBtb2JOYXYgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgY29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3NldFVwTGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIG5hdkJ0bi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIF90b2dnbGVOYXYpO1xyXG4gICAgICAgIG5hdldyYXAuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBfYWN0aW9uKTtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAod2luZG93Lm91dGVyV2lkdGggPCA1ODApIHtcclxuICAgICAgICAgICAgICAgIGxvZ2luQnRuLnN0eWxlLnJpZ2h0ID0gMDtcclxuICAgICAgICAgICAgICAgIG5hdkJ0bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIG5hdldyYXAuc3R5bGUubGVmdCA9IC0xMDAgKyAnJSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5vdXRlcldpZHRoID4gNTgwKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZCdG4uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgICAgICBuZXRib29rTWVudS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgICAgIGxvZ2luQnRuLnN0eWxlLnJpZ2h0ID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBwYXJ0T25lID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fcGFydC1vbmUnKTtcclxuICAgIGNvbnN0IG5hdldyYXAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuaGVhZGVyX19wYXJ0LXR3bycpO1xyXG4gICAgY29uc3QgcGFydFRocmVlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fcGFydC10aHJlZScpO1xyXG4gICAgY29uc3QgbmF2QnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLm1lbnUtdHJpZ2dlcicpO1xyXG4gICAgY29uc3QgbmF2TGlua3MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLm5hdl9fbGlua19hcnJvd1wiKTtcclxuICAgIGNvbnN0IGxvZ2luQnRuID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmhlYWRlcl9fbG9naW4tYnRuJyk7XHJcbiAgICBjb25zdCBuZXRib29rTWVudSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uZXRib29rLW1lbnUtd3JhcCcpO1xyXG5cclxuICAgIGZ1bmN0aW9uIF90b2dnbGVOYXYoKSB7XHJcbiAgICAgICAgbGV0IHN0eWxlc05hdldyYXAgPSBnZXRDb21wdXRlZFN0eWxlKG5hdldyYXApO1xyXG4gICAgICAgIGxldCBzdHlsZXNMb2dpbkJ0biA9IGdldENvbXB1dGVkU3R5bGUobG9naW5CdG4pO1xyXG4gICAgICAgIGxldCBwb3NPZk5hdldyYXAgPSBwYXJzZUZsb2F0KHN0eWxlc05hdldyYXAubGVmdCk7XHJcbiAgICAgICAgbGV0IHBvc09mTG9naW5CdG4gPSBwYXJzZUZsb2F0KHN0eWxlc0xvZ2luQnRuLnJpZ2h0KTtcclxuICAgICAgICBsZXQgd2lkdGhPZkxvZ2luQnRuID0gbG9naW5CdG4ub2Zmc2V0V2lkdGg7XHJcblxyXG4gICAgICAgIHBvc09mTmF2V3JhcCA9PT0gMCA/IG5hdldyYXAuc3R5bGUubGVmdCA9IC0xMDAgKyAnJScgOiBuYXZXcmFwLnN0eWxlLmxlZnQgPSAwO1xyXG4gICAgICAgIHBvc09mTG9naW5CdG4gPT09IDAgPyBsb2dpbkJ0bi5zdHlsZS5yaWdodCA9IHdpZHRoT2ZMb2dpbkJ0biArICdweCcgOiBsb2dpbkJ0bi5zdHlsZS5yaWdodCA9IDA7XHJcbiAgICAgICAgbmF2QnRuLmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIHBhcnRPbmUuY2xhc3NMaXN0LnRvZ2dsZSgncGFzc2l2ZScpO1xyXG4gICAgICAgIHBhcnRUaHJlZS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKTtcclxuXHJcbiAgICAgICAgaWYgKHdpbmRvdy5vdXRlcldpZHRoID4gNTgwKSB7XHJcbiAgICAgICAgICAgIG5ldGJvb2tNZW51LmNsYXNzTGlzdC50b2dnbGUoJ2FjdGl2ZScpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfYWN0aW9uKGUpIHtcclxuXHJcbiAgICAgICAgaWYgKGUudGFyZ2V0Lm5leHRFbGVtZW50U2libGluZy5zdHlsZS5tYXhIZWlnaHQpIHtcclxuICAgICAgICAgICAgZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcbiAgICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5hdkxpbmtzLmZvckVhY2gobGluayA9PiB7XHJcbiAgICAgICAgICAgIGxpbmsuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XHJcbiAgICAgICAgICAgIGxpbmsubmV4dEVsZW1lbnRTaWJsaW5nLnN0eWxlLm1heEhlaWdodCA9IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZihlLnRhcmdldCA9PT0gbGluaykge1xyXG4gICAgICAgICAgICAgICAgbGV0IHBhbmVsID0gZS50YXJnZXQubmV4dEVsZW1lbnRTaWJsaW5nO1xyXG4gICAgICAgICAgICAgICAgcGFuZWwuc3R5bGUubWF4SGVpZ2h0ID0gcGFuZWwuc2Nyb2xsSGVpZ2h0ICsgXCJweFwiO1xyXG4gICAgICAgICAgICAgICAgbGluay5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaW5pdDogaW5pdFxyXG4gICAgfVxyXG59KCkpO1xyXG5tb2JOYXYuaW5pdCgpO1xyXG4iLCJjb25zdCBvd2xTbGlkZXIgPSAoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIGNvbnN0IGluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgX3NldFVwTGlzdGVuZXJzKCk7XHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHdpbmRvdy5vdXRlcldpZHRoIDw9IDQ4MCkge1xyXG4gICAgICAgICAgICAgICAgX293bEluaXRpYWxpemF0aW9uKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh3aW5kb3cub3V0ZXJXaWR0aCA8PSA3ODApIHtcclxuICAgICAgICAgICAgICAgIF9pbml0aWFsaXplU2xpZGVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpID0+IHtcclxuICAgICAgICAgICAgd2luZG93Lm91dGVyV2lkdGggPiA0ODAgPyAkKCcucHJvZHVjdHNfX2xpc3QnKS50cmlnZ2VyKCdkZXN0cm95Lm93bC5jYXJvdXNlbCcpIDogX293bEluaXRpYWxpemF0aW9uKCk7XHJcbiAgICAgICAgICAgIHdpbmRvdy5vdXRlcldpZHRoID4gNzgwID8gJCgnLnNsaWRlcl9fbGlzdCcpLnRyaWdnZXIoJ2Rlc3Ryb3kub3dsLmNhcm91c2VsJykgOiBfaW5pdGlhbGl6ZVNsaWRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBfaW5pdGlhbGl6ZVNsaWRlcigpIHtcclxuICAgICAgICAkKCcuc2xpZGVyX19saXN0JykuYWRkQ2xhc3MoJ293bC1jYXJvdXNlbCBvd2wtdGhlbWUnKTtcclxuICAgICAgICAkKCcuc2xpZGVyX19saXN0Jykub3dsQ2Fyb3VzZWwoe1xyXG4gICAgICAgICAgICBsb29wOnRydWUsXHJcbiAgICAgICAgICAgIG5hdjpmYWxzZSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgaXRlbXM6MSxcclxuICAgICAgICAgICAgYXV0b3BsYXk6dHJ1ZSxcclxuICAgICAgICAgICAgYXV0b3BsYXlUaW1lb3V0OjMwMDAsXHJcbiAgICAgICAgICAgIGF1dG9wbGF5SG92ZXJQYXVzZTp0cnVlLFxyXG4gICAgICAgICAgICByZXNwb25zaXZlOntcclxuICAgICAgICAgICAgICAgIDA6e1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zOjFcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIF9vd2xJbml0aWFsaXphdGlvbigpIHtcclxuICAgICAgICAkKCcucHJvZHVjdHNfX2xpc3QnKS5hZGRDbGFzcygnb3dsLWNhcm91c2VsIG93bC10aGVtZScpO1xyXG4gICAgICAgICQoJy5wcm9kdWN0c19fbGlzdCcpLm93bENhcm91c2VsKHtcclxuICAgICAgICAgICAgbG9vcDp0cnVlLFxyXG4gICAgICAgICAgICBuYXY6dHJ1ZSxcclxuICAgICAgICAgICAgZG90czogdHJ1ZSxcclxuICAgICAgICAgICAgaXRlbXM6MSxcclxuICAgICAgICAgICAgcmVzcG9uc2l2ZTp7XHJcbiAgICAgICAgICAgICAgICAwOntcclxuICAgICAgICAgICAgICAgICAgICBpdGVtczoxXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGluaXQ6IGluaXRcclxuICAgIH1cclxufSkoKTtcclxub3dsU2xpZGVyLmluaXQoKTtcclxuIiwiY29uc3Qgc2VhcmNoID0gKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0Y29uc3QgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0X3NldFVwTGlzdG5lcnMoKTtcclxuXHR9O1xyXG5cdGNvbnN0IF9zZXRVcExpc3RuZXJzID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0c2VhcmNoQm50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlU2VhcmNoKTtcclxuXHR9XHRcdFxyXG5cclxuXHRjb25zdCBzZWFyY2hCbnQgPSBnZXRFbGVtZW50KCcjc2VhcmNoLWJ0bicpO1xyXG5cdGNvbnN0IHNlYXJjaEJsb2NrID0gZ2V0RWxlbWVudCgnLnNlYXJjaCcpO1xyXG5cdGNvbnN0IHNlYXJjaFdyYXAgPSBnZXRFbGVtZW50KCcuc2VhcmNoX193cmFwJyk7XHJcblxyXG5cdGZ1bmN0aW9uIHRvZ2dsZVNlYXJjaCgpIHtcclxuXHJcblx0XHRpZiAoc2VhcmNoQmxvY2suc3R5bGUuZGlzcGxheSA9PT0gJ2Jsb2NrJykge1xyXG5cdFx0XHRzZWFyY2hXcmFwLmFkZEV2ZW50TGlzdGVuZXIoJ3RyYW5zaXRpb25lbmQnLCB0cmFuc2l0aW9uRW5kKTtcclxuXHRcdFx0ZnVuY3Rpb24gdHJhbnNpdGlvbkVuZCgpIHtcclxuXHRcdFx0XHRzZWFyY2hCbG9jay5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG5cdFx0XHRcdHNlYXJjaFdyYXAucmVtb3ZlRXZlbnRMaXN0ZW5lcigndHJhbnNpdGlvbmVuZCcsIHRyYW5zaXRpb25FbmQpO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c2VhcmNoQmxvY2suc3R5bGUuZGlzcGxheSA9ICdibG9jaydcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0c2VhcmNoV3JhcC5jbGFzc0xpc3QudG9nZ2xlKCdvcGVuZWQnKTtcclxuXHRcdH0pXHJcblx0fVxyXG5cdFx0XHJcblx0cmV0dXJuIHtcclxuXHRcdGluaXQ6IGluaXRcclxuXHR9XHJcblxyXG59KSgpO1xyXG5cclxuc2VhcmNoLmluaXQoKTsiLCJjb25zdCBzaG93UGhvdG8gPSAoKCkgPT4ge1xyXG5cclxuICAgIGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAgICAgaWYgKHdyYXBwZXIpIHtcclxuICAgICAgICAgICAgX3NldExpc3RlbmVycygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBfc2V0TGlzdGVuZXJzKCkge1xyXG4gICAgICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgX3Nob3dQaG90b3MpXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgd3JhcHBlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zZXJpZXNfX3RhYmxlJyk7XHJcbiAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcclxuXHJcbiAgICBjb25zdCBfY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb25zdCBwcmVsb2FkZXIgPSBgPGRpdiBjbGFzcz1cInByZWxvYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInByZWxvYWRlcl9fY2lyY2xlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PmA7XHJcbiAgICAgICAgaW1nV3JhcHBlci5jbGFzc05hbWUgPSAnc2VyaWVzX190YWJsZS1jb2RlLWltZy13cmFwJztcclxuICAgICAgICBpbWdXcmFwcGVyLmluc2VydEFkamFjZW50SFRNTCgnYmVmb3JlRW5kJywgcHJlbG9hZGVyKTtcclxuICAgICAgICByZXR1cm4gaW1nV3JhcHBlcjtcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgX3Byb21pc2UgPSBmdW5jdGlvbiAodXJsKSB7XHJcbiAgICAgICAgaW1nLnNyYyA9IHVybDtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpbWcuYWRkRXZlbnRMaXN0ZW5lcignZXJyb3InLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZWplY3QoKTtcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KTtcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gX3Nob3dQaG90b3MoZSkge1xyXG4gICAgICAgIGNvbnN0IGltZ1dyYXBwZXIgPSBfY3JlYXRlRWxlbWVudCgpO1xyXG4gICAgICAgIGNvbnN0IHRhcmdldHMgPSB3cmFwcGVyLnF1ZXJ5U2VsZWN0b3JBbGwoJy5zZXJpZXNfX3RhYmxlLWNvZGUtbGluaycpO1xyXG4gICAgICAgIGxldCBpc0xvYWRlZCA9IGZhbHNlO1xyXG4gICAgICAgIGNvbnN0IHRsID0gbmV3IFRpbWVsaW5lTWF4KHtcclxuICAgICAgICAgICAgb25VcGRhdGUoKSB7XHJcbiAgICAgICAgICAgICAgICB3cmFwcGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIF9zaG93UGhvdG9zKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICAgICAgICAgIHdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgX3Nob3dQaG90b3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRhcmdldHMuZm9yRWFjaCh0YXJnZXQgPT4ge1xyXG5cclxuICAgICAgICAgICAgaWYgKGUudGFyZ2V0ID09PSB0YXJnZXQpIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldC5wYXJlbnRFbGVtZW50LmFwcGVuZENoaWxkKGltZ1dyYXBwZXIpO1xyXG4gICAgICAgICAgICAgICAgbGV0IHVybCA9IHRhcmdldC5kYXRhc2V0LnVybDtcclxuICAgICAgICAgICAgICAgIGxldCBwcmVsb2FkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucHJlbG9hZGVyJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGwuZnJvbVRvKGltZ1dyYXBwZXIsIDAuNSwge29wYWNpdHk6MH0sIHtvcGFjaXR5OjF9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBfcHJvbWlzZSh1cmwpLnRoZW4oKCkgPT4ge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpc0xvYWRlZCA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc0xvYWRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdXcmFwcGVyLnJlbW92ZUNoaWxkKHByZWxvYWRlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ1dyYXBwZXIuYXBwZW5kQ2hpbGQoaW1nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGltZ1dyYXBwZXIuaW5uZXJUZXh0ID0gJ3NvcnJ5LCBpbWFnZSBpcyBub3QgZXhpc3QnO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3V0JywgZnVuY3Rpb24gaGlkZVBob3RvcygpIHtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucGFyZW50RWxlbWVudC5yZW1vdmVDaGlsZChpbWdXcmFwcGVyKTtcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignbW91c2VvdXQnLCBoaWRlUGhvdG9zKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7aW5pdH1cclxufSkoKTtcclxuc2hvd1Bob3RvLmluaXQoKTsiLCJjb25zdCBteVNsaWRlc2hvdyA9IChmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGNvbnN0IHNsaWRlcyA9IGdldEFsbEVsZW1lbnRzKCcuc2xpZGVyX19pdGVtJyk7XHJcblx0Y29uc3QgZG90c0NvbnRhaW5lciA9IGdldEVsZW1lbnQoJy5kb3RzJyk7XHJcblx0Y29uc3QgZG90cyA9IGdldEFsbEVsZW1lbnRzKCcuZG90Jyk7XHJcblx0bGV0IHNsaWRlSW5kZXggPSAwO1xyXG5cclxuXHRjb25zdCBpbml0ID0gZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHdpbmRvdy5pbm5lcldpZHRoIDw9IDc4MCkge1xyXG5cdFx0XHQvLyBfc2V0VXBMaXN0bmVycygpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Y29uc3QgX3NldFVwTGlzdG5lcnMgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRkb3RzQ29udGFpbmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgX2N1cnJlbnRTbGlkZSk7XHJcblx0XHRfc2hvd1NsaWRlcygpO1xyXG5cdFx0c2V0SW50ZXJ2YWwoX3Nob3dTbGlkZXMsIDUwMDApOyAvLyBDaGFuZ2UgaW1hZ2UgZXZlcnkgMiBzZWNvbmRzXHJcblx0fVxyXG5cclxuXHRmdW5jdGlvbiBfY3VycmVudFNsaWRlKGUpIHtcclxuXHRcdGxldCBpID0gMDtcclxuXHJcblx0XHRkb3RzLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XHJcblx0XHRcdGlmIChlLnRhcmdldCA9PT0gaXRlbSkge1xyXG5cdFx0XHRcdGkgPSBpbmRleDtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0X3Nob3dTbGlkZXMoc2xpZGVJbmRleCA9IGkpO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gX3Nob3dTbGlkZXMoKSB7XHJcblxyXG5cdFx0c2xpZGVzLmZvckVhY2goZnVuY3Rpb24oaXRlbSkge1xyXG5cdFx0XHRpdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2ZhZGUnKTtcclxuXHRcdFx0aXRlbS5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcblx0XHR9KTtcclxuXHJcblxyXG5cdFx0ZG90cy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcblx0XHRcdGl0ZW0uY2xhc3NOYW1lID0gaXRlbS5jbGFzc05hbWUucmVwbGFjZShcIiBhY3RpdmUgZmFkZVwiLCBcIlwiKTtcclxuXHRcdH0pO1xyXG5cclxuXHRcdHNsaWRlSW5kZXgrKztcclxuXHJcblx0XHRpZiAoc2xpZGVJbmRleCA+IHNsaWRlcy5sZW5ndGgpIHtzbGlkZUluZGV4ID0gMX07XHJcblxyXG5cdFx0c2xpZGVzW3NsaWRlSW5kZXgtMV0uc3R5bGUuZGlzcGxheSA9IFwiZmxleFwiO1xyXG5cdFx0c2xpZGVzW3NsaWRlSW5kZXgtMV0uY2xhc3NMaXN0LmFkZCgnZmFkZScpO1xyXG5cdFx0ZG90c1tzbGlkZUluZGV4LTFdLmNsYXNzTmFtZSArPSBcIiBhY3RpdmUgZmFkZVwiO1xyXG5cdH1cclxuXHJcblx0XHJcblxyXG5cdHJldHVybiB7XHJcblx0XHQgaW5pdDogaW5pdFxyXG5cdH1cclxuXHJcbn0pKCk7XHJcblxyXG5teVNsaWRlc2hvdy5pbml0KCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
