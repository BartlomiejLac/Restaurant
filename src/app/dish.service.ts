import { Injectable } from "@angular/core";
import { Firestore, collection, doc, getDoc, getDocs, addDoc, deleteDoc, updateDoc, query, where } from "@angular/fire/firestore"
import { Dish } from './structures/Dish'
import { Order } from "./structures/Order";
import { Review } from "./structures/Review";
import { Role } from "./structures/Role";

@Injectable({
    providedIn: 'root'
})

export class DishService {
    constructor(private angularFirestore: Firestore)  {}

    async getDishList(){
        let dishList: Dish[] = [];
        const colRef =  collection(this.angularFirestore, 'dishes');
        const docSnap = await getDocs(colRef);
        docSnap.forEach(doc => {
            let obj = {
                id: doc.id,
                ...doc.data() as {},
                orderedCount: 0
            } as Dish;
            dishList.push(obj);
        });
        return dishList;
    }

    async getDish(id: string){
        const docRef = doc(this.angularFirestore, "dishes", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Document does not exist.");
        let obj = {
            id: docSnap.id,
            ...docSnap.data() as {},
            orderedCount: 0
        } as Dish;
        return obj;
    }
    

    addDish(d: Dish){
        const colRef =  collection(this.angularFirestore, 'dishes');
        let obj = {
            name: d.name,
            cuisine: d.cuisine,
            category: d.category,
            description: d.description,
            ingredients: d.ingredients,
            max: d.max,
            photos: d.photos,
            price: d.price,
            vegan: d.vegan,
            reviewAvg: d.reviewAvg,
            origMax: d.origMax
        }
        addDoc(colRef, obj);
    }

    deleteDish(id: string){
        const docRef = doc(this.angularFirestore, "dishes", id);
        deleteDoc(docRef);
    }

    editDish(id: string, d: Dish){
        const docRef = doc(this.angularFirestore, "dishes", id);
        let obj = {
            name: d.name,
            cuisine: d.cuisine,
            category: d.category,
            description: d.description,
            ingredients: d.ingredients,
            max: d.max,
            photos: d.photos,
            price: d.price,
            vegan: d.vegan,
            reviewAvg: d.reviewAvg,
            origMax: d.origMax
        }
        updateDoc(docRef, obj);
    }

    addReview(id: string, grade: number, text: string){
        const colRef =  collection(this.angularFirestore, 'reviews');
        let obj = {
            uid: localStorage['user'],
            grade: grade,
            dishId: id,
            text: text,
            nick: localStorage['mail']
        }
        addDoc(colRef, obj);
        this.updateAvg(id);
    }

    async updateAvg(id: string){
        let total = 0;
        let count = 0;

        const colRef =  collection(this.angularFirestore, 'reviews');

        const q = query(colRef, where("dishId", "==", id));

        const docSnap = await getDocs(q);
        docSnap.forEach(doc => {
            count++;
            total += doc.data()['grade'];
        });
        let avg = 0;
        if (count !== 0){
            avg = total/count;
        }

        let obj = {
            reviewAvg: avg
        };
        const docRef = doc(this.angularFirestore, "dishes", id);
        updateDoc(docRef, obj);
      }

      async getAllReviews(id: string){
        let reviewList: Review[] = [];
        const colRef =  collection(this.angularFirestore, 'reviews');
        const q = query(colRef, where("dishId", "==", id));
        const docSnap = await getDocs(q);
        docSnap.forEach(doc => {
            let obj = {
                text: doc.data()['text'],
                grade: doc.data()['grade'],
                nick: doc.data()['nick']
            } as Review;
            reviewList.push(obj);
        });
        return reviewList;
      }

      addOrder(order: Order){
        const colRef =  collection(this.angularFirestore, 'orders');
        let obj = {
            uid: localStorage['user'],
            dishIds: order.dishIds,
            dishCounts: order.dishCounts,
            dishNames: order.dishNames,
            date: order.date
        }
        addDoc(colRef, obj);
        order.dishIds.forEach((id, index) => {
            this.updateMax(id, order.dishCounts[index]);
        })
    }

    async updateMax(id: string, value: number){
        const docRef = doc(this.angularFirestore, "dishes", id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error("Document does not exist.");
        let d = {
            id: docSnap.id,
            ...docSnap.data() as {},
            orderedCount: 0
        } as Dish;
        let obj = {
            max: d.max - value
        };
        updateDoc(docRef, obj);
    }

    async getAllOrders(){
        let orderList: Order[] = [];
        const colRef =  collection(this.angularFirestore, 'orders');
        const q = query(colRef, where("uid", "==", localStorage['user']));
        const docSnap = await getDocs(q);
        docSnap.forEach(doc => {
            let obj = {
                ...doc.data()
            } as Order;
            orderList.push(obj);
        });
        return orderList;
    }

    async verifyIfUserCanReview(id: string){
        const colRef =  collection(this.angularFirestore, 'orders');
        const q = query(colRef, where("uid", "==", localStorage['user']));
        const docSnap = await getDocs(q);
        let can: boolean = false;
        docSnap.forEach(doc => {
            if (doc.data()['dishIds'].includes(id)) can = true;
        });
        return can;
    }

    addRole(uid: string, mail: string, admin: boolean){
        const colRef =  collection(this.angularFirestore, 'roles');
        let obj = {
            uid: uid,
            mail: mail,
            admin: admin
        };

        addDoc(colRef, obj);
    }

    updateRole(id: string, admin: boolean){
        const docRef = doc(this.angularFirestore, "roles", id);
        let obj = {
            admin: admin
        };

        updateDoc(docRef, obj);
    }

    async getAllRoles(){
        let roleList: Role[] = [];
        const colRef =  collection(this.angularFirestore, 'roles');
        const docSnap = await getDocs(colRef);
        docSnap.forEach(doc => {
            let obj = {
                id: doc.id,
                ...doc.data() as {},
            } as Role;
            roleList.push(obj);
        });
        return roleList;
    }

    async getRoleOfUid(uid: string){
        const colRef =  collection(this.angularFirestore, 'roles');
        const q = query(colRef, where("uid", "==", uid));
        const docSnap = await getDocs(q);
        let admin: boolean = false;
        docSnap.forEach(doc => {
            admin = doc.data()['admin']; 
        });
        return admin;
    }

}

