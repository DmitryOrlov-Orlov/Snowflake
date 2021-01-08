const readChunk = require('read-chunk');
const fs = require('fs');
const path = require('path');
const { type } = require('os');
const { error } = require('console');

const db = {
  rar_5: [82, 97, 114, 33, 26, 7, 1, 0],
}

let archiveBtn = document.getElementById('archive__btn');
let archiveInp1 = document.getElementById('archive__inp1');
let archiveInp2 = document.getElementById('archive__inp2');
let archiveProc = document.getElementById('archive__process');
let archiveProcessedFiles = document.getElementById('archive__processedFiles');
let desktop = require('path').join(require('os').homedir(), 'Desktop');

//получаем полные пути к файлам
const getFilesHeandler = (dir, files_) => {
  files_ = files_ || [];
  var files = fs.readdirSync(dir);
  for (var i in files) {
    var name = dir + '\\' + files[i];
    try {
      if (fs.statSync(name).isDirectory()) {
        getFilesHeandler(name, files_);
      } else {
        files_.push(name);
      }
    }
    catch (e) {
      console.log('e', e);
      console.log('name', e.name);
      console.log('stack', e.stack);
      console.log('message', e.message);
    }
  }
  return files_;
}

//сравниваем файлы с базой данных
const compareHeandler = (files, dbT) => {
  let flag = 0;
  let newArr = [];
  files.map((itemF, indexF) => {
    for (let itemD in dbT) {
      flag = 0;
      dbT[itemD].map((item, index) => {
        console.log(dbT[itemD].length);
        if (item === readChunk.sync(itemF, 0, dbT[itemD].length)[index]) {
          flag++;
        }
        if (flag === dbT[itemD].length) {
          newArr.push(itemF);
        }
      })
    }
    archiveProcessedFiles.innerHTML = `<p>Обработанно файлов: ${indexF + 1}</p>`
  })
  return newArr;
}

//запись в файл
const createLogHeandler = (res, input2) => {
  fs.mkdir(path.join(desktop, 'Snowflake_Log'),
    { recursive: true }, (err) => {
      if (err) {
        return console.error(err);
      }
      console.log('Directory created successfully!');
    });
  if (fs.existsSync(`${desktop}/Snowflake_Log/${input2}.txt`)) {
    fs.unlinkSync(`${desktop}/Snowflake_Log/${input2}.txt`)
  }
  res.map(item => {
    fs.appendFileSync(`${desktop}/Snowflake_Log/${input2}.txt`, `${item}\r\n`, function (error) {
      console.log('Запись файла завершена.');
    })
  });
}

//отобразить процесс на экране
const processHeandler = (files, input2) => {
  archiveProc.innerHTML = '';
  archiveProc.innerHTML += `<p>Количество совпадение: ${files.length}.</p>`;
  archiveProc.innerHTML += `<p>Поиск осуществлялся в каталоге: ${archiveInp1.value}</p>`;
  archiveProc.innerHTML += `<p>Ваш отсчет лежит в ${desktop}\\Snowflake_Log\\${input2}.txt</p>`;
  archiveInp1.value = '';
  archiveInp2.value = '';
}

archiveBtn.onclick = async () => {
  if (archiveInp1.value === '' || archiveInp2.value === '') {
    return false;
  }
  /* let getFiles = await getFilesHeandler(archiveInp1.value);
  let compare = compareHeandler(getFiles, db);
  createLogHeandler(compare, archiveInp2.value);
  processHeandler(compare, archiveInp2.value); */

  /* if (archiveInp1.value[archiveInp1.value.length - 1] === '\\') {
      archiveInp1.value = archiveInp1.value.substring(0, archiveInp1.value.length - 1);
    } */
  new Promise(function (resolve) {
    resolve(getFilesHeandler(archiveInp1.value));
  }).then(function (files) {
    console.log(files);
    return compareHeandler(files, db);
  }).then(function (files) {
    createLogHeandler(files, archiveInp2.value);
    return files;
  }).then(function (files) {
    processHeandler(files, archiveInp2.value);
  }).catch((error) => {
    archiveProc.innerHTML += error;
    console.log(error);
  })
}