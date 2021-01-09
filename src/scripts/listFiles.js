let listFilesBtn = document.getElementById('list-files__btn');
let listFilesInp1 = document.getElementById('list-files__inp1');
let listFilesInp2 = document.getElementById('list-files__inp2');
let listFilesProcess = document.getElementById('list-files__process');

//получаем полные пути к файлам
const getListFiles = (dir, files_) => {
  files_ = files_ || [];
  let files = fs.readdirSync(dir);
  for (let i in files) {
    let name = dir + '\\' + files[i];
    try {
      if (fs.statSync(name).isDirectory()) {
        getListFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    catch (e) {
      console.log(e.name);
    }
  }

  return files_;
}

//запись в файл
const createLogListFiles = (res, input2) => {
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
const processListFiles = (files, input2) => {
  listFilesProcess.innerHTML = '';
  listFilesProcess.innerHTML += `<p>Поиск осуществлялся в каталоге: ${listFilesInp1.value}</p>`;
  listFilesProcess.innerHTML += `<p>Количество совпадение: ${files.length}.</p>`;
  listFilesProcess.innerHTML += `<p>Ваш отсчет лежит в ${desktop}\\Snowflake_Log\\${input2}.txt</p>`;
  listFilesInp1.value = '';
  listFilesInp2.value = '';
}

listFilesBtn.onclick = () => {
  if (listFilesInp1.value === '' || listFilesInp2.value === '') {
    return false;
  }
  /* if (listFilesInp1.value[listFilesInp1.value.length - 1] === '\\') {
    listFilesInp1.value = listFilesInp1.value.substring(0, listFilesInp1.value.length - 1);
  } */

  new Promise(function (resolve) {
    resolve(getListFiles(listFilesInp1.value));
  }).then(function (files) {
    createLogListFiles(files, listFilesInp2.value);
    return files;
  }).then(function (files) {
    processListFiles(files, listFilesInp2.value);
  })
}