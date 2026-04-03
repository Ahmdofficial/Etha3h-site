import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCzQi1TZ4Y83m-yfwl1ScEMHzjbc4pD798",
  authDomain: "etha3h.firebaseapp.com",
  projectId: "etha3h",
  storageBucket: "etha3h.firebasestorage.app",
  messagingSenderId: "395218988791",
  appId: "1:395218988791:web:91a70c45866dbc4f806df2"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

import { db } from './firebase.js';
import { collection, query, where, getDocs } from "firebase/firestore";

export async function loginUser(username, password) {
  try {
    // البحث عن المستخدم في Firestore بناءً على الحقل username
    const q = query(collection(db, "users"), where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      alert("اسم المستخدم غير موجود!");
      return;
    }

    let userFound = false;
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if (data.password === password) {
        userFound = true;
        // حفظ الجلسة محلياً لكي لا يخرج الحساب عند تحديث الصفحة
        localStorage.setItem('currentUser', JSON.stringify({
          name: data.username,
          role: data.role // admin, supervisor, or user
        }));
        
        // التوجيه التلقائي حسب الرتبة
        redirectByRole(data.role);
      }
    });

    if (!userFound) alert("كلمة المرور خاطئة!");

  } catch (error) {
    console.error("حدث خطأ أثناء الاتصال بالقاعدة:", error);
  }
}

function redirectByRole(role) {
  if (role === 'admin') window.location.href = 'admin-dashboard.html';
  else if (role === 'supervisor') window.location.href = 'radio-control.html';
  else window.location.href = 'home.html';
}
