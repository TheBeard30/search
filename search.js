class Sorted{
    constructor(data,compareFn){
        this.data = data;
        this.compareFn = compareFn;
    }
    
    /**
     * 取出最小数
     * @returns 
     */
    take(){
        if(!this.data.length) return null;
        let min = this.data[0];
        let minIndex = 0;
        for(let i = 1; i < this.data.length; i++){
            if(this.compareFn(this.data[i],min) < 0){
                min = this.data[i];
                minIndex = i;
            }
        }
        this.data[minIndex] = this.data[this.data.length - 1];
        this.data.pop();
        return min;
    }

    insert(v){
        this.data.push(v);
    }


    get length(){
        return this.data.length;
    }


}

/**
 * 二叉堆
 */
class BinaryHeap{
    constructor(data,compareFn){
        this.data = data;
        this.compareFn = compareFn;
    }

    take(){
        if(!this.data.length) return null;
        let min = this.data[0];
        let i = 0;
        // fix heap
        while(i < this.data.length){
            if(i * 2 + 1 >= this.data.length){
                break;
            }
            if(i * 2 + 2 >= this.data.length){
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
                break;
            }
            if(this.compareFn(this.data[i * 2 + 1],this.data[i * 2 + 2]) < 0){
                this.data[i] = this.data[i * 2 + 1];
                i = i * 2 + 1;
            }else{
                this.data[i] = this.data[i * 2 + 2];
                i = i * 2 + 2; 
            }
        }
        
        this.insertAt(i,this.data.pop());
        return min;
    }

    insertAt(i,v){
        this.data[i] = v;
        while(i > 0 && this.compareFn(v,this.data[Math.floor((i - 1)/2)]) < 0){
            this.data[i] = this.data[Math.floor((i - 1)/2)];
            this.data[Math.floor((i - 1)/2)] = v;
            i = Math.floor((i - 1)/2);
        }
    }

    insert(v){
        this.insertAt(this.data.length,v);
    }

    get length(){
        return this.data.length;
    }
}



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
    // 起点
    container.children[start[1] * 100 + start[0]].style.backgroundColor = 'blue';
    // 终点
    container.children[end[1] * 100 + end[0]].style.backgroundColor = 'red';



    // 广度优先搜索
    const queue = [start];

    // A*搜索
    function distance([x,y]){
        return (x - end[0]) ** 2 + (y - end[1]) ** 2;
    }
    const collection = new Sorted([start],(a,b) => distance(a) - distance(b));  // 可以使用二叉堆

    async function insert( [x, y],pre ){
        if(map[y * 100 + x] !== 0){
            return;
        }
        if(x < 0 || y < 0 || x >= 100 || y >= 100){
            return;
        }
        map[y * 100 + x] = pre;
        if(x != start[0] && y != start[1] && x != end[0] && y != end[1]){
            container.children[y * 100 + x].style.backgroundColor = 'lightgreen';
        }
        
        await sleep(1);
        // 广度优先搜索
        // queue.push([x,y]);
        
        // A*搜索
        collection.insert([x,y]);
    }

    
    while(collection.length){   // 如果为广度优先搜索，则为 queue.length
        // 广度优先搜索
        // let [x,y] = queue.shift();

        // A*搜索
        let [x,y] = collection.take();

        if(x == end[0] && y == end[1]){
            const path = [];
            while(x !== start[0] || y !== start[1]){
                path.push([x,y]);
                if(x !== end[0] || y !== end[1])
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