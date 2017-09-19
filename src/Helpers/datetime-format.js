export class DateFormat {

    getDateFormat(data) {
        //console.log('data', date)
        var date = new Date(data.setHours(data.getHours() + data.getTimezoneOffset() / 60));

        var hours = date.getHours();
        if (hours < 10) {
            hours = '0' + hours;
        }


        var minutes = date.getMinutes();
        if (minutes < 10) {
            minutes = '0' + minutes;
        }

        var second = date.getSeconds();
        if (second < 10) {
            second = '0' + second;
        }
        //minutes = minutes < 10 ? '0' + minutes : minutes;
        var strTime = hours + ':' + minutes + ':' + second;
        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear() + " " + strTime;
    }
    getDate(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0' + minutes : minutes;

        return date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
    }

}