
const map = localStorage.map ? JSON.parse(localStorage.map) : new Array(10000).fill(0);
const container = document.getElementById('container');

for(let y = 0; y < 100; y++){
    for(let x = 0; x < 100; x++){
        let cell = document.createElement('div');
        cell.classList.add("cell");
        container.appendChild(cell);

        if(map[y * 100 + x] === 1){
            cell.style.backgroundColor = 'black';
        }

        cell.addEventListener("mouseover",() => {
            if(mouse){
                if(clear){
                    cell.style.backgroundColor = '';
                    map[y * 100 + x] = 0;
                }else{
                    cell.style.backgroundColor = 'black';
                    map[y * 100 + x] = 1;
                }
            }
        });
    }
}

let mouse = false;
let clear = false;

document.addEventListener('mousedown', e => {
    mouse = true;
    clear = e.which === 3;
});
document.addEventListener('mouseup',() => mouse = false);

document.addEventListener('contextmenu', e => e.preventDefault());

function sleep(t){
    return new Promise(function(resolve){
        setTimeout(resolve, t);
    });
}   


/**
 * 寻找路径
 * @param {Array}  map    总数据
 * @param {Array}  start  开始节点
 * @param {Array}  end    结束节点
 **/
async function findPath(map, start, end){
    map = map.slice();
    const queue = [start];

    async function insert( [x, y],pre ){
        if(map[y * 100 + x] !== 0){
            return;
        }
        if(x < 0 || y < 0 || x >= 100 || y >= 100){
            return;
        }
        map[y * 100 + x] = pre;
        container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
        await sleep(1);
        queue.push([x,y]);
    }


    while(queue.length){
        let [x,y] = queue.shift();

        if(x == end[0] && y == end[1]){
            const path = [];
            while(x !== start[0] || y !== start[1]){
                path.push([x,y]);
                container.children[y * 100 + x].style.backgroundColor = 'pink';
                [x,y] = map[y *100 + x];
            }
            return path;
        }
        await insert([x - 1, y],[x,y]);
        await insert([x + 1, y],[x,y]);
        await insert([x, y - 1],[x,y]);
        await insert([x, y + 1],[x,y]);


        await insert([x - 1, y - 1],[x,y]);
        await insert([x + 1, y - 1],[x,y]);
        await insert([x - 1, y - 1],[x,y]);
        await insert([x + 1, y + 1],[x,y]);
        
    }

    return null;
}