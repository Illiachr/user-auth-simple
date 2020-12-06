document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    
    /* -----------Константы------------- */
    const signUpBtn = document.querySelector('#sigUpBtn'),
        logInBtn = document.querySelector('#logInBtn'),
        logOutBtn = document.querySelector('#logOutBtn'),
        userList = document.querySelector('#userList');    

    // База пользователей - массив объектов
    // const dbUser = localStorage.getItem('dbUser') !== null ? 
    //                 JSON.parse(localStorage.getItem('dbUser')) : [];
    const userControl = {
        dbUser : [],
        regExpName : /[А-ЯЁ][а-яё]* [А-ЯЁ][а-яё]*$/,
        regExpPwd : /^[a-zA-Z0-9]+$/,
        options : {  
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric',
                    hour : '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                },
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

        initDb () {
            if (localStorage.getItem('dbUser') !== null) {
                this.dbUser = JSON.parse(localStorage.getItem('dbUser'));
            }
        },

        askUser (question, regExp, defExp, defExpErr) {
            let userAnswer = prompt(question, defExp);
            if (userAnswer !== null) {
            while (userAnswer.trim() === '' || !regExp.test(userAnswer)) {
                userAnswer = prompt(question, defExpErr);
            }             
            return userAnswer;
        } else { return; }
        },

        askSignUp () {            
                const userData = {};
                let name = this.askUser (this.questions[0], this.regExpName, this.defExp[0], this.defExp[1]);
                name = name.split(' ');
                userData.firstName = name[0];
                userData.lastName = name[1];
                userData.login = this.askUser (this.questions[1], this.regExpPwd, this.defExp[2], this.defExp[3]);
                const isUser = this.dbUser.findIndex(item => item === userData.login);
                if (isUser === -1) {
                    alert ('Такой логин уже занят');
                    userData.login = this.askUser (this.questions[1], this.regExpPwd, this.defExp[2], this.defExp[3]);
                }
                userData.pwd = this.askUser (this.questions[2], this.regExpPwd, this.defExp[2], this.defExp[3]);
                userData.date = new Date().toLocaleDateString('ru', this.options);
                this.dbUser.push(userData);
                const dbUserJson = JSON.stringify(this.dbUser);
                localStorage.dbUser = dbUserJson;
                this.userAuth(userData);
        },
            
        askSignIn () {
            const login = this.askUser(this.questions[1], this.regExpPwd, this.defExp[2], this.defExp[2]);

            if (login.trim() !== null){
                const indexAuth = this.dbUser.findIndex(item => item.login === login.trim());
                
                if (indexAuth === -1) { return alert('Пользователь не найден!');}
                const pwd = this.askUser(this.questions[2], this.regExpPwd, '', this.defExp[3]);
                if (this.dbUser[indexAuth].pwd === pwd.trim()) {                            
                    this.userAuth(this.dbUser[indexAuth]);
                } else { return alert('Неверный пароль'); }
            } else { return; }
        },
        userAuth (user) {
            const titles = document.querySelectorAll('h2');
            titles[0].textContent = `Привет, ${user.firstName}`;
            titles[1].textContent = `Пользователи`;
            signUpBtn.textContent = 'Добавить пользователя';
            logInBtn.classList.add('invisible');
            logOutBtn.classList.remove('invisible');
            logOutBtn.after(logInBtn);
            this.authOk = true;
        },

        userLogOut () {
            this.authOk = false;
            userList.textContent = '';
            logInBtn.classList.remove('invisible');
            logOutBtn.classList.add('invisible');
            logOutBtn.before(logInBtn);
        },

        showUsers () {
            userList.textContent = '';
            this.dbUser.forEach(item => {
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
                    const rmItem = this.dbUser.indexOf(item);
                    this.dbUser.splice(rmItem,1);
                    const dbUserJson = JSON.stringify(this.dbUser);
                    localStorage.dbUser = dbUserJson;
                    this.showUsers();
                });
            });
    }

    };
    // Основная функция
    userControl.initDb();

    signUpBtn.addEventListener('click', e => {
        e.preventDefault();
        userControl.askSignUp();
        if(userControl.authOk) {
            userControl.showUsers();
        }
    });

    logInBtn.addEventListener('click', e => {
        e.preventDefault();
        userControl.askSignIn();
        if(userControl.authOk) {
            userControl.showUsers();
        }        
    });

    logOutBtn.addEventListener('click', () => {
        userControl.userLogOut();
        
    });
});