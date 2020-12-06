document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    /* -----------Константы------------- */
    const signUpBtn = document.querySelector('#sigUpBtn'),
        logInBtn = document.querySelector('#logInBtn'),
        userList = document.querySelector('#userList');

    const regExpName = /[А-ЯЁ][а-яё]* [А-ЯЁ][а-яё]*$/,
        regExpPwd = /^[a-zA-Z0-9]+$/,
        options = {  
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour : '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                };
    /* -----------Переменные------------- */
    

    // База пользователей - массив объектов
    const dbUser = localStorage.getItem('dbUser') !== null ? 
                    JSON.parse(localStorage.getItem('dbUser')) : [];

    // Вспомагательные функции
    // Запрос Имени и фамилии, логина пользователя
    const askUser = (question, regExp, defExp, defExpErr) => {
        let userAnswer;
        userAnswer = prompt(question, defExp);
        if (userAnswer.trim() === '' || !regExp.test(userAnswer)) {
            userAnswer = prompt(question, defExp);
            return askUser(question, defExpErr);
        } else {return userAnswer;}
    };
    // Опрос пользователя
    const asking = {
        questions : [
                'Имя и фамилия',
                'Логин',
                'Пароль'
            ],
            defExp : [
                'Имя Фамилия',
                'Неверный формат!!! Введите по образцу: Имя Фамилия',
                'Латинские буквы и цифры',            
                'Только латинские буквы и цифры!'
            ],
            authOk: false,
        askSignUp ()
            {
                if (confirm('Зарегистрировать нового пользователя?')){
                    const userData = {};
                    let name = askUser (this.questions[0], regExpName, this.defExp[0], this.defExp[1]);
                    name = name.split(' ');
                    userData.firstName = name[0];
                    userData.lastName = name[1];
                    userData.login = askUser (this.questions[1], regExpPwd, this.defExp[2], this.defExp[3]);
                    userData.pwd = askUser (this.questions[2], regExpPwd, this.defExp[2], this.defExp[3]);
                    userData.date = new Date().toLocaleDateString('ru', options);
                    dbUser.push(userData);
                    const dbUserJson = JSON.stringify(dbUser);
                    console.log(dbUser);
                    localStorage.dbUser = dbUserJson;

                    const titles = document.querySelectorAll('h2');
                            titles[0].textContent = `Привет, ${dbUser.firstName}`;
                            titles[1].textContent = `Пользователи`;
                            this.authOk = true;

                    }
            },
        askSignIn ()
            {
                const login = askUser(this.questions[1], regExpPwd, this.defExp[2], this.defExp[2]);
                const indexAuth = dbUser.findIndex(item => item.login === login);
                console.log(indexAuth);
                if(dbUser[indexAuth].pwd === askUser(this.questions[2], regExpPwd, this.defExp[2], this.defExp[3])) {                            
                    this.authOk = true;
                    this.userAuth(indexAuth);
                } else { alert('Неверный пароль'); }
                //else if (item.login !== login)  { alert('Пользователь не найден!');
            },
        userAuth (indexAuth) {
            const titles = document.querySelectorAll('h2');
            titles[0].textContent = `Привет, ${dbUser[indexAuth].firstName}`;
            titles[1].textContent = `Пользователи`;
        }
    };

    // Создание элемента списка с данным пользователя из массива 
    const showUsers = () => {
        userList.textContent = '';
        dbUser.forEach(item => {
            const listItem = document.createElement('li');
            listItem.style.listStyleType = 'none';
            userList.append(listItem);
            listItem.innerHTML = `<li class="list-group-item d-flex align-items-center justify-content-center">
            <span class="d-block align-middle">Имя: ${item.firstName}<br>
            Фамилия: ${item.lastName}<br>
            Дата регистрации: ${item.date}</span>
            <button class="btn btn-dark ml-auto d-block rm-user">Удалить</button></li>`;

            const btnRm = listItem.querySelector('.rm-user');
            btnRm.addEventListener('click', () => {
                const rmItem = dbUser.indexOf(item);
                dbUser.splice(rmItem,1);
                console.log(rmItem);
                const dbUserJson = JSON.stringify(dbUser);
                console.log(dbUser);
                localStorage.dbUser = dbUserJson;
                showUsers();
            });
        });

    };
    // Основная функция

        signUpBtn.addEventListener('click', e => {
            e.preventDefault();
            asking.askSignUp();
            showUsers();
        });

        logInBtn.addEventListener('click', e => {
            e.preventDefault();
            asking.askSignIn();
            if(asking.authOk) {
                console.log('Autorization passed');
                showUsers();
            }
        });
});