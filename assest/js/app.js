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
                  Swal.fire({
                    icon: 'success',
                    title: 'Account Created',
                    text: 'Your Account Is Created Successfully',
                    confirmButtonText: 'OK'
                });
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
            Swal.fire({
                icon: 'success',
                title: 'Email Verification Sent',
                text: 'A verification email has been sent to your email address.',
                confirmButtonText: 'OK'
            });
            setTimeout(() => {
            window.location.href = "./dashboard/index.html"
            }, 3000);
        })
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
           Swal.fire({
                title: 'Log-In Successful!',
                text: 'You have logged in successfully.',
                icon: 'success',
                timer: 8000,
                timerProgressBar: true,
            });
            setTimeout(() => {
                window.location.href = "./dashboard/index.html"
            }, 3000);
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

// _________________________________________forget password____________________________________________________________

let forgetPassword = () => {
    const forEmail = document.getElementById("exampleInputEmail1").value;
    sendPasswordResetEmail(auth, forEmail)
        .then(() => {
              Swal.fire({
                icon: 'success',
                title: 'Email Sent',
                text: 'A Password Reset Link Has Been Sent To Your Email',
                confirmButtonText: 'OK'
            });
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


const updatedData = async (event) => {
    event.preventDefault();

    const updateEmailValue = document.getElementById('updateemail').value;
    const currentPassword = document.getElementById('currentPassword').value;
    const updatePasswordValue = document.getElementById('updatePassword').value;
    const user = auth.currentUser;

    if (!user) {
        alert("No user is currently logged in.");
        console.log("No user logged in");
        return;
    }

    if (!updateEmailValue || !currentPassword || !updatePasswordValue) {
        alert("Please fill in email and both password fields.");
        return;
    }
    const credential = EmailAuthProvider.credential(user.email, currentPassword);

    try {
        await reauthenticateWithCredential(user, credential);
        console.log("Reauthentication successful!");

        if (updateEmailValue !== user.email) {
            console.log("Updating email to:", updateEmailValue);
            await updateEmail(user, updateEmailValue);

            await sendEmailVerification(user);

            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, {
                email: updateEmailValue,
            });
        }
        if (updatePassword) {
            console.log("Updating password...");
            await updatePassword(user, updatePasswordValue);
        }

        Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            text: 'Profile updated successfully. Please verify your new email address if updated.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#3085d6',
        });

    } catch (error) {
        console.error("Update profile error:", error);
        alert("Update profile error: " + error.message);
    }
};

if (window.location.pathname === '/assest/dashboard/setting.html') {
    const updateBtn = document.getElementById("updatedProfile");
    updateBtn.addEventListener("click", updatedData);
}




// __________________________________________sign-out_____________________________________________________________________

window.logOut = () => {
    signOut(auth).then(() => {
        localStorage.removeItem('user');
       Swal.fire({
                icon: 'success',
                title: 'Logged Out',
                text: 'Your account is successfully logged out.',
                timerProgressBar: true,
                confirmButtonText: 'OK',
            });
            setTimeout(() => {
            window.location.href = "/index.html"
                
            }, 3000);
        })
        .catch((error) => {
            alert(error.code);
        });
};

// __________________________________________________delete profile__________________________________________________________________________________

let deleteProfile = async () => {
    let user = auth.currentUser;
    let userId = auth.currentUser.uid;
    try {
        await deleteUser(user);
        await deleteDoc(doc(db, "users", userId));
        Swal.fire({
            icon: "success",
            title: "Account Deleted",
            text: 'Your account has been successfully deleted.',
            timer: 8000,
            timerProgressBar: true,
        })
        .then(()=>{
            window.location.href = "/index.html";
        })
       
    }

    catch (error) {
        alert("Delete button dose not work" + error.message)
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
         Swal.fire({
            icon: 'success',
            title: 'Message Sent',
            text: 'Your message request is sent. We will respond to you later! Thank you!',
            timer: 5000, 
            timerProgressBar: true, 
        }).then(()=>{
            window.location.reload();
        })
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
