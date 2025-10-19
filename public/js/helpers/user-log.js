// helpers/user-log.js
const checkUser = async () => {
    const email = sessionStorage.email; // from login

    if (!email) { // first check on reload
        location.href = '/login_register.html';
        return null;
    }

    try {
        const res = await fetch(`/current-user?email=${encodeURIComponent(email)}`);
        const user = await res.json();
        return user;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default checkUser;
