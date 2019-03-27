window.addEventListener('load', function() {
    FN.setPixel();
    DOM.addCity();
    if (navigator.onLine) {
        WEATHERINFO.getLocation().then((Response) => {
            localStorage.setItem('city', Response);
            WEATHERINFO.buildNewCity(Response);
        })
    } else {
        let city = localStorage.getItem('city');
        WEATHERINFO.buildNewCity(city);
    }
})

window.addEventListener('DOMContentLoaded', function() {
    SW.register();
})

const CityList = [];
// 城市天气类
function City(id, name, time, tem, weather, humidity, winddirection, windpower) {
    this.id = id;
    this.name = name;
    this.time = time;
    
    this.tem = tem;
    
    this.weather = weather;
    this.humidity = humidity;
    this.winddirection = winddirection;
    this.windpower = windpower;

    this.forecast = [];

    this.setForecast = function(list) {
        let temp = {};
        for (let item in list) {
            for (let i in list[item]) {
                if (i == 'date') {
                    temp.day = dataCount(new Date(list[item][i]));
                } else if (i == 'cond_txt_d') {
                    temp.weather = list[item][i];
                } else if (i == 'tmp_max') {
                    temp.tmp_max = list[item][i];
                } else if (i == 'tmp_min') {
                    temp.tmp_min = list[item][i];
                }
            }
            this.forecast.push(temp);   
            temp = {};
        }
        this.render();
    }

    let dataCount = function(time) {
        switch (time.getDay()) {
            case 0:
                return 'Sun';
                break;
            case 1:
                return 'Mon';
                break;
            case 2:
                return 'Tue';
                break;
            case 3:
                return 'Wed';
                break;
            case 4:
                return 'Thu';
                break;
            case 5:
                return 'Fri';
                break;
            case 6:
                return 'Sat';
                break;
            default:
                break;
        }
    };

    this.render = function() {
        // let model = `
        //     <div class="card mg">
        //         <img src="./images/icons/delete.svg" class="delete" id="card_${ this.id }"/>
        //         <h3>${ this.name }</h3>
        //         <p>${ this.time }</p>
        //         <div class="show">
        //             <div>
        //                 <img src="./images/wind.png" alt="" class="img_now">
        //                 <span>${ this.tem }℃</span>
        //             </div>
        //             <div>
        //                 <ul>
        //                     <li>天气 : <span>${ this.weather }</span></li>
        //                     <li>空气湿度 : <span>${ this.humidity }</span></li>
        //                     <li>风向 : <span>${ this.winddirection }</span></li>
        //                     <li>风力 : <span>${ this.windpower }</span></li>
        //                 </ul>
        //             </div>
        //         </div>
        //         <div class="future">
        //             <ul class="mg">
        //                 <li>
        //                     <h4>${ this.forecast[1].day }</h4>
        //                     <img src="./images/partly-cloudy.png" alt="">
        //                     <p>${ this.forecast[1].tmp_max }℃</p>
        //                     <p>${ this.forecast[1].tmp_min }℃</p>
        //                 </li>
        //             </ul>
        //             <ul class="mg">
        //                 <li>
        //                     <h4>${ this.forecast[2].day }</h4>
        //                     <img src="./images/partly-cloudy.png" alt="">
        //                     <p>${ this.forecast[2].tmp_max }℃</p>
        //                     <p>${ this.forecast[2].tmp_min }℃</p>
        //                 </li>
        //             </ul>
        //         </div>
        //     </div>
        // `

        let _this = this;
    
        let model = (function() {
            let div_card = document.createElement('div');
            div_card.className = "card mg";
            div_card.id = "card_" + _this.id;

            let div_card_img = document.createElement('img');
            div_card_img.src = "./images/icons/delete.svg";
            div_card_img.className = "delete";
            div_card_img.id = "delete_" + _this.id;
            div_card.appendChild(div_card_img);

            let div_card_h3 = document.createElement('h3');
            div_card_h3.textContent = _this.name;
            div_card.appendChild(div_card_h3);

            let div_card_p = document.createElement('p');
            div_card_p.textContent = _this.time;
            div_card.appendChild(div_card_p);

            let div_show = document.createElement('div');
            div_show.className = 'show';
            
            let show_div1 = document.createElement('div');
            let show_div1_img = document.createElement('img');
            show_div1_img.src = "./images/wind.png";
            show_div1_img.className = "img_now";
            show_div1.appendChild(show_div1_img);
            let show_div1_span = document.createElement('span');
            show_div1_span.textContent = _this.tem + '℃';
            show_div1.appendChild(show_div1_span);
            div_show.appendChild(show_div1);

            let show_div2 = document.createElement('div');
            let show_div2_ul = document.createElement('ul');
            for (let i = 0; i < 4; i ++) {
                let li = document.createElement('li');
                let span = document.createElement('span');
                switch (i) {
                    case 0:
                        span.textContent = _this.weather;
                        li.textContent = '天气 : ';
                        li.appendChild(span);
                        show_div2_ul.appendChild(li);
                        break;
                    case 1:
                        span.textContent = _this.humidity;
                        li.textContent = '湿度 : ';
                        li.appendChild(span);
                        show_div2_ul.appendChild(li);
                        break;
                    case 2:
                        span.textContent = _this.winddirection;
                        li.textContent = '风向 : ';
                        li.appendChild(span);
                        show_div2_ul.appendChild(li);
                        break;
                    case 3:
                        span.textContent = _this.windpower;
                        li.textContent = '风力 : ';
                        li.appendChild(span);
                        show_div2_ul.appendChild(li);
                        break;
                    default:
                        break;
                }
            }
            show_div2.appendChild(show_div2_ul);
            div_show.appendChild(show_div2);

            let div_future = document.createElement('div');
            div_future.className = 'future';
            let ul = document.createElement('ul');
            for (let i = 0; i < 2; i ++) {
                let li = document.createElement('li');
                let h4 = document.createElement('h4');
                let img = document.createElement('img');
                let p_1 = document.createElement('p');
                let p_2 = document.createElement('p');

                ul.className = 'mg';

                h4.textContent = _this.forecast[i + 1].day
                li.appendChild(h4);

                img.src = './images/partly-cloudy.png';
                li.appendChild(img);

                p_1.textContent = _this.forecast[i + 1].tmp_max + '℃';
                li.appendChild(p_1);
                
                p_2.textContent = _this.forecast[i + 1].tmp_min + '℃';
                li.appendChild(p_2);

                ul.appendChild(li);
            }
            div_future.appendChild(ul);
        
            div_card.appendChild(div_show);
            div_card.appendChild(div_future);

            return div_card;
        })();

        let container = document.getElementById('container');
        container.appendChild(model);

        // 为删除键绑定事件
        document.getElementById('delete_' + this.id).addEventListener('click', function() {
            WEATHERINFO.deleteCity(_this.id);
        })
    };
}

const FN = {
    // 设置屏幕字体宽度
    setPixel() {
        // 页面宽度
        let htmlWidth = document.documentElement.clientWidth;
        // dom节点
        let htmlDom = document.getElementsByTagName('html')[0];

        // 设置html的fontsize
        htmlDom.style.fontSize = htmlWidth / 10 + 'px';
    }
}

// DOM节点操作
const DOM = {
    addCity() {
        let btn = document.getElementById('add');
        let cover = document.getElementById('cover');
        let cityList = document.getElementById('cityList');
        let item = document.getElementsByClassName('city_item');

        for (let i = 0; i < item.length; i ++) {
            item[i].onclick = function() {
                WEATHERINFO.buildNewCity(this.innerHTML);
                cover.style.display = "none";
                cityList.style.display = "none";
            }
        }

        btn.addEventListener('click', function() {
            if (cover.style.display == 'none') {
                cover.style.display = "block";
                cityList.style.display = "flex";
            } else {
                cover.style.display = "none";
                cityList.style.display = "none";
            }
            
        })
    }
}

const WEATHERINFO = {
    getLocation() {
        return new Promise(
            function(resolve, reject) {
                if (navigator.onLine) {
                    resolve(returnCitySN.cname);
                    localStorage.setItem('city', returnCitySN.cname);
                } else if (!navigator.onLine) {
                    let city = localStorage.getItem('city');
                    resolve(city);
                }
            }
        )
    },

    // 根据位置获取当前天气
    getInfoNow(city) {
        let baseURL = 'https://restapi.amap.com/v3/weather/weatherInfo';
        let KEY = 'd856a0dbdd337bf52068a3f8c127e345';
        let URL = baseURL + '?city=' + city + '&key=' + KEY;

        fetch(URL).then((Response) => {
            if (Response.status === 200) {
                Response.json().then((data) => {
                    let list = data.lives[0];
                    for (let i = 0; i < CityList.length; i ++) {
                        if (CityList[i].name == list.province) {
                            alert('你已经添加过该城市了');
                            return;
                        }
                    }
                    let city = new City(CityList.length, list.province, list.reporttime, list.temperature, list.weather, list.humidity, list.winddirection, list.windpower);
                    CityList.push(city);
                    this.getInfoFutre(city.name);
                })
            }
        })
    },

    // 根据位置获取天气预报
    getInfoFutre(city) {
        let baseURL = 'https://free-api.heweather.net/s6/weather/forecast'
        let KEY = '2b0f813dcb5847cf95a5ceacd141ea7d';
        let URL = baseURL + '?location=' + city + '&key=' + KEY;

        fetch(URL).then((Response) => {
            if (Response.status === 200) {
                Response.json().then((data) => {
                    for (let i = 0; i < CityList.length; i ++) {
                        if (CityList[i].name == data.HeWeather6[0].basic.location) {
                            CityList[i].setForecast(data.HeWeather6[0].daily_forecast);
                        }
                    }
                })
            }
        })
    },

    // 新建一个新的城市天气实例
    buildNewCity(city) {
        this.getInfoNow(city);
    },

    // 删除一个城市天气实例
    deleteCity(cityId) {
        let dom = document.getElementById('card_' + cityId);
        dom.style.height = '0px';
        setTimeout(() => {
            dom.remove();
        }, 500);
        for (let i = 0; i < CityList.length; i ++) {
            if (CityList[i].id === cityId) {
                CityList.pop(i);
                return;
            }
        }
        return;
    },
}

const SW = {
    register() {
        if('serviceWorker' in navigator) {
            navigator.serviceWorker.register('./sw.js')
            .then(function() {
                console.log('Service Worker Registered');
            })
            .catch(function() {
                console.log('Service Worker failed');
            })
        }
    }
}