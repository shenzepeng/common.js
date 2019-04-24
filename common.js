var root_url = 'http://192.168.1.107:8080';
var index_url = root_url;
var picture_url = 'http://47.102.113.146/sringmvcphoto-1.0-SNAPSHOT/updateitem.action';
//关闭窗口
function closewin() {
    api.closeWin();
}
//提示
function msg(msg) {
    api.toast({
        msg: msg,
        duration: 2000,
        location: 'bottom'
    });
}
//添加进度框
function showProgress() {
    api.showProgress({
        title: '努力加载中...',
        text: '先喝杯茶...',
        modal: false
    });
}
//取消进度框
function hideProgress() {
    api.hideProgress();
}
//发送短信
function sentSms(numbers, textContext) {
    api.sms({
        numbers: [numbers],
        text: textContext
    }, function(ret, err) {
        if (ret && ret.status) {
            api.toast({
                msg: '已发送'
            });
            //已发送
        } else {
            api.toast({
                msg: '发送失败'
            });
            //发送失败
        }
    });
}
//清除缓存
function clearCache() {
    api.clearCache(function() {
        api.toast({
            msg: '清除完成'
        });
    });
}
//时间戳转 YY-mm-dd HH:ii:ss
function formatDateTime(timeStamp, returnType) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    if (returnType == 'str') {
        return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
    }
    return [y, m, d, h, minute, second];
}
// 日期转时间戳
function dateTimeToTimeStamp(timeStamp) {
    var reg = /^([0-9]{4})-([0-9]{2})-([0-9]{2}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    var res = timeStamp.match(reg);
    if (res == null) {
        var reg2 = /^([0-9]{2})\/([0-9]{2})\/([0-9]{4}) ([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
        var res2 = timeStamp.match(reg2);
        if (res2 == null) {
            console.log('时间格式错误 E001');
            return false;
        } else {
            var year = parseInt(res2[3]);
            var month = parseInt(res2[1]);
            var day = parseInt(res2[2]);
            var h = parseInt(res2[4]);
            var i = parseInt(res2[5]);
            var s = parseInt(res2[6]);
        }
    } else {
        var year = parseInt(res[1]);
        var month = parseInt(res[2]);
        var day = parseInt(res[3]);
        var h = parseInt(res[4]);
        var i = parseInt(res[5]);
        var s = parseInt(res[6]);
    }
    if (year < 1000) {
        console.log('时间格式错误');
        return false;
    }
    if (h < 0 || h > 24) {
        console.log('时间格式错误');
        return false;
    }
    if (i < 0 || i > 60) {
        console.log('时间格式错误');
        return false;
    }
    if (s < 0 || s > 60) {
        console.log('时间格式错误');
        return false;
    }
    return Date.parse(new Date(year, month - 1, day, h, i, s)) / 1000;
}
//数据验证（表单验证）
function checkForm(data, rule) {
    for (var i = 0; i < rule.length; i++) {
        if (!rule[i].checkType) {
            return true;
        }
        if (!rule[i].name) {
            return true;
        }
        if (!rule[i].errorMsg) {
            return true;
        }
        if (!data[rule[i].name]) {
            this.error = rule[i].errorMsg;
            return false;
        }
        switch (rule[i].checkType) {
            case 'string':
                var reg = new RegExp('.{' + rule[i].checkRule + '}');
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'int':
                var reg = new RegExp('^(-[1-9]|[1-9])[0-9]{' + rule[i].checkRule + '}$');
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
                break;
            case 'between':
                if (!this.isNumber(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                var minMax = rule[i].checkRule.split(',');
                minMax[0] = Number(minMax[0]);
                minMax[1] = Number(minMax[1]);
                if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'betweenD':
                var reg = /^-?[1-9][0-9]?$/;
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                var minMax = rule[i].checkRule.split(',');
                minMax[0] = Number(minMax[0]);
                minMax[1] = Number(minMax[1]);
                if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'betweenF':
                var reg = /^-?[0-9][0-9]?.+[0-9]+$/;
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                var minMax = rule[i].checkRule.split(',');
                minMax[0] = Number(minMax[0]);
                minMax[1] = Number(minMax[1]);
                if (data[rule[i].name] > minMax[1] || data[rule[i].name] < minMax[0]) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'same':
                if (data[rule[i].name] != rule[i].checkRule) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'notsame':
                if (data[rule[i].name] == rule[i].checkRule) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'email':
                var reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'phoneno':
                var reg = /^1[0-9]{10,10}$/;
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'zipcode':
                var reg = /^[0-9]{6}$/;
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'reg':
                var reg = new RegExp(rule[i].checkRule);
                if (!reg.test(data[rule[i].name])) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'in':
                if (rule[i].checkRule.indexOf(data[rule[i].name]) == -1) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
            case 'notnull':
                if (data[rule[i].name] == null || data[rule[i].name].length < 1) {
                    this.error = rule[i].errorMsg;
                    return false;
                }
                break;
        }
    }
    return true;
}
//数字验证
function isNumber(checkVal) {
    var reg = /^-?[1-9][0-9]?.?[0-9]*$/;
    return reg.test(checkVal);
}

//随机数
//生成2数之间的随机数
function random(min, max) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * min + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (max - min + 1) + min, 10);
            break;
        default:
            return 0;
            break;
    }
}
//UUID
function uuid(len, radix) {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    var uuid = [],
        i;
    radix = radix || chars.length;
    if (len) {
        for (i = 0; i < len; i++) {
            uuid[i] = chars[0 | Math.random() * radix];
        }
    } else {
        var r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random() * 16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
    }
    return uuid.join('');
}
// 判断是否为手机号
function isPoneAvailable(phoneNumber) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(pone)) {
        return false;
    } else {
        return true;
    }
}
// 判断是否为电话号码
function isTelAvailable(telNumber) {
    var myreg = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
    if (!myreg.test(tel)) {
        return false;
    } else {
        return true;
    }
}
//冒泡排序
function bubbleSort(arr) {
    var len = arr.length;
    for (var i = 0; i < len; i++) {
        for (var j = 0; j < len - 1 - i; j++) {
            if (arr[j] > arr[j+1]) {        //相邻元素两两对比
                var temp = arr[j+1];        //元素交换
                arr[j+1] = arr[j];
                arr[j] = temp;
            }
        }
    }
    return arr;
}

//选择排序
function selectionSort(arr) {
    var len = arr.length;
    var minIndex, temp;
    for (var i = 0; i < len - 1; i++) {
        minIndex = i;
        for (var j = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {     //寻找最小的数
                minIndex = j;                 //将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}
//插入排序
function insertionSort(arr) {
    var len = arr.length;
    var preIndex, current;
    for (var i = 1; i < len; i++) {
        preIndex = i - 1;
        current = arr[i];
        while(preIndex >= 0 && arr[preIndex] > current) {
            arr[preIndex+1] = arr[preIndex];
            preIndex--;
        }
        arr[preIndex+1] = current;
    }
    return arr;
}
//希尔排序（Shell Sort）
function shellSort(arr) {
    var len = arr.length,
        temp,
        gap = 1;
    while(gap < len/3) {          //动态定义间隔序列
        gap =gap*3+1;
    }
    for (gap; gap> 0; gap = Math.floor(gap/3)) {
        for (var i = gap; i < len; i++) {
            temp = arr[i];
            for (var j = i-gap; j > 0 && arr[j]> temp; j-=gap) {
                arr[j+gap] = arr[j];
            }
            arr[j+gap] = temp;
        }
    }
    return arr;
}
//归并排序
function mergeSort(arr) {  //采用自上而下的递归方法
    var len = arr.length;
    if(len < 2) {
        return arr;
    }
    var middle = Math.floor(len / 2),
        left = arr.slice(0, middle),
        right = arr.slice(middle);
    return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
    var result = [];

    while (left.length>0 && right.length>0) {
        if (left[0] <= right[0]) {
            result.push(left.shift());
        } else {
            result.push(right.shift());
        }
    }

    while (left.length)
        result.push(left.shift());

    while (right.length)
        result.push(right.shift());

    return result;
}
//快速排序
function quickSort(arr, left, right) {
    var len = arr.length,
        partitionIndex,
        left = typeof left != 'number' ? 0 : left,
        right = typeof right != 'number' ? len - 1 : right;

    if (left < right) {
        partitionIndex = partition(arr, left, right);
        quickSort(arr, left, partitionIndex-1);
        quickSort(arr, partitionIndex+1, right);
    }
    return arr;
}

function partition(arr, left ,right) {     //分区操作
    var pivot = left,                      //设定基准值（pivot）
        index = pivot + 1;
    for (var i = index; i <= right; i++) {
        if (arr[i] < arr[pivot]) {
            swap(arr, i, index);
            index++;
        }
    }
    swap(arr, pivot, index - 1);
    return index-1;
}

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}
//堆排序
var len;    //因为声明的多个函数都需要数据长度，所以把len设置成为全局变量

function buildMaxHeap(arr) {   //建立大顶堆
    len = arr.length;
    for (var i = Math.floor(len/2); i &gt;= 0; i--) {
        heapify(arr, i);
    }
}

function heapify(arr, i) {     //堆调整
    var left = 2 * i + 1,
        right = 2 * i + 2,
        largest = i;

    if (left < len && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < len && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest != i) {
        swap(arr, i, largest);
        heapify(arr, largest);
    }
}

function swap(arr, i, j) {
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

function heapSort(arr) {
    buildMaxHeap(arr);

    for (var i = arr.length-1; i > 0; i--) {
        swap(arr, 0, i);
        len--;
        heapify(arr, 0);
    }
    return arr;
}
//计数排序
function countingSort(arr, maxValue) {
    var bucket = new Array(maxValue+1),
        sortedIndex = 0;
        arrLen = arr.length,
        bucketLen = maxValue + 1;

    for (var i = 0; i < arrLen; i++) {
        if (!bucket[arr[i]]) {
            bucket[arr[i]] = 0;
        }
        bucket[arr[i]]++;
    }

    for (var j = 0; j < bucketLen; j++) {
        while(bucket[j] > 0) {
            arr[sortedIndex++] = j;
            bucket[j]--;
        }
    }

    return arr;
}

//桶排序
function bucketSort(arr, bucketSize) {
    if (arr.length === 0) {
      return arr;
    }

    var i;
    var minValue = arr[0];
    var maxValue = arr[0];
    for (i = 1; i < arr.length; i++) {
      if (arr[i] < minValue) {
          minValue = arr[i];                //输入数据的最小值
      } else if (arr[i] > maxValue) {
          maxValue = arr[i];                //输入数据的最大值
      }
    }

    //桶的初始化
    var DEFAULT_BUCKET_SIZE = 5;            //设置桶的默认数量为5
    bucketSize = bucketSize || DEFAULT_BUCKET_SIZE;
    var bucketCount = Math.floor((maxValue - minValue) / bucketSize) + 1;
    var buckets = new Array(bucketCount);
    for (i = 0; i < buckets.length; i++) {
        buckets[i] = [];
    }

    //利用映射函数将数据分配到各个桶中
    for (i = 0; i < arr.length; i++) {
        buckets[Math.floor((arr[i] - minValue) / bucketSize)].push(arr[i]);
    }

    arr.length = 0;
    for (i = 0; i < buckets.length; i++) {
        insertionSort(buckets[i]);                      //对每个桶进行排序，这里使用了插入排序
        for (var j = 0; j < buckets[i].length; j++) {
            arr.push(buckets[i][j]);
        }
    }

    return arr;
}
//基数排序
//LSD Radix Sort
var counter = [];
function radixSort(arr, maxDigit) {
    var mod = 10;
    var dev = 1;
    for (var i = 0; i < maxDigit; i++, dev *= 10, mod *= 10) {
        for(var j = 0; j < arr.length; j++) {
            var bucket = parseInt((arr[j] % mod) / dev);
            if(counter[bucket]==null) {
                counter[bucket] = [];
            }
            counter[bucket].push(arr[j]);
        }
        var pos = 0;
        for(var j = 0; j < counter.length; j++) {
            var value = null;
            if(counter[j]!=null) {
                while ((value = counter[j].shift()) != null) {
                      arr[pos++] = value;
                }
          }
        }
    }
    return arr;
}
