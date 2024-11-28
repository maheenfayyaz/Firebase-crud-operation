import { auth, createUserWithEmailAndPassword, GoogleAuthProvider, provider, signInWithPopup, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, getFirestore, collection, addDoc, doc, setDoc, getDocs, db, updateDoc, serverTimestamp, deleteDoc } from "./firebase.js";

//________________________________________________________signup_______________________________________________________________________________________
let signUp = () => {

    let email = document.getElementById("exampleInputEmail1").value;
    let password = document.getElementById("exampleInputPassword1").value;
    let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    let passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    let confirmPassword = document.getElementById("exampleInputConfirmPassword1").value;
    let firstName = document.getElementById("firstname").value;
    let lastName = document.getElementById("lastname").value;
    let dateOfBirth = document.getElementById("birthdate").value;
    let gender = document.querySelector("input[name=gender ]:checked");


    let userData = {
        firstName,
        lastName,
        dateOfBirth,
        gender: gender ? gender.value : null,
        email
    };
    console.log(userData);
    if (emailRegex.test(email) && passwordRegex.test(password)) {
        console.log("test");
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log(user);
                localStorage.setItem('user', JSON.stringify({
                    uid: user.uid,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: userData.lastName,
                    gender: user.gender,
                }));
                alert("Your Account Is Created Successfully");
                setTimeout(function (event) {
                    window.location.href = "./email-validation.html";
                }, 2000);

                try {
                    await setDoc(doc(db, "users", user.uid), {
                        ...userData,
                        uID: user.uid
                    });
                    console.log("Document written with ID: ", user.uid);
                } catch (e) {
                    console.error("Error adding document: ", e);
                };
            })

            .catch((error) => {
                alert("The Error Is: " + error.code);
                console.log(error.message);
            });
    }
    else {
        alert("Invalid email or Password");
    }
    if (password !== confirmPassword) {
        alert("Your Password Should Be Identical")
    }
};

if (window.location.pathname == "/assest/sign-up.html") {
    let signupBtn = document.getElementById("sign-up-btn");
    signupBtn.addEventListener("click", signUp);
}


// __________________________________________________signup with google___________________________________________________

let signupGoogle = () => {
    signInWithPopup(auth, provider)
        .then(async (result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            const user = result.user;
            console.log(user);
            window.location.href = "./email-validation.html"

            try {
                await setDoc(doc(db, "users", user.uid), {
                    ...userData,
                    uID: user.uid
                });
                console.log("Document written with ID: ", user.uid);
            } catch (e) {
                console.error("Error adding document: ", e);
            }

        })
        .catch((error) => {
            const email = error.customData.email;
            const credential = GoogleAuthProvider.credentialFromError(error);
            alert(email, credential);
            // alert(error.code)
        });
};

if (window.location.pathname == "/assest/sign-up.html") {
    let signUpGoogleBtn = document.getElementById("sign-up-gmail-btn");
    signUpGoogleBtn.addEventListener("click", signupGoogle);
};

// ________________________________________________mail-verificaton_______________________________________________________

let sendMail = () => {
    sendEmailVerification(auth.currentUser)
        .then(async () => {
            alert("Email verification sent!");
            window.location.href = "./dashboard/index.html"
        }
        )
};

if (window.location.pathname == "/assest/email-validation.html") {
    let validation = document.getElementById("verify-email");
    validation.addEventListener("click", sendMail)
};

// ____________________________________________________log-in____________________________________________________________

let logIn = () => {
    const logEmail = document.getElementById("exampleInputEmail1").value;
    const logPassword = document.getElementById("exampleInputPassword1").value;

    // Validate email and password before sending request
    if (!logEmail || !logPassword) {
        alert("Please enter both email and password.");
        return;
    }

    signInWithEmailAndPassword(auth, logEmail, logPassword)
        .then(async (userCredential) => {
            const user = userCredential.user;
            console.log(user);
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
            }))
            alert("Log-In Successfully!")
            setTimeout (function (event) {
                window.location.href = "./dashboard/index.html"
            }, 2000);
        })
        .catch((error) => {
            console.error("Login Error:", error.code, error.message);
            alert("Login failed: " + error.message);
        });
};

if (window.location.pathname == "/assest/log-in.html") {
    let logBtn = document.getElementById("log-in-button")
    logBtn.addEventListener("click", logIn);
};

// console.log(auth.currentUser);


// _________________________________________forget password____________________________________________________________

let forgetPassword = () => {
    const forEmail = document.getElementById("exampleInputEmail1").value;
    sendPasswordResetEmail(auth, forEmail)
        .then(() => {
            alert("A Password Reset Link Has Been Seen In Your Email")
        })
        .catch((error) => {
            alert(error.code);
        })
};

if (window.location.pathname == "/assest/log-in.html") {
    let resetpass = document.querySelector(".forget-pass");
    resetpass.addEventListener("click", forgetPassword);
};

// __________________________________________________update profile_____________________________________________________________________________________

let updatedData = async () => {
    event.preventDefault();
    let updateEmail = document.getElementById('updateemail').value;
    let updatePassword = document.getElementById('updatePassword').value;
    let user = auth.currentUser ;
    if (!user) {
        alert("No user is currently logged in.");
        return;
    }
    if (!updateEmail || !updatePassword) {
        alert("Please fill in both email and password fields.");
        return; 
    }
    let userId = user.uid;
    try {
        const washingtonRef = doc(db, "users", userId);
        await updateDoc(washingtonRef, {
            email: updateEmail,
        });
        alert("Profile updated successfully.");

    } catch (error) {
        console.error("Update profile error:", error);
        alert("Update profile error: " + error.message);
    }
};

if (window.location.pathname == '/assest/dashboard/setting') {
    let updateBtn = document.getElementById("updatedProfile");
    updateBtn.addEventListener("click", updatedData);
};




// __________________________________________sign-out_____________________________________________________________________

window.logOut = () => {
    signOut(auth).then(() => {
        localStorage.removeItem('user');
        alert("Your account is successfully log-out")
        window.location.href = "/index.html";
    })
        .catch((error) => {
            alert(error.code);
        });
};

// __________________________________________________delete profile__________________________________________________________________________________

let deleteProfile = async () => {
    let userId = auth.currentUser.uid;
    try {
        await deleteDoc(doc(db, "users", userId));
        alert("your account is successfully deleted")
        window.location.href = "/index.html";
    }
    catch (error) {
        alert("Delete button dose not work" + error.code)
    }

}
if (window.location.pathname == '/assest/dashboard/setting.html') {
    let deleteBtn = document.getElementById('delete-btn')
    deleteBtn.addEventListener("click", deleteProfile)
}


// ______________________________________________get user data in firestor________________________________________________

let getData = async () => {
    const querySnapshot = await getDocs(collection(db, "users",));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
    });
};
getData();


// __________________________________________________contact-page__________________________________________________________________________________

let contactForm = async () => {
    let conName = document.getElementById("con-name").value;
    let conEmail = document.getElementById("con-email").value;
    let conSub = document.getElementById("con-subject").value;
    let conMsg = document.getElementById("con-message").value;

    let conData = {
        yourName: conName,
        yourEmail: conEmail,
        subject: conSub,
        message: conMsg,
    }

    try {
        const docRef = await addDoc(collection(db, "contactForm"), {
            ...conData,
        });
        alert("Your Message request is sent we will responed you later! <br/> Thank You !")
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

if (window.location.pathname == "/assest/Dashboard/contact.html") {
    let sendMsg = document.getElementById("con-btn");
    sendMsg.addEventListener('click', contactForm);
}

let getContactData = async () => {
    const querySnapshot = await getDocs(collection(db, "contactForm"));
    querySnapshot.forEach((doc) => {
        console.log(`${doc.id} => `, doc.data());
    });
};
getContactData();

// console.log(auth.currentUser);
