import { Injectable } from "@angular/core";
import { Auth, getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "@angular/fire/auth"
import { DishService } from "./dish.service";

@Injectable({
    providedIn: 'root'
})

export class LogService {

    isLoggedIn = false;
    constructor(public firebaseAuth: Auth, private dishService: DishService){}

    async signin(email: string, password: string){
        signInWithEmailAndPassword(this.firebaseAuth, email, password)
        .then((userCredential) => {
            this.isLoggedIn = true;
            const user = userCredential.user;
            localStorage.setItem('user', user.uid);
            localStorage.setItem('mail', String(user.email));
            let admin:boolean = false;
            this.dishService.getRoleOfUid(user.uid).then(resp => {
                admin = resp;
                localStorage.setItem('role', String(admin))
                console.log("Logged in as " + user.email + ' - ' + String(admin));
            });
        })
        .catch((e) => {
            alert(this.alertOfError(e.code))
            return false;
        })
        return true;
    }

    async signup(email: string, password: string){
        createUserWithEmailAndPassword(this.firebaseAuth, email, password)
        .then((userCredential) => {
            this.isLoggedIn = true;
            const user = userCredential.user;
            localStorage.setItem('user', user.uid);
            localStorage.setItem('mail', String(user.email));
            localStorage.setItem('role', String(false));
            this.dishService.addRole(user.uid, String(user.email), false);
            console.log("Signed up as " + user.email);
        })
        .catch((e) => {
            alert(this.alertOfError(e.code))
            return false;
        })
        return true;
    }

    logout() {
        signOut(this.firebaseAuth)
        this.isLoggedIn = false;
        localStorage.removeItem('user');
        localStorage.removeItem('mail');
        localStorage.removeItem('role');
        console.log("Signed out");
    }

    alertOfError(id: string){
        if (id === "auth/too-many-requests") return "Too many requests, try later.";
        if (id === "auth/email-already-in-use") return "Email already in use";
        if (id === "auth/wrong-password") return "Wrong password";
        if (id === "auth/weak-password") return "Weak password, try one with at least 6 characters";
        return "Unknown error";
    }
}