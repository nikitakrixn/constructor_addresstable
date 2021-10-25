jQuery.noConflict();
jQuery(document).ready(function ($) {
  // Переменные
  let current_svg, current_price, textSize, fontSize = 0;

  // Цветовая палитра
  $('.popup-adresstable__modal_form').mouseup(function (e) {
    let div = $('.color-picker__paletetre');
    let dropdown_table = $('.color_table__btn.dropdown');
    let dropdown_text = $('.color_text__btn.dropdown');
    if (!div.is(e.target) && div.has(e.target).length === 0 &&
      !dropdown_table.is(e.target) && dropdown_table.has(e.target).length === 0 &&
      !dropdown_text.is(e.target) && dropdown_text.has(e.target).length === 0
      ) { // и не по его дочерним элементам
      div.slideUp(); // скрываем его
      dropdown_text.removeClass('opened'); // убираем класс active
      dropdown_table.removeClass('opened'); // убираем класс active
    }
  });
  $('.color_table__btn.dropdown, .color_text__btn.dropdown').on('click', function () {
    $(this).toggleClass('opened').next().slideToggle();
  });

  $('.color-avalible-list .color-avalible-list__item').on('click', function () {
    $(this).addClass('active').siblings().removeClass('active');
  });

  // Получаем текущий цвет таблички и выводим
  $('.constructor-color_table .color-avalible-list .color-avalible-list__item').on('click', function () {
    let color = $(this).data('color');
    let currentColor = $('.constructor-color_table .color_table__current-color');
    let detail_info = $('.information__detail.color-table .detail-subinfo');
    let colorTable_btn = $('.color_table__btn.dropdown');
    currentColor.attr('data-color', color).css("display", "inline-block");
    colorTable_btn.text('Цвет: ' + color);
    detail_info.find('.subinfo-text').html(color);
    detail_info.find('.subinfo-color').empty();
    currentColor.clone().appendTo(detail_info.find('.subinfo-color'));
    if(color == '091' || color == '090') {
      if(color == '091') palletre_svg.color_table = 'url(#gold)';
      else if (color == '090') palletre_svg.color_table = 'url(#silver)';
    }
    else palletre_svg.color_table = $(this).css('background-color');
    changeParams();
  });

  // Получаем текущий цвет текста и выводим
  $('.constructor-color_text .color-avalible-list .color-avalible-list__item').on('click', function () {
    let color = $(this).data('color');
    let currentColor = $('.information__detail.color-text .color_text__current-color');
    let detail_info = $('.information__detail.color-text .detail-subinfo');
    let dropdown_btn = $('.color_text__list-items .color_text__btn.dropdown');
    let colortext_btn = $('.color_text__list-items .color_text__btn');
    let current_material = $('.constructor-materials__list-items .constructor-materials-card');
    colortext_btn.removeClass('active'); // Убираем класс с кнопки "Белый"
    dropdown_btn.addClass('active'); // Добавляем нашей кнопки вывода палитры класс
    // Если не выбран 2-3 материал, то делаем 2 материал активным.
    if (current_material.filter(':nth-child(2)').is(':not(.active)') &&
      current_material.filter(':nth-child(3)').is(':not(.active)')) {
      current_material.filter(':nth-child(2)').addClass('active').siblings().removeClass('active');
    }
    $('.information__detail.material .detail-subinfo')
    .html(current_material.filter('.active').html()); // Парсим информацию о материале в данные заказа 
    currentColor.attr('data-color', color).css("display", "inline-block"); // Добавляем цвет
    detail_info.find('.subinfo-text').html(color);
    if(color == '091' || color == '090') {
      if(color == '091') palletre_svg.color_text = 'url(#gold)';
      else if (color == '090') palletre_svg.color_text = 'url(#silver)';
    }
    else palletre_svg.color_text = $(this).css('background-color');
    changeParams();
  });

  // Выбор белого цвета текста
  $('.modal_form__wrapper .constructor-color_text .color_text__btn.white').on('click', function () {
    let dropdown_btn = $('.color_text__list-items .color_text__btn.dropdown');
    let current_material = $('.constructor-materials__list-items .constructor-materials-card:nth-child(1)');
    let detail_info = $('.information__detail.color-text .detail-subinfo');
    let currentColor = $('.information__detail.color-text .color_text__current-color');
    let color = $('.constructor-color_text .color-avalible-list .color-avalible-list__item');
    $(this).addClass('active'); // Добавляем кнопке класс актив
    color.siblings().removeClass('active'); // Убираем класс актив с палитры цветов.
    dropdown_btn.removeClass('active'); // Кнопку вывода палитры делаем не активной
    current_material.addClass('active').siblings().removeClass('active'); // Делаем материал белого цвета активным
    $('.information__detail.material .detail-subinfo').html(current_material.html()); // Парсим информацию о материале в данные заказа
    currentColor.css("display", "none"); // Убираем лишний цвет, если есть.
    detail_info.find('.subinfo-text').html('Белый'); // Добавляем подпись
    palletre_svg.color_text = "white";
    changeParams();
  });

  // Эта кнопка увеличит значение
  $('[data-quantity="plus"]').click(function (e) {
    e.preventDefault();
    fieldName = $(this).attr('data-field');
    let currentVal = parseInt($('input[name=' + fieldName + ']').val());
    if (!isNaN(currentVal) && currentVal <= 32) {
      $('input[name=' + fieldName + ']').val(currentVal + 1);
      $('.information__detail.quantity .detail-subinfo').text(currentVal + 1 + ' шт.')
    }
    printPrice();
  });

  // Эта кнопка уменьшает значение до 1
  $('[data-quantity="minus"]').click(function (e) {
    e.preventDefault();
    fieldName = $(this).attr('data-field');
    let currentVal = parseInt($('input[name=' + fieldName + ']').val());
    if (!isNaN(currentVal) && currentVal > 1) {
      $('input[name=' + fieldName + ']').val(currentVal - 1);
      $('.information__detail.quantity .detail-subinfo').text(currentVal - 1 + ' шт.')
    } else {
      $('input[name=' + fieldName + ']').val(1);
      $('.information__detail.quantity .detail-subinfo').text('1 шт.')
    }
    printPrice();
  });

  // Выбор текущего материала
  $('.constructor-materials__list-items .constructor-materials-card').on('click', function () {
    let current_material = $(this).html();
    $(this).addClass('active').siblings().removeClass('active');
    // Если был выбран первый элемент, то цвет текста должен быть белым
    if ($(this).filter(':nth-child(1)').hasClass('active')) {
      $('.modal_form__wrapper .constructor-color_text .color_text__btn.white').trigger('click');
    }
    $('.information__detail.material .detail-subinfo').html(current_material);
        printPrice();
  });

  // Изменение адреса
  $('.constructor-adress .adress-inputs input[name="street"]').on('keyup paste change', function () {
    let $this = $(this);
    let value = $this.val();
    let selected = $('#select option:selected');
    let detailinfo_address = $('.information__detail.address .detail-subinfo .subinfo-street');
    let detailinfo_road = $('.information__detail.address .detail-subinfo .subinfo-road');
    if ($("#select")[0].selectedIndex <= 0) {
      $('#select option:contains("Улица")').prop('selected', true);
      palletre_svg.current_build = $('#select option:selected').val();
    }

    // Если значение больше 1, то парсим в информации о заказе введенный текст
    if (value.length >= 1 && value.length <= 22) {
      detailinfo_address.text(value);
      palletre_svg.current_text = value;
      detailinfo_road.text(selected.val() + ',');
      $('#street-text').attr('font-size', fontSizeChanged(value.length));
      // $('#mainpath')[0].textLength.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, 0);
      // if (value.length >= 8) $('#mainpath')[0].textLength.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, palletre_svg.textLength);
    } else {
      $('#mainpath')[0].textLength.baseVal.newValueSpecifiedUnits(SVGLength.SVG_LENGTHTYPE_PX, palletre_svg.textLength);
      palletre_svg.current_text = null;
      $('#street-text').text(palletre_svg.default_street);
      detailinfo_address.text('');
      detailinfo_road.text('Неизвестно');
    }
    changeParams();
  });

  // Выбор наименование дороги
  $('#select').on('change', function () {
    let selected = $('#select option:selected');
    $('.information__detail.address .detail-subinfo .subinfo-road').text(selected.val() + ',');
    palletre_svg.current_build = selected.val();
    changeParams();
  });

  // Изменение дома
  $('.constructor-adress .adress-inputs input[name="number-house"]').on('keyup paste', function () {
    let $this = $(this);
    let value = $this.val();
    let detailinfo_house = $('.information__detail.address .detail-subinfo .subinfo-house');

    // Номер дома были только числа
    this.value = this.value.replace(/[^0-9]/g, '');
    // Если значение больше 1, то парсим в информации о заказе введенный текст
    if (value.length >= 1) {
      detailinfo_house.text(', дом ' + value);
      palletre_svg.current_housenum = this.value;
    } else {
      palletre_svg.current_housenum = 54;
      detailinfo_house.text('');
    }
    changeParams();
  });

  // Изменение ламинации 
  $('.constructor-lamination .lamination-radio input[name="radio-category"]').on('change', function () {
    let value = $(this).filter(':checked').val();
    let detailinfo_lamination = $('.information__detail.lamination .detail-subinfo');
    detailinfo_lamination.text(value);
    printPrice();
  });

  // Инициализация окна
  $('.popup-adresstable-button').on('click', function () {
    $('.popup-adresstable__modal_overlay').show();
    $(this).hide();
    // Slick
    $(".popup-adresstable__modal_form .modal_form__service_box").slick({
      arrows: true,
      prevArrow: '<button type="button" class="prev-Button-slider"></button>',
      nextArrow: '<button type="button" class="next-Button-slider"></button>',
      slidesToShow: 6,
      slidesToScroll: 1,
      focusOnSelect: true
    });
    $('.modal_form__gallery .gallery-for').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      fade: true,
      asNavFor: '.modal_form__gallery .gallery-nav'
    });
    $('.modal_form__gallery .gallery-nav').slick({
      arrows: true,
      prevArrow: '<button type="button" class="prev-Button-slider"></button>',
      nextArrow: '<button type="button" class="next-Button-slider"></button>',
      slidesToShow: 6,
      slidesToScroll: 1,
      asNavFor: '.modal_form__gallery .gallery-for',
      focusOnSelect: true
    });

    // Получаем текущий слайд при иницилизации
    let currentSlide = $('.popup-adresstable__modal_form .modal_form__service_box').slick('slickCurrentSlide');
    current_svg = getItems(currentSlide);
    drawImage();
  });

  // Закрыть окно
  $('.popup-adresstable__modal_overlay_close').on('click', function () {
    $('.popup-adresstable__modal_overlay').hide();
    $('.popup-adresstable__modal_form .modal_form__service_box').slick('unslick');
    $('.modal_form__gallery .gallery-for').slick('unslick');
    $('.modal_form__gallery .gallery-nav').slick('unslick');
    $('.popup-adresstable-button').show();
  });

  // Клик по оверлею (закрытие окна)
  $('.popup-adresstable__modal_overlay').click(function(e) {
    if(e.target == e.currentTarget) {
      $('.popup-adresstable__modal_overlay_close').trigger('click');
    }
  });

  // Check
  $('.popup-adresstable__modal_form .modal_form__service_box').on('beforeChange', function(event, slick, currentSlide, nextSlide){
    if(nextSlide == 12)
      $('.constructor-materials-card:nth-child(2)').addClass('active').siblings().removeClass('active').hide();
    else 
      $('.constructor-materials-card').siblings().show();
    current_svg = getItems(nextSlide);
    drawImage();
  });

  // Отправка формы для joomla
  $('.modal_form__order form.order-form').on('submit', function (e) {
    e.preventDefault();
    let postdata = {
      name: $('.modal_form__order form.order-form input[name="user_name"]').val(),
      phone: $('.modal_form__order form.order-form input[name="phone"]').val(),
      address: $('.modal_form__information .information__detail.address .detail-subinfo').text(),
      material: $('.modal_form__information .information__detail.material .detail-subinfo').text(),
      quantity: $('.modal_form__information .information__detail.quantity .detail-subinfo').text(),
      color_text: $('.modal_form__information .information__detail.color-text .detail-subinfo').text(),
      lamination: $('.modal_form__information .information__detail.lamination .detail-subinfo').text(),
      color_table: $('.modal_form__information .information__detail.color-table .detail-subinfo').text(),
      price: $('.modal_form__order .order-form .form-footer .form-footer__price span').text(),
      option: 'com_ajax',
      module: 'constructor_adressestable',
      format: 'json'
    };
    $.ajax({
      type: 'POST',
      dataType: 'json',
      data: postdata,
      success:function(data){
        console.info(data);
        $('.modal_form__order').html('<p>Сообщение успешно отправлено!</p>');
      },
      error:function(data){
        console.error(data);
        alert('Ошибка!!!');
      }
    });
  });

  // Получение адресных табличек из массива
  const getItems = (index) => {
    let addresess = item_adresstable.find(item => item.id == index);
    return addresess;
  }

  // Вывод изображения
  const drawImage = () => {
    $('.gallery-svg').html(current_svg.svg);
    palletre_svg.default_street = $('#street-text').text();
    palletre_svg.textLength = $('#mainpath')[0].textLength.baseVal.valueInSpecifiedUnits;
    fontSize = parseInt($('#street-text').attr('font-size'));
    changeParams();
    printPrice();
  }

  // Изменение таблички
  const changeParams = () => {
    shortBuildName(current_svg.id);
    if(palletre_svg.current_build) $('#build-text').text(palletre_svg.current_build);
    if(palletre_svg.current_text) $('#street-text').text(addtoStreetText(current_svg.id));
    if(palletre_svg.current_housenum) $('#housenum-text').text(palletre_svg.current_housenum);
    else palletre_svg.current_housenum = 54;
    if(palletre_svg.color_text) {
      $('#street-text').attr('fill', palletre_svg.color_text);
      $('#housenum-text').attr('fill', palletre_svg.color_text);
      $('#build-text').attr('fill', palletre_svg.color_text);
    }
    if(palletre_svg.color_table) {
      $('#table-main').attr('fill', palletre_svg.color_table);
    }
    textfromColorTable(current_svg.id);
  }

  // Вывод цены
  const printPrice = () => {
    let price_draw = $('.constructor-price .price-item strong');
    let price_draw_form = $('.order-form .form-footer .form-footer__price');
    let current_sum = parseInt($('input[name=quantity]').val());
    if($('.constructor-materials-card:nth-child(1)').is('.active')) {
      if($('.constructor-lamination .lamination-radio input[name="radio-category"]:checked').val() == "Да") 
      current_price = parseInt(current_svg.k3mm_white_any) * current_sum; 
      else current_price = parseInt(current_svg.k3mm_white) * current_sum;      
    } else if ($('.constructor-materials-card:nth-child(2)').is('.active')) {
      if($('.constructor-lamination .lamination-radio input[name="radio-category"]:checked').val() == "Да")
      current_price = parseInt(current_svg.k3mm_any) * current_sum;
      else current_price = parseInt(current_svg.k3mm) * current_sum;
    } else if ($('.constructor-materials-card:nth-child(3)').is('.active')) {
      if($('.constructor-lamination .lamination-radio input[name="radio-category"]:checked').val() == "Да") 
      current_price = parseInt(current_svg.price_pvh_any) * current_sum;
      else current_price = parseInt(current_svg.price_pvh) * current_sum;
    }
    price_draw.text(current_price + ' ₽');
    price_draw_form.find('span').text(current_price + ' ₽');
  }

  // Адаптив (короткое наименования строение)
  const shortBuildName = (id) => {
    if(id == '4' || id == '6' || id == '9') palletre_svg.current_build = $('#select option:selected').data('field');
    else palletre_svg.current_build = $('#select option:selected').val();
  }

  // Текст как цвет таблички
  const textfromColorTable = (id) => {
    if(id == '1' || id == '10' || id == '11' || id == '15') {
      if(palletre_svg.color_table)$('#housenum-text').attr('fill', palletre_svg.color_table);
      else $('#housenum-text').attr('fill', 'blue');
    }
    else if (id == '6') {
      if(palletre_svg.color_table) $('#street-text').attr('fill', palletre_svg.color_table);
      else $('#street-text').attr('fill', 'blue');
    }
  }

  // Добавляет к адресу текст номер дома или наименования строения
  const addtoStreetText = (id) => {
    let text;
    if(id == '4' || id == '6' || id == '9') text = palletre_svg.current_build + ' ' + palletre_svg.current_text;
    else if (id == '8' || id == '12') text = palletre_svg.current_text + ', ' + palletre_svg.current_housenum;
    else text = palletre_svg.current_text;
    return text;
  }

  const fontSizeChanged = (value) => {
    x = (fontSize / 100) * value;
    textSize = fontSize = fontSize - 0.9;
    return textSize;
  }
});