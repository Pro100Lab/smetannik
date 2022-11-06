import axios from 'axios';
import {eventBus} from "../eventBus";
import {makeUrl} from "./utils";

const ROLES = {
    'Администратор': 3,
    'Контролер': 2,
    'Пользователь': 1
}

const TOKEN_NAME = 'jwtSMETANNIK';

export class User {
    login = null;
    password = null;
    email = null;
    isAuthorized = false;
    token = null;
    role = null;

    constructor() {
        this.token = localStorage.getItem(TOKEN_NAME);
        if(this.token && this.token.length > 0) {
            console.log('try authorize by token...')
            this.LoadByToken(this.token);
        }
    }

    LoadByToken(token) {
        axios.get(makeUrl(`/user/get/${token}`, false)).then(response=>{
            this.email = response.data.user.email;
            this.login = response.data.user.username;
            this.isAuthorized = true;
            this.token = response.data.user.token;
            this.role = ROLES[response.data.user.role];
        });
    }

    SetToken(jwt) {
        localStorage.setItem(TOKEN_NAME, jwt);
    }
    TryLogIn(login, password) {
        axios.post(makeUrl('login'), {email:login, password}).then(response => {
            if(!response.data.errors) {
                this.email = login;
                this.login = response.data.user.username;
                this.password = password;
                this.isAuthorized = true;
                this.token = response.data.user.token;
                this.role = ROLES[response.data.user.role];
                this.SetToken(this.token);
                eventBus.$emit('wants-scroll', '.section__main');

                console.log('role: ' + this.role )
                eventBus.$emit('Authorized');
                eventBus.$emit('change-mind-authorize', true);
            } else {
                console.log('emti')
                eventBus.$emit('auth-errors', response.data.errors );
            }
        }, (rejected) => {
            eventBus.$emit('auth-errors', rejected.response.data.errors );
        })
    }

    LogOut() {
        if (this.isAuthorized) {
            this.isAuthorized = false;
            this.SetToken('');
            eventBus.$emit('change-mind-authorize', true);
            eventBus.$emit('wants-scroll', '.section__main');
        }
        console.log('User.LogOut')
    }

    TryRegister(username, email, password) {
        axios.post(makeUrl('registrate'), {
            username,
            email,
            password
        }).then(response => {
            if (!response.data.errors) {
                this.login = username;
                this.email = email;
                this.password = password;
                this.isAuthorized = true;
                this.token = response.data.user.token;
                this.role = ROLES[response.data.user.role];
                this.SetToken(this.token);
                eventBus.$emit('wants-scroll', '.section__main');

                eventBus.$emit('Registered');
                eventBus.$emit('change-mind-authorize', true);
            } else {
                eventBus.$emit('reg-errors', response.data.errors );
            }
        }, (rejected) => {
            eventBus.$emit('reg-errors', rejected.response.data.errors );
        })
    }
}
