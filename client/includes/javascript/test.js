ymaps.ready(init);
function init() {
    // Подключаем поисковые подсказки к полю ввода.
    var suggestView = new ymaps.SuggestView('suggest')

    var myMap = new ymaps.Map('map', {
            center: [59.935061, 30.318106],
            zoom: 12,
            controls: [],
        }),




        // Создадим пользовательский макет ползунка масштаба.
        ZoomLayout = ymaps.templateLayoutFactory.createClass("<div id='zoom_container'>" +
            "<div id='zoom-in' class='btn'><i>+</i></div><br>" +
            "<div id='zoom-out' class='btn'><i>-</i></div>" +
            "</div>", {

            // Переопределяем методы макета, чтобы выполнять дополнительные действия
            // при построении и очистке макета.
            build: function () {
                // Вызываем родительский метод build.
                ZoomLayout.superclass.build.call(this);

                // Привязываем функции-обработчики к контексту и сохраняем ссылки
                // на них, чтобы потом отписаться от событий.
                this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
                this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

                // Начинаем слушать клики на кнопках макета.
                $('#zoom-in').bind('click', this.zoomInCallback);
                $('#zoom-out').bind('click', this.zoomOutCallback);
            },

            clear: function () {
                // Снимаем обработчики кликов.
                $('#zoom-in').unbind('click', this.zoomInCallback);
                $('#zoom-out').unbind('click', this.zoomOutCallback);

                // Вызываем родительский метод clear.
                ZoomLayout.superclass.clear.call(this);
            },

            zoomIn: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
            },

            zoomOut: function () {
                var map = this.getData().control.getMap();
                map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
            }
        }),
        zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    // МЕТКИ


    
    var geolocationControl = new ymaps.control.GeolocationControl({
        options: {
            noPlacemark: true,
            maxWidth: '200',
            maxHeight: '200',
            float: 'none',
        },

        data: {
            image: 'images/geoloc.png',
        },
    });
    geolocationControl.events.add('locationchange', function (event) {
        var position = event.get('position'),
            // При создании метки можно задать ей любой внешний вид.
            locationPlacemark = new ymaps.Placemark(position);

        myMap.geoObjects.add(locationPlacemark);
        // Установим новый центр карты в текущее местоположение пользователя.
        myMap.panTo(position);
    });





    myMap.controls.add(geolocationControl);
    myMap.controls.add(zoomControl);

    // ПОИСК

    var searchControl = new ymaps.control.SearchControl({
        options: {
            provider: 'yandex#search',
            position: {
                top: -40, // уберём поисковую панель за край карты
                left: 600,
            },
        }
    });
    myMap.controls.add(searchControl);

    suggestView.events.add('select', function () { // поиск по выбору саджеста
        Search()
    })

    $("#suggest").keyup(function(event){ // поиск по Enter
        if(event.keyCode == 13){
            Search()
        }
    });

    $('#button').bind('click', function () { // поиск по кнопке
        Search()
    });

    function Search () { // Непосредственно поиск в панели
        var request = $('#suggest').val();
        searchControl.search(request);
    }


    // СОБСТВЕННАЯ МЕТКА
    // Создаём макет содержимого cобственной метки.


    MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
    ),

        myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
            hintContent: 'Собственный значок метки',
            balloonContentBody: 'Красивая метка'
        }, {
            // Опции.
            // Необходимо указать данный тип макета.
            iconLayout: 'default#image',
            // Своё изображение иконки метки.
            iconImageHref: 'images/map/marker.svg',
            // Размеры метки.
            iconImageSize: [30, 42],
            // Смещение левого верхнего угла иконки относительно
            // её "ножки" (точки привязки).
            iconImageOffset: [-5, -38]
        })



    objectManager = new ymaps.ObjectManager();
    // Загружаем GeoJSON файл, экспортированный из Конструктора карт.
    $.getJSON('includes/javascript/geoObjects.geojson')
        .done(function (geoJson) {

            geoJson.features.forEach(function (obj) {
                // Задаём контент балуна.
                obj.properties.balloonContent = obj.properties.description;
                // Задаём пресет для меток с полем iconCaption.
                if (obj.properties.iconCaption) {
                    obj.options = {
                        preset: MyIconContentLayout,
                        iconLayout: 'default#image',
                        // Своё изображение иконки метки.
                        iconImageHref: 'images/map/marker.svg',
                        // Размеры метки.
                        iconImageSize: [30, 42],
                        // Смещение левого верхнего угла иконки относительно
                        // её "ножки" (точки привязки).
                        iconImageOffset: [-5, -38]
                    }
                }
            });
            // Добавляем описание объектов в формате JSON в менеджер объектов.
            objectManager.add(geoJson);
            // Добавляем объекты на карту.
            myMap.geoObjects.add(objectManager);
        });


    myMap.geoObjects
        .add(myPlacemark)


}