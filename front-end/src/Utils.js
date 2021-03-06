import axios from 'axios';

export const shuffleArray = arr => {
    return [...arr].sort(() => Math.random() - 0.5);
};

export const hexToRgb = hex => {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : "";
};

export const shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = parseInt(R * (100 + percent) / 100);
    G = parseInt(G * (100 + percent) / 100);
    B = parseInt(B * (100 + percent) / 100);

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    let RR = ((R.toString(16).length === 1) ? "0" + R.toString(16) : R.toString(16));
    let GG = ((G.toString(16).length === 1) ? "0" + G.toString(16) : G.toString(16));
    let BB = ((B.toString(16).length === 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
};

export const getUser = async (onAuthUpdate, callback=null) => {
    try {
        let res = await axios.get("http://localhost:4000/api/user");
        onAuthUpdate(true, res.data, callback);
    }
    catch (err) {
        console.error("An error occured while trying to get user data");
        console.log(err);
        if (err.response) {
            eraseCookie("session");
        }
        onAuthUpdate(false);
    }
};


export const signOut = async onAuthUpdate => {
    eraseCookie("session");
    try {
        await axios.get("http://localhost:4000/api/user/logout");
    }
    catch (err) {
        console.error("An error occured while trying to log you out");
        console.log(err);
    }

    onAuthUpdate(false);
};


export const getHttpCookie = cookiename => {
    let date = new Date();
    date.setTime(date.getTime() + 1000);
    let expires = "expires=" + date.toUTCString();

    document.cookie = cookiename + "=new_value;path=/;" + expires;
    return document.cookie.indexOf(cookiename + '=') === -1;
};

export const setCookie = (name, value, days) => {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
};

export const getCookie = name => {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
};

export const eraseCookie = name => {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

export const getInitialsForName = name => {
    if (!name) {
        return "";
    }

    let names = name.split(" ");
    let initials = "";
    names.forEach(n => {
        if (n !== "") {
            initials += n[0];
        }
    });
    return initials.toUpperCase();
};

export const isEmpty = obj => {
    if (obj === null) return true;
    return Object.keys(obj).length === 0;
};

export const formatDigits = (number, digits) => {
    let num = String(number);

    if (num.length > digits) {
        return num.slice(0, digits);
    }
    else if (num.length === digits) {
        return num;
    }

    let newDigits = digits - num.length;
    for (let i = 0; i < newDigits; i++) {
        num = "0" + num;
    }

    return num;
};

export const formatDate = date => {
    if (!date instanceof Date) {
        return "Invalid date";
    }

    return `${formatDigits(date.getDate(), 2)}/${formatDigits(date.getMonth()+1, 2)}/${date.getFullYear()}`;
};

export const addDays = (date, days) => {
    let tmpDate = new Date(date.valueOf());
    tmpDate.setDate(tmpDate.getDate() + days);
    return tmpDate;
};

export const addMonths = (date, months) => {
    let tmpDate = new Date(date.valueOf());
    tmpDate.setMonth(tmpDate.getMonth() + months);
    return tmpDate;
};

export const addYears = (date, years) => {
    let tmpDate = new Date(date.valueOf());
    tmpDate.setFullYear(tmpDate.getFullYear() + years);
    return tmpDate;
};

export const datesEqual = (date, date2) => {
    return  date.getFullYear() === date2.getFullYear()
            && date.getMonth() === date2.getMonth()
            && date.getDate() === date2.getDate();
};

export const daysBetween = (startDate, endDate) => {
    return Math.floor(( endDate - startDate ) / 86400000); 
};