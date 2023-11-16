async function fetchUserData(userId) {
    try {
        const response = await fetch(`http://localhost:3000/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add any other headers as needed
            },
            // Add any other fetch options as needed
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('User data:', userData);
            // Do something with the user data
        } else {
            console.error('Failed to fetch user data:', response.status, response.statusText);
            // Handle the error
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Handle the error
    }
};
function getPageNameFromURL(url) {
    const regex = /\/([a-zA-Z0-9_-]+)\.html$/;
    const match = url.match(regex);

    if (match && match[1]) {
        const pageName = match[1];
        return pageName;
    } else {
        console.error('Failed to extract page name from URL.');
        return null;
    }
};
function checkLoggedInStatus() {
    const username = localStorage.getItem('userId');
    const sessionID = localStorage.getItem('sessionID');

    if (username && sessionID) {
        showUserLoggedIn(username);
    } else {
        showLoginButton();
    }
};
function changeContent(url) {
    const userId = localStorage.getItem('userId');
    const relativeUrl = '/' + url;

    $("#pageContent").load(relativeUrl);
    history.pushState(null, null, relativeUrl);

    const pageName = getPageNameFromURL(relativeUrl);
    if (pageName) {
        init(pageName); 
    } else {
        console.error('Failed to extract page name from URL.');
    }
    init(userId); 
    fetchUserData(userId);
    checkLoggedInStatus();
};
function isValidUserName(newUserName){
    const regUserName = /^[a-zA-Z0-9]{6,15}$/;
    return regUserName.test(newUserName);
};
function isValidPassword(password) {
    const regPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regPassword.test(password);
};
function isValidEmail(email) {
    const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/
    return regEmail.test(email);
};
function isValidForm(event) {
    const username = document.getElementById('register-username');
    console.log(username.value);
    const password = document.getElementById('register-password');
    console.log(password.value);
    const confirmPassword = document.getElementById('repeat-password');
    console.log(confirmPassword.value);
    const email = document.getElementById('email');
    console.log(email.value);
    if (password.value!== confirmPassword.value) {
        alert('Passwords do not match');
    } else if (!isValidUserName(username.value)) {
        alert('Your username must be 5-16 characters long and can only contain letters and numbers');
    } else if (!isValidPassword(password.value)) {
        alert('Your password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, and one digit');
    } else if (!isValidEmail(email.value)) {
        alert('Invalid email address')
    } else{
        return true;
    }
};
function toggleRecoverPassword() {
    const recoverPasswordEmail = document.getElementById('recover-password-email');
    if (recoverPasswordEmail.style.display === 'none' || recoverPasswordEmail.style.display === '') {
        recoverPasswordEmail.style.display = 'block';
    } else {
        recoverPasswordEmail.style.display = 'none';
    }
};
function showTooltip(id) {
    const tooltip = document.getElementById(`tooltip-${id}`);
    tooltip.style.display = 'block';
};
function hideTooltip(id) {
const tooltip = document.getElementById(`tooltip-${id}`);
tooltip.style.display = 'none';
};
function onRegisterHandle(event) {
    event.preventDefault(); // Prevent the default form submission

    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('email').value;

    // Send data to the server
    fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username,
            password,
            email
        })
    })
    .then(response => {
        if (response.ok) {
            alert('Registration successful!') // Show a success message
            console.log('Registration successful!');
        } else {
            response.text().then(errorMessage => {
                console.error('Registration failed:', errorMessage);
                alert(`Registration failed: ${errorMessage}`); // Show the error message
            });
        }
    })
    .catch(error => {
        console.error('Error during registration:', error);
       alert('Registration failed!'); // Show a general error message
    });
};
function showLoginButton() {
    const loginButton = document.getElementById('main-login-button');
    const userInfo = document.getElementById('user-info');
    const logoffButton = document.getElementById('logoff-button');

    if (loginButton && userInfo && logoffButton) {
        loginButton.style.display = 'inline';
        userInfo.style.display = 'none';
        logoffButton.style.display = 'none';
    } else {
        console.error('One or more elements not found.');
    }
};
async function login(username, password) {
    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const result = await response.json();

            if (result.success) {
                alert('Login successful!');
                changeContent('index.html');
                return { sessionID: result.sessionID, userId: result.userId }; // Return an object
            } else {
                console.error('Login failed:', result.error);
                alert(`Login failed. ${result.error}`);
            }
        } else {
            const errorText = await response.text();
            console.error('Login failed:', response.status, errorText);
            alert(`Login failed. ${errorText}`);
        }
    } catch (error) {
        console.error('Login failed:', error);
        alert(`Login failed. ${result.error}`);
    }
};
async function onLoginHandle(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    const { sessionID, userId } = await login(username, password);

    // Store userId in localStorage
    localStorage.setItem('userId', userId);
    localStorage.setItem('sessionID', sessionID);

    showUserLoggedIn(username);
};


function handleLogout() {
    handleLogout();
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionID');
    showLoginButton();
};
function checkLoggedInStatus() {
    const sessionID = localStorage.getItem('sessionID');
    const userId = localStorage.getItem('userId');    
    if (userId && sessionID) {
        showUserLoggedIn(userId);
    } else {
        showLoginButton();
    }
};
async function logout() {
    try {
        const sessionID = localStorage.getItem('sessionID');
        const response = await fetch('http://localhost:3000/auth/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionID}`, // Include the session ID in the headers
            },
        });

        if (response.ok) {
            // Successful logout
            console.log('User logged off');
            handleLogout();
        } else {
            // Logout failed
            console.error('Logout failed:', response.status, response.statusText);
            alert('Logout failed. Please try again.');
        }
    } catch (error) {
        console.error('Logout failed:', error);
        alert('Logout failed. Please try again.');
    }
    checkLoggedInStatus();
};
function onLogoffButtonClick() {
    logout();
};
function showLoginButton() {
    const logoffButton = document.getElementById('logoff-button');
    if (logoffButton) {
        logoffButton.style.display = 'none';
    }
    console.log('User logged off. Update UI accordingly.');
}
// async function onLoginHandle(event) {
//     event.preventDefault();
//     const username = document.getElementById('login-username').value;
//     const password = document.getElementById('login-password').value;
//     const sessionID = await login(username, password);
//     localStorage.setItem('userId', username);
//     localStorage.setItem('sessionID', sessionID);
//     showUserLoggedIn(username);
// };
function onLoginButtonClick() {
    onLoginHandle();
    return { sessionID: result.sessionID, userId: result.userId };
};
function recoverPasswordByUsername(event) {
    event.preventDefault();

    const username = document.getElementById('recover-username').value;
    fetch('http://localhost:3000/auth/recover-password-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Password recovery email sent successfully.');
            } else {
                alert('Password recovery failed. Please check your username and try again.');
            }
        })
        .catch(error => {
            console.error('Error during password recovery:', error);
            alert('Password recovery failed. Please try again later.');
        });
};
function recoverPasswordByEmail(event) {
    event.preventDefault();
    const email = document.getElementById('recover-email').value;

    // Send a request to the server for email-based password recovery
    fetch('http://localhost:3000/auth/recover-password-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Recovery email sent successfully. Check your email for instructions.');
        } else {
            alert('Failed to send recovery email. Email not found.');
        }
    })
    .catch(error => {
        console.error('Error during password recovery:', error);
        alert('Failed to send recovery email. Please try again later.');
    });
};
function toggleRecoverPasswordByUsername() {
    const recoverPasswordUsernameForm = document.getElementById('recover-password-username');
    recoverPasswordUsernameForm.style.display = recoverPasswordUsernameForm.style.display === 'none' ? 'block' : 'none';
};
$(document).ready(function () {
    const path = window.location.pathname;

    if (path === '/index.html') {
        // Load the homepage content
        $("#pageContent").load('./homePage.html', function () {
            console.log('Homepage loaded successfully.');
        });
    }

    // Attach event listener to the login form
    $("#loginForm").submit(function (event) {
        event.preventDefault();
        const username = $("#login-username").val();
        const password = $("#login-password").val();
        login(username, password);
    });
});
$("#navbar a, .content-link").click(function(e) {
    e.preventDefault();
    var url = $(this).attr('href');
    changeContent(url);
});
function showUserLoggedIn(username) {
    const loginButton = document.getElementById('main-login-button');
    const userInfo = document.getElementById('user-info');
    const logoffButton = document.getElementById('logoff-button');

    if (loginButton && userInfo && logoffButton) {
        loginButton.style.display = 'none';
        userInfo.style.display = 'inline';
        logoffButton.style.display = 'inline';
        userInfo.innerHTML = `Logged in as: ${username}`;
    } else {
        console.error('One or more elements not found.');
    }
};
function init(page) {
    fetch(`http://localhost:3000/${page}`)
        .then(data => data.json())
        .then(response => console.log(response))
};

