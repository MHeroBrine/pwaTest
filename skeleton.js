const Skeleton = {
    Render(key, type, row) {
        let rows = (function() {
            let temp = '';
            for (let i = 0; i < row; i ++) {
                temp += '<p class="item"></p>'
            }
            return temp;
        })();

        let model = (function() {
            let temp = '';
            switch (type) {
                case 'normal':
                    temp = `
                        <div class="card preload mg" id="${key}">
                            ${ rows }
                            <p class="item" style="width: 4rem"></p>
                        </div>
                    `
                    break;
                case 'title':
                    temp = `
                        <div class="card preload mg" id="${key}">
                            <p class="head"></p>
                            ${ rows }
                            <p class="item" style="width: 4rem"></p>
                        </div>
                    `
                    break;
                default:
                    break;
            }
            return document.createRange().createContextualFragment(temp);
        })();

        return model;
    }
}

export default Skeleton