window.addEventListener('DOMContentLoaded', function() {
    FN.setPixel();
    DOM.addCity();
    WEATHERINFO.getLocation().then((Response) => {
        WEATHERINFO.buildNewCity(Response);
    })
})

let btn = document.getElementById('btn');

const CityList = [];
// 城市天气类
function City(name, time, tem, weather, humidity, winddirection, windpower) {
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
        let model = `
            <div class="card mg">
                <h3>${ this.name }</h3>
                <p>${ this.time }</p>
                <div class="show">
                    <div>
                        <img src="./images/wind.png" alt="" class="img_now">
                        <span>${ this.tem }℃</span>
                    </div>
                    <div>
                        <ul>
                            <li>天气 : <span>${ this.weather }</span></li>
                            <li>空气湿度 : <span>${ this.humidity }</span></li>
                            <li>风向 : <span>${ this.winddirection }</span></li>
                            <li>风力 : <span>${ this.windpower }</span></li>
                        </ul>
                    </div>
                </div>
                <div class="future">
                    <ul class="mg">
                        <li>
                            <h4>${ this.forecast[1].day }</h4>
                            <img src="./images/partly-cloudy.png" alt="">
                            <p>${ this.forecast[1].tmp_max }℃</p>
                            <p>${ this.forecast[1].tmp_min }℃</p>
                        </li>
                    </ul>
                    <ul class="mg">
                        <li>
                            <h4>${ this.forecast[2].day }</h4>
                            <img src="./images/partly-cloudy.png" alt="">
                            <p>${ this.forecast[2].tmp_max }℃</p>
                            <p>${ this.forecast[2].tmp_min }℃</p>
                        </li>
                    </ul>
                </div>
            </div>
        `

        let body = document.getElementsByTagName('body')[0];
        body.innerHTML += model;
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
        console.log(window.btn);
        // btn.onclick = function() {
            WEATHERINFO.buildNewCity('北京');
        // }
        // btn.addEventListener('click', function() {
        //     console.log('add');
        //     WEATHERINFO.buildNewCity('上海');
        // })
    }
}

const WEATHERINFO = {
    getLocation() {
        return new Promise(
            function(resolve, reject) {
                var myCity = new BMap.LocalCity();
                myCity.get((result) => {
                    var cityName = result.name;
                    resolve(cityName);
                })
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
                    let city = new City(list.province, list.reporttime, list.temperature, list.weather, list.humidity, list.winddirection, list.windpower);
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
    }
}


